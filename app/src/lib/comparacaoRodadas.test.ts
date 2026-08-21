import { describe, expect, it } from 'vitest';
import intervencoesData from '../data/intervencoes.json';
import rodadasData from '../data/rodadasAnteriores.json';
import type { Intervencao, RodadaAnterior } from '../types';
import {
  CAMPOS_COMPARADOS,
  NAO_INFORMADO,
  compararProjetos,
  compararRodadas,
  rodadaMaisRecente,
} from './comparacaoRodadas';

const intervencoes = intervencoesData as Intervencao[];
const rodadasAnteriores = rodadasData as RodadaAnterior[];

/** Parte de um projeto real, para o teste não depender de um objeto inventado. */
const base = (id: string): Intervencao => ({ ...intervencoes[0], id });

const rodadaCom = (projetos: Intervencao[]): RodadaAnterior => ({
  referencia: '06/08/2026',
  rotulo: 'Consolidação de 06/08/2026',
  fonte: 'Página oficial do IRM',
  projetos,
});

describe('compararProjetos', () => {
  it('não acusa mudança entre um projeto e ele mesmo', () => {
    expect(compararProjetos(base('x'), base('x'))).toEqual([]);
  });

  it('registra a situação como de → para, sem julgar avanço', () => {
    const antes = { ...base('x'), situacao: 'Em licitação' as Intervencao['situacao'] };
    const depois = { ...base('x'), situacao: 'Em andamento' as Intervencao['situacao'] };
    const [mudanca] = compararProjetos(antes, depois);
    expect(mudanca).toMatchObject({ campo: 'situacao', de: 'Em licitação', para: 'Em andamento' });
  });

  it('formata valor de contrato em reais nos dois lados', () => {
    const antes = { ...base('x'), valorContrato: 1000 };
    const depois = { ...base('x'), valorContrato: 2500.5 };
    const mudanca = compararProjetos(antes, depois).find((m) => m.campo === 'valorContrato');
    expect(mudanca?.de).toContain('1.000,00');
    expect(mudanca?.para).toContain('2.500,50');
  });

  it('mostra "Não informado" quando o valor deixa de existir, nunca zero', () => {
    const antes = { ...base('x'), valorContrato: 1000 };
    const depois = { ...base('x'), valorContrato: null };
    const mudanca = compararProjetos(antes, depois).find((m) => m.campo === 'valorContrato');
    expect(mudanca?.para).toBe(NAO_INFORMADO);
  });

  // A normalizacao e detalhe interno nosso. Se a fonte declarou a mesma data e
  // so mudou onde ela caiu na estrutura, o portal nao pode anunciar mudanca.
  it('não acusa mudança quando só muda o campo em que a mesma data está guardada', () => {
    const antes = { ...base('x'), dataTerminoVigencia: '31/12/2027', dataTerminoVigenciaTexto: null };
    const depois = { ...base('x'), dataTerminoVigencia: null, dataTerminoVigenciaTexto: '31/12/2027' };
    expect(compararProjetos(antes, depois).find((m) => m.campo === 'dataTerminoVigencia')).toBeUndefined();
  });

  it('acusa mudança quando a data declarada muda de fato', () => {
    const antes = { ...base('x'), dataTerminoVigencia: null, dataTerminoVigenciaTexto: '2027' };
    const depois = { ...base('x'), dataTerminoVigencia: null, dataTerminoVigenciaTexto: '2028' };
    const mudanca = compararProjetos(antes, depois).find((m) => m.campo === 'dataTerminoVigencia');
    expect(mudanca).toMatchObject({ de: '2027', para: '2028' });
  });

  it('relata coordenada que passou a existir pela contagem, não pelo par lat/lng', () => {
    const antes = { ...base('x'), pontos: [] };
    const depois = { ...base('x'), pontos: [{ rotulo: 'Local', lat: -22.7, lng: -43.3 }] };
    const mudanca = compararProjetos(antes, depois).find((m) => m.campo === 'coordenadas');
    expect(mudanca).toMatchObject({ de: 'Sem coordenada declarada', para: '1 coordenada' });
  });

  it('acumula várias mudanças no mesmo projeto', () => {
    const antes = { ...base('x'), situacao: 'Em licitação' as Intervencao['situacao'], valorContrato: 10 };
    const depois = { ...base('x'), situacao: 'Em andamento' as Intervencao['situacao'], valorContrato: 20 };
    expect(compararProjetos(antes, depois)).toHaveLength(2);
  });
});

describe('compararRodadas', () => {
  it('separa quem entrou, quem saiu, quem mudou e quem ficou igual', () => {
    const anterior = rodadaCom([base('a'), base('b'), { ...base('c'), valorContrato: 10 }]);
    const atuais = [base('a'), { ...base('c'), valorContrato: 99 }, base('d')];

    const r = compararRodadas(anterior, atuais, '08/10/2026');

    expect(r.entraram.map((p) => p.id)).toEqual(['d']);
    expect(r.sairam.map((p) => p.id)).toEqual(['b']);
    expect(r.alterados.map((p) => p.id)).toEqual(['c']);
    expect(r.semMudanca).toBe(1);
  });

  it('carrega as referências das duas rodadas comparadas', () => {
    const r = compararRodadas(rodadaCom([]), [], '08/10/2026');
    expect(r.referenciaAnterior).toBe('06/08/2026');
    expect(r.referenciaAtual).toBe('08/10/2026');
  });

  it('um projeto que sai e outro que entra não viram "alteração" um do outro', () => {
    const r = compararRodadas(rodadaCom([base('antigo')]), [base('novo')], '08/10/2026');
    expect(r.alterados).toEqual([]);
    expect(r.entraram.map((p) => p.id)).toEqual(['novo']);
    expect(r.sairam.map((p) => p.id)).toEqual(['antigo']);
  });

  it('comparar os 14 projetos atuais consigo mesmos não acusa nenhuma mudança', () => {
    const r = compararRodadas(rodadaCom(intervencoes), intervencoes, '06/08/2026');
    expect(r.entraram).toEqual([]);
    expect(r.sairam).toEqual([]);
    expect(r.alterados).toEqual([]);
    expect(r.semMudanca).toBe(intervencoes.length);
  });
});

describe('arquivo de rodadas anteriores', () => {
  it('está no formato esperado', () => {
    expect(Array.isArray(rodadasAnteriores)).toBe(true);
    for (const rodada of rodadasAnteriores) {
      expect(rodada.referencia).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(rodada.rotulo.length).toBeGreaterThan(0);
      expect(rodada.fonte.length).toBeGreaterThan(0);
      expect(Array.isArray(rodada.projetos)).toBe(true);
      expect(new Set(rodada.projetos.map((p) => p.id)).size).toBe(rodada.projetos.length);
    }
  });

  it('rodadaMaisRecente devolve null enquanto não houver rodada arquivada', () => {
    expect(rodadaMaisRecente([])).toBeNull();
  });

  it('rodadaMaisRecente devolve a primeira do arquivo', () => {
    const nova = { ...rodadaCom([]), referencia: '08/10/2026' };
    const velha = { ...rodadaCom([]), referencia: '06/08/2026' };
    expect(rodadaMaisRecente([nova, velha])?.referencia).toBe('08/10/2026');
  });
});

describe('campos comparados', () => {
  it('não tem chave repetida', () => {
    const chaves = CAMPOS_COMPARADOS.map((c) => c.campo);
    expect(new Set(chaves).size).toBe(chaves.length);
  });

  it('todo campo produz texto legível para os 14 projetos, sem "undefined" nem "null"', () => {
    for (const item of intervencoes) {
      for (const campo of CAMPOS_COMPARADOS) {
        const valor = campo.ler(item);
        expect(valor.length).toBeGreaterThan(0);
        expect(valor).not.toContain('undefined');
        expect(valor).not.toContain('null');
      }
    }
  });
});
