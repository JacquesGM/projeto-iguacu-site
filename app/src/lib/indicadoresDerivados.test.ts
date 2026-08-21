import { describe, expect, it } from 'vitest';
import intervencoesData from '../data/intervencoes.json';
import municipiosData from '../data/municipios.json';
import type { Intervencao, Municipio } from '../types';
import { completudeDosDados, valorPorMunicipio, valorPorSituacao } from './indicadoresDerivados';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];

const somaDeclarada = intervencoes.reduce((s, i) => s + (i.valorContrato ?? 0), 0);

describe('valor por município', () => {
  const fatias = valorPorMunicipio(intervencoes, municipios);

  it('traz uma fatia por município, inclusive os sem projeto próprio', () => {
    expect(fatias).toHaveLength(municipios.length);
  });

  // Se a soma nao fechar, ou algum projeto foi contado duas vezes ou algum
  // ficou de fora -- e o portal estaria publicando um total que nao existe.
  it('a soma das fatias reconcilia com o valor total contratado', () => {
    const total = fatias.reduce((s, f) => s + f.valor, 0);
    expect(total).toBeCloseTo(somaDeclarada, 2);
  });

  // A Barragem de Gericino e atribuida a Nilopolis e Mesquita. Contar em
  // ambos inflaria o total; ratear seria inventar uma divisao que a fonte
  // nao declara.
  it('não conta duas vezes o projeto atribuído a dois municípios', () => {
    const compartilhados = intervencoes.filter((i) => i.municipiosAdicionais.length > 0);
    expect(compartilhados.length).toBeGreaterThan(0);

    for (const projeto of compartilhados) {
      const principal = municipios.find((m) => m.id === projeto.municipioId)!;
      const fatiaPrincipal = fatias.find((f) => f.nome === principal.nome)!;
      expect(fatiaPrincipal.valor).toBeGreaterThanOrEqual(projeto.valorContrato ?? 0);

      // No municipio corresponsavel a fatia vale exatamente a soma dos
      // projetos que o tem como principal -- ou seja, sem este projeto.
      for (const idAdicional of projeto.municipiosAdicionais) {
        const adicional = municipios.find((m) => m.id === idAdicional)!;
        const fatiaAdicional = fatias.find((f) => f.nome === adicional.nome)!;
        const esperado = intervencoes
          .filter((i) => i.municipioId === idAdicional)
          .reduce((s, i) => s + (i.valorContrato ?? 0), 0);
        expect(fatiaAdicional.valor).toBeCloseTo(esperado, 2);
      }
    }
  });

  it('nenhuma fatia é negativa', () => {
    expect(fatias.every((f) => f.valor >= 0)).toBe(true);
  });
});

describe('valor por situação', () => {
  const fatias = valorPorSituacao(intervencoes);

  it('cobre exatamente as situações que aparecem nos dados', () => {
    const situacoes = new Set(intervencoes.map((i) => i.situacao));
    expect(new Set(fatias.map((f) => f.nome))).toEqual(situacoes);
  });

  it('a soma das fatias reconcilia com o valor total contratado', () => {
    const total = fatias.reduce((s, f) => s + f.valor, 0);
    expect(total).toBeCloseTo(somaDeclarada, 2);
  });

  it('cada projeto entra em uma situação só', () => {
    const projetosContados = intervencoes.filter((i) => i.valorContrato !== null).length;
    const semValor = fatias.reduce((s, f) => s + f.semValorDeclarado, 0);
    expect(projetosContados + semValor).toBe(intervencoes.length);
  });
});

describe('completude dos dados', () => {
  const linhas = completudeDosDados(intervencoes);

  it('nunca conta mais preenchidos do que projetos', () => {
    for (const linha of linhas) {
      expect(linha.preenchidos).toBeLessThanOrEqual(linha.total);
      expect(linha.preenchidos).toBeGreaterThanOrEqual(0);
      expect(linha.total).toBe(intervencoes.length);
    }
  });

  // Estas sao as lacunas que o PENDENCIAS.md registra. Se algum dia elas
  // fecharem, e porque o dado chegou -- e o teste deve ser atualizado junto,
  // de proposito, para que a mudanca seja notada.
  it('reflete as lacunas conhecidas em 06/08/2026', () => {
    const por = Object.fromEntries(linhas.map((l) => [l.rotulo, l.preenchidos]));
    expect(por['Com valor de contrato declarado']).toBe(14);
    expect(por['Com processo SEI declarado']).toBe(10);
    expect(por['Com coordenada declarada']).toBe(8);
    expect(por['Com empresa já contratada']).toBe(6);
    expect(por['Com data de término de vigência']).toBe(4);
  });

  // Uma data declarada como texto ("Julho de 2028 (a confirmar)") e
  // informacao, mas nao e data. O rotulo diz "com data", entao contar o texto
  // faria o indicador afirmar mais do que a fonte deu.
  it('não conta como data o término declarado só em texto', () => {
    const soTexto = intervencoes.filter((i) => i.dataTerminoVigencia === null && i.dataTerminoVigenciaTexto);
    expect(soTexto.length).toBeGreaterThan(0);
    const linha = linhas.find((l) => l.rotulo === 'Com data de término de vigência')!;
    expect(linha.preenchidos).toBe(intervencoes.filter((i) => i.dataTerminoVigencia !== null).length);
  });
});
