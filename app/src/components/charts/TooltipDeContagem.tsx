/**
 * O balão dos três gráficos de contagem — situação, município e órgão.
 *
 * Vive fora do corpo do componente de propósito. Declarado dentro, ele virava
 * um **tipo de componente novo a cada render**, e o Recharts remontava o balão
 * em vez de atualizá-lo. Era a mesma implementação copiada em três arquivos, o
 * que também significava três lugares para corrigir qualquer coisa.
 *
 * O rótulo da categoria vem do próprio Recharts, em `label`: num eixo de
 * categoria é o valor da linha sob o cursor. Por isso o balão não precisa
 * saber se o campo do dado se chama `situacao` ou `nome`.
 */
export interface FatiaContada {
  count: number;
  color: string;
}

export function TooltipDeContagem({
  active,
  payload,
  label,
  total,
}: {
  active?: boolean;
  payload?: Array<{ payload: FatiaContada }>;
  label?: string;
  total: number;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-neutral-900">{label}</p>
      <p style={{ color: item.color }}>
        <strong>{item.count}</strong> de {total} ({pct}%)
      </p>
    </div>
  );
}
