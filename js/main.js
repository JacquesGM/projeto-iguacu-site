/**
 * ============================================================================
 *  main.js — Acompanhamento do Projeto Iguaçu (IRM)
 * ============================================================================
 *  Este arquivo cuida apenas da APRESENTAÇÃO da página: lê os dados definidos
 *  em js/dados.js e monta o HTML na tela, os filtros da tabela de
 *  intervenções, o modal de detalhes e o menu mobile.
 *
 *  A equipe de comunicação normalmente NÃO precisa editar este arquivo.
 *  Para atualizar textos, números, intervenções, documentos ou datas,
 *  edite apenas js/dados.js.
 * ============================================================================
 */
(function () {
  "use strict";

  var PADRAO_VAZIO = "Não informado";

  var SITUACOES_VALIDAS = [
    "Em planejamento",
    "Em licitação",
    "Em execução",
    "Concluída",
    "Atrasada",
    "Paralisada",
    "Aguardando informação",
    "Aguardando validação"
  ];

  var CLASSE_ETIQUETA = {
    "Em planejamento": "etiqueta--planejamento",
    "Em licitação": "etiqueta--licitacao",
    "Em execução": "etiqueta--execucao",
    "Concluída": "etiqueta--concluida",
    "Atrasada": "etiqueta--atrasada",
    "Paralisada": "etiqueta--paralisada",
    "Aguardando informação": "etiqueta--aguardando-informacao",
    "Aguardando validação": "etiqueta--aguardando-validacao"
  };

  // ------------------------------------------------------------------ util
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function texto(valor) {
    if (valor === undefined || valor === null) return PADRAO_VAZIO;
    var s = String(valor).trim();
    return s === "" ? PADRAO_VAZIO : s;
  }

  function limpar(elemento) {
    while (elemento.firstChild) elemento.removeChild(elemento.firstChild);
  }

  function criar(tag, opcoes, filhos) {
    var elemento = document.createElement(tag);
    opcoes = opcoes || {};
    if (opcoes.classe) elemento.className = opcoes.classe;
    if (opcoes.texto !== undefined) elemento.textContent = opcoes.texto;
    if (opcoes.attrs) {
      Object.keys(opcoes.attrs).forEach(function (chave) {
        elemento.setAttribute(chave, opcoes.attrs[chave]);
      });
    }
    (filhos || []).forEach(function (filho) {
      if (filho) elemento.appendChild(filho);
    });
    return elemento;
  }

  function linhaDefinicao(rotulo, valorTexto) {
    return criar("div", {}, [
      criar("dt", { texto: rotulo }),
      criar("dd", { texto: texto(valorTexto) })
    ]);
  }

  function linkOuTexto(url, rotuloLink) {
    var urlLimpa = (url || "").trim();
    if (urlLimpa === "") {
      return criar("dd", { texto: "Link a inserir" });
    }
    var link = criar("a", { texto: rotuloLink || urlLimpa, attrs: { href: urlLimpa, target: "_blank", rel: "noopener noreferrer" } });
    return criar("dd", {}, [link]);
  }

  function nomeMunicipio(id) {
    var municipio = (window.projeto.municipios || []).filter(function (m) { return m.id === id; })[0];
    return municipio ? municipio.nome : PADRAO_VAZIO;
  }

  function classeEtiqueta(situacao) {
    return "etiqueta " + (CLASSE_ETIQUETA[situacao] || "etiqueta--planejamento");
  }

  // ------------------------------------------------------------- cabeçalho
  function renderCabecalho() {
    var p = window.projeto;
    $("#brand-nome").textContent = p.identidade.nomeInstituto;
    $("#brand-projeto").textContent = "Acompanhamento do " + p.identidade.nomeProjeto;
    var logo = $("#brand-logo");
    logo.src = p.identidade.logoUrl;
    logo.alt = p.identidade.nomeInstituto + " (" + p.identidade.sigla + ")";

    var logoGov = $("#gov-logo");
    if (p.identidade.logoGovUrl) {
      logoGov.src = p.identidade.logoGovUrl;
      logoGov.alt = "Governo do Estado do Rio de Janeiro";
    }

    var banner = $("#beta-banner");
    banner.textContent = p.meta.avisoVersaoBeta || "";
  }

  // ------------------------------------------------------------------ hero
  function renderHero() {
    var p = window.projeto.apresentacao;
    $("#hero-titulo").textContent = p.titulo;
    $("#hero-subtitulo").textContent = p.subtitulo;
    $("#hero-intro").textContent = p.textoIntro;
    $("#hero-papel").textContent = p.papelResumo;
    $("#hero-atualizacao").textContent = "Última atualização: " + texto(window.projeto.meta.ultimaAtualizacao);
    var img = $("#hero-imagem");
    img.src = p.imagemUrl;
    img.alt = p.imagemAlt;
    $("#hero-imagem-credito").textContent = p.imagemCredito || "";
  }

  // ----------------------------------------------------------------- sobre
  function renderSobre() {
    var s = window.projeto.sobreProjeto;

    $("#sobre-oquee").textContent = s.oQueE;
    $("#sobre-problema").textContent = s.problemaPublico;

    var objetivosEl = $("#sobre-objetivos");
    limpar(objetivosEl);
    (s.objetivos || []).forEach(function (item) {
      objetivosEl.appendChild(criar("li", { texto: item }));
    });

    $("#bloco-papel-irm-titulo").textContent = s.blocoPapelIRM.titulo;
    $("#bloco-papel-irm-texto").textContent = s.blocoPapelIRM.texto;

    var baseLegalEl = $("#sobre-base-legal");
    limpar(baseLegalEl);
    (s.baseLegal || []).forEach(function (item) {
      baseLegalEl.appendChild(criar("li", { texto: item }));
    });

    var orgaosEl = $("#sobre-orgaos");
    limpar(orgaosEl);
    (s.orgaosParticipantes || []).forEach(function (item) {
      orgaosEl.appendChild(criar("li", { texto: item }));
    });

    $("#sobre-municipios-texto").textContent = s.municipiosContempladosTexto;
  }

  // ------------------------------------------------------------- situação
  function renderSituacaoAtual() {
    var s = window.projeto.situacaoAtual;
    $("#situacao-fase").textContent = texto(s.faseAtual);
    $("#situacao-geral").textContent = texto(s.situacaoGeral);
    $("#situacao-ultimo-marco").textContent = texto(s.ultimoMarco);
    $("#situacao-proximo-marco").textContent = texto(s.proximoMarco);
    $("#situacao-data-referencia").textContent = texto(s.dataReferencia);

    var atividadesEl = $("#situacao-atividades");
    limpar(atividadesEl);
    (s.atividadesEmAndamento || []).forEach(function (item) {
      atividadesEl.appendChild(criar("li", { texto: item }));
    });
  }

  // ---------------------------------------------------------- indicadores
  function renderIndicadores() {
    var p = window.projeto;
    var intervencoes = p.intervencoes || [];

    function contarSituacao(situacao) {
      return intervencoes.filter(function (i) { return i.situacao === situacao; }).length;
    }

    var cartoes = [
      { rotulo: "Municípios contemplados", valor: p.municipios.length },
      { rotulo: "Intervenções cadastradas", valor: intervencoes.length },
      { rotulo: "Em planejamento", valor: contarSituacao("Em planejamento") },
      { rotulo: "Em licitação", valor: contarSituacao("Em licitação") },
      { rotulo: "Em execução", valor: contarSituacao("Em execução") },
      { rotulo: "Concluídas", valor: contarSituacao("Concluída") },
      { rotulo: "Investimento previsto", valor: texto(p.indicadores.investimentoPrevisto) },
      { rotulo: "População estimada beneficiada", valor: texto(p.indicadores.populacaoBeneficiadaEstimada) },
      { rotulo: "Data da última atualização", valor: texto(p.indicadores.dataUltimaAtualizacao) }
    ];

    var grade = $("#grade-indicadores");
    limpar(grade);
    cartoes.forEach(function (c) {
      grade.appendChild(criar("div", { classe: "indicador-card" }, [
        criar("div", { classe: "indicador-card__valor", texto: String(c.valor) }),
        criar("div", { classe: "indicador-card__rotulo", texto: c.rotulo })
      ]));
    });

    $("#indicadores-observacao").textContent = p.indicadores.observacao;
  }

  // --------------------------------------------------------- intervenções
  var estadoFiltros = { busca: "", municipio: "", fase: "", situacao: "" };

  function popularFiltros() {
    var p = window.projeto;

    var selMunicipio = $("#filtro-municipio");
    p.municipios.forEach(function (m) {
      selMunicipio.appendChild(criar("option", { texto: m.nome, attrs: { value: m.id } }));
    });

    var fases = [];
    p.intervencoes.forEach(function (i) {
      if (fases.indexOf(i.fase) === -1) fases.push(i.fase);
    });
    var selFase = $("#filtro-fase");
    fases.forEach(function (f) {
      selFase.appendChild(criar("option", { texto: f, attrs: { value: f } }));
    });

    var selSituacao = $("#filtro-situacao");
    SITUACOES_VALIDAS.forEach(function (s) {
      selSituacao.appendChild(criar("option", { texto: s, attrs: { value: s } }));
    });
  }

  function intervencoesFiltradas() {
    var p = window.projeto;
    var buscaLower = estadoFiltros.busca.trim().toLowerCase();

    return p.intervencoes.filter(function (i) {
      if (estadoFiltros.municipio && i.municipioId !== estadoFiltros.municipio) return false;
      if (estadoFiltros.fase && i.fase !== estadoFiltros.fase) return false;
      if (estadoFiltros.situacao && i.situacao !== estadoFiltros.situacao) return false;
      if (buscaLower) {
        var alvo = [
          i.nomeProjeto, i.rio, i.orgaoResponsavel, i.tipo, nomeMunicipio(i.municipioId)
        ].join(" ").toLowerCase();
        if (alvo.indexOf(buscaLower) === -1) return false;
      }
      return true;
    });
  }

  function celula(rotulo, conteudoTexto) {
    return criar("td", { texto: conteudoTexto, attrs: { "data-rotulo": rotulo } });
  }

  // ------------------------------------------------- ordenação da tabela
  var estadoOrdenacao = { campo: null, direcao: "asc" };

  function dataParaOrdenacao(valor) {
    if (typeof valor !== "string") return 0;
    var m = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return 0; // "Não informado", "Dado em validação" etc. — vão para o início
    return new Date(m[3], m[2] - 1, m[1]).getTime();
  }

  function valorParaOrdenacao(item, campo) {
    if (campo === "municipio") return nomeMunicipio(item.municipioId).toLowerCase();
    if (campo === "percentualExecucao") {
      return typeof item.percentualExecucao === "number" ? item.percentualExecucao : -1;
    }
    if (campo === "ultimaAtualizacao") return dataParaOrdenacao(item.ultimaAtualizacao);
    var valor = item[campo];
    return typeof valor === "string" ? valor.toLowerCase() : (valor === undefined || valor === null ? "" : valor);
  }

  function ordenarLista(lista) {
    if (!estadoOrdenacao.campo) return lista;
    var campo = estadoOrdenacao.campo;
    var multiplicador = estadoOrdenacao.direcao === "asc" ? 1 : -1;
    return lista.slice().sort(function (a, b) {
      var va = valorParaOrdenacao(a, campo);
      var vb = valorParaOrdenacao(b, campo);
      if (va < vb) return -1 * multiplicador;
      if (va > vb) return 1 * multiplicador;
      return 0;
    });
  }

  function configurarOrdenacao() {
    $all(".th-ordenar").forEach(function (botao) {
      botao.addEventListener("click", function () {
        var campo = botao.getAttribute("data-campo");
        if (estadoOrdenacao.campo === campo) {
          estadoOrdenacao.direcao = estadoOrdenacao.direcao === "asc" ? "desc" : "asc";
        } else {
          estadoOrdenacao.campo = campo;
          estadoOrdenacao.direcao = "asc";
        }
        $all(".th-ordenar").forEach(function (b) {
          b.closest("th").setAttribute("aria-sort", "none");
        });
        botao.closest("th").setAttribute("aria-sort", estadoOrdenacao.direcao === "asc" ? "ascending" : "descending");
        renderTabelaIntervencoes();
      });
    });
  }

  function renderTabelaIntervencoes() {
    var lista = ordenarLista(intervencoesFiltradas());
    var corpo = $("#tabela-intervencoes-corpo");
    limpar(corpo);

    $("#contador-resultados").textContent = lista.length + " intervenção(ões) encontrada(s)";
    $("#mensagem-sem-resultado").hidden = lista.length > 0;
    $("#tabela-intervencoes").hidden = lista.length === 0;

    lista.forEach(function (item) {
      var etiqueta = criar("span", { classe: classeEtiqueta(item.situacao), texto: item.situacao });
      var celulaSituacao = criar("td", { attrs: { "data-rotulo": "Situação" } }, [etiqueta]);

      var botao = criar("button", {
        classe: "botao-detalhe",
        texto: "Ver detalhes",
        attrs: { type: "button", "data-id": item.id, "aria-haspopup": "dialog" }
      });
      var celulaAcao = criar("td", { attrs: { "data-rotulo": "Detalhes" } }, [botao]);

      var percentual = (item.percentualExecucao === "" || item.percentualExecucao === undefined || item.percentualExecucao === null)
        ? PADRAO_VAZIO
        : (typeof item.percentualExecucao === "number" ? item.percentualExecucao + "%" : String(item.percentualExecucao));

      var linha = criar("tr", {}, [
        celula("Intervenção", texto(item.nomeProjeto)),
        celula("Município", nomeMunicipio(item.municipioId)),
        celula("Tipo", texto(item.tipo)),
        celula("Órgão responsável", texto(item.orgaoResponsavel)),
        celula("Fase", texto(item.fase)),
        celulaSituacao,
        celula("% execução", percentual),
        celula("Última atualização", texto(item.ultimaAtualizacao)),
        celulaAcao
      ]);

      corpo.appendChild(linha);
    });
  }

  function aplicarFiltros() {
    estadoFiltros.busca = $("#filtro-busca").value;
    estadoFiltros.municipio = $("#filtro-municipio").value;
    estadoFiltros.fase = $("#filtro-fase").value;
    estadoFiltros.situacao = $("#filtro-situacao").value;
    renderTabelaIntervencoes();
  }

  function configurarFiltros() {
    popularFiltros();
    configurarOrdenacao();
    renderTabelaIntervencoes();

    $("#filtro-busca").addEventListener("input", aplicarFiltros);
    $("#filtro-municipio").addEventListener("change", aplicarFiltros);
    $("#filtro-fase").addEventListener("change", aplicarFiltros);
    $("#filtro-situacao").addEventListener("change", aplicarFiltros);

    $("#botao-limpar-filtros").addEventListener("click", function () {
      $("#filtros-intervencoes").reset();
      estadoFiltros = { busca: "", municipio: "", fase: "", situacao: "" };
      renderTabelaIntervencoes();
      $("#filtro-busca").focus();
    });

    $("#tabela-intervencoes-corpo").addEventListener("click", function (evento) {
      var botao = evento.target.closest ? evento.target.closest(".botao-detalhe") : null;
      if (!botao) return;
      abrirModal(botao.getAttribute("data-id"), botao);
    });
  }

  // ------------------------------------------------------------- território
  function renderTerritorio() {
    var t = window.projeto.territorio;
    var img = $("#territorio-imagem");
    img.src = t.imagemUrl;
    img.alt = t.imagemAlt;
    $("#territorio-legenda").textContent = t.legenda;
    $("#territorio-descricao").textContent = t.descricaoTextual;
  }

  // ------------------------------------------------------------ linha tempo
  function renderLinhaDoTempo() {
    var lista = $("#linha-do-tempo-lista");
    limpar(lista);

    window.projeto.linhaDoTempo.forEach(function (marco) {
      var item = criar("li", { classe: marco.confirmado === false ? "marco--nao-confirmado" : "" }, [
        criar("span", { classe: "linha-do-tempo__data", texto: marco.data }),
        criar("span", { classe: "linha-do-tempo__categoria", texto: marco.categoria }),
        criar("p", { classe: "linha-do-tempo__titulo", texto: marco.titulo }),
        criar("p", { texto: marco.descricao }),
        criar("p", { classe: "linha-do-tempo__fonte", texto: "Fonte: " + texto(marco.fonte) + (marco.confirmado === false ? " — Data em validação" : "") })
      ]);
      lista.appendChild(item);
    });
  }

  // ------------------------------------------------------------ documentos
  function renderDocumentos() {
    var grade = $("#grade-documentos");
    limpar(grade);

    window.projeto.documentos.forEach(function (doc) {
      var acao = (doc.url || "").trim() !== ""
        ? criar("a", { classe: "botao botao--secundario", texto: "Acessar documento", attrs: { href: doc.url, target: "_blank", rel: "noopener noreferrer" } })
        : criar("span", { classe: "botao botao--texto", texto: "Link a inserir" });

      var card = criar("article", { classe: "documento-card" }, [
        criar("span", { classe: "documento-card__tipo", texto: texto(doc.tipo) }),
        criar("h3", { classe: "documento-card__titulo", texto: doc.titulo }),
        criar("p", { classe: "documento-card__meta", texto: texto(doc.orgao) + " · " + texto(doc.data) + " · " + texto(doc.formato) }),
        criar("p", { texto: doc.descricao }),
        criar("div", { classe: "documento-card__acao" }, [acao])
      ]);
      grade.appendChild(card);
    });
  }

  // --------------------------------------------------------- transparência
  function renderTransparencia() {
    var t = window.projeto.transparencia;

    $("#transparencia-origem").textContent = t.origemDados;
    $("#transparencia-responsaveis").textContent = t.responsaveisFornecimento;
    $("#transparencia-consolidacao").textContent = t.consolidacaoIRM;
    $("#transparencia-periodicidade").textContent = "Data de referência: " + texto(t.dataReferencia) + ". " + t.periodicidade;
    $("#transparencia-limitacoes").textContent = t.limitacoes;
    $("#transparencia-canal").textContent = t.canalContato;
    $("#transparencia-aviso").textContent = t.avisoConsolidacao;

    var situacoesEl = $("#transparencia-situacoes");
    limpar(situacoesEl);
    (t.significadoSituacoes || []).forEach(function (item) {
      situacoesEl.appendChild(linhaDefinicao(item.situacao, item.significado));
    });

    var estadosEl = $("#transparencia-estados");
    limpar(estadosEl);
    (t.estadosQualidade || []).forEach(function (item) {
      estadosEl.appendChild(linhaDefinicao(item.estado, item.significado));
    });

    var glossarioEl = $("#transparencia-glossario");
    limpar(glossarioEl);
    (t.glossario || []).forEach(function (item) {
      glossarioEl.appendChild(linhaDefinicao(item.termo, item.significado));
    });

    var contatosEl = $("#lista-contatos");
    limpar(contatosEl);
    (window.projeto.contatos || []).forEach(function (c) {
      var email = criar("a", { texto: c.email, attrs: { href: "mailto:" + c.email } });
      contatosEl.appendChild(criar("li", {}, [
        criar("strong", { texto: c.nome }),
        criar("span", { texto: c.cargo + " — " }),
        email
      ]));
    });
  }

  // -------------------------------------------------------------- rodapé
  function renderRodape() {
    var r = window.projeto.rodape;
    $("#rodape-instituto").textContent = r.nomeInstituto;
    $("#rodape-diretoria").textContent = r.diretoriaResponsavel;
    $("#rodape-atualizacao").textContent = "Última atualização desta página: " + texto(window.projeto.meta.ultimaAtualizacao);
    $("#rodape-aviso").textContent = r.avisoAtualizacao;

    var links = [
      { rotulo: "Site institucional do IRM", url: r.linkSitePrincipal },
      { rotulo: "Política de privacidade", url: r.linkPrivacidade },
      { rotulo: "Acessibilidade", url: r.linkAcessibilidade },
      { rotulo: "Fale com o GT Projeto Iguaçu", url: "mailto:" + r.canalInstitucional }
    ];

    var listaEl = $("#rodape-links");
    limpar(listaEl);
    links.forEach(function (l) {
      var urlLimpa = (l.url || "").trim();
      var conteudo = urlLimpa !== ""
        ? criar("a", { texto: l.rotulo, attrs: { href: urlLimpa } })
        : criar("span", { texto: l.rotulo + " (link a inserir)" });
      listaEl.appendChild(criar("li", {}, [conteudo]));
    });
  }

  // ---------------------------------------------------------------- modal
  var elementoAnterior = null;

  function abrirModal(id, botaoOrigem) {
    var item = window.projeto.intervencoes.filter(function (i) { return i.id === id; })[0];
    if (!item) return;

    elementoAnterior = botaoOrigem || document.activeElement;

    $("#modal-titulo").textContent = item.nomeProjeto;

    var detalhes = $("#modal-detalhes");
    limpar(detalhes);

    detalhes.appendChild(linhaDefinicao("Descrição", item.descricao));
    detalhes.appendChild(linhaDefinicao("Município", nomeMunicipio(item.municipioId)));
    detalhes.appendChild(linhaDefinicao("Rio", item.rio));
    detalhes.appendChild(linhaDefinicao("Localização", item.localizacaoTexto));
    detalhes.appendChild(linhaDefinicao("Órgão responsável", item.orgaoResponsavel));
    detalhes.appendChild(linhaDefinicao("Empresa contratada", item.empresaContratada));
    detalhes.appendChild(linhaDefinicao("Contrato", item.contrato));
    detalhes.appendChild(linhaDefinicao("Valor contratado", item.valorContrato));
    detalhes.appendChild(linhaDefinicao("Fonte do recurso", item.fonteRecurso));
    detalhes.appendChild(linhaDefinicao("Fase", item.fase));

    var linhaSituacao = criar("div", {}, [
      criar("dt", { texto: "Situação" }),
      criar("dd", {}, [criar("span", { classe: classeEtiqueta(item.situacao), texto: item.situacao })])
    ]);
    detalhes.appendChild(linhaSituacao);

    detalhes.appendChild(linhaDefinicao("Execução física", typeof item.execucaoFisica === "number" ? item.execucaoFisica + "%" : item.execucaoFisica));
    detalhes.appendChild(linhaDefinicao("Execução financeira", typeof item.execucaoFinanceira === "number" ? item.execucaoFinanceira + "%" : item.execucaoFinanceira));
    detalhes.appendChild(linhaDefinicao("Data de início prevista/vigência", item.dataInicioVigencia));
    detalhes.appendChild(linhaDefinicao("Data prevista de conclusão", item.dataPrevista));
    detalhes.appendChild(linhaDefinicao("Data atualizada de conclusão", item.dataAtualizada));
    detalhes.appendChild(linhaDefinicao("Motivo de atraso/paralisação", item.motivoAtrasoParalisacao));
    detalhes.appendChild(linhaDefinicao("Próximo marco", item.proximoMarco));
    detalhes.appendChild(linhaDefinicao("Data da informação", item.dataInformacao));
    detalhes.appendChild(linhaDefinicao("Fonte", item.fonte));

    var linhaDocumento = criar("div", {}, [criar("dt", { texto: "Link para documento público" })]);
    linhaDocumento.appendChild(linkOuTexto(item.linkDocumento, "Acessar documento"));
    detalhes.appendChild(linhaDocumento);

    if (item.demonstrativo) {
      detalhes.appendChild(criar("div", {}, [
        criar("dt", { texto: "Aviso" }),
        criar("dd", { texto: "Registro demonstrativo — não representa informação oficial." })
      ]));
    }

    var fundo = $("#modal-fundo");
    fundo.hidden = false;
    document.body.style.overflow = "hidden";
    $("#modal-intervencao").focus();
    document.addEventListener("keydown", aoTeclarNoModal);
  }

  function fecharModal() {
    var fundo = $("#modal-fundo");
    fundo.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", aoTeclarNoModal);
    if (elementoAnterior && typeof elementoAnterior.focus === "function") {
      elementoAnterior.focus();
    }
  }

  function aoTeclarNoModal(evento) {
    if (evento.key === "Escape") {
      fecharModal();
      return;
    }
    if (evento.key === "Tab") {
      var focaveis = $all('#modal-intervencao button, #modal-intervencao a[href]');
      if (focaveis.length === 0) return;
      var primeiro = focaveis[0];
      var ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  }

  function configurarModal() {
    $("#modal-fechar").addEventListener("click", fecharModal);
    $("#modal-fundo").addEventListener("click", function (evento) {
      if (evento.target === $("#modal-fundo")) fecharModal();
    });
  }

  // ------------------------------------------------- altura do cabeçalho
  // O cabeçalho é fixo (sticky) e sua altura varia (desktop, mobile, menu
  // aberto/fechado, textos maiores). Medimos a altura real e guardamos em
  // uma variável CSS, para que os links do menu ("#sobre", "#indicadores"
  // etc.) parem exatamente abaixo do cabeçalho, sem ficar escondidos atrás
  // dele nem deixar um espaço grande demais.
  function ajustarAlturaCabecalho() {
    var header = $(".site-header");
    if (!header) return;
    document.documentElement.style.setProperty("--altura-cabecalho", header.offsetHeight + "px");
  }

  function configurarAlturaCabecalho() {
    ajustarAlturaCabecalho();
    var pendente;
    window.addEventListener("resize", function () {
      clearTimeout(pendente);
      pendente = setTimeout(ajustarAlturaCabecalho, 150);
    });
    if (window.ResizeObserver) {
      new ResizeObserver(ajustarAlturaCabecalho).observe($(".site-header"));
    }
  }

  // ---------------------------------------------------- voltar ao topo
  function preferemReduzirMovimento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function configurarBotaoTopo() {
    var botao = $("#botao-topo");
    if (!botao) return;
    var visivel = false;
    function atualizar() {
      var deveMostrar = window.scrollY > 500;
      if (deveMostrar !== visivel) {
        visivel = deveMostrar;
        botao.hidden = !visivel;
      }
    }
    window.addEventListener("scroll", atualizar, { passive: true });
    atualizar();
    botao.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: preferemReduzirMovimento() ? "auto" : "smooth" });
      $("#hero-titulo").focus({ preventScroll: true });
    });
  }

  // ------------------------------------------- destaque do menu ativo
  function configurarDestaqueNavegacao() {
    var links = $all('#nav-principal a[href^="#"]');
    var mapa = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var alvo = document.getElementById(id);
      if (alvo) mapa[id] = link;
    });
    if (!window.IntersectionObserver || Object.keys(mapa).length === 0) return;

    var header = $(".site-header");
    var margemTopo = (header ? header.offsetHeight : 150) + 10;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = mapa[entry.target.id];
        if (!link) return;
        links.forEach(function (l) {
          l.classList.remove("ativo");
          l.removeAttribute("aria-current");
        });
        link.classList.add("ativo");
        link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-" + margemTopo + "px 0px -60% 0px", threshold: 0 });

    Object.keys(mapa).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  // --------------------------------------------------------- menu mobile
  function configurarMenuMobile() {
    var botao = $("#nav-toggle");
    var nav = $("#nav-principal");

    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    $all("#nav-principal a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
      });
    });
  }

  // -------------------------------------------------------------- início
  function iniciar() {
    if (!window.projeto) {
      console.error("Dados do projeto não encontrados. Verifique se js/dados.js foi carregado antes de js/main.js.");
      return;
    }
    renderCabecalho();
    renderHero();
    renderSobre();
    renderSituacaoAtual();
    renderIndicadores();
    configurarFiltros();
    renderTerritorio();
    renderLinhaDoTempo();
    renderDocumentos();
    renderTransparencia();
    renderRodape();
    configurarModal();
    configurarMenuMobile();
    configurarAlturaCabecalho();
    configurarBotaoTopo();
    configurarDestaqueNavegacao();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
