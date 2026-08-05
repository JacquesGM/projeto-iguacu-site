import { useState } from 'react';
import { Banknote, Building2, CalendarClock, Info, ListChecks, MapPin, Users } from 'lucide-react';
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

const ESCOPO_HISTORICO_MUNICIPIOS = [
  'Nilópolis',
  'Mesquita',
  'São João de Meriti',
  'Belford Roxo',
  'Nova Iguaçu',
  'Duque de Caxias',
  'Bangu/RJ',
];

function contarSituacao(situacao: SituacaoIntervencao): number {
  return intervencoes.filter((i) => i.situacao === situacao).length;
}

function nomeMunicipio(id: string): string {
  return municipios.find((m) => m.id === id)?.nome ?? 'Não informado';
}

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
        const total = intervencoes.filter((i) => i.municipioId === m.id).length;
        return {
          id: m.id,
          titulo: m.nome,
          subtitulo: `${total} intervenç${total === 1 ? 'ão' : 'ões'}`,
          cor: CORES_MUNICIPIO[m.id],
        };
      });
    case 'orgaos': {
      const orgaos = [...new Set(intervencoes.map((i) => i.orgaoResponsavel))];
      return orgaos.map((orgao) => {
        const total = intervencoes.filter((i) => i.orgaoResponsavel === orgao).length;
        return { id: orgao, titulo: orgao, subtitulo: `${total} intervenç${total === 1 ? 'ão' : 'ões'}` };
      });
    }
    case 'intervencoes':
      return itensIntervencoes(intervencoes);
    case 'situacaoFaseDeProjeto':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Fase de Projeto'));
    case 'situacaoEmExecucao':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Em Execução'));
    case 'situacaoConcluido':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Concluído'));
    case 'situacaoSuspenso':
      return itensIntervencoes(intervencoes.filter((i) => i.situacao === 'Suspenso'));
    case 'investimentoPrevisto': {
      // Mesmo critério de exclusão do callout de divergência em Intervenções:
      // os 2 registros do projeto guarda-chuva do Rio Iguaçu (INEA/SEAS) não
      // entram na soma, então também não aparecem neste detalhamento.
      const idsExcluidos = new Set(
        intervencoes.filter((i) => i.rio === 'Rio Iguaçu' && i.tipo === 'Controle de inundação').map((i) => i.id),
      );
      return itensIntervencoes(
        intervencoes
          .filter((i) => i.valorContrato !== null && !idsExcluidos.has(i.id))
          .sort((a, b) => (b.valorContrato ?? 0) - (a.valorContrato ?? 0)),
      );
    }
    case 'populacaoBeneficiadaEstimada':
      return ESCOPO_HISTORICO_MUNICIPIOS.map((nome) => ({ id: nome, titulo: nome }));
    default:
      return [];
  }
}

const cartoesPrincipais = [
  { chave: 'municipios', rotulo: 'Municípios contemplados', valor: String(municipios.length), Icon: MapPin, cor: '#0b4f8a' },
  { chave: 'intervencoes', rotulo: 'Intervenções cadastradas', valor: String(intervencoes.length), Icon: ListChecks, cor: '#0b4f8a' },
  {
    chave: 'orgaos',
    rotulo: 'Órgãos executores',
    valor: String(new Set(intervencoes.map((i) => i.orgaoResponsavel)).size),
    Icon: Building2,
    cor: '#0b4f8a',
  },
];

const cartoesSituacao: { chave: string; situacao: SituacaoIntervencao; rotulo: string }[] = [
  { chave: 'situacaoFaseDeProjeto', situacao: 'Fase de Projeto', rotulo: 'Em fase de projeto' },
  { chave: 'situacaoEmExecucao', situacao: 'Em Execução', rotulo: 'Em execução' },
  { chave: 'situacaoConcluido', situacao: 'Concluído', rotulo: 'Concluídas' },
  { chave: 'situacaoSuspenso', situacao: 'Suspenso', rotulo: 'Suspensas' },
];

const cartoesFinais = [
  { chave: 'investimentoPrevisto', rotulo: 'Investimento previsto', valor: indicadores.investimentoPrevisto, Icon: Banknote, cor: '#5a6b78' },
  {
    chave: 'populacaoBeneficiadaEstimada',
    rotulo: 'População estimada beneficiada',
    valor: indicadores.populacaoBeneficiadaEstimada,
    Icon: Users,
    cor: '#5a6b78',
  },
  {
    chave: 'dataUltimaAtualizacao',
    rotulo: 'Data da última atualização',
    valor: indicadores.dataUltimaAtualizacao,
    Icon: CalendarClock,
    cor: '#5a6b78',
  },
];

const colunasIntervencoesResumo: DownloadColumn<Intervencao>[] = [
  { key: 'nomeProjeto', label: 'Intervenção' },
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
      subtitle="Os números do Projeto Iguaçu, calculados automaticamente a partir das intervenções cadastradas. Clique em um indicador para ver como ele foi calculado."
    >
      <div className="mb-6">
        <DownloadButton
          filename="indicadores-projeto-iguacu"
          title="Indicadores principais — Projeto Iguaçu"
          data={intervencoes}
          columns={colunasIntervencoesResumo}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cartoesPrincipais.map((c) => (
          <Card key={c.chave} className="flex">
            <button
              type="button"
              onClick={() => setChaveSelecionada(c.chave)}
              aria-haspopup="dialog"
              className="group flex w-full flex-col items-start text-left"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${c.cor}1a`, color: c.cor }}
              >
                <c.Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                {c.rotulo}
                <Info aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400 group-hover:text-brand-blue-600" />
              </span>
              <span className="mt-1 text-3xl font-extrabold text-brand-blue-800">{c.valor}</span>
            </button>
          </Card>
        ))}

        {cartoesSituacao.map((c) => {
          const cor = situacaoColorHex(c.situacao);
          const Icon = situacaoIcon(c.situacao);
          return (
            <Card key={c.chave} className="flex">
              <button
                type="button"
                onClick={() => setChaveSelecionada(c.chave)}
                aria-haspopup="dialog"
                className="group flex w-full flex-col items-start text-left"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${cor}1a`, color: cor }}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                  {c.rotulo}
                  <Info aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400 group-hover:text-brand-blue-600" />
                </span>
                <span className="mt-1 text-3xl font-extrabold" style={{ color: cor }}>
                  {contarSituacao(c.situacao)}
                </span>
              </button>
            </Card>
          );
        })}

        {cartoesFinais.map((c) => (
          <Card key={c.chave} className="flex">
            <button
              type="button"
              onClick={() => setChaveSelecionada(c.chave)}
              aria-haspopup="dialog"
              className="group flex w-full flex-col items-start text-left"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${c.cor}1a`, color: c.cor }}
              >
                <c.Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                {c.rotulo}
                <Info aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400 group-hover:text-brand-blue-600" />
              </span>
              <span className="mt-1 break-words text-3xl font-extrabold text-neutral-800">{c.valor}</span>
            </button>
          </Card>
        ))}
      </div>

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
