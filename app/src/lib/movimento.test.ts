import { afterEach, describe, expect, it, vi } from 'vitest';
import { prefereMovimentoReduzido } from './movimento';

const original = window.matchMedia;

afterEach(() => {
  if (original) window.matchMedia = original;
  else Reflect.deleteProperty(window, 'matchMedia');
});

const fingirMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
};

describe('prefereMovimentoReduzido', () => {
  // Este e o caso que quebrou de verdade: jsdom nao tem matchMedia, e a
  // chamada direta derrubava o efeito do mapa durante os testes.
  it('devolve false onde matchMedia não existe, em vez de lançar', () => {
    Reflect.deleteProperty(window, 'matchMedia');
    expect(() => prefereMovimentoReduzido()).not.toThrow();
    expect(prefereMovimentoReduzido()).toBe(false);
  });

  it('devolve true quando a preferência está ligada', () => {
    fingirMatchMedia(true);
    expect(prefereMovimentoReduzido()).toBe(true);
  });

  it('devolve false quando a preferência está desligada', () => {
    fingirMatchMedia(false);
    expect(prefereMovimentoReduzido()).toBe(false);
  });

  it('pergunta exatamente pela media query de movimento reduzido', () => {
    fingirMatchMedia(false);
    prefereMovimentoReduzido();
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});
