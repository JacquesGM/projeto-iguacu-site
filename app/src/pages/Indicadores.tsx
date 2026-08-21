import { useState } from 'react';
import { Banknote, Building2, Info, ListChecks, MapPin } from 'lucide-react';
import intervencoesData from '../data/intervencoes.json';
import municipiosData from '../data/municipios.json';
import indicadoresData from '../data/indicadores.json';
import type {
  Indicadores as IndicadoresType,
  ItemPopupIndicador,
  Intervencao,
  Municipio,
  SituacaoIntervencao,
} from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { situacaoColorHex, situacaoIcon } from '../components/ui/SituacaoBadge';
import { SituacaoDistributionChart } from '../components/charts/SituacaoDistributionChart';
import { MunicipioDistributionChart } from '../components/charts/MunicipioDistributionChart';
import { OrgaoDistributionChart } from '../components/charts/OrgaoDistributionChart';
import { DownloadButton } from '../components/ui/DownloadButton';
import { IndicatorDetailModal } from '../components/sections/IndicatorDetailModal';
import { InterventionModal } from '../components/sections/InterventionModal';
import { CORES_MUNICIPIO } from '../lib/coresMunicipio';
import type { DownloadColumn } from '../lib/download';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const indicadores = indicadoresData as IndicadoresType;

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function contarSituacao(situacao: SituacaoIntervencao): number {
  return intervencoes.filter((i) => i.situacao === situacao).length;
}

function nomeMunicipio(id: string): string {
  return municipios.find((m) => m.id === id)?.nome ?? 'Não informado';
}

// Gericinó é declarado para Nilópolis e Mesquita: os dois municípios contam o
// projeto, por isso a soma por município é maior que o total de projetos.
function projetosDoMunicipio(id: string): Intervencao[] {
  return intervencoes.filter((i) => i.municipioId === id || i.municipiosAdicionais.includes(id));
}

const valorTotalContratado = intervencoes.reduce((soma, i) => soma + Math.round((i.valorContrato ?? 0) * 100), 0) / 100;

function itensIntervencoes(lista: Intervencao[]): ItemPopupIndicador[] {
  return lista.map((i) => ({
    id: i.id,
    titulo: i.nomeProjeto,
    subtitulo: nomeMunicipio(i.municipioId),
    situacao: i.situacao,
    valorTexto: i.valorContrato !== null ? moeda.format(i.valorContrato) : undefined,
    intervencaoId: i.id,
  }));
}

function itensParaChave(chave: string | null): ItemPopupIndicador[] {
  switch (chave) {
    case 'municipios':
      return municipios.map((m) => {
        const total = projetosDoMunicipio(m.id).length;
        return {
          id: m.id,
          titulo: m.nome,
          subtitulo: `${total} projeto${total === 1 ? '' : 's'}`,
          cor: CORES_MUNICIPIO[m.id],
        };
      });
    case 'orgaos': {
      const orgaos = [...new Set(intervencoes.map((i) => i.orgaoResponsavel))];
      return orgaos.map((orgao) => {
        const total = intervencoes.filter((i) => i.orgaoResponsavel === orgao).length;
        return { id: orgao, titulo: orgao, subtitulo: `${total} projeto${total === 1 ? '' : 's'}` };
      });
    }
    case 'intervencoes':
      return itensIntervencoes(intervencoes);
    case 'situacaoEmLicitacao':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Em licitação'));
    case 'situacaoEmAndamento':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Em andamento'));
    case 'situacaoConclusaoEmBreve':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Conclusão em breve'));
    case 'situacaoBaixaDeClausulaSuspensiva':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Baixa de cláusula suspensiva'));
    case 'situacaoAguardandoManifestacao':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Aguardando manifestação'));
    case 'valorTotalContratado':
      return itensIntervencoes(
        [...intervencoes]
          .filter((i) => i.valorContrato !== null)
          .sort((a, b) => (b.valorContrato ?? 0) - (a.valorContrato ?? 0)),
      );
    default:
      return [];
  }
}

const cartoesPrincipais = [
  { chave: 'intervencoes', rotulo: 'Projetos publicados', valor: String(intervencoes.length), Icon: ListChecks },
  {
    chave: 'valorTotalContratado',
    rotulo: 'Valor total contratado',
    valor: moeda.format(valorTotalContratado),
    Icon: Banknote,
    // Ocupa duas colunas: e o numero principal da pagina e, com uma so, o
    // valor formatado em pt-BR nao cabe.
    largo: true,
  },
  { chave: 'municipios', rotulo: 'Municípios', valor: String(municipios.length), Icon: MapPin },
  {
    chave: 'orgaos',
    rotulo: 'Órgãos executores',
    valor: String(new Set(intervencoes.map((i) => i.orgaoResponsavel)).size),
    Icon: Building2,
  },
];

const cartoesSituacao: { chave: string; situacao: SituacaoIntervencao; rotulo: string }[] = [
  { chave: 'situacaoEmLicitacao', situacao: 'Em licitação', rotulo: 'Em licitação' },
  { chave: 'situacaoEmAndamento', situacao: 'Em andamento', rotulo: 'Em andamento' },
  { chave: 'situacaoConclusaoEmBreve', situacao: 'Conclusão em breve', rotulo: 'Conclusão em breve' },
  {
    chave: 'situacaoBaixaDeClausulaSuspensiva',
    situacao: 'Baixa de cláusula suspensiva',
    rotulo: 'Baixa de cláusula suspensiva',
  },
  { chave: 'situacaoAguardandoManifestacao', situacao: 'Aguardando manifestação', rotulo: 'Aguardando manifestação' },
];

const colunasIntervencoesResumo: DownloadColumn<Intervencao>[] = [
  { key: 'nomeProjeto', label: 'Projeto' },
  { key: 'situacao', label: 'Situação' },
  { key: 'municipioId', label: 'Município', value: (row) => nomeMunicipio(row.municipioId) },
  { key: 'orgaoResponsavel', label: 'Órgão responsável' },
];

export function Indicadores() {
  const [chaveSelecionada, setChaveSelecionada] = useState<string | null>(null);
  const [intervencaoSelecionadaId, setIntervencaoSelecionadaId] = useState<string | null>(null);
  const detalheSelecionado = chaveSelecionada ? indicadores.detalhamento[chaveSelecionada] : null;
  const intervencaoSelecionada = intervencaoSelecionadaId
    ? (intervencoes.find((i) => i.id === intervencaoSelecionadaId) ?? null)
    : null;

  return (
    <Section
      id="indicadores"
      title="Indicadores principais"
      headingLevel="h1"
      subtitle="Os números do Projeto Iguaçu, calculados automaticamente a partir dos 14 projetos publicados pelo IRM. Clique em um indicador para ver como ele foi calculado."
    >
      <div className="mb-6">
        <DownloadButton
          filename="indicadores-projeto-iguacu"
          title="Indicadores principais — Projeto Iguaçu"
          data={intervencoes}
          columns={colunasIntervencoesResumo}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cartoesPrincipais.map((c) => (
          <Card key={c.chave} className={`flex ${'largo' in c && c.largo ? 'lg:col-span-2' : ''}`}>
            <button
              type="button"
              onClick={() => setChaveSelecionada(c.chave)}
              aria-haspopup="dialog"
              className="group flex w-full flex-col items-start text-left"
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                <c.Icon aria-hidden="true" className="h-4 w-4 text-brand-blue-700" />
                {c.rotulo}
                <Info aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400 group-hover:text-brand-blue-600" />
              </span>
              <span className="mt-1 break-words text-3xl font-extrabold text-brand-blue-800">{c.valor}</span>
            </button>
          </Card>
        ))}
      </div>

      {/* As cinco situações formam um conjunto só: uma faixa, não cinco caixas
          soltas competindo com os indicadores principais. */}
      <Card className="mt-5">
        <h2 className="text-sm font-semibold text-neutral-900">Projetos por situação</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cartoesSituacao.map((c) => {
            const cor = situacaoColorHex(c.situacao);
            const Icon = situacaoIcon(c.situacao);
            return (
              <button
                key={c.chave}
                type="button"
                onClick={() => setChaveSelecionada(c.chave)}
                aria-haspopup="dialog"
                className="group flex w-full flex-col items-start rounded-lg border border-neutral-200 p-3 text-left hover:bg-neutral-50"
              >
                <span className="flex items-start gap-1.5 text-xs font-medium text-neutral-600">
                  <Icon aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: cor }} />
                  {c.rotulo}
                </span>
                <span className="mt-1 text-2xl font-extrabold" style={{ color: cor }}>
                  {contarSituacao(c.situacao)}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Datas são contexto de leitura, não indicador: viravam duas caixas do
          mesmo tamanho de "Valor total contratado", que é o número da página. */}
      <p className="mt-5 text-sm text-neutral-600">
        Dados de <strong className="font-semibold text-neutral-900">{indicadores.dataUltimaAtualizacao}</strong>,
        referentes ao período de {indicadores.periodoReferencia}. Próxima atualização prevista para{' '}
        <strong className="font-semibold text-neutral-900">{indicadores.proximaAtualizacao}</strong>.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <SituacaoDistributionChart situacoes={intervencoes.map((i) => i.situacao)} />
        </Card>
        <Card>
          <MunicipioDistributionChart intervencoes={intervencoes} />
        </Card>
        <Card>
          <OrgaoDistributionChart intervencoes={intervencoes} />
        </Card>
      </div>

      <IndicatorDetailModal
        detalhe={detalheSelecionado}
        fontePadrao={indicadores.fontePadrao}
        itens={itensParaChave(chaveSelecionada)}
        onSelecionarItem={(id) => {
          setChaveSelecionada(null);
          setIntervencaoSelecionadaId(id);
        }}
        onClose={() => setChaveSelecionada(null)}
      />

      <InterventionModal
        intervencao={intervencaoSelecionada}
        municipioNome={intervencaoSelecionada ? nomeMunicipio(intervencaoSelecionada.municipioId) : ''}
        onClose={() => setIntervencaoSelecionadaId(null)}
      />
    </Section>
  );
}
