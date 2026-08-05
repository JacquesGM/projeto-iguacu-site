import { useMemo, useState } from 'react';
import { Circle, MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import municipiosData from '../../data/municipios.json';
import intervencoesData from '../../data/intervencoes.json';
import type { Intervencao, Municipio } from '../../types';
import { Card } from '../ui/Card';
import { SituacaoBadge } from '../ui/SituacaoBadge';
import { centroid, convexHull, maxDistanceMeters, uniquePoints, type LatLng } from '../../lib/geo';

const municipios = municipiosData as Municipio[];
const intervencoes = intervencoesData as Intervencao[];

const CORES_MUNICIPIO: Record<string, string> = {
  m1: '#2f7fb8',
  m2: '#2f9e75',
  m3: '#7c4dbd',
  m4: '#c2703d',
  varios: '#5a6b78',
};

const RAIO_MINIMO_METROS = 500;
const MARGEM_BUFFER_METROS = 400;

interface GrupoMunicipio {
  municipio: Municipio;
  pontos: LatLng[];
  intervencoesDoGrupo: Intervencao[];
}

function textoContagem(n: number): string {
  return n === 1 ? '1 intervenção registrada' : `${n} intervenções registradas`;
}

export function MunicipiosMap() {
  const [selecionado, setSelecionado] = useState<Municipio | null>(null);
  const center = useMemo<[number, number]>(() => [-22.75, -43.33], []);

  const grupos = useMemo<GrupoMunicipio[]>(() => {
    return municipios
      .map((municipio) => {
        const doGrupo = intervencoes.filter(
          (i) => i.municipioId === municipio.id && i.latitude !== null && i.longitude !== null,
        );
        const pontos = doGrupo.map((i) => ({ lat: i.latitude as number, lng: i.longitude as number }));
        return { municipio, pontos, intervencoesDoGrupo: doGrupo };
      })
      .filter((g) => g.pontos.length > 0);
  }, []);

  return (
    <div>
      <p className="text-sm text-neutral-600">
        Áreas aproximadas construídas a partir das coordenadas reais de cada intervenção registrada (extração
        BI/INFOVIA do IRM) — não representam um perímetro oficial. Com 3 ou mais pontos distintos, o contorno
        conecta essas coordenadas; com 1 ou 2 pontos, mostramos um círculo ilustrativo ao redor deles.
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="isolate h-[420px] overflow-hidden rounded-xl border border-neutral-200">
          <MapContainer
            center={center}
            zoom={10}
            scrollWheelZoom={false}
            className="h-full w-full"
            aria-label="Áreas aproximadas das intervenções do Projeto Iguaçu, por município"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {grupos.map((grupo) => {
              const cor = CORES_MUNICIPIO[grupo.municipio.id] ?? '#5a6b78';
              const pathOptions = { color: cor, fillColor: cor, fillOpacity: 0.28, weight: 2 };
              const distintos = uniquePoints(grupo.pontos);
              const contagem = textoContagem(grupo.intervencoesDoGrupo.length);

              if (distintos.length >= 3) {
                const hull = convexHull(distintos);
                return (
                  <Polygon
                    key={grupo.municipio.id}
                    positions={hull.map((p) => [p.lat, p.lng])}
                    pathOptions={pathOptions}
                    eventHandlers={{ click: () => setSelecionado(grupo.municipio) }}
                  >
                    <Popup>
                      <strong>{grupo.municipio.nome}</strong>
                      <br />
                      {contagem}
                    </Popup>
                  </Polygon>
                );
              }

              const c = centroid(distintos);
              const raio = Math.max(RAIO_MINIMO_METROS, maxDistanceMeters(distintos, c) + MARGEM_BUFFER_METROS);
              return (
                <Circle
                  key={grupo.municipio.id}
                  center={[c.lat, c.lng]}
                  radius={raio}
                  pathOptions={pathOptions}
                  eventHandlers={{ click: () => setSelecionado(grupo.municipio) }}
                >
                  <Popup>
                    <strong>{grupo.municipio.nome}</strong>
                    <br />
                    {contagem}
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </div>

        <Card>
          {selecionado ? (
            (() => {
              const grupo = grupos.find((g) => g.municipio.id === selecionado.id);
              return (
                <div>
                  <p className="font-semibold text-neutral-900">{selecionado.nome}</p>
                  <ul className="mt-3 space-y-3">
                    {grupo?.intervencoesDoGrupo.map((item) => (
                      <li key={item.id} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                        <p className="text-sm font-medium text-neutral-900">{item.nomeProjeto}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {item.rio} · {item.orgaoResponsavel}
                        </p>
                        <div className="mt-1.5">
                          <SituacaoBadge situacao={item.situacao} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-neutral-500">
              Clique em uma área do mapa para ver as intervenções registradas naquele município.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
