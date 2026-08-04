export type SituacaoIntervencao =
  | 'Em planejamento'
  | 'Em licitação'
  | 'Em execução'
  | 'Concluída'
  | 'Atrasada'
  | 'Paralisada'
  | 'Aguardando informação'
  | 'Aguardando validação';

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
}

export interface Indicadores {
  investimentoPrevisto: string;
  populacaoBeneficiadaEstimada: string;
  dataUltimaAtualizacao: string;
  observacao: string;
}

export interface Municipio {
  id: string;
  nome: string;
  lat: number;
  lng: number;
  fonteCoordenadas: string;
  demonstrativo?: boolean;
}

export interface Intervencao {
  id: string;
  nomeProjeto: string;
  objeto: string;
  tipo: string;
  programa: string;
  orgaoResponsavel: string;
  rio: string;
  municipioId: string;
  processoSEI: string;
  fase: string;
  situacao: SituacaoIntervencao;
  percentualExecucao: number | string;
  execucaoFisica: number | string;
  execucaoFinanceira: number | string;
  empresaContratada: string;
  contrato: string;
  valorContrato: string;
  fonteRecurso: string;
  dataInicioVigencia: string;
  prazoContratoDias: string;
  dataTerminoVigencia: string;
  dataPrevista: string;
  dataAtualizada: string;
  motivoAtrasoParalisacao: string;
  proximoMarco: string;
  latitude: string;
  longitude: string;
  localizacaoTexto: string;
  descricao: string;
  dataInformacao: string;
  fonte: string;
  linkDocumento: string;
  ultimaAtualizacao: string;
  demonstrativo?: boolean;
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
  data: string;
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

export interface EstadoQualidade {
  estado: string;
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
  criteriosIndicadores: string;
  limitacoes: string;
  canalContato: string;
  avisoConsolidacao: string;
  estadosQualidade: EstadoQualidade[];
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

export interface Territorio {
  imagemAlt: string;
  legenda: string;
  descricaoTextual: string;
}
