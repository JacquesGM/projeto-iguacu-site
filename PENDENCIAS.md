# Informações oficiais pendentes de confirmação

Esta lista reúne tudo que precisa ser fornecido ou validado por quem de
direito antes desta página deixar de ser um protótipo e passar a apresentar
apenas informação oficial. Nada nesta lista foi inventado — onde a
informação não estava disponível nos documentos de referência, o campo
correspondente na página mostra "Não informado", "A confirmar" ou
"Link a inserir".

> **Atualização (20/08/2026 — escopo reduzido)**: o conteúdo público do `app/`
> passou a ser **exclusivamente os 14 projetos publicados na página oficial do
> Projeto Iguaçu** (<https://www.rj.gov.br/irm/node/387>, consolidação de
> 06/08/2026), que é agora a única fonte do dado publicado. Os 11 registros da
> extração BI/INFOVIA de 23/07/2026 saíram do ar e ficam preservados como
> registro de origem. Pendências e divergências detalhadas em
> `Docs/Modelo novo/ESCOPO_REDUZIDO_2026-08-20.md`; o escopo do produto está no
> `Prompt_Mestre_Atualizacao_Portal_Projeto_Iguacu_v2.1`, na mesma pasta.
>
> Continuam pendentes, agora para os 14 projetos: percentual de avanço, valor
> executado e valor pago (a fonte não informa nenhum dos três); coordenadas de 6
> projetos; processo SEI de 4 projetos; término de vigência de Calombé e
> Roncador; e a ficha original de Mesquita.
>
> **Acrescentado em 21/08/2026 — licença de uso dos dados abertos.** O portal
> passou a publicar `/dados.json` com os 14 projetos e um dicionário de campos.
> A fonte **não declara licença de uso** para esses dados. Nenhuma foi
> inventada: o arquivo traz `licencaDeclarada: null` e uma observação dizendo
> que são dados públicos, que se cite fonte e data de referência, e a quem
> perguntar em caso de dúvida sobre redistribuição. Confirmar com o GT qual
> licença adotar — CC-BY 4.0 é a usual em dados abertos de governo, mas isso é
> decisão do IRM, não nossa.

> **Atualização (dados reais recebidos)**: com o recebimento de
> `Docs/Dados_BI.xlsx` (extração BI/INFOVIA do IRM, referência de
> 23/07/2026), a versão em `app/` já substituiu as 8 intervenções
> demonstrativas por **11 intervenções reais** (nome, órgão, empresa,
> processo SEI, valor de contrato, situação, datas de vigência e
> coordenadas). Isso resolve a maior parte da seção "Intervenções (obras)"
> abaixo e parte de "Indicadores" — ver `app/src/data/intervencoes.json`.
> Seguem pendentes: percentual de execução física/financeira, motivo de
> atraso/paralisação e próximo marco (não constam na extração recebida);
> população estimada beneficiada; e a divergência de valor/situação entre
> INEA e SEAS para o projeto guarda-chuva do Rio Iguaçu, sinalizada na
> página em vez de resolvida silenciosamente.

## Siglas dos órgãos executores

- [ ] **O que significa "PCNI – SEMIF"?** A página oficial do IRM traz apenas a
      sigla, sem expansão, como órgão responsável pela execução dos reservatórios
      de amortecimento de cheias em Nova Iguaçu. Duas coisas dependem disso:
      - **PCNI** foi expandido para "Prefeitura da Cidade de Nova Iguaçu" em
        `app/src/data/sobreProjeto.json` (lista de órgãos participantes). Essa
        expansão é **dedução**, não consta da fonte — confirmar com o GT ou
        corrigir para a sigla pura.
      - **SEMIF** não foi expandido em lugar nenhum, por não haver fonte. Sem
        essa confirmação, o glossário da página de Transparência não ganha
        verbete para o órgão, embora ele execute um dos 14 projetos.
- [x] EMOP — verbete acrescentado ao glossário, com o nome por extenso declarado
      na consolidação do IRM e a ressalva de que o projeto de pontes aguarda
      manifestação da própria empresa.

## Identidade visual
- [x] Logotipo oficial do IRM — já inserido (`Docs/Modelo antigo/prototipo-estatico/assets/img/logo-irm-branca-horizontal.png`
      e `Docs/Modelo antigo/prototipo-estatico/assets/img/logo-governo-rj.png`), obtido em www.rj.gov.br/irm em 31/07/2026.
- [ ] Confirmar com o IRM se este é o arquivo/versão mais atual da marca, e se
      existe um arquivo vetorial (.svg/.eps) de maior qualidade a fornecer.
- [ ] Manual de identidade visual/marca, se existir, para ajustar cores,
      tipografia e espaçamentos ao padrão oficial com mais precisão.
- [x] Imagem para a seção de abertura — já inserida uma fotografia real do
      rio Iguaçu (`Docs/Modelo antigo/prototipo-estatico/assets/img/rio-iguacu-nascente.jpg`, Gerson Tavares, CC BY 2.0,
      via Wikimedia Commons). É uma imagem ilustrativa do rio, não de uma obra
      específica; substituir por foto institucional oficial do IRM, se houver.

## Endereços e links institucionais
- [x] URL do site institucional do IRM confirmada: https://www.rj.gov.br/irm
      (já preenchida em `identidade.siteInstitucionalUrl` e
      `rodape.linkSitePrincipal` em `Docs/Modelo antigo/prototipo-estatico/js/dados.js` (arquivado)).
- [ ] URL da política de privacidade do IRM (`rodape.linkPrivacidade`).
- [ ] URL da página de acessibilidade do IRM (`rodape.linkAcessibilidade`).
- [ ] URL canônica definitiva desta página, para a tag `<link rel="canonical">`
      em `app/index.html`, quando esta página tiver um endereço público definitivo.

## Município e território
- [ ] Lista oficial e definitiva dos municípios contemplados nesta fase do
      Projeto Iguaçu (o protótipo estático mantém 3 municípios demonstrativos
      em `Docs/Modelo antigo/prototipo-estatico/js/dados.js` (arquivado), bloco 7; a versão `app/` já mostra Duque de Caxias,
      Belford Roxo e Nilópolis com intervenção real registrada — Nova Iguaçu
      segue sem intervenção na extração recebida, apesar de dar nome ao
      projeto).
- [x] Mapa de localização geral da Baixada Fluminense já inserido
      (`Docs/Modelo antigo/prototipo-estatico/assets/img/mapa-baixada-fluminense.png`, Alvoradaking, CC BY-SA 4.0,
      via Wikimedia Commons) — é apenas um mapa de referência da região, não
      um mapa oficial das intervenções.
- [ ] Mapa oficial do território com a localização de cada intervenção, ou a
      camada georreferenciada do SIGA Águas, quando estiver disponível
      publicamente.

## Intervenções (obras)
As 8 intervenções em `Docs/Modelo antigo/prototipo-estatico/js/dados.js` (arquivado) (bloco 8, protótipo estático) continuam
**demonstrativas** (`demonstrativo: true`) — não foram alteradas. Na versão
`app/`, foram substituídas por 11 intervenções reais (`intervencoes.json`):
- [x] Nome do projeto (objeto), tipo, programa e processo SEI de cada obra;
- [x] Empresa contratada e valor do contrato;
- [x] Datas de início e término de vigência e prazo contratual (quando
      informadas na extração — vários registros têm essas datas em branco
      na própria fonte, mantidas como "Não informado");
- [ ] Percentual de execução física e financeira — não consta na extração
      BI/INFOVIA recebida.
- [x] Latitude e longitude de cada intervenção.
- [ ] Motivo de eventual atraso ou paralisação — não consta na extração.
- [ ] Link para o documento público correspondente a cada obra.

## Indicadores
- [x] Investimento total previsto — na versão `app/`, calculado como a soma
      dos 9 contratos não disputados (R$ 350,1 milhões); o projeto
      guarda-chuva do Rio Iguaçu fica de fora da soma por ter valor
      divergente entre fontes (ver seção Intervenções).
- [ ] População estimada beneficiada (`indicadores.populacaoBeneficiadaEstimada`).

## Documentos
Os seguintes documentos estão referenciados na página (bloco 10 de
`Docs/Modelo antigo/prototipo-estatico/js/dados.js` (arquivado)), mas **sem link**, por não haver URL oficial disponível nos
materiais de referência consultados:
- [ ] Portaria IRM nº 195/2025;
- [ ] Plano Diretor da Bacia Iguaçu/Sarapuí (SEA/SERLA, 2007);
- [ ] Nota técnica INEA (2025);
- [ ] Matérias jornalísticas citadas como fonte (RioOnWatch, Diário do Rio,
      Diário do Estado);
- [ ] Apresentação institucional do GT Projeto Iguaçu (25/06/2026), caso vá
      ser disponibilizada publicamente.

> A URL do SIGA Águas já está confirmada e preenchida:
> https://sigaaguas.org.br/sigaweb/apps/baia-de-guanabara

## Créditos e licenças das imagens já inseridas
As imagens abaixo foram obtidas de fontes públicas e têm uso livre **desde
que mantido o crédito** (a página já exibe o crédito automaticamente onde
aplicável). Se forem substituídas por material oficial do IRM, os créditos
podem ser removidos.

| Arquivo | Fonte | Licença |
|---|---|---|
| `logo-irm-branca-horizontal.png`, `logo-governo-rj.png` | www.rj.gov.br/irm (site oficial) | Marca institucional do Governo do RJ/IRM |
| `rio-iguacu-nascente.jpg` | Gerson Tavares, Wikimedia Commons | CC BY 2.0 |
| `mapa-baixada-fluminense.png` | Alvoradaking, Wikimedia Commons | CC BY-SA 4.0 |

## Outras validações institucionais
- [ ] Confirmar se o nome correto da diretoria responsável é "Diretoria de
      Saneamento Metropolitano Integrado (DIRSMI)" ou "Diretoria de
      Saneamento Básico Integrado" — os dois nomes aparecem em contextos
      diferentes na apresentação institucional de referência.
- [ ] Confirmar se os contatos (Maria Clara Freitas Zopellari, Debora Toci
      Puccini e o e-mail geral `saneamento@irm.rj.gov.br`) podem ser
      publicados nesta página pública.
