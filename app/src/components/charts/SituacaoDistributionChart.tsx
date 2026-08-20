import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SituacaoIntervencao } from '../../types';
import { situacaoColorHex } from '../ui/SituacaoBadge';
import { GRAFICO } from '../../lib/tokensGrafico';

export function groupBySituacao(situacoes: SituacaoIntervencao[]) {
  const counts = new Map<SituacaoIntervencao, number>();
  for (const situacao of situacoes) {
    counts.set(situacao, (counts.get(situacao) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([situacao, count]) => ({ situacao, count, color: situacaoColorHex(situacao) }))
    .sort((a, b) => b.count - a.count);
}

export function SituacaoDistributionChart({ situacoes }: { situacoes: SituacaoIntervencao[] }) {
  const total = situacoes.length;
  const data = groupBySituacao(situacoes);

  function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: (typeof data)[number] }> }) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
    return (
      <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-md">
        <p className="font-semibold text-neutral-900">{item.situacao}</p>
        <p style={{ color: item.color }}>
          <strong>{item.count}</strong> de {total} ({pct}%)
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">Projetos por situação</h2>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 4 }} barCategoryGap={8}>
            <CartesianGrid horizontal={false} stroke={GRAFICO.grade} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: GRAFICO.rotuloEixo }} axisLine={{ stroke: GRAFICO.eixo }} tickLine={false} />
            <YAxis type="category" dataKey="situacao" width={140} tick={{ fontSize: 12, fill: GRAFICO.rotuloCategoria }} axisLine={{ stroke: GRAFICO.eixo }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: GRAFICO.cursor }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry.situacao} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: GRAFICO.valor, fontSize: 12, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-neutral-500">Fonte: página oficial do Projeto Iguaçu (IRM). Total: {total} projetos.</p>
    </div>
  );
}
