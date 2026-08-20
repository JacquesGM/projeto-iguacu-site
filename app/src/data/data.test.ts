import { describe, expect, it } from 'vitest';
import intervencoesData from './intervencoes.json';
import municipiosData from './municipios.json';
import documentosData from './documentos.json';
import linhaDoTempoData from './linhaDoTempo.json';
import contatosData from './contatos.json';
import transparenciaData from './transparencia.json';
import type { Contato, Documento, Intervencao, MarcoLinhaDoTempo, Municipio, Transparencia } from '../types';
import { SITUACOES_VALIDAS } from '../components/ui/SituacaoBadge';
import { routes } from '../routes';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const documentos = documentosData as Documento[];
const linhaDoTempo = linhaDoTempoData as MarcoLinhaDoTempo[];
const contatos = contatosData as Contato[];
const transparencia = transparenciaData as Transparencia;

function idsUnicos(items: { id: string }[]): boolean {
  return new Set(items.map((i) => i.id)).size === items.length;
}

describe('integridade dos dados', () => {
  it('todo municipioId em intervencoes.json existe em municipios.json', () => {
    const idsValidos = new Set(municipios.map((m) => m.id));
    for (const item of intervencoes) {
      expect(idsValidos.has(item.municipioId), `municipioId "${item.municipioId}" em "${item.id}" não existe`).toBe(true);
    }
  });

  it('toda situacao usada em intervencoes.json é uma das 4 situações válidas', () => {
    for (const item of intervencoes) {
      expect(SITUACOES_VALIDAS, `situação "${item.situacao}" em "${item.id}" é inválida`).toContain(item.situacao);
    }
  });

  it('ids de intervencoes.json são únicos', () => {
    expect(idsUnicos(intervencoes)).toBe(true);
  });

  it('ids de municipios.json são únicos', () => {
    expect(idsUnicos(municipios)).toBe(true);
  });

  it('lat/lng de intervencoes.json, quando informadas, estão dentro da faixa do estado do Rio de Janeiro', () => {
    for (const item of intervencoes) {
      if (item.latitude === null || item.longitude === null) continue;
      expect(item.latitude, `latitude fora da faixa esperada em "${item.id}"`).toBeGreaterThan(-23.5);
      expect(item.latitude).toBeLessThan(-20.5);
      expect(item.longitude, `longitude fora da faixa esperada em "${item.id}"`).toBeGreaterThan(-44.9);
      expect(item.longitude).toBeLessThan(-40.9);
    }
  });

  it('valorContrato de intervencoes.json, quando informado, é positivo', () => {
    for (const item of intervencoes) {
      if (item.valorContrato === null) continue;
      expect(item.valorContrato, `valorContrato inválido em "${item.id}"`).toBeGreaterThan(0);
    }
  });

  // Controles da consolidação oficial de 06/08/2026 (rj.gov.br/irm/node/387).
  // Se um destes falhar, o dado divergiu da fonte e não pode ser publicado.
  it('publica exatamente os 14 projetos da consolidação oficial', () => {
    expect(intervencoes).toHaveLength(14);
  });

  it('a soma dos contratos reconcilia com o total declarado pela fonte', () => {
    const centavos = intervencoes.reduce((soma, i) => soma + Math.round((i.valorContrato ?? 0) * 100), 0);
    expect(centavos).toBe(75516121453);
  });

  it('todo municipioId de municipiosAdicionais existe em municipios.json', () => {
    const idsValidos = new Set(municipios.map((m) => m.id));
    for (const item of intervencoes) {
      for (const id of item.municipiosAdicionais) {
        expect(idsValidos.has(id), `municipioId adicional "${id}" em "${item.id}" não existe`).toBe(true);
      }
      expect(item.municipiosAdicionais, `"${item.id}" repete o município principal`).not.toContain(item.municipioId);
    }
  });

  it('latitude/longitude representam o primeiro ponto declarado', () => {
    for (const item of intervencoes) {
      if (item.pontos.length === 0) {
        expect(item.latitude, `"${item.id}" não tem ponto mas tem latitude`).toBeNull();
        expect(item.longitude, `"${item.id}" não tem ponto mas tem longitude`).toBeNull();
        expect(item.coordenadasTexto, `"${item.id}" não tem ponto mas tem texto de coordenada`).toBeNull();
        continue;
      }
      expect(item.latitude).toBe(item.pontos[0].lat);
      expect(item.longitude).toBe(item.pontos[0].lng);
    }
  });

  it('todo ponto declarado está dentro da faixa do estado do Rio de Janeiro', () => {
    for (const item of intervencoes) {
      for (const ponto of item.pontos) {
        expect(ponto.lat, `latitude fora da faixa em "${item.id}" (${ponto.rotulo})`).toBeGreaterThan(-23.5);
        expect(ponto.lat).toBeLessThan(-20.5);
        expect(ponto.lng, `longitude fora da faixa em "${item.id}" (${ponto.rotulo})`).toBeGreaterThan(-44.9);
        expect(ponto.lng).toBeLessThan(-40.9);
      }
    }
  });

  it('data de vigência normalizada e texto original nunca coexistem', () => {
    for (const item of intervencoes) {
      expect(
        !(item.dataInicioVigencia && item.dataInicioVigenciaTexto),
        `"${item.id}" tem data de início normalizada e texto original ao mesmo tempo`,
      ).toBe(true);
      expect(
        !(item.dataTerminoVigencia && item.dataTerminoVigenciaTexto),
        `"${item.id}" tem data de término normalizada e texto original ao mesmo tempo`,
      ).toBe(true);
    }
  });

  it('término de vigência, quando há os dois, é posterior ao início', () => {
    const paraData = (v: string) => {
      const [d, m, a] = v.split('/').map(Number);
      return new Date(a, m - 1, d).getTime();
    };
    for (const item of intervencoes) {
      if (!item.dataInicioVigencia || !item.dataTerminoVigencia) continue;
      expect(
        paraData(item.dataTerminoVigencia),
        `cronologia incoerente em "${item.id}"`,
      ).toBeGreaterThan(paraData(item.dataInicioVigencia));
    }
  });

  it('toda situação declarada tem significado explicado em transparencia.json', () => {
    const explicadas = new Set(transparencia.significadoSituacoes.map((s) => s.situacao));
    for (const situacao of new Set(intervencoes.map((i) => i.situacao))) {
      expect(explicadas.has(situacao), `situação "${situacao}" não está explicada em Transparência`).toBe(true);
    }
  });

  it('ids de documentos.json são únicos', () => {
    expect(idsUnicos(documentos)).toBe(true);
  });

  it('ids de linhaDoTempo.json são únicos', () => {
    expect(idsUnicos(linhaDoTempo)).toBe(true);
  });

  it('todo path de rota é único', () => {
    const paths = routes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('url de documentos.json é vazia ou começa com http', () => {
    for (const doc of documentos) {
      expect(doc.url === '' || doc.url.startsWith('http'), `url inválida em "${doc.id}"`).toBe(true);
    }
  });

  it('e-mails de contatos.json têm formato válido', () => {
    for (const contato of contatos) {
      expect(contato.email, `e-mail inválido para "${contato.nome}"`).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });
});
