import { describe, expect, it } from 'vitest';
import intervencoesData from '../data/intervencoes.json';
import type { Intervencao, PontoIntervencao } from '../types';
import { classificarForma, geometriasDosProjetos, semCoordenada } from './geometriaProjeto';

const intervencoes = intervencoesData as Intervencao[];

const ponto = (rotulo: string): PontoIntervencao => ({ rotulo, lat: -22.7, lng: -43.3 });

describe('classificarForma', () => {
  it('uma coordenada e um local unico', () => {
    expect(classificarForma([ponto('Local')])).toBe('ponto');
  });

  it('par Inicial/Final e um trecho', () => {
    expect(classificarForma([ponto('Inicial'), ponto('Final')])).toBe('trecho');
  });

  it('nao depende da ordem dos rotulos do par', () => {
    expect(classificarForma([ponto('Final'), ponto('Inicial')])).toBe('trecho');
  });

  it('tres ou mais coordenadas formam um conjunto', () => {
    expect(classificarForma([ponto('Ponto 1'), ponto('Ponto 2'), ponto('Ponto 3')])).toBe('conjunto');
  });

  // Duas coordenadas soltas nao sao as duas pontas de um canal: ligar as duas
  // com uma linha afirmaria um percurso que a fonte nao declarou.
  it('duas coordenadas sem par Inicial/Final sao conjunto, nao trecho', () => {
    expect(classificarForma([ponto('Ponto 1'), ponto('Ponto 2')])).toBe('conjunto');
  });
});

describe('geometrias dos projetos reais', () => {
  const geometrias = geometriasDosProjetos(intervencoes);

  it('inclui apenas projetos com coordenada declarada', () => {
    expect(geometrias.every((g) => g.pontos.length > 0)).toBe(true);
    expect(geometrias.length + semCoordenada(intervencoes).length).toBe(intervencoes.length);
  });

  it('nenhum projeto e inventado nem duplicado', () => {
    const ids = geometrias.map((g) => g.intervencao.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => intervencoes.some((i) => i.id === id))).toBe(true);
  });

  it('preserva todas as coordenadas declaradas, sem descartar nenhuma', () => {
    for (const g of geometrias) {
      expect(g.pontos).toHaveLength(g.intervencao.pontos.length);
      expect(g.rotulos).toHaveLength(g.intervencao.pontos.length);
    }
  });

  it('as pontes de Nova Iguacu sao um conjunto de 10 pontos, nao uma area', () => {
    const pontes = geometrias.find((g) => g.intervencao.id === 'pontes-nova-iguacu');
    expect(pontes?.forma).toBe('conjunto');
    expect(pontes?.pontos).toHaveLength(10);
  });

  it('os reservatorios de Nova Iguacu sao um conjunto de 3 pontos', () => {
    const reservatorios = geometrias.find((g) => g.intervencao.id === 'reservatorios-nova-iguacu');
    expect(reservatorios?.forma).toBe('conjunto');
    expect(reservatorios?.pontos).toHaveLength(3);
  });

  it('a ancora de cada projeto cai dentro da faixa das suas coordenadas', () => {
    for (const g of geometrias) {
      const lats = g.pontos.map((p) => p.lat);
      const lngs = g.pontos.map((p) => p.lng);
      expect(g.ancora.lat).toBeGreaterThanOrEqual(Math.min(...lats));
      expect(g.ancora.lat).toBeLessThanOrEqual(Math.max(...lats));
      expect(g.ancora.lng).toBeGreaterThanOrEqual(Math.min(...lngs));
      expect(g.ancora.lng).toBeLessThanOrEqual(Math.max(...lngs));
    }
  });
});
