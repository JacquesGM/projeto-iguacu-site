import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Intervencao } from '../../types';
import { COR_BARRA } from '../../lib/coresMunicipio';
import { GRAFICO } from '../../lib/tokensGrafico';
import { GraficoComTabela } from './GraficoComTabela';
import { TooltipDeContagem } from './TooltipDeContagem';

// Uma cor só, de propósito: o nome do órgão já está no eixo, então cor por
// categoria aqui seria decoração — e decoração colorida é justamente o que
// quebra para quem tem daltonismo, sem informar nada a mais a quem não tem.

export function OrgaoDistributionChart({ intervencoes }: { intervencoes: Intervencao[] }) {
  const total = intervencoes.length;
  const orgaos = [...new Set(intervencoes.map((i) => i.orgaoResponsavel))].sort(
    (a, b) => intervencoes.filter((i) => i.orgaoResponsavel === b).length - intervencoes.filter((i) => i.orgaoResponsavel === a).length,
  );
  const data = orgaos.map((orgao) => ({
    nome: orgao,
    count: intervencoes.filter((i) => i.orgaoResponsavel === orgao).length,
    color: COR_BARRA,
  }));

  const linhas = data.map((d) => [
    d.nome,
    String(d.count),
    total > 0 ? `${Math.round((d.count / total) * 100)}%` : '0%',
  ]);

  return (
    <GraficoComTabela
      titulo="Projetos por órgão executor"
      cabecalhos={['Órgão executor', 'Projetos', '% do total']}
      linhas={linhas}
      nota={`Fonte: página oficial do Projeto Iguaçu (IRM). Total: ${total} projetos.`}
    >
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 4 }} barCategoryGap={10}>
            <CartesianGrid horizontal={false} stroke={GRAFICO.grade} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: GRAFICO.rotuloEixo }} axisLine={{ stroke: GRAFICO.eixo }} tickLine={false} />
            <YAxis type="category" dataKey="nome" width={70} tick={{ fontSize: 12, fill: GRAFICO.rotuloCategoria }} axisLine={{ stroke: GRAFICO.eixo }} tickLine={false} />
            <Tooltip content={<TooltipDeContagem total={total} />} cursor={{ fill: GRAFICO.cursor }} />
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
