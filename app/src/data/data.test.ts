import { describe, expect, it } from 'vitest';
import intervencoesData from './intervencoes.json';
import municipiosData from './municipios.json';
import documentosData from './documentos.json';
import linhaDoTempoData from './linhaDoTempo.json';
import contatosData from './contatos.json';
import type { Contato, Documento, Intervencao, MarcoLinhaDoTempo, Municipio } from '../types';
import { SITUACOES_VALIDAS } from '../components/ui/SituacaoBadge';
import { routes } from '../routes';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const documentos = documentosData as Documento[];
const linhaDoTempo = linhaDoTempoData as MarcoLinhaDoTempo[];
const contatos = contatosData as Contato[];

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
