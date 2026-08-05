// Vocabulário real, extraído da extração BI/INFOVIA do IRM (Dados_BI.xlsx) —
// substitui os 8 valores hipotéticos do prompt original, que nunca tiveram
// dado real correspondente.
export type SituacaoIntervencao = 'Em Execução' | 'Concluído' | 'Suspenso' | 'Fase de Projeto';

export interface Meta {
  ultimaAtualizacao: string;
  dataReferencia: string;
  situacaoGeral: string;
  periodicidadeAtualizacao: string;
  avisoVersaoBeta: string;
}

export interface Identidade {
  nomeInstituto: string;
  sigla: string;
  nomeProjeto: string;
  siteInstitucionalUrl: string;
}

export interface Apresentacao {
  titulo: string;
  subtitulo: string;
  textoIntro: string;
  papelResumo: string;
  imagemAlt: string;
  imagemCredito: string;
}

export interface BlocoPapelIRM {
  titulo: string;
  texto: string;
}

export interface SobreProjeto {
  oQueE: string;
  problemaPublico: string;
  objetivos: string[];
  papelIRM: string;
  baseLegal: string[];
  orgaosParticipantes: string[];
  municipiosContempladosTexto: string;
  blocoPapelIRM: BlocoPapelIRM;
}

export interface SituacaoAtual {
  faseAtual: string;
  atividadesEmAndamento: string[];
  ultimoMarco: string;
  proximoMarco: string;
  dataReferencia: string;
  situacaoGeral: string;
  escopoRessalva: string;
}

export interface DetalheIndicador {
  titulo: string;
  oQueE: string;
  ressalva?: string;
  fonte?: string;
  rotuloLista?: string;
}

export interface Indicadores {
  investimentoPrevisto: string;
  populacaoBeneficiadaEstimada: string;
  dataUltimaAtualizacao: string;
  fontePadrao: string;
  detalhamento: Record<string, DetalheIndicador>;
}

export interface ItemPopupIndicador {
  id: string;
  titulo: string;
  subtitulo?: string;
  situacao?: SituacaoIntervencao;
  cor?: string;
  valorTexto?: string;
  intervencaoId?: string;
}

export interface Municipio {
  id: string;
  nome: string;
}

// Campos alinhados 1:1 com a extração BI/INFOVIA (Dados_BI.xlsx, aba "Projetos
// Iguaçu - Projetos"). Campos sem correspondência na planilha (percentual de
// execução física/financeira, motivo de atraso, próximo marco) ficam null —
// a fonte real não os informa, e nada aqui é inventado para preenchê-los.
export interface Intervencao {
  id: string;
  nomeProjeto: string;
  objeto: string;
  tipo: string;
  programa: string | null;
  orgaoResponsavel: string;
  rio: string;
  municipioId: string;
  processoSEI: string | null;
  situacao: SituacaoIntervencao;
  valorContrato: number | null;
  empresaContratada: string | null;
  prazoContratoDias: number | null;
  dataInicioVigencia: string | null;
  dataTerminoVigencia: string | null;
  latitude: number | null;
  longitude: number | null;
  localizacaoTexto: string;
  dataInformacao: string;
  fonte: string;
  ultimaAtualizacao: string;
}

export interface MarcoLinhaDoTempo {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  categoria: string;
  fonte: string;
  confirmado: boolean;
}

export interface Documento {
  id: string;
  titulo: string;
  tipo: string;
  data?: string;
  orgao: string;
  descricao: string;
  formato: string;
  url: string;
}

export interface GlossarioItem {
  termo: string;
  significado: string;
}

export interface SituacaoSignificado {
  situacao: string;
  significado: string;
}

export interface Transparencia {
  origemDados: string;
  responsaveisFornecimento: string;
  consolidacaoIRM: string;
  dataReferencia: string;
  periodicidade: string;
  glossario: GlossarioItem[];
  significadoSituacoes: SituacaoSignificado[];
  limitacoes: string;
  canalContato: string;
  avisoConsolidacao: string;
}

export interface Contato {
  nome: string;
  cargo: string;
  email: string;
}

export interface Rodape {
  nomeInstituto: string;
  diretoriaResponsavel: string;
  canalInstitucional: string;
  linkSitePrincipal: string;
  linkPrivacidade: string;
  linkAcessibilidade: string;
  avisoAtualizacao: string;
}

export interface AtualizacaoChangelog {
  data: string;
  descricao: string;
}

export interface Territorio {
  descricaoTextual: string;
}
