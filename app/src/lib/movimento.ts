/**
 * Se a pessoa pediu menos movimento no sistema operacional.
 *
 * O CSS do portal já respeita `prefers-reduced-motion`, mas bibliotecas que
 * animam por conta própria — o Leaflet, ao reposicionar o mapa — não
 * consultam a preferência. Quem precisa disso pergunta aqui.
 *
 * A guarda em `matchMedia` não é defensivismo à toa: em jsdom a função não
 * existe, e chamá-la direto derrubava o efeito do mapa durante os testes. O
 * erro não reprovava a suíte, só aparecia como "unhandled" no fim — o tipo de
 * coisa que passa despercebida até mascarar uma falha de verdade.
 */
export function prefereMovimentoReduzido(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
