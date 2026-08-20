import { lazy, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import intervencoesData from '../data/intervencoes.json';
import territorioData from '../data/territorio.json';
import type { Intervencao, Territorio } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { DownloadButton } from '../components/ui/DownloadButton';
import type { DownloadColumn } from '../lib/download';
import { InterventionsTable, nomesMunicipios } from '../components/sections/InterventionsTable';
import { PageLoading } from '../components/layout/PageLoading';

// Import dinâmico: Leaflet só é baixado quando esta seção entra em vista/renderiza,
// evitando engordar o bundle principal (mesma lógica do mapa do PMetGIRS).
const MunicipiosMap = lazy(() =>
  import('../components/sections/MunicipiosMap').then((m) => ({ default: m.MunicipiosMap })),
);

const intervencoes = intervencoesData as Intervencao[];
const territorio = territorioData as Territorio;

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// A página oficial do IRM traz um aviso de transparência sobre a natureza do
// dado; repetimos aqui e somamos o que os próprios registros revelam — quantos
// projetos ainda não têm coordenada declarada.
const semCoordenada = intervencoes.filter((i) => i.pontos.length === 0).length;

const colunasIntervencoes: DownloadColumn<Intervencao>[] = [
  { key: 'nomeProjeto', label: 'Projeto' },
  { key: 'municipioId', label: 'Município', value: (row) => nomesMunicipios(row) },
  { key: 'rio', label: 'Rio' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'orgaoResponsavel', label: 'Órgão executor' },
  { key: 'situacao', label: 'Situação' },
  { key: 'valorContrato', label: 'Valor do contrato', value: (row) => (row.valorContrato !== null ? moeda.format(row.valorContrato) : null) },
  { key: 'empresaContratada', label: 'Empresa contratada' },
  { key: 'processoSEI', label: 'Processo' },
  { key: 'programa', label: 'Programa' },
  { key: 'prazoContratoMeses', label: 'Prazo do contrato (meses)' },
  { key: 'dataInicioVigencia', label: 'Início de vigência', value: (row) => row.dataInicioVigencia ?? row.dataInicioVigenciaTexto },
  { key: 'dataTerminoVigencia', label: 'Término de vigência', value: (row) => row.dataTerminoVigencia ?? row.dataTerminoVigenciaTexto },
  { key: 'coordenadasTexto', label: 'Coordenadas declaradas' },
  { key: 'observacoes', label: 'Observações do órgão' },
  { key: 'fonte', label: 'Fonte da informação' },
  { key: 'ultimaAtualizacao', label: 'Última atualização' },
];

export function Intervencoes() {
  return (
    <Section
      id="intervencoes"
      title="Projetos por município"
      headingLevel="h1"
      subtitle="Pesquise, filtre e ordene os 14 projetos publicados pelo IRM; clique em uma linha para ver todos os detalhes."
      tone="muted"
    >
      <Card className="mb-6 border-amber-300 bg-amber-50">
        <div className="flex gap-3">
          <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <p className="font-semibold text-amber-900">Aviso de transparência</p>
            <p className="mt-1 text-sm text-amber-800">
              Os dados abaixo são <strong>declarados pelos próprios órgãos responsáveis</strong> por cada obra ou
              serviço, em formulário padronizado de atualização de status, e consolidados pelo IRM no âmbito do GT
              Projeto Iguaçu. O valor apresentado é o <strong>valor do contrato</strong>: a fonte não informa
              quanto já foi executado, medido ou pago, nem o percentual de avanço de cada obra.
            </p>
            {semCoordenada > 0 && (
              <p className="mt-2 text-sm text-amber-800">
                {semCoordenada === 1
                  ? '1 projeto ainda não teve coordenada declarada e, por isso, não aparece no mapa — mas consta na lista acima.'
                  : `${semCoordenada} projetos ainda não tiveram coordenadas declaradas e, por isso, não aparecem no mapa — mas constam na lista acima.`}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <DownloadButton
          filename="projetos-projeto-iguacu"
          title="Projetos — Projeto Iguaçu"
          data={intervencoes}
          columns={colunasIntervencoes}
        />
      </div>
      <InterventionsTable />

      <div className="mt-12 border-t border-neutral-200 pt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Onde estão os projetos</h2>
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
