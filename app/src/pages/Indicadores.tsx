import { Banknote, CalendarClock, ListChecks, MapPin, Users } from 'lucide-react';
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
import type { DownloadColumn } from '../lib/download';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const indicadores = indicadoresData as IndicadoresType;

function contarSituacao(situacao: SituacaoIntervencao): number {
  return intervencoes.filter((i) => i.situacao === situacao).length;
}

const cartoesPrincipais = [
  { rotulo: 'Municípios contemplados', valor: String(municipios.length), Icon: MapPin, cor: '#0b4f8a' },
  { rotulo: 'Intervenções cadastradas', valor: String(intervencoes.length), Icon: ListChecks, cor: '#0b4f8a' },
];

const cartoesSituacao: { situacao: SituacaoIntervencao; rotulo: string }[] = [
  { situacao: 'Fase de Projeto', rotulo: 'Em fase de projeto' },
  { situacao: 'Em Execução', rotulo: 'Em execução' },
  { situacao: 'Concluído', rotulo: 'Concluídas' },
  { situacao: 'Suspenso', rotulo: 'Suspensas' },
];

const cartoesFinais = [
  { rotulo: 'Investimento previsto', valor: indicadores.investimentoPrevisto, Icon: Banknote, cor: '#5a6b78' },
  { rotulo: 'População estimada beneficiada', valor: indicadores.populacaoBeneficiadaEstimada, Icon: Users, cor: '#5a6b78' },
  { rotulo: 'Data da última atualização', valor: indicadores.dataUltimaAtualizacao, Icon: CalendarClock, cor: '#5a6b78' },
];

const colunasIntervencoesResumo: DownloadColumn<Intervencao>[] = [
  { key: 'nomeProjeto', label: 'Intervenção' },
  { key: 'situacao', label: 'Situação' },
  { key: 'municipioId', label: 'Município', value: (row) => municipios.find((m) => m.id === row.municipioId)?.nome },
];

export function Indicadores() {
  return (
    <Section
      id="indicadores"
      title="Indicadores principais"
      subtitle="Os números do Projeto Iguaçu, calculados automaticamente a partir das intervenções cadastradas."
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
          <Card key={c.rotulo} className="flex flex-col">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${c.cor}1a`, color: c.cor }}
            >
              <c.Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-neutral-600">{c.rotulo}</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-blue-800">{c.valor}</p>
          </Card>
        ))}

        {cartoesSituacao.map((c) => {
          const cor = situacaoColorHex(c.situacao);
          const Icon = situacaoIcon(c.situacao);
          return (
            <Card key={c.situacao} className="flex flex-col">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${cor}1a`, color: cor }}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-medium text-neutral-600">{c.rotulo}</p>
              <p className="mt-1 text-3xl font-extrabold" style={{ color: cor }}>
                {contarSituacao(c.situacao)}
              </p>
            </Card>
          );
        })}

        {cartoesFinais.map((c) => (
          <Card key={c.rotulo} className="flex flex-col">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${c.cor}1a`, color: c.cor }}
            >
              <c.Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-neutral-600">{c.rotulo}</p>
            <p className="mt-1 break-words text-3xl font-extrabold text-neutral-800">{c.valor}</p>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-sm text-neutral-600">{indicadores.observacao}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <SituacaoDistributionChart situacoes={intervencoes.map((i) => i.situacao)} />
        </Card>
        <Card>
          <MunicipioDistributionChart intervencoes={intervencoes} />
        </Card>
      </div>
    </Section>
  );
}
