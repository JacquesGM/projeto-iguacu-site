import type { ReactNode } from 'react';

/**
 * Envolve um gráfico com a sua tabela equivalente.
 *
 * O Recharts desenha o gráfico como dezenas de `<text>` soltos dentro de um
 * SVG. Um leitor de tela atravessa isso lendo números sem rótulo, fora de
 * ordem e sem dizer a que se referem — pior que silêncio, porque parece
 * conteúdo. Por isso o gráfico inteiro vai como `aria-hidden` e **a tabela é a
 * versão acessível**, não um extra.
 *
 * A tabela fica num `<details>` em vez de escondida com `sr-only`: assim serve
 * também a quem enxerga e quer o número exato, que o rótulo arredondado da
 * barra não dá. E evita mais um `sr-only` absoluto solto na página — que já
 * causou rolagem horizontal em todo o portal uma vez.
 *
 * Nenhuma interação do gráfico se perde com o `aria-hidden`: o tooltip do
 * Recharts responde a mouse, nunca a teclado.
 */
export function GraficoComTabela({
  titulo,
  cabecalhos,
  linhas,
  nota,
  alturaDoGrafico = 'h-48',
  children,
}: {
  titulo: string;
  cabecalhos: string[];
  /** Já formatadas para leitura: a tabela é o dado exato, não o arredondado. */
  linhas: string[][];
  nota: ReactNode;
  /** Classe de altura do gráfico; a de situação precisa de mais espaço. */
  alturaDoGrafico?: string;
  children: ReactNode;
}) {
  return (
    <figure className="m-0">
      <h2 className="text-sm font-semibold text-neutral-900">{titulo}</h2>

      <div aria-hidden="true" className={`mt-3 ${alturaDoGrafico}`}>
        {children}
      </div>

      <details className="mt-2 text-xs">
        <summary className="cursor-pointer text-neutral-600 hover:text-neutral-900">Ver dados em tabela</summary>
        <div className="relative mt-2 overflow-x-auto">
          {/* aria-label em vez de <caption> com sr-only: um absoluto a menos
              solto na página, e o nome chega igual ao leitor de tela. */}
          <table aria-label={titulo} className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                {cabecalhos.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`py-1.5 pr-3 font-semibold text-neutral-700 ${i > 0 ? 'text-right' : ''}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha) => (
                <tr key={linha[0]} className="border-b border-neutral-100 last:border-0">
                  {linha.map((celula, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-1.5 pr-3 font-normal text-neutral-700">
                        {celula}
                      </th>
                    ) : (
                      <td key={i} className="py-1.5 pr-3 text-right tabular-nums text-neutral-900">
                        {celula}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <figcaption className="mt-2 text-xs text-neutral-500">{nota}</figcaption>
    </figure>
  );
}
