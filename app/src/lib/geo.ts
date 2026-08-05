export interface LatLng {
  lat: number;
  lng: number;
}

/** Remove pontos com coordenadas idênticas (ex.: duas intervenções no mesmo local). */
export function uniquePoints(points: LatLng[]): LatLng[] {
  const seen = new Set<string>();
  const result: LatLng[] = [];
  for (const p of points) {
    const key = `${p.lat},${p.lng}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(p);
    }
  }
  return result;
}

function cross(o: LatLng, a: LatLng, b: LatLng): number {
  return (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);
}

/**
 * Casco convexo (algoritmo de Andrew/monotone chain) sobre lat/lng tratadas
 * como um plano cartesiano local. Para a escala de um único município isso é
 * uma aproximação aceitável — não é uma projeção cartográfica real, só o
 * suficiente para conectar os pontos em ordem sem auto-interseção.
 */
export function convexHull(points: LatLng[]): LatLng[] {
  const pts = [...points].sort((a, b) => a.lng - b.lng || a.lat - b.lat);
  if (pts.length < 3) return pts;

  const lower: LatLng[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: LatLng[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

export function centroid(points: LatLng[]): LatLng {
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
}

/** Distância em metros entre dois pontos (fórmula de haversine). */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function maxDistanceMeters(points: LatLng[], from: LatLng): number {
  return points.reduce((max, p) => Math.max(max, haversineMeters(from, p)), 0);
}
