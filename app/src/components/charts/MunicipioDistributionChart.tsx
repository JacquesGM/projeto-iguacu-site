import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import municipiosData from '../../data/municipios.json';
import type { Intervencao, Municipio } from '../../types';
import { COR_BARRA } from '../../lib/coresMunicipio';
import { GRAFICO } from '../../lib/tokensGrafico';
import { GraficoComTabela } from './GraficoComTabela';

const municipios = municipiosData as Municipio[];

export function MunicipioDistributionChart({ intervencoes }: { intervencoes: Intervencao[] }) {
  const total = intervencoes.length;
  const data = municipios.map((municipio) => ({
    nome: municipio.nome,
    count: intervencoes.filter((i) => i.municipioId === municipio.id).length,
    color: COR_BARRA,
  }));

  function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: (typeof data)[number] }> }) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
    return (
      <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-md">
        <p className="font-semibold text-neutral-900">{item.nome}</p>
        <p style={{ color: item.color }}>
          <strong>{item.count}</strong> de {total} ({pct}%)
        </p>
      </div>
    );
  }

  const linhas = data.map((d) => [
    d.nome,
    String(d.count),
    total > 0 ? `${Math.round((d.count / total) * 100)}%` : '0%',
  ]);

  return (
    <GraficoComTabela
      titulo="Projetos por município"
      cabecalhos={['Município', 'Projetos', '% do total']}
      linhas={linhas}
      nota={`Fonte: página oficial do Projeto Iguaçu (IRM). Total: ${total} projetos.`}
    >
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 4 }} barCategoryGap={10}>
            <CartesianGrid horizontal={false} stroke={GRAFICO.grade} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: GRAFICO.rotuloEixo }} axisLine={{ stroke: GRAFICO.eixo }} tickLine={false} />
            <YAxis type="category" dataKey="nome" width={130} tick={{ fontSize: 12, fill: GRAFICO.rotuloCategoria }} axisLine={{ stroke: GRAFICO.eixo }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: GRAFICO.cursor }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry.nome} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: GRAFICO.valor, fontSize: 12, fontWeight: 600 }} />
            </Bar>
          </BarChart>
      </ResponsiveContainer>
    </GraficoComTabela>
  );
}
