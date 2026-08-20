// Vocabulário declarado pelos órgãos executores na página oficial do Projeto
// Iguaçu (rj.gov.br/irm/node/387). A fonte grafa "Em Licitação" e "Em licitação"
// indistintamente — normalizamos apenas a caixa, sem alterar o termo. "Aguardando
// manifestação" é a forma curta de "Aguardando manifestação da EMOP", declarada
// para um único projeto; o texto integral fica em `situacaoTextoOriginal`.
export type SituacaoIntervencao =
  | 'Em licitação'
  | 'Em andamento'
  | 'Conclusão em breve'
  | 'Baixa de cláusula suspensiva'
  | 'Aguardando manifestação';

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
  dataUltimaAtualizacao: string;
  periodoReferencia: string;
  proximaAtualizacao: string;
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

// Campos alinhados 1:1 com o que a página oficial do IRM declara para cada
// projeto. Campos que a fonte não informa (percentual de execução física ou
// financeira, valor executado, valor pago, população beneficiada) não existem
// aqui — nada é inventado para preenchê-los. Quando a fonte declara uma data
// como texto ("Aguardando licitação", "Janeiro de 2027 (a confirmar)"), o campo
// normalizado fica null e o texto original é preservado no campo `...Texto`.
export interface PontoIntervencao {
  /** "Inicial", "Final", "Local" ou "Ponto N", conforme rotulado na fonte. */
  rotulo: string;
  lat: number;
  lng: number;
}

export interface Intervencao {
  id: string;
  nomeProjeto: string;
  objeto: string;
  tipo: string;
  programa: string | null;
  orgaoResponsavel: string;
  rio: string;
  municipioId: string;
  /** Projetos que a fonte atribui a mais de um município (Barragem de Gericinó). */
  municipiosAdicionais: string[];
  processoSEI: string | null;
  situacao: SituacaoIntervencao;
  valorContrato: number | null;
  empresaContratada: string | null;
  /** Texto da fonte quando a empresa ainda não foi definida ("A definir"). */
  empresaTexto: string | null;
  prazoContratoMeses: number | null;
  /** Ressalva da fonte sobre o prazo ("12 meses (serviço contínuo)"). */
  prazoTexto: string | null;
  dataInicioVigencia: string | null;
  dataInicioVigenciaTexto: string | null;
  dataTerminoVigencia: string | null;
  dataTerminoVigenciaTexto: string | null;
  /** Primeiro ponto declarado, usado como marcador representativo no mapa. */
  latitude: number | null;
  longitude: number | null;
  /** Todos os pontos declarados: 1 local, um par inicial/final, ou vários pontos. */
  pontos: PontoIntervencao[];
  /** Coordenadas exatamente como declaradas, incluindo grau-minuto-segundo. */
  coordenadasTexto: string | null;
  localizacaoTexto: string;
  observacoes: string | null;
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
