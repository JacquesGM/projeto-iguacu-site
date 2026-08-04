import { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import municipiosData from '../../data/municipios.json';
import intervencoesData from '../../data/intervencoes.json';
import type { Intervencao, Municipio } from '../../types';
import { Card } from '../ui/Card';
import { SituacaoBadge } from '../ui/SituacaoBadge';

const municipios = municipiosData as Municipio[];
const intervencoes = intervencoesData as Intervencao[];

function radiusForCount(count: number): number {
  return Math.max(10, Math.min(24, 8 + count * 3));
}

export function MunicipiosMap() {
  const [selecionado, setSelecionado] = useState<Municipio | null>(null);

  const center = useMemo<[number, number]>(() => [-22.77, -43.39], []);

  const intervencoesPorMunicipio = (municipioId: string) =>
    intervencoes.filter((i) => i.municipioId === municipioId);

  return (
    <div>
      <p className="text-sm text-neutral-600">
        Localização real dos {municipios.length} municípios contemplados nesta fase (coordenadas do
        centroide municipal, IBGE). As coordenadas de cada intervenção específica ainda não foram
        informadas pelos órgãos executores — clique em um município para ver a lista de intervenções
        registradas nele.
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="isolate h-[400px] overflow-hidden rounded-xl border border-neutral-200">
          <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom={false}
            className="h-full w-full"
            aria-label="Mapa dos municípios contemplados pelo Projeto Iguaçu"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {municipios.map((municipio) => {
              const count = intervencoesPorMunicipio(municipio.id).length;
              return (
                <CircleMarker
                  key={municipio.id}
                  center={[municipio.lat, municipio.lng]}
                  radius={radiusForCount(count)}
                  pathOptions={{ color: '#0b4f8a', fillColor: '#2f7fb8', fillOpacity: 0.55, weight: 1.5 }}
                  eventHandlers={{ click: () => setSelecionado(municipio) }}
                >
                  <Popup>
                    <strong>{municipio.nome}</strong>
                    <br />
                    {count} {count === 1 ? 'intervenção registrada' : 'intervenções registradas'}
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <Card>
          {selecionado ? (
            <div>
              <p className="font-semibold text-neutral-900">{selecionado.nome}</p>
              <p className="mt-1 text-xs text-neutral-500">Fonte das coordenadas: {selecionado.fonteCoordenadas}</p>
              <ul className="mt-3 space-y-3">
                {intervencoesPorMunicipio(selecionado.id).map((item) => (
                  <li key={item.id} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-neutral-900">{item.nomeProjeto}</p>
                    <div className="mt-1.5">
                      <SituacaoBadge situacao={item.situacao} />
                    </div>
                  </li>
                ))}
                {intervencoesPorMunicipio(selecionado.id).length === 0 && (
                  <p className="text-sm text-neutral-500">Nenhuma intervenção registrada para este município.</p>
                )}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Clique em um dos municípios no mapa para ver as intervenções registradas nele.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
