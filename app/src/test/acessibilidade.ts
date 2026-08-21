import axe, { type AxeResults, type Result } from 'axe-core';

/**
 * Roda o axe-core sobre um trecho já renderizado e devolve as violações.
 *
 * **O que isto cobre e o que não cobre.** Em jsdom não há layout nem pintura:
 * o axe consegue avaliar estrutura, ARIA, nomes acessíveis, ordem de títulos e
 * rótulos de formulário — e não consegue avaliar contraste de cor, tamanho de
 * alvo de toque nem qualquer coisa que dependa de geometria. Os gráficos
 * também ficam de fora, porque o `ResponsiveContainer` do Recharts não desenha
 * nada sem dimensão (a alternativa em tabela, essa sim, é verificada).
 *
 * Ou seja: isto transforma metade da auditoria de acessibilidade em teste de
 * regressão a cada commit. A outra metade — contraste, toque, leitura real com
 * leitor de tela — continua exigindo a passada no navegador. Tratar este teste
 * verde como "o portal é acessível" seria justamente o erro.
 */

/** Regras que o jsdom não tem como julgar; deixá-las ligadas só produz ruído. */
const REGRAS_DESLIGADAS = {
  // Precisa de cor computada e de sobreposição real.
  'color-contrast': { enabled: false },
  // Precisa de geometria: em jsdom todo elemento tem tamanho zero.
  'target-size': { enabled: false },
} as const;

export async function violacoesDeAcessibilidade(container: HTMLElement): Promise<Result[]> {
  const resultado: AxeResults = await axe.run(container, {
    rules: REGRAS_DESLIGADAS,
    resultTypes: ['violations'],
  });
  return resultado.violations;
}

/** Uma linha por violação, com o seletor do elemento — para o erro do teste ser acionável. */
export function descreverViolacoes(violacoes: Result[]): string {
  return violacoes
    .map((v) => {
      const onde = v.nodes.map((n) => n.target.join(' ')).join(', ');
      return `[${v.impact ?? 'sem impacto'}] ${v.id}: ${v.help}\n    em: ${onde}\n    ver: ${v.helpUrl}`;
    })
    .join('\n');
}
