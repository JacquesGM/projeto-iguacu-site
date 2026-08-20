// Cores dos eixos, grade e rótulos dos gráficos.
//
// Recharts recebe cor por propriedade JS, não por classe CSS, então estes
// valores não podem sair do tema do Tailwind diretamente. Ficam aqui, num
// lugar só, espelhando os tokens do tema — antes estavam repetidos como hex
// cru nos três componentes de gráfico.
export const GRAFICO = {
  /** neutral-200 — linha do eixo */
  eixo: '#c7d8e4',
  /** cinza claro — linhas de grade */
  grade: '#e5e7eb',
  /** neutral-500 — números do eixo de valores */
  rotuloEixo: '#5a6b78',
  /** neutral-700 — nomes das categorias */
  rotuloCategoria: '#34424d',
  /** neutral-600 — número ao fim da barra */
  valor: '#4a5964',
  /** realce discreto ao passar o cursor sobre a barra */
  cursor: 'rgba(0,0,0,0.03)',
} as const;
