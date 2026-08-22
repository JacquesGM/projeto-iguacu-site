/**
 * Barril dos gráficos, e a razão dele: os quatro componentes daqui são os
 * únicos que importam o Recharts, e o Recharts sozinho responde por metade do
 * pacote principal. Reunidos num módulo só, o `import()` dinâmico de
 * `pages/Indicadores` gera **um** chunk — se cada gráfico fosse importado
 * direto, seriam quatro pedidos para a mesma biblioteca.
 *
 * Quem renderiza gráfico em teste continua importando o componente pelo
 * caminho dele; este arquivo existe para o carregamento sob demanda.
 */
export { SituacaoDistributionChart } from './SituacaoDistributionChart';
export { MunicipioDistributionChart } from './MunicipioDistributionChart';
export { OrgaoDistributionChart } from './OrgaoDistributionChart';
export { ValorPorCategoriaChart } from './ValorPorCategoriaChart';
