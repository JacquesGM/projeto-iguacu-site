import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import municipiosData from '../../data/municipios.json';
import type { Intervencao, Municipio } from '../../types';

const municipios = municipiosData as Municipio[];

// Paleta validada com scripts/validate_palette.js (dataviz skill) — todos os
// checks passam: banda de luminosidade, piso de croma, separação CVD e piso
// de visão normal. Cores institucionais azul/verde do site + um roxo mais
// claro que o da etiqueta "Em licitação" (para não colidir visualmente).
const CORES_MUNICIPIO = ['#2f7fb8', '#2f9e75', '#7c4dbd'];

export function MunicipioDistributionChart({ intervencoes }: { intervencoes: Intervencao[] }) {
  const total = intervencoes.length;
  const data = municipios.map((municipio, index) => ({
    nome: municipio.nome,
    count: intervencoes.filter((i) => i.municipioId === municipio.id).length,
    color: CORES_MUNICIPIO[index % CORES_MUNICIPIO.length],
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

  return (
    <div>
      <p className="text-sm font-semibold text-neutral-900">Intervenções por município</p>
      <div className="mt-3 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 4 }} barCategoryGap={10}>
            <CartesianGrid horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5a6b78' }} axisLine={{ stroke: '#c7d8e4' }} tickLine={false} />
            <YAxis type="category" dataKey="nome" width={130} tick={{ fontSize: 12, fill: '#34424d' }} axisLine={{ stroke: '#c7d8e4' }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry.nome} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: '#4a5964', fontSize: 12, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        Municípios demonstrativos (ver Transparência). Total: {total} intervenções.
      </p>
    </div>
  );
}
