import { lazy, Suspense } from 'react';
import intervencoesData from '../data/intervencoes.json';
import municipiosData from '../data/municipios.json';
import territorioData from '../data/territorio.json';
import type { Intervencao, Municipio, Territorio } from '../types';
import { Section } from '../components/ui/Section';
import { DownloadButton } from '../components/ui/DownloadButton';
import type { DownloadColumn } from '../lib/download';
import { InterventionsTable } from '../components/sections/InterventionsTable';
import { PageLoading } from '../components/layout/PageLoading';
import mapaBaixada from '../assets/mapa-baixada-fluminense.png';

// Import dinâmico: Leaflet só é baixado quando esta seção entra em vista/renderiza,
// evitando engordar o bundle principal (mesma lógica do mapa do PMetGIRS).
const MunicipiosMap = lazy(() =>
  import('../components/sections/MunicipiosMap').then((m) => ({ default: m.MunicipiosMap })),
);

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const territorio = territorioData as Territorio;

function nomeMunicipio(id: string): string {
  return municipios.find((m) => m.id === id)?.nome ?? 'Não informado';
}

const colunasIntervencoes: DownloadColumn<Intervencao>[] = [
  { key: 'nomeProjeto', label: 'Intervenção' },
  { key: 'municipioId', label: 'Município', value: (row) => nomeMunicipio(row.municipioId) },
  { key: 'rio', label: 'Rio' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'orgaoResponsavel', label: 'Órgão responsável' },
  { key: 'fase', label: 'Fase' },
  { key: 'situacao', label: 'Situação' },
  { key: 'percentualExecucao', label: '% execução física' },
  { key: 'execucaoFinanceira', label: '% execução financeira' },
  { key: 'empresaContratada', label: 'Empresa contratada' },
  { key: 'valorContrato', label: 'Valor contratado' },
  { key: 'fonteRecurso', label: 'Fonte do recurso' },
  { key: 'dataPrevista', label: 'Data prevista de conclusão' },
  { key: 'motivoAtrasoParalisacao', label: 'Motivo de atraso/paralisação' },
  { key: 'fonte', label: 'Fonte da informação' },
  { key: 'ultimaAtualizacao', label: 'Última atualização' },
];

export function Intervencoes() {
  return (
    <Section
      id="intervencoes"
      title="Intervenções por município"
      subtitle="Pesquise, filtre e ordene as intervenções do Projeto Iguaçu; clique em uma linha para ver todos os detalhes."
      tone="muted"
    >
      <div className="mb-6">
        <DownloadButton
          filename="intervencoes-projeto-iguacu"
          title="Intervenções — Projeto Iguaçu"
          data={intervencoes}
          columns={colunasIntervencoes}
        />
      </div>
      <InterventionsTable />

      <div className="mt-12 border-t border-neutral-200 pt-10">
        <p className="text-lg font-semibold text-neutral-900">Onde estão as intervenções</p>
        <p className="mt-1 text-sm text-neutral-600">{territorio.descricaoTextual}</p>
        <div className="mt-4">
          <Suspense fallback={<PageLoading label="Carregando mapa..." />}>
            <MunicipiosMap />
          </Suspense>
        </div>

        <figure className="mt-6 overflow-hidden rounded-xl border border-neutral-200 lg:max-w-md">
          <img src={mapaBaixada} alt={territorio.imagemAlt} className="w-full" loading="lazy" />
          <figcaption className="border-t border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-500">
            {territorio.legenda}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
