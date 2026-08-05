import { lazy, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import intervencoesData from '../data/intervencoes.json';
import municipiosData from '../data/municipios.json';
import territorioData from '../data/territorio.json';
import type { Intervencao, Municipio, Territorio } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { SituacaoBadge } from '../components/ui/SituacaoBadge';
import { DownloadButton } from '../components/ui/DownloadButton';
import type { DownloadColumn } from '../lib/download';
import { InterventionsTable } from '../components/sections/InterventionsTable';
import { PageLoading } from '../components/layout/PageLoading';

// Import dinâmico: Leaflet só é baixado quando esta seção entra em vista/renderiza,
// evitando engordar o bundle principal (mesma lógica do mapa do PMetGIRS).
const MunicipiosMap = lazy(() =>
  import('../components/sections/MunicipiosMap').then((m) => ({ default: m.MunicipiosMap })),
);

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];
const territorio = territorioData as Territorio;

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function nomeMunicipio(id: string): string {
  return municipios.find((m) => m.id === id)?.nome ?? 'Não informado';
}

// Duas linhas da extração BI/INFOVIA descrevem o mesmo projeto guarda-chuva
// (controle de inundações do Rio Iguaçu), mas com órgão, valor e situação
// diferentes — nunca escolhemos uma silenciosamente, mostramos as duas.
const divergenciaRioIguacu = intervencoes.filter((i) => i.rio === 'Rio Iguaçu' && i.tipo === 'Controle de inundação');

const colunasIntervencoes: DownloadColumn<Intervencao>[] = [
  { key: 'nomeProjeto', label: 'Intervenção' },
  { key: 'municipioId', label: 'Município', value: (row) => nomeMunicipio(row.municipioId) },
  { key: 'rio', label: 'Rio' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'orgaoResponsavel', label: 'Órgão responsável' },
  { key: 'situacao', label: 'Situação' },
  { key: 'valorContrato', label: 'Valor do contrato', value: (row) => (row.valorContrato !== null ? moeda.format(row.valorContrato) : null) },
  { key: 'empresaContratada', label: 'Empresa contratada' },
  { key: 'processoSEI', label: 'Processo' },
  { key: 'programa', label: 'Programa' },
  { key: 'prazoContratoDias', label: 'Prazo do contrato (dias)' },
  { key: 'dataInicioVigencia', label: 'Início de vigência' },
  { key: 'dataTerminoVigencia', label: 'Término de vigência' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
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
      {divergenciaRioIguacu.length > 1 && (
        <Card className="mb-6 border-amber-300 bg-amber-50">
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-semibold text-amber-900">
                Aviso de transparência: divergência entre fontes sobre o projeto guarda-chuva do Rio Iguaçu
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Dois órgãos reportam o mesmo projeto de controle de inundações das bacias dos rios Iguaçu,
                Botas e Sarapuí com valores, situação e responsável diferentes. Nenhuma das duas versões foi
                escolhida como "a certa" — as duas aparecem abaixo, sem edição. A extração de dados usada
                nesta página não indica prazo nem responsável definido para a reconciliação dessas informações.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {divergenciaRioIguacu.map((item) => (
                  <div key={item.id} className="rounded-lg border border-amber-200 bg-white p-3 text-sm">
                    <p className="font-semibold text-neutral-900">{item.orgaoResponsavel}</p>
                    <p className="mt-1 text-neutral-600">
                      {item.valorContrato !== null ? moeda.format(item.valorContrato) : 'Não informado'}
                    </p>
                    <div className="mt-2">
                      <SituacaoBadge situacao={item.situacao} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

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
      </div>
    </Section>
  );
}
