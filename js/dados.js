/**
 * ============================================================================
 *  ARQUIVO DE DADOS — Acompanhamento do Projeto Iguaçu (IRM)
 * ============================================================================
 *
 *  ESTE É O ÚNICO ARQUIVO QUE A EQUIPE DE COMUNICAÇÃO PRECISA EDITAR
 *  PARA ATUALIZAR TEXTOS, INDICADORES, INTERVENÇÕES, DOCUMENTOS E DATAS.
 *
 *  Não é necessário conhecimento de programação além de:
 *   - Manter as aspas " " ao redor de cada texto;
 *   - Manter as vírgulas entre itens;
 *   - Não apagar chaves { } ou colchetes [ ].
 *
 *  Se tiver dúvida, copie um item existente (colchete a colchete, ou chave a
 *  chave), cole logo abaixo e apenas troque os valores.
 *
 *  IMPORTANTE — DADOS DEMONSTRATIVOS:
 *  Os itens marcados com  demonstrativo: true  são dados FICTÍCIOS, criados
 *  apenas para testar o funcionamento da página (protótipo). Eles NÃO podem
 *  ser publicados como informação oficial. Substitua pelos dados reais
 *  enviados pelos órgãos executores assim que estiverem disponíveis.
 *  Veja também o arquivo PENDENCIAS.md.
 *
 *  Campos sem informação oficial devem usar um dos textos padronizados:
 *    "Não informado"   "A confirmar"   "Dado em validação"   "Link a inserir"
 *  Nunca deixe um campo em branco ("") em conteúdo que será exibido.
 * ============================================================================
 */

window.projeto = {

  // --------------------------------------------------------------------
  // 1. DADOS GLOBAIS — altere aqui a data de atualização do site inteiro
  // --------------------------------------------------------------------
  meta: {
    ultimaAtualizacao: "31/07/2026", // data em que ESTA PÁGINA foi atualizada
    dataReferencia: "30/06/2026",    // até quando os dados foram validados
    situacaoGeral: "Em execução do processo licitatório e elaboração do projeto executivo",
    periodicidadeAtualizacao: "Bimestral, alinhada às reuniões do Grupo de Trabalho (GT) Projeto Iguaçu",
    avisoVersaoBeta: "Versão beta — dados de obras ainda são exemplos ilustrativos da estrutura; preenchimento real depende do envio de informações pelos órgãos executores e prefeituras."
  },

  // --------------------------------------------------------------------
  // 2. IDENTIDADE — nomes e espaço reservado para marca oficial
  // --------------------------------------------------------------------
  identidade: {
    nomeInstituto: "Instituto Rio Metrópole",
    sigla: "IRM",
    nomeProjeto: "Projeto Iguaçu",
    // Logotipo oficial do IRM (versão branca, para fundo escuro), obtido em www.rj.gov.br/irm em 31/07/2026.
    // Se o IRM fornecer um arquivo oficial mais atual (ex.: vetor .svg), troque este caminho.
    logoUrl: "assets/img/logo-irm-branca-horizontal.png",
    logoGovUrl: "assets/img/logo-governo-rj.png", // selo do Governo do Estado do Rio de Janeiro, mesma fonte
    siteInstitucionalUrl: "https://www.rj.gov.br/irm" // site institucional oficial do IRM
  },

  // --------------------------------------------------------------------
  // 3. ABERTURA (seção "hero" no topo da página)
  // --------------------------------------------------------------------
  apresentacao: {
    titulo: "Projeto Iguaçu",
    subtitulo: "Informações públicas sobre o acompanhamento das intervenções",
    textoIntro: "O Projeto Iguaçu reúne as intervenções de controle de inundações e recuperação ambiental nas bacias dos rios Iguaçu, Botas e Sarapuí, na Baixada Fluminense. Esta página consolida, de forma pública e acessível, o acompanhamento realizado pelo Instituto Rio Metrópole (IRM) sobre o andamento dessas obras.",
    papelResumo: "O IRM coordena o Grupo de Trabalho (GT) Projeto Iguaçu, reunindo, checando e divulgando as informações enviadas pelos órgãos responsáveis pelas intervenções.",
    imagemUrl: "assets/img/rio-iguacu-nascente.jpg", // foto real do rio Iguaçu (não é fotografia de nenhuma obra/intervenção específica)
    imagemAlt: "Fotografia do rio Iguaçu em sua nascente, no Maciço do Tinguá, em Nova Iguaçu (RJ).",
    imagemCredito: "Rio Iguaçu, próximo à nascente, no Maciço do Tinguá (Nova Iguaçu/RJ). Foto: Gerson Tavares, via Wikimedia Commons (CC BY 2.0). Imagem ilustrativa do rio — não retrata nenhuma obra ou intervenção específica."
  },

  // --------------------------------------------------------------------
  // 4. SOBRE O PROJETO
  // --------------------------------------------------------------------
  sobreProjeto: {
    oQueE: "O Projeto Iguaçu é o conjunto de estudos, planos e obras voltados ao controle de inundações e à recuperação ambiental das bacias dos rios Iguaçu, Botas e Sarapuí, na Baixada Fluminense. Inclui dragagem, construção de pôlderes e comportas, macrodrenagem, reflorestamento de nascentes e mata ciliar, urbanização de áreas ribeirinhas e reassentamento de famílias em áreas de risco.",
    problemaPublico: "Historicamente, a região sofre com alagamentos e transbordamentos recorrentes dos rios Iguaçu, Botas e Sarapuí, agravados pelo assoreamento dos leitos, pela ocupação de áreas de várzea e pela descontinuidade de obras de macrodrenagem ao longo das últimas décadas.",
    objetivos: [
      "Mitigar inundações em áreas urbanizadas por meio de infraestrutura de macrodrenagem.",
      "Recuperar e proteger nascentes, mata ciliar e áreas de preservação das bacias.",
      "Promover reassentamento digno de famílias em áreas de risco, quando aplicável.",
      "Garantir transparência e integração das informações entre os órgãos envolvidos."
    ],
    papelIRM: "O Instituto Rio Metrópole atua no acompanhamento, articulação, consolidação e divulgação das informações sobre o Projeto Iguaçu, coordenando o Grupo de Trabalho (GT) criado para essa finalidade. O IRM não é o órgão executor das obras — essa responsabilidade é dos órgãos e empresas contratantes indicados em cada intervenção.",
    baseLegal: [
      "Lei Complementar Estadual nº 184/2018 — institui a governança da Região Metropolitana do Rio de Janeiro (RMRJ) e define, no art. 3º, a drenagem e o manejo de águas pluviais urbanas como função pública de interesse comum.",
      "Decreto Estadual nº 46.893/2019 — regulamento do IRM; o art. 24 atribui à Diretoria de Saneamento Metropolitano Integrado (DIRSMI) a competência de planejar, coordenar e supervisionar intervenções territoriais de saneamento, incluindo drenagem e manejo de águas pluviais.",
      "Lei Estadual nº 11.021/2025 — ratifica o Plano Estratégico de Desenvolvimento Urbano Integrado (PEDUI), que orienta o desenvolvimento da RMRJ até 2040 e inclui, no Programa Habitar a Metrópole (ação HM 10), a mitigação de inundações por meio de macrodrenagem.",
      "Portaria IRM nº 195/2025 — formaliza a criação do Grupo de Trabalho (GT) Projeto Iguaçu, com o IRM como coordenador."
    ],
    orgaosParticipantes: [
      "Instituto Rio Metrópole (IRM) — coordenação do GT",
      "Instituto Estadual do Ambiente (INEA) — órgão executor",
      "Ministério Público do Estado do Rio de Janeiro (MPRJ)",
      "Comitês de Bacia Hidrográfica (incluindo o CBH Baía de Guanabara)",
      "Prefeituras dos municípios contemplados",
      "Secretarias estaduais relacionadas à execução das obras"
    ],
    municipiosContempladosTexto: "A lista oficial e definitiva de municípios contemplados nesta fase do Projeto Iguaçu está em consolidação pelo GT. A relação abaixo, na seção de Intervenções, é demonstrativa e serve para testar a estrutura da página.",
    blocoPapelIRM: {
      titulo: "Papel do Instituto Rio Metrópole",
      texto: "O IRM atua no acompanhamento, articulação, consolidação e divulgação das informações sobre o Projeto Iguaçu, sem assumir as responsabilidades técnicas, contratuais ou executivas dos órgãos e empresas responsáveis por cada obra."
    }
  },

  // --------------------------------------------------------------------
  // 5. SITUAÇÃO ATUAL
  // --------------------------------------------------------------------
  situacaoAtual: {
    faseAtual: "Licitação em andamento e elaboração do projeto executivo",
    atividadesEmAndamento: [
      "Tramitação do processo licitatório aberto no SEI pelo INEA (desde 06/02/2026).",
      "Elaboração do projeto executivo, dentro do prazo de 18 meses definido em 12/02/2026 (sendo os 3 meses iniciais dedicados ao projeto executivo).",
      "Coleta e consolidação, pelo GT Projeto Iguaçu, das informações enviadas pelos órgãos executores e prefeituras."
    ],
    ultimoMarco: "10/02/2026 — Emissão de reserva orçamentária de R$ 147 milhões para projeto executivo e obras.",
    proximoMarco: "Definição do processo licitatório prevista para junho de 2026; início físico das obras estimado para o 4º trimestre de 2026, segundo o INEA.",
    dataReferencia: "30/06/2026",
    situacaoGeral: "Em andamento — sem obras físicas iniciadas nesta fase."
  },

  // --------------------------------------------------------------------
  // 6. INDICADORES
  //    Os contadores de intervenções por fase/situação são calculados
  //    automaticamente a partir da lista "intervencoes" (mais abaixo),
  //    para nunca ficarem desatualizados. Edite aqui apenas os dois
  //    valores que não podem ser somados automaticamente.
  // --------------------------------------------------------------------
  indicadores: {
    investimentoPrevisto: "A confirmar",
    populacaoBeneficiadaEstimada: "A confirmar",
    dataUltimaAtualizacao: "30/06/2026",
    observacao: "Os indicadores apresentados consideram as informações encaminhadas pelos órgãos responsáveis e validadas até a data de referência indicada nesta página."
  },

  // --------------------------------------------------------------------
  // 7. MUNICÍPIOS
  //    ATENÇÃO: lista demonstrativa. Para adicionar um município real,
  //    copie um item, gere um novo "id" (ex.: "m4") e troque o nome.
  // --------------------------------------------------------------------
  municipios: [
    { id: "m1", nome: "Duque de Caxias", demonstrativo: true },
    { id: "m2", nome: "Nova Iguaçu", demonstrativo: true },
    { id: "m3", nome: "Belford Roxo", demonstrativo: true }
  ],

  // --------------------------------------------------------------------
  // 8. INTERVENÇÕES
  //    COMO ADICIONAR UMA NOVA INTERVENÇÃO:
  //    1. Copie um objeto inteiro entre { e } (incluindo a vírgula final);
  //    2. Cole abaixo do último item, antes do colchete "]" de fechamento;
  //    3. Troque o "id" para um valor único (ex.: "i8");
  //    4. Preencha os campos com os dados reais recebidos do órgão;
  //    5. Campos sem informação: use "Não informado";
  //    6. Remova "demonstrativo: true" quando o dado passar a ser real.
  //
  //    "situacao" deve ser um destes textos exatos:
  //    "Em planejamento" | "Em licitação" | "Em execução" | "Concluída" |
  //    "Atrasada" | "Paralisada" | "Aguardando informação" | "Aguardando validação"
  // --------------------------------------------------------------------
  intervencoes: [
    {
      id: "i1",
      nomeProjeto: "Macrodrenagem do Rio Iguaçu — trecho Xerém/Jardim Primavera (demonstrativo)",
      objeto: "Execução de obras de macrodrenagem e contenção de cheias",
      tipo: "Macrodrenagem",
      programa: "Novo PAC",
      orgaoResponsavel: "INEA",
      rio: "Iguaçu",
      municipioId: "m1",
      processoSEI: "Não informado",
      fase: "Planejamento",
      situacao: "Em planejamento",
      percentualExecucao: "Não informado",
      execucaoFisica: "Não informado",
      execucaoFinanceira: "Não informado",
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "A confirmar",
      fonteRecurso: "Novo PAC",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "Não informado",
      dataPrevista: "A confirmar",
      dataAtualizada: "Não informado",
      motivoAtrasoParalisacao: "Não se aplica",
      proximoMarco: "Conclusão do projeto executivo",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Trecho entre Xerém e Jardim Primavera (referência demonstrativa)",
      descricao: "Obra demonstrativa criada para testar a estrutura da página. Substituir pelos dados reais enviados pelo órgão executor.",
      dataInformacao: "30/06/2026",
      fonte: "Dado em validação",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    },
    {
      id: "i2",
      nomeProjeto: "Recuperação de nascentes e mata ciliar — Alto Iguaçu (demonstrativo)",
      objeto: "Reflorestamento e proteção de nascentes na cabeceira da bacia",
      tipo: "Recuperação ambiental",
      programa: "Novo PAC",
      orgaoResponsavel: "INEA",
      rio: "Iguaçu",
      municipioId: "m2",
      processoSEI: "Não informado",
      fase: "Licitação",
      situacao: "Em licitação",
      percentualExecucao: "Não informado",
      execucaoFisica: "Não informado",
      execucaoFinanceira: "Não informado",
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "A confirmar",
      fonteRecurso: "Novo PAC",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "Não informado",
      dataPrevista: "A confirmar",
      dataAtualizada: "Não informado",
      motivoAtrasoParalisacao: "Não se aplica",
      proximoMarco: "Homologação da licitação",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Cabeceira do rio Iguaçu (referência demonstrativa)",
      descricao: "Obra demonstrativa criada para testar a estrutura da página. Substituir pelos dados reais enviados pelo órgão executor.",
      dataInformacao: "30/06/2026",
      fonte: "Dado em validação",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    },
    {
      id: "i3",
      nomeProjeto: "Dragagem e desassoreamento do Rio Botas (demonstrativo)",
      objeto: "Dragagem do leito do rio para ampliação da calha de vazão",
      tipo: "Dragagem",
      programa: "Novo PAC",
      orgaoResponsavel: "INEA",
      rio: "Botas",
      municipioId: "m1",
      processoSEI: "Não informado",
      fase: "Execução",
      situacao: "Em execução",
      percentualExecucao: 32,
      execucaoFisica: 32,
      execucaoFinanceira: "Não informado",
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "A confirmar",
      fonteRecurso: "Novo PAC",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "A confirmar",
      dataPrevista: "A confirmar",
      dataAtualizada: "30/06/2026",
      motivoAtrasoParalisacao: "Não se aplica",
      proximoMarco: "Conclusão do trecho inicial de dragagem",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Trecho urbano do rio Botas (referência demonstrativa)",
      descricao: "Obra demonstrativa criada para testar a estrutura da página. Substituir pelos dados reais enviados pelo órgão executor.",
      dataInformacao: "30/06/2026",
      fonte: "Dado em validação",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    },
    {
      id: "i4",
      nomeProjeto: "Construção de pôlder e comportas — Baixada do Sarapuí (demonstrativo)",
      objeto: "Implantação de pôlder e sistema de comportas para controle de cheias",
      tipo: "Pôlder e comportas",
      programa: "PAC (2007–2014)",
      orgaoResponsavel: "INEA",
      rio: "Sarapuí",
      municipioId: "m3",
      processoSEI: "Não informado",
      fase: "Concluída",
      situacao: "Concluída",
      percentualExecucao: 100,
      execucaoFisica: 100,
      execucaoFinanceira: 100,
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "A confirmar",
      fonteRecurso: "PAC (1ª e 2ª fases, 2007–2014)",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "2014",
      dataPrevista: "2014",
      dataAtualizada: "2014",
      motivoAtrasoParalisacao: "Não se aplica",
      proximoMarco: "Não se aplica — obra concluída",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Baixada do rio Sarapuí (referência demonstrativa)",
      descricao: "Obra demonstrativa representando intervenções concluídas nas fases do PAC entre 2007 e 2014. Substituir pelos dados reais quando confirmados.",
      dataInformacao: "30/06/2026",
      fonte: "Dado em validação",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    },
    {
      id: "i5",
      nomeProjeto: "Urbanização e avenida-canal — margem do Rio Iguaçu (demonstrativo)",
      objeto: "Urbanização de margem fluvial com implantação de avenida-canal",
      tipo: "Urbanização e reassentamento",
      programa: "PAC (2007–2014)",
      orgaoResponsavel: "INEA",
      rio: "Iguaçu",
      municipioId: "m2",
      processoSEI: "Não informado",
      fase: "Execução",
      situacao: "Paralisada",
      percentualExecucao: 48,
      execucaoFisica: 48,
      execucaoFinanceira: "Não informado",
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "A confirmar",
      fonteRecurso: "PAC (2007–2014)",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "Não informado",
      dataPrevista: "Não informado",
      dataAtualizada: "2014",
      motivoAtrasoParalisacao: "Crise fiscal do estado e irregularidades apontadas por tribunais de contas (histórico do ciclo 2007–2014, conforme apuração em curso pelo MPRJ/GAEMA).",
      proximoMarco: "Reavaliação técnica no âmbito da retomada do projeto",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Margem do rio Iguaçu (referência demonstrativa)",
      descricao: "Obra demonstrativa representando o histórico de paralisação de obras do ciclo 2007–2014. Substituir pelos dados reais quando confirmados.",
      dataInformacao: "30/06/2026",
      fonte: "Dado em validação",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    },
    {
      id: "i6",
      nomeProjeto: "Reassentamento de famílias em área de risco — Sarapuí (demonstrativo)",
      objeto: "Reassentamento de famílias em áreas de risco de inundação",
      tipo: "Reassentamento",
      programa: "Novo PAC",
      orgaoResponsavel: "Secretaria municipal responsável (a confirmar)",
      rio: "Sarapuí",
      municipioId: "m3",
      processoSEI: "Não informado",
      fase: "Planejamento",
      situacao: "Aguardando informação",
      percentualExecucao: "Não informado",
      execucaoFisica: "Não informado",
      execucaoFinanceira: "Não informado",
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "Não informado",
      fonteRecurso: "A confirmar",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "Não informado",
      dataPrevista: "Não informado",
      dataAtualizada: "Não informado",
      motivoAtrasoParalisacao: "Aguardando envio de informações pelo órgão responsável",
      proximoMarco: "Não informado",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Não informado",
      descricao: "Obra demonstrativa criada para testar o estado \"aguardando informação\" da página. Substituir pelos dados reais quando enviados pelo órgão responsável.",
      dataInformacao: "Não informado",
      fonte: "Não informado",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "Não informado",
      demonstrativo: true
    },
    {
      id: "i7",
      nomeProjeto: "Ampliação da calha do Rio Botas — trecho Belford Roxo (demonstrativo)",
      objeto: "Ampliação e reforço da calha fluvial para aumento de vazão",
      tipo: "Macrodrenagem",
      programa: "Novo PAC",
      orgaoResponsavel: "INEA",
      rio: "Botas",
      municipioId: "m3",
      processoSEI: "Não informado",
      fase: "Execução",
      situacao: "Aguardando validação",
      percentualExecucao: "Dado em validação",
      execucaoFisica: "Dado em validação",
      execucaoFinanceira: "Dado em validação",
      empresaContratada: "Dado em validação",
      contrato: "Dado em validação",
      valorContrato: "Dado em validação",
      fonteRecurso: "Novo PAC",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "Não informado",
      dataPrevista: "Dado em validação",
      dataAtualizada: "Dado em validação",
      motivoAtrasoParalisacao: "Não se aplica",
      proximoMarco: "Validação das informações enviadas pelo órgão responsável",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Trecho em Belford Roxo (referência demonstrativa)",
      descricao: "Obra demonstrativa criada para testar o estado \"aguardando validação\" da página, representando informação recebida mas ainda não checada pelo GT.",
      dataInformacao: "30/06/2026",
      fonte: "Ficha de atualização de status recebida do órgão executor — em checagem pelo IRM",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    },
    {
      id: "i8",
      nomeProjeto: "Reflorestamento de mata ciliar — margem do Rio Sarapuí (demonstrativo)",
      objeto: "Plantio e recuperação de mata ciliar em trecho degradado",
      tipo: "Recuperação ambiental",
      programa: "Novo PAC",
      orgaoResponsavel: "INEA",
      rio: "Sarapuí",
      municipioId: "m1",
      processoSEI: "Não informado",
      fase: "Execução",
      situacao: "Atrasada",
      percentualExecucao: 21,
      execucaoFisica: 21,
      execucaoFinanceira: 15,
      empresaContratada: "Não informado",
      contrato: "Não informado",
      valorContrato: "A confirmar",
      fonteRecurso: "Novo PAC",
      dataInicioVigencia: "Não informado",
      prazoContratoDias: "Não informado",
      dataTerminoVigencia: "A confirmar",
      dataPrevista: "A confirmar",
      dataAtualizada: "30/06/2026",
      motivoAtrasoParalisacao: "Atraso na liberação da área para plantio; sem paralisação formal do contrato.",
      proximoMarco: "Conclusão da primeira etapa de plantio",
      latitude: "Não informado",
      longitude: "Não informado",
      localizacaoTexto: "Margem do rio Sarapuí (referência demonstrativa)",
      descricao: "Obra demonstrativa criada para testar o estado \"atrasada\" da página. Substituir pelos dados reais enviados pelo órgão executor.",
      dataInformacao: "30/06/2026",
      fonte: "Dado em validação",
      linkDocumento: "Link a inserir",
      ultimaAtualizacao: "30/06/2026",
      demonstrativo: true
    }
  ],

  // --------------------------------------------------------------------
  // 9. LINHA DO TEMPO
  //    Estes marcos refletem o histórico institucional relatado na
  //    apresentação do GT Projeto Iguaçu (25/06/2026) e trazem fonte.
  //    Para adicionar um novo marco, copie um item e cole antes do "]".
  // --------------------------------------------------------------------
  linhaDoTempo: [
    {
      id: "t1",
      data: "1996",
      titulo: "Primeira proposta técnica",
      descricao: "Primeira proposta de intervenção nas bacias, elaborada pela COPPE/UFRJ com recursos do Banco Mundial.",
      categoria: "Estudos e planejamento",
      fonte: "COPPE/UFRJ (1996)",
      confirmado: true
    },
    {
      id: "t2",
      data: "2005–2006",
      titulo: "Retomada dos estudos",
      descricao: "A COPPE/UFRJ retoma os estudos técnicos em cooperação com o governo do estado do Rio de Janeiro.",
      categoria: "Estudos e planejamento",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t3",
      data: "2007",
      titulo: "Plano Diretor da Bacia Iguaçu/Sarapuí",
      descricao: "SEA e SERLA formalizam o Plano Diretor da Bacia Iguaçu/Sarapuí, prevendo 25 intervenções em 6 municípios.",
      categoria: "Etapas anteriores",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t4",
      data: "2007–2014",
      titulo: "Execução parcial via PAC",
      descricao: "Execução parcial das intervenções por meio do PAC federal — cerca de R$ 270 milhões na primeira etapa e aproximadamente R$ 450 milhões investidos no período, entre dragagens, pôlderes, desassoreamento e moradias planejadas.",
      categoria: "Etapas anteriores",
      fonte: "INEA/PAC (2007–2014)",
      confirmado: true
    },
    {
      id: "t5",
      data: "2014",
      titulo: "Interrupção das obras",
      descricao: "Obras interrompidas em decorrência da crise fiscal do estado, falhas de manutenção e irregularidades apontadas pelos tribunais de contas.",
      categoria: "Etapas anteriores",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t6",
      data: "Fevereiro de 2024",
      titulo: "Transbordamento do Rio Botas reacende a discussão",
      descricao: "Novo transbordamento do rio Botas reacende a discussão pública. A Casa Civil apresenta à União um projeto orçado em R$ 733 milhões.",
      categoria: "Retomada institucional",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t7",
      data: "Abril de 2025",
      titulo: "Reunião MPRJ, INEA e IRM",
      descricao: "Em reunião conjunta, o Ministério Público propõe três medidas: mapeamento das intervenções, criação de um Grupo de Trabalho e desenvolvimento de uma plataforma digital de transparência.",
      categoria: "Formação do Grupo de Trabalho",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t8",
      data: "2025",
      titulo: "Projeto Iguaçu entra no Novo PAC",
      descricao: "O projeto passa a integrar o Novo PAC, com documentação em tramitação junto à Caixa Econômica Federal.",
      categoria: "Contratações",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t9",
      data: "Dezembro de 2025",
      titulo: "Aprovação pela Caixa",
      descricao: "A Caixa Econômica Federal conclui a aprovação e o INEA prepara o edital de licitação.",
      categoria: "Licitações",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t10",
      data: "06/02/2026",
      titulo: "Abertura do processo licitatório",
      descricao: "A Caixa retira a cláusula suspensiva e o processo licitatório é aberto no SEI pelo INEA.",
      categoria: "Licitações",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t11",
      data: "10/02/2026",
      titulo: "Reserva orçamentária",
      descricao: "Emissão de reserva orçamentária de R$ 147 milhões para o projeto executivo e as obras.",
      categoria: "Licitações",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t12",
      data: "12/02/2026",
      titulo: "Cronograma definido em reunião do GT",
      descricao: "Reunião do GT com o MPRJ define prazo de 18 meses para o projeto, sendo os 3 meses iniciais dedicados ao projeto executivo. Definição da licitação esperada para junho de 2026.",
      categoria: "Formação do Grupo de Trabalho",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: true
    },
    {
      id: "t13",
      data: "Previsão: 4º trimestre de 2026",
      titulo: "Início físico das obras (previsão)",
      descricao: "Data em validação — início físico das obras estimado pelo INEA, sujeito à conclusão do processo licitatório e do projeto executivo.",
      categoria: "Atualizações futuras",
      fonte: "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)",
      confirmado: false
    }
  ],

  // --------------------------------------------------------------------
  // 10. DOCUMENTOS E LINKS
  //     Somente URLs oficiais confirmadas devem ser inseridas em "url".
  //     Quando não houver, mantenha "url: \"\"" — a página mostrará
  //     automaticamente "Link a inserir".
  // --------------------------------------------------------------------
  documentos: [
    {
      id: "d1",
      titulo: "Portaria IRM nº 195/2025",
      tipo: "Ato normativo",
      data: "2025",
      orgao: "Instituto Rio Metrópole (IRM)",
      descricao: "Formaliza a criação do Grupo de Trabalho (GT) Projeto Iguaçu, com o IRM como coordenador.",
      formato: "PDF",
      url: ""
    },
    {
      id: "d2",
      titulo: "Apresentação institucional — GT Projeto Iguaçu",
      tipo: "Apresentação",
      data: "25/06/2026",
      orgao: "Instituto Rio Metrópole (IRM)",
      descricao: "Apresentação da reunião de retomada dos trabalhos do Grupo de Trabalho Projeto Iguaçu.",
      formato: "PPTX",
      url: ""
    },
    {
      id: "d3",
      titulo: "Plano Diretor da Bacia Iguaçu/Sarapuí",
      tipo: "Relatório técnico",
      data: "2007",
      orgao: "SEA / SERLA",
      descricao: "Plano Diretor formalizado em 2007, com previsão de 25 intervenções em 6 municípios da bacia.",
      formato: "Não informado",
      url: ""
    },
    {
      id: "d4",
      titulo: "Nota técnica sobre o Projeto Iguaçu",
      tipo: "Relatório técnico",
      data: "2025",
      orgao: "INEA",
      descricao: "Nota técnica do INEA referente ao andamento do Projeto Iguaçu.",
      formato: "PDF",
      url: ""
    },
    {
      id: "d5",
      titulo: "Cobertura jornalística — RioOnWatch",
      tipo: "Notícia",
      data: "Março de 2025",
      orgao: "RioOnWatch",
      descricao: "Reportagem sobre a situação do Projeto Iguaçu e da Baixada Fluminense.",
      formato: "Página web",
      url: ""
    },
    {
      id: "d6",
      titulo: "Cobertura jornalística — Diário do Rio",
      tipo: "Notícia",
      data: "Março de 2026",
      orgao: "Diário do Rio",
      descricao: "Reportagem sobre a retomada do Projeto Iguaçu.",
      formato: "Página web",
      url: ""
    },
    {
      id: "d7",
      titulo: "Cobertura jornalística — Diário do Estado",
      tipo: "Notícia",
      data: "Março de 2026",
      orgao: "Diário do Estado",
      descricao: "Reportagem sobre a retomada do Projeto Iguaçu.",
      formato: "Página web",
      url: ""
    },
    {
      id: "d8",
      titulo: "SIGA Águas — Baía de Guanabara",
      tipo: "Sistema público relacionado",
      data: "Não informado",
      orgao: "AGEVAP / CBH Baía de Guanabara",
      descricao: "Sistema com acervo de mapas e camadas de dados georreferenciados da Região Hidrográfica V (Baía de Guanabara). O IRM e o CBH Baía de Guanabara vão integrar dados do Projeto Iguaçu a esta plataforma.",
      formato: "Plataforma web (SIG)",
      url: "https://sigaaguas.org.br/sigaweb/apps/baia-de-guanabara"
    }
  ],

  // --------------------------------------------------------------------
  // 11. TRANSPARÊNCIA E METODOLOGIA
  // --------------------------------------------------------------------
  transparencia: {
    origemDados: "Os dados sobre cada intervenção são preenchidos pelos próprios órgãos executores (como o INEA) e pelas prefeituras, por meio de um Formulário de Atualização de Status com 15 campos padronizados, agrupados em quatro blocos: Identificação, Execução, Vigência e Localização.",
    responsaveisFornecimento: "Órgãos executores das obras e prefeituras dos municípios contemplados, conforme fluxo definido pelo Grupo de Trabalho (GT) Projeto Iguaçu.",
    consolidacaoIRM: "O Instituto Rio Metrópole (IRM), na coordenação do GT, checa e consolida os dados recebidos antes da publicação nesta página.",
    dataReferencia: "30/06/2026",
    periodicidade: "Ciclo bimestral: cerca de 14 dias para os órgãos enviarem as informações do período de referência encerrado, seguidos de cerca de 14 dias para a consolidação pelo IRM antes da reunião seguinte do GT.",

    // Glossário de siglas e termos técnicos usados na página (guia de UI/UX,
    // seções 1 e 5: "explicar siglas na primeira utilização" e "explicar
    // termos como execução física e execução financeira").
    glossario: [
      { termo: "IRM", significado: "Instituto Rio Metrópole — autarquia estadual responsável pela gestão metropolitana da Região Metropolitana do Rio de Janeiro (RMRJ) e pela coordenação do GT Projeto Iguaçu." },
      { termo: "GT", significado: "Grupo de Trabalho — neste caso, o GT Projeto Iguaçu, criado pela Portaria IRM nº 195/2025 para reunir, checar e divulgar informações sobre as intervenções." },
      { termo: "INEA", significado: "Instituto Estadual do Ambiente — órgão do governo do Rio de Janeiro responsável pela execução técnica das obras do Projeto Iguaçu." },
      { termo: "MPRJ", significado: "Ministério Público do Estado do Rio de Janeiro." },
      { termo: "PAC / Novo PAC", significado: "Programa de Aceleração do Crescimento — programa federal de investimento em infraestrutura que financia parte das intervenções." },
      { termo: "PEDUI", significado: "Plano Estratégico de Desenvolvimento Urbano Integrado da Região Metropolitana do Rio de Janeiro, ratificado pela Lei Estadual nº 11.021/2025." },
      { termo: "DIRSMI", significado: "Diretoria de Saneamento Metropolitano Integrado — diretoria do IRM responsável pelos temas de saneamento e drenagem, incluindo o Projeto Iguaçu." },
      { termo: "RMRJ", significado: "Região Metropolitana do Rio de Janeiro — os 22 municípios sob gestão metropolitana do IRM." },
      { termo: "SEA / SERLA", significado: "Secretaria de Estado do Ambiente e Fundação Superintendência Estadual de Rios e Lagoas — órgãos estaduais responsáveis pelo Plano Diretor da Bacia Iguaçu/Sarapuí de 2007 (a SERLA foi posteriormente sucedida pelo INEA)." },
      { termo: "CBH Baía de Guanabara", significado: "Comitê de Bacia Hidrográfica da Região Hidrográfica da Baía de Guanabara — parceiro do IRM na integração de dados do Projeto Iguaçu ao SIGA Águas." },
      { termo: "AGEVAP", significado: "Entidade de apoio à gestão de recursos hídricos que mantém, em conjunto com o CBH Baía de Guanabara, a plataforma SIGA Águas." },
      { termo: "SIGA Águas", significado: "Sistema com acervo de mapas e camadas de dados georreferenciados sobre recursos hídricos, mantido pela AGEVAP e pelos comitês de bacia." },
      { termo: "SEI", significado: "Sistema Eletrônico de Informações — sistema usado pelo governo do Rio de Janeiro para tramitar processos administrativos, como o processo licitatório das obras." },
      { termo: "Execução física", significado: "Percentual da obra que já foi de fato construído/realizado no local." },
      { termo: "Execução financeira", significado: "Percentual do valor do contrato que já foi efetivamente pago à empresa executora." },
      { termo: "Valor previsto, contratado, empenhado e pago", significado: "Quatro momentos diferentes de um mesmo valor: previsto é a estimativa inicial; contratado é o valor firmado em contrato; empenhado é o valor reservado no orçamento público; pago é o valor já desembolsado. Esta versão da página registra, para cada intervenção, apenas o valor contratado — os demais serão incorporados conforme os órgãos executores passarem a informá-los." }
    ],

    significadoSituacoes: [
      { situacao: "Em planejamento", significado: "A intervenção está em fase de estudos, projeto básico ou projeto executivo, sem processo licitatório aberto." },
      { situacao: "Em licitação", significado: "O processo licitatório para contratação da obra está em andamento." },
      { situacao: "Em execução", significado: "A obra está contratada e em execução física." },
      { situacao: "Concluída", significado: "A obra foi finalizada." },
      { situacao: "Atrasada", significado: "A obra está em execução, mas fora do cronograma previsto; o motivo, quando informado, é apresentado no detalhe da intervenção." },
      { situacao: "Paralisada", significado: "A execução da obra foi interrompida; o motivo, quando informado, é apresentado no detalhe da intervenção." },
      { situacao: "Aguardando informação", significado: "O órgão responsável ainda não enviou os dados desta intervenção ao GT." },
      { situacao: "Aguardando validação", significado: "As informações foram recebidas do órgão responsável, mas ainda não foram checadas e consolidadas pelo IRM." }
    ],
    criteriosIndicadores: "Os indicadores numéricos de contagem (municípios, intervenções por fase e situação) são calculados automaticamente a partir dos registros de intervenções cadastrados. Indicadores financeiros e populacionais dependem de consolidação adicional e são apresentados como \"A confirmar\" até validação.",
    limitacoes: "Esta é uma versão de protótipo (beta). Os dados de intervenções específicas (empresa contratada, valores de contrato, percentuais de execução, datas) são demonstrativos e não representam informação oficial até que sejam substituídos pelos dados reais enviados pelos órgãos executores.",
    canalContato: "Dúvidas, correções ou solicitações de informação podem ser encaminhadas à Diretoria de Saneamento Básico Integrado do IRM pelo e-mail saneamento@irm.rj.gov.br.",
    avisoConsolidacao: "As informações divulgadas nesta página são consolidadas pelo Instituto Rio Metrópole a partir dos dados encaminhados pelos órgãos responsáveis. Informações ainda não validadas são identificadas expressamente.",
    estadosQualidade: [
      { estado: "Atualizado", significado: "Dado revisado e confirmado dentro do ciclo de referência vigente." },
      { estado: "Aguardando validação", significado: "Dado recebido, ainda em checagem pelo IRM." },
      { estado: "Desatualizado", significado: "Dado mais antigo que o ciclo de referência vigente, pendente de novo envio." },
      { estado: "Não informado", significado: "Campo sem informação enviada pelo órgão responsável." },
      { estado: "Em correção", significado: "Inconsistência identificada e em processo de correção junto ao órgão responsável." }
    ]
  },

  // --------------------------------------------------------------------
  // 12. FONTES GERAIS (bibliografia consolidada)
  // --------------------------------------------------------------------
  fontes: [
    "COPPE/UFRJ (1996)",
    "SEA/SERLA — Plano Diretor da Bacia Iguaçu/Sarapuí (2007)",
    "INEA/PAC (2007–2014)",
    "RioOnWatch (março de 2025)",
    "Diário do Rio (março de 2026)",
    "Diário do Estado (março de 2026)",
    "Nota técnica INEA (2025)",
    "Apresentação institucional GT Projeto Iguaçu — IRM (25/06/2026)"
  ],

  // --------------------------------------------------------------------
  // 13. CONTATOS DO GT PROJETO IGUAÇU
  // --------------------------------------------------------------------
  contatos: [
    {
      nome: "Maria Clara Freitas Zopellari",
      cargo: "Coordenadora Executiva — GT Projeto Iguaçu",
      email: "mzopellari@irm.rj.gov.br"
    },
    {
      nome: "Debora Toci Puccini",
      cargo: "Coordenadora Técnica — GT Projeto Iguaçu, Diretoria de Saneamento Metropolitano Integrado",
      email: "dpuccini@irm.rj.gov.br"
    },
    {
      nome: "Diretoria de Saneamento Básico Integrado",
      cargo: "Canal institucional geral",
      email: "saneamento@irm.rj.gov.br"
    }
  ],

  // --------------------------------------------------------------------
  // 14. RODAPÉ
  // --------------------------------------------------------------------
  rodape: {
    nomeInstituto: "Instituto Rio Metrópole (IRM)",
    diretoriaResponsavel: "Diretoria de Saneamento Metropolitano Integrado (DIRSMI)",
    canalInstitucional: "saneamento@irm.rj.gov.br",
    linkSitePrincipal: "https://www.rj.gov.br/irm",
    linkPrivacidade: "",   // URL da política de privacidade (a confirmar)
    linkAcessibilidade: "", // URL da página de acessibilidade (a confirmar)
    avisoAtualizacao: "Os dados desta página podem ser atualizados após validação pelos órgãos responsáveis e pelo Instituto Rio Metrópole."
  },

  // --------------------------------------------------------------------
  // 15. TERRITÓRIO (seção "Onde estão as intervenções")
  // --------------------------------------------------------------------
  territorio: {
    // Mapa de localização real da Baixada Fluminense (região em vermelho) dentro do estado do
    // Rio de Janeiro. É um mapa de referência geográfica geral — não representa a localização
    // específica de nenhuma intervenção. Trocar pelo mapa oficial (ex.: camada do SIGA Águas)
    // quando disponível.
    imagemUrl: "assets/img/mapa-baixada-fluminense.png",
    imagemAlt: "Mapa de localização da região da Baixada Fluminense (destacada em vermelho) dentro do estado do Rio de Janeiro.",
    legenda: "Mapa de localização geral da Baixada Fluminense. Mapa: Alvoradaking, via Wikimedia Commons (CC BY-SA 4.0). Não representa a localização específica de nenhuma intervenção — substituir pelo mapa oficial, incluindo a futura camada georreferenciada compartilhada com o SIGA Águas (AGEVAP/CBH Baía de Guanabara), quando disponível.",
    descricaoTextual: "O território do Projeto Iguaçu abrange municípios da Baixada Fluminense cortados pelos rios Iguaçu, Botas e Sarapuí. A relação oficial e definitiva de municípios contemplados está em consolidação pelo GT Projeto Iguaçu; a lista atual nesta página é demonstrativa."
  }
};
