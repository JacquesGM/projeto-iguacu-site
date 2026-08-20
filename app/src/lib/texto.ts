/**
 * Primeira letra maiúscula, preservando o resto da frase.
 *
 * O vocabulário de tipo vem da fonte em minúscula ("obra", "apoio técnico /
 * gerenciamento"). O valor é mantido como declarado nos dados; só a exibição
 * é ajustada. `text-transform: capitalize` não serve porque maiusculizaria
 * cada palavra ("Apoio Técnico / Gerenciamento").
 */
export function primeiraMaiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
