import { useState } from 'react';
import { Banknote, CalendarClock, Info, ListChecks, MapPin, Users } from 'lucide-react';
import intervencoesData from '../data/intervencoes.json';
import municipiosData from '../data/municipios.json';
import indicadoresData from '../data/indicadores.json';
import type { Indicadores as IndicadoresType, Intervencao, Municipio, SituacaoIntervencao } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { situacaoColorHex, situacaoIcon } from '../components/ui/SituacaoBadge';
import { SituacaoDistributionChart } from '../components/charts/SituacaoDistributionChart';
import { MunicipioDistributionChart } from '../components/charts/MunicipioDistributionChart';
import { DownloadButton } from '../components/ui/DownloadButton';
import { IndicatorDetailModal } from '../components/sections/IndicatorDetailModal';
import type { DownloadColumn } from '../lib/download';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const indicadores = indicadoresData as IndicadoresType;

function contarSituacao(situacao: SituacaoIntervencao): number {
  return intervencoes.filter((i) => i.situacao === situacao).length;
}

const cartoesPrincipais = [
  { chave: 'municipios', rotulo: 'Municípios contemplados', valor: String(municipios.length), Icon: MapPin, cor: '#0b4f8a' },
  { chave: 'intervencoes', rotulo: 'Intervenções cadastradas', valor: String(intervencoes.length), Icon: ListChecks, cor: '#0b4f8a' },
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
  { key: 'municipioId', label: 'Município', value: (row) => municipios.find((m) => m.id === row.municipioId)?.nome },
];

export function Indicadores() {
  const [chaveSelecionada, setChaveSelecionada] = useState<string | null>(null);
  const detalheSelecionado = chaveSelecionada ? indicadores.detalhamento[chaveSelecionada] : null;

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
      </div>

      <IndicatorDetailModal detalhe={detalheSelecionado} onClose={() => setChaveSelecionada(null)} />
    </Section>
  );
}
