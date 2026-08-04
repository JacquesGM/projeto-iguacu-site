import type { ReactNode } from 'react';
import { Home } from './pages/Home';
import { SituacaoAtual } from './pages/SituacaoAtual';
import { Indicadores } from './pages/Indicadores';
import { Intervencoes } from './pages/Intervencoes';
import { LinhaDoTempo } from './pages/LinhaDoTempo';
import { Documentos } from './pages/Documentos';
import { Transparencia } from './pages/Transparencia';

export interface AppRoute {
  path: string;
  /** Shown as a link in the header nav. Omit to keep the route reachable only via direct link/footer. */
  label?: string;
  title: string;
  description: string;
  element: ReactNode;
}

export const routes: AppRoute[] = [
  {
    path: '/',
    label: 'Início',
    title: 'Início',
    description:
      'Acompanhamento público do Projeto Iguaçu pelo Instituto Rio Metrópole: controle de inundações e recuperação ambiental das bacias dos rios Iguaçu, Botas e Sarapuí, na Baixada Fluminense.',
    element: <Home />,
  },
  {
    path: '/situacao-atual',
    label: 'Situação atual',
    title: 'Situação atual',
    description: 'Fase atual, atividades em andamento, último e próximo marco do Projeto Iguaçu.',
    element: <SituacaoAtual />,
  },
  {
    path: '/indicadores',
    label: 'Indicadores',
    title: 'Indicadores principais',
    description: 'Municípios contemplados, intervenções por situação e demais números do Projeto Iguaçu, com fonte e período.',
    element: <Indicadores />,
  },
  {
    path: '/intervencoes',
    label: 'Intervenções',
    title: 'Intervenções por município',
    description: 'Tabela filtrável e pesquisável das intervenções do Projeto Iguaçu, com detalhes completos de cada obra.',
    element: <Intervencoes />,
  },
  {
    path: '/linha-do-tempo',
    label: 'Linha do tempo',
    title: 'Linha do tempo institucional',
    description: 'Do primeiro estudo técnico, em 1996, até a fase atual do Projeto Iguaçu.',
    element: <LinhaDoTempo />,
  },
  {
    path: '/documentos',
    label: 'Documentos',
    title: 'Documentos e links',
    description: 'Atos normativos, relatórios, apresentações e sistemas públicos relacionados ao Projeto Iguaçu.',
    element: <Documentos />,
  },
  {
    path: '/transparencia',
    label: 'Transparência',
    title: 'Transparência e metodologia',
    description: 'Origem dos dados, glossário de siglas, significado das situações e canal de contato do GT Projeto Iguaçu.',
    element: <Transparencia />,
  },
];
