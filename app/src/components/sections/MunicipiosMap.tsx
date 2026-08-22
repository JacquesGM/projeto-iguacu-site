import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import municipiosData from '../../data/municipios.json';
import intervencoesData from '../../data/intervencoes.json';
import type { Intervencao, Municipio } from '../../types';
import { Card } from '../ui/Card';
import { SituacaoBadge } from '../ui/SituacaoBadge';
import { CORES_MUNICIPIO } from '../../lib/coresMunicipio';
import { geometriasDosProjetos, semCoordenada, type GeometriaProjeto } from '../../lib/geometriaProjeto';
import { prefereMovimentoReduzido } from '../../lib/movimento';

const municipios = municipiosData as Municipio[];
const intervencoes = intervencoesData as Intervencao[];

const COR_PADRAO = '#5a6b78';
const RAIO_PONTO = 6;
const RAIO_PONTO_ATIVO = 9;
const ZOOM_PONTO_UNICO = 14;

/** Enquadramento de partida, e para onde "Limpar seleção" devolve o mapa. */
interface VisaoInicial {
  centro: [number, number];
  zoom: number;
}
const VISAO_INICIAL: VisaoInicial = { centro: [-22.75, -43.33], zoom: 10 };

const nomeMunicipio = (id: string) => municipios.find((m) => m.id === id)?.nome ?? 'Não informado';

const corDoProjeto = (item: Intervencao) => CORES_MUNICIPIO[item.municipioId] ?? COR_PADRAO;

const DESCRICAO_FORMA: Record<GeometriaProjeto['forma'], string> = {
  ponto: 'local único declarado',
  trecho: 'trecho entre coordenada inicial e final',
  conjunto: 'conjunto de pontos declarados',
};

/**
 * Reposiciona o mapa quando a seleção muda. Precisa ser filho do MapContainer
 * porque `useMap` só funciona dentro dele. O ref evita refazer o enquadramento
 * a cada render enquanto o mesmo projeto segue selecionado — sem ele o mapa
 * voltaria ao lugar toda vez que a pessoa arrastasse.
 *
 * O Leaflet anima por conta própria e não consulta `prefers-reduced-motion`,
 * ao contrário do resto do site; por isso a preferência é lida aqui.
 */
function FocarSelecionado({ geometria, visaoInicial }: { geometria: GeometriaProjeto | null; visaoInicial: VisaoInicial }) {
  const map = useMap();
  const ultimoId = useRef<string | null>(null);

  useEffect(() => {
    const semMovimento = prefereMovimentoReduzido();

    if (!geometria) {
      // Limpar a seleção devolve o panorama: sem isso o mapa fica parado no
      // último projeto, e a lista deixa de corresponder ao que se vê.
      if (ultimoId.current !== null) {
        map.setView(visaoInicial.centro, visaoInicial.zoom, { animate: !semMovimento });
      }
      ultimoId.current = null;
      return;
    }
    if (ultimoId.current === geometria.intervencao.id) return;
    ultimoId.current = geometria.intervencao.id;

    if (geometria.pontos.length === 1) {
      map.setView([geometria.pontos[0].lat, geometria.pontos[0].lng], ZOOM_PONTO_UNICO, {
        animate: !semMovimento,
      });
      return;
    }
    map.fitBounds(
      geometria.pontos.map((p) => [p.lat, p.lng] as [number, number]),
      { padding: [40, 40], maxZoom: ZOOM_PONTO_UNICO, animate: !semMovimento },
    );
  }, [geometria, map, visaoInicial]);

  return null;
}

function ConteudoPopup({ g, rotulo }: { g: GeometriaProjeto; rotulo: string }) {
  return (
    <>
      <strong>{g.intervencao.nomeProjeto}</strong>
      <br />
      {nomeMunicipio(g.intervencao.municipioId)}
      {rotulo ? ` · ${rotulo}` : ''}
      <br />
      <span className="text-neutral-600">{DESCRICAO_FORMA[g.forma]}</span>
    </>
  );
}

export function MunicipiosMap() {
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  const geometrias = useMemo(() => geometriasDosProjetos(intervencoes), []);
  const semCoord = useMemo(() => semCoordenada(intervencoes), []);
  const selecionado = geometrias.find((g) => g.intervencao.id === selecionadoId) ?? null;
  const totalPontos = geometrias.reduce((soma, g) => soma + g.pontos.length, 0);

  return (
    <div>
      <p className="text-sm text-neutral-600">
        Cada projeto aparece com as coordenadas que o órgão executor declarou na página oficial do IRM —{' '}
        {geometrias.length} projetos, {totalPontos} coordenadas ao todo. Um projeto pode ser um local único, um
        trecho entre coordenada inicial e final, ou um conjunto de pontos, como as pontes de Nova Iguaçu, que são
        obras distintas. Onde há linha, ela liga a coordenada inicial à final em traçado reto:{' '}
        <strong>não é o eixo real do canal</strong> nem perímetro oficial de obra.
      </p>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* A lista fica bem mais alta que o mapa. Sem o sticky sobrariam ~540px
            de vazio ao lado dela e, pior, o mapa sairia de vista justamente
            quando se clica nos projetos do fim da lista — a sincronia entre os
            dois viraria invisível. O top acompanha a altura do cabeçalho fixo. */}
        <div className="isolate relative h-[420px] overflow-hidden rounded-xl border border-neutral-200 lg:sticky lg:top-28">
          <MapContainer
            center={VISAO_INICIAL.centro}
            zoom={VISAO_INICIAL.zoom}
            scrollWheelZoom={false}
            className="h-full w-full"
            aria-label="Localização declarada dos projetos do Projeto Iguaçu"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FocarSelecionado geometria={selecionado} visaoInicial={VISAO_INICIAL} />

            {geometrias.map((g) => {
              const cor = corDoProjeto(g.intervencao);
              const ativo = g.intervencao.id === selecionadoId;
              const selecionar = () => setSelecionadoId(g.intervencao.id);

              return (
                <Fragment key={g.intervencao.id}>
                  {g.forma === 'trecho' && (
                    <Polyline
                      positions={g.pontos.map((p) => [p.lat, p.lng] as [number, number])}
                      pathOptions={{ color: cor, weight: ativo ? 6 : 4, opacity: ativo ? 1 : 0.85 }}
                      eventHandlers={{ click: selecionar }}
                    >
                      <Popup>
                        <ConteudoPopup g={g} rotulo="" />
                      </Popup>
                    </Polyline>
                  )}

                  {g.pontos.map((ponto, indice) => (
                    <CircleMarker
                      key={`${g.intervencao.id}-${indice}`}
                      center={[ponto.lat, ponto.lng]}
                      radius={ativo ? RAIO_PONTO_ATIVO : RAIO_PONTO}
                      pathOptions={{ color: '#ffffff', weight: 2, fillColor: cor, fillOpacity: 1 }}
                      eventHandlers={{ click: selecionar }}
                    >
                      <Popup>
                        <ConteudoPopup g={g} rotulo={g.rotulos[indice]} />
                      </Popup>
                    </CircleMarker>
                  ))}
                </Fragment>
              );
            })}
          </MapContainer>
        </div>

        <Card>
          <div className="flex items-baseline justify-between gap-2">
            <h3 id="projetos-no-mapa" className="font-semibold text-neutral-900">
              Projetos no mapa
            </h3>
            {selecionado && (
              <button
                type="button"
                onClick={() => setSelecionadoId(null)}
                className="rounded-md px-2 py-1 text-xs font-medium text-brand-blue-700 hover:bg-brand-blue-50"
              >
                Limpar seleção
              </button>
            )}
          </div>

          <p className="mt-1 text-sm text-neutral-500">
            Escolha um projeto para enquadrá-lo no mapa, ou clique direto em um ponto.
          </p>

          {/* Sao oito listas nesta pagina; sem rotulo, quem navega por lista
              ouve "lista, 8 itens" sem saber de que se trata. */}
          <ul aria-labelledby="projetos-no-mapa" className="mt-3 space-y-1">
            {geometrias.map((g) => {
              const ativo = g.intervencao.id === selecionadoId;
              return (
                <li key={g.intervencao.id}>
                  <button
                    type="button"
                    onClick={() => setSelecionadoId(ativo ? null : g.intervencao.id)}
                    aria-current={ativo ? 'true' : undefined}
                    className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left ${
                      ativo ? 'bg-brand-blue-50 ring-1 ring-brand-blue-500' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 h-3 w-3 shrink-0 rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
                      style={{ backgroundColor: corDoProjeto(g.intervencao) }}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-neutral-900">{g.intervencao.nomeProjeto}</span>
                      <span className="mt-0.5 block text-xs text-neutral-500">
                        {nomeMunicipio(g.intervencao.municipioId)} · {DESCRICAO_FORMA[g.forma]}
                        {g.pontos.length > 1 ? ` (${g.pontos.length} coordenadas)` : ''}
                      </span>
                      {ativo && (
                        <span className="mt-2 block">
                          <span className="block text-xs text-neutral-600">
                            {g.intervencao.rio} · {g.intervencao.orgaoResponsavel}
                          </span>
                          <span className="mt-1.5 block">
                            <SituacaoBadge situacao={g.intervencao.situacao} />
                          </span>
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {semCoord.length > 0 && (
            <div className="mt-4 border-t border-neutral-200 pt-3">
              <h4 className="text-sm font-semibold text-neutral-900">
                {semCoord.length === 1
                  ? '1 projeto sem coordenada declarada'
                  : `${semCoord.length} projetos sem coordenada declarada`}
              </h4>
              <p className="mt-1 text-xs text-neutral-600">
                A fonte não informa onde ficam. Não são estimados pelo município nem omitidos: seguem na tabela
                acima, com todos os demais dados.
              </p>
              <ul className="mt-2 space-y-1.5">
                {semCoord.map((item) => (
                  <li key={item.id} className="text-sm text-neutral-700">
                    {item.nomeProjeto}
                    <span className="block text-xs text-neutral-500">{nomeMunicipio(item.municipioId)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
