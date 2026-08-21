// Paleta categórica por município, usada no mapa e nos marcadores de indicador
// para que a mesma cor sempre identifique o mesmo município.
//
// Escolhida por busca sobre candidatas dentro da direção visual do projeto,
// maximizando a menor distância perceptual (ΔE em CIELAB) entre qualquer par,
// medida também sob deuteranopia e protanopia. A anterior tinha dois azuis com
// ΔE 9,5 entre si — e 4,4 sob protanopia, ou seja, indistinguíveis.
//
// Limite honesto: não existem seis cores simultaneamente institucionais e
// seguras para daltonismo. O melhor par desta paleta fica em ΔE ~19, abaixo dos
// 20 recomendados. Por isso a cor nunca é o único identificador: no mapa há
// rótulo no popup, e nos gráficos o nome está no eixo.
export const CORES_MUNICIPIO: Record<string, string> = {
  m1: '#0b4f8a', // azul profundo    — Duque de Caxias
  m2: '#1f7a5c', // verde-petróleo   — Belford Roxo
  m3: '#7c4dbd', // roxo             — Nova Iguaçu
  m4: '#c2703d', // laranja terroso  — São João de Meriti
  m5: '#8a5300', // âmbar escuro     — Nilópolis
  m6: '#6b5a2b', // oliva            — Mesquita
};

/** Cor institucional única para gráficos cuja categoria já está rotulada no eixo. */
export const COR_BARRA = '#0b4f8a';
