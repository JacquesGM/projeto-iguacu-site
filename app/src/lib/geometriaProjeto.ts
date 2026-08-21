import type { Intervencao, PontoIntervencao } from '../types';
import type { LatLng } from './geo';

/**
 * As três formas que a fonte usa para localizar um projeto. O Prompt Mestre
 * (§6) exige que o mapa trate os três casos, e eles vêm rotulados na origem:
 *
 * - `ponto`   — uma coordenada só, rotulada "Local". Casa de bombas, barragem.
 * - `trecho`  — par "Inicial"/"Final". Canal ou rio ao longo de uma extensão.
 * - `conjunto`— vários pontos "Ponto N", cada um uma obra distinta. São as 3
 *               unidades dos reservatórios de Nova Iguaçu e as 10 pontes.
 *
 * A distinção não é cosmética: um `conjunto` de 10 pontes são dez obras
 * separadas, e desenhá-las como área contínua afirmaria uma abrangência que a
 * fonte não declara.
 */
export type FormaGeometrica = 'ponto' | 'trecho' | 'conjunto';

export interface GeometriaProjeto {
  intervencao: Intervencao;
  forma: FormaGeometrica;
  pontos: LatLng[];
  /** Rótulo de origem de cada ponto, na mesma ordem de `pontos`. */
  rotulos: string[];
  /** Onde ancorar o foco do mapa: o ponto único, o meio do trecho, o centro do conjunto. */
  ancora: LatLng;
}

const ehInicial = (r: string) => /^inicial$/i.test(r.trim());
const ehFinal = (r: string) => /^final$/i.test(r.trim());

/**
 * Um par Inicial/Final é trecho; o resto se decide pela contagem. A checagem
 * dos rótulos vem antes da contagem porque dois pontos soltos não são a mesma
 * coisa que as duas pontas de um canal.
 */
export function classificarForma(pontos: PontoIntervencao[]): FormaGeometrica {
  if (pontos.length === 2) {
    const rotulos = pontos.map((p) => p.rotulo ?? '');
    const temPar = rotulos.some(ehInicial) && rotulos.some(ehFinal);
    return temPar ? 'trecho' : 'conjunto';
  }
  return pontos.length === 1 ? 'ponto' : 'conjunto';
}

function media(pontos: LatLng[]): LatLng {
  return {
    lat: pontos.reduce((s, p) => s + p.lat, 0) / pontos.length,
    lng: pontos.reduce((s, p) => s + p.lng, 0) / pontos.length,
  };
}

/**
 * Monta a geometria de cada projeto que tem coordenada. Projetos sem
 * coordenada declarada ficam de fora — não são inventados nem aproximados
 * pelo município, e a página os anuncia à parte.
 */
export function geometriasDosProjetos(intervencoes: Intervencao[]): GeometriaProjeto[] {
  return intervencoes
    .filter((i) => i.pontos.length > 0)
    .map((intervencao) => {
      const pontos = intervencao.pontos.map((p) => ({ lat: p.lat, lng: p.lng }));
      return {
        intervencao,
        forma: classificarForma(intervencao.pontos),
        pontos,
        rotulos: intervencao.pontos.map((p) => p.rotulo ?? ''),
        ancora: media(pontos),
      };
    });
}

export function semCoordenada(intervencoes: Intervencao[]): Intervencao[] {
  return intervencoes.filter((i) => i.pontos.length === 0);
}
