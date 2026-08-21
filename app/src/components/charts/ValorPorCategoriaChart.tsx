import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { COR_BARRA } from '../../lib/coresMunicipio';
import { GRAFICO } from '../../lib/tokensGrafico';
import { useMediaQuery } from '../../lib/movimento';
import { GraficoComTabela } from './GraficoComTabela';

/**
 * Barras de valor contratado por categoria.
 *
 * Existe porque contar projetos engana: um município com dois projetos de
 * R$ 5 milhões e outro com um de R$ 147 milhões aparecem, no gráfico de
 * contagem, como se o primeiro tivesse o dobro do peso. Aqui a barra é o
 * dinheiro.
 *
 * Cor única, como nos demais gráficos do portal: não existem seis cores
 * simultaneamente institucionais e seguras para daltonismo, então a
 * identidade da categoria fica no rótulo do eixo, nunca na cor.
 */

const moedaCheia = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** "R$ 147,7 mi" — o valor cheio não cabe no eixo nem no fim da barra. */
export function moedaCompacta(valor: number): string {
  if (valor >= 1_000_000) {
    const milhoes = valor / 1_000_000;
    return `R$ ${milhoes.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  }
  if (valor >= 1_000) {
    const mil = valor / 1_000;
    return `R$ ${mil.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`;
  }
  if (valor === 0) return 'R$ 0';
  return moedaCheia.format(valor);
}

/**
 * Rotulo proprio no fim da barra. O `LabelList` do Recharts passa a largura da
 * BARRA como limite do texto, e o componente `Text` dele quebra a linha nesse
 * limite: numa barra curta, "R$ 57,5 mi" virava tres linhas empilhadas em cima
 * do grafico. Desenhando o `<text>` aqui, nao ha largura a respeitar.
 */
function RotuloDeValor(props: unknown) {
  const { x, y, width, height, value } = props as {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
  };
  return (
    <text
      x={x + width + 6}
      y={y + height / 2}
      dominantBaseline="middle"
      style={{ fill: GRAFICO.valor, fontSize: 11, fontWeight: 600 }}
    >
      {moedaCompacta(value)}
    </text>
  );
}

export interface FatiaDeValor {
  nome: string;
  valor: number;
  /** Projetos da categoria cujo valor a fonte não informa. */
  semValorDeclarado: number;
}

export function ValorPorCategoriaChart({
  titulo,
  dados,
  rotuloCategoria,
  nota,
  larguraDoEixo = 130,
}: {
  titulo: string;
  dados: FatiaDeValor[];
  rotuloCategoria: string;
  nota?: string;
  larguraDoEixo?: number;
}) {
  // Num cartao de celular a area util e ~310px: com o eixo em 130px e a
  // margem da direita em 76, sobravam ~100px para as barras, e o tick
  // "R$ 320 mi" ainda quebrava em duas linhas. Abaixo de 640px a geometria
  // encolhe e o eixo passa a ter 3 marcas em vez de 5.
  const telaLarga = useMediaQuery('(min-width: 640px)');
  const eixoY = telaLarga ? larguraDoEixo : 96;
  const margemDireita = telaLarga ? 76 : 62;

  // Ordem decrescente: a pergunta aqui e de magnitude, e comparar barras
  // desordenadas obriga a pessoa a fazer a ordenacao de cabeca.
  const ordenados = [...dados].sort((a, b) => b.valor - a.valor);
  const total = ordenados.reduce((soma, d) => soma + d.valor, 0);
  const semValor = ordenados.reduce((soma, d) => soma + d.semValorDeclarado, 0);

  function CustomTooltip({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: FatiaDeValor }>;
  }) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const pct = total > 0 ? Math.round((item.valor / total) * 100) : 0;
    return (
      <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-md">
        <p className="font-semibold text-neutral-900">{item.nome}</p>
        <p className="text-neutral-700">
          <strong>{moedaCheia.format(item.valor)}</strong> ({pct}% do total)
        </p>
        {item.semValorDeclarado > 0 && (
          <p className="mt-1 text-xs text-neutral-500">
            {item.semValorDeclarado === 1
              ? '1 projeto sem valor declarado, fora desta soma'
              : `${item.semValorDeclarado} projetos sem valor declarado, fora desta soma`}
          </p>
        )}
      </div>
    );
  }

  // A tabela traz o valor CHEIO, nao o compacto da barra: quem abre "ver dados
  // em tabela" quer justamente o numero exato que "R$ 304,6 mi" esconde.
  const linhas = ordenados.map((d) => [
    d.nome,
    moedaCheia.format(d.valor),
    total > 0 ? `${Math.round((d.valor / total) * 100)}%` : '0%',
  ]);

  const notaCompleta = [
    `Valor do contrato declarado, somado por ${rotuloCategoria}. Total: ${moedaCheia.format(total)}.`,
    semValor > 0
      ? semValor === 1
        ? '1 projeto não tem valor declarado e ficou fora da soma.'
        : `${semValor} projetos não têm valor declarado e ficaram fora da soma.`
      : '',
    nota ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <GraficoComTabela
      titulo={titulo}
      cabecalhos={[rotuloCategoria.charAt(0).toUpperCase() + rotuloCategoria.slice(1), 'Valor contratado', '% do total']}
      linhas={linhas}
      nota={notaCompleta}
    >
      <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ordenados}
            layout="vertical"
            margin={{ top: 4, right: margemDireita, left: 8, bottom: 4 }}
            barCategoryGap={10}
          >
            <CartesianGrid horizontal={false} stroke={GRAFICO.grade} />
            <XAxis
              type="number"
              tickFormatter={(v: number) => moedaCompacta(v)}
              tickCount={telaLarga ? 5 : 3}
              tick={{ fontSize: 11, fill: GRAFICO.rotuloEixo }}
              axisLine={{ stroke: GRAFICO.eixo }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="nome"
              width={eixoY}
              tick={{ fontSize: 12, fill: GRAFICO.rotuloCategoria }}
              axisLine={{ stroke: GRAFICO.eixo }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: GRAFICO.cursor }} />
            <Bar dataKey="valor" fill={COR_BARRA} radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
              <LabelList dataKey="valor" content={RotuloDeValor} />
            </Bar>
          </BarChart>
      </ResponsiveContainer>
    </GraficoComTabela>
  );
}
