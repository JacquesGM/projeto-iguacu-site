# Acompanhamento do Projeto Iguaçu — página institucional (protótipo)

Página institucional estática para apresentar publicamente o acompanhamento
do Projeto Iguaçu pelo Instituto Rio Metrópole (IRM). Feita em HTML, CSS e
JavaScript puro — sem banco de dados, sem login, sem servidor próprio.

> **Nova versão em desenvolvimento**: a pasta [`app/`](app/) contém uma
> reconstrução completa desta página como webapp React + TypeScript + Vite +
> Tailwind (mesma stack e mesmo nível de recurso do PMetGIRS —
> `Residuos/app`), com gráficos, exportação de dados em CSV/PDF, VLibras e
> testes automatizados. Este protótipo estático continua aqui como registro;
> veja `app/README.md` para instruções de execução da nova versão.

## Estrutura de diretórios

```
Site/
├── index.html                 → estrutura da página (não editar dados aqui)
├── css/
│   └── styles.css             → aparência visual
├── js/
│   ├── dados.js                → ⭐ ARQUIVO QUE VOCÊ EDITA para atualizar a página
│   └── main.js                 → lógica de exibição (não precisa editar)
├── assets/img/                 → imagens e ilustrações locais (placeholders)
├── README.md                   → este arquivo
├── PENDENCIAS.md                → lista de informações oficiais ainda a confirmar
└── CHECKLIST.md                 → checklist antes de publicar
```

Também existe a pasta `Docs/`, com o `Guia_Melhores_Praticas_UI_UX_Projeto_Iguacu.docx` — um guia de
referência de UI/UX do IRM para esta página, usado para orientar decisões
de design (ex.: cores por situação, navegação, acessibilidade, desempenho).
As decisões tomadas com base nele estão registradas neste README, no
`CHECKLIST.md` e comentadas em `js/dados.js` e `css/styles.css`.

## Como abrir e testar

Basta abrir o arquivo `index.html` duas vezes clicando nele — ele funciona
diretamente no navegador, sem precisar de instalação, servidor ou internet
(exceto para abrir links externos, como o SIGA Águas).

## Como atualizar o conteúdo (para a equipe de Comunicação)

**Você só precisa editar um arquivo: `js/dados.js`.**

Abra-o em qualquer editor de texto (Bloco de Notas, VS Code, etc.). Ele é
dividido em blocos numerados e comentados, cada um responsável por uma parte
da página (ex.: bloco 6 = indicadores, bloco 8 = intervenções). Cada bloco
tem instruções escritas em português no próprio arquivo.

### Alterar a data global de atualização
No bloco **1. DADOS GLOBAIS**, altere `ultimaAtualizacao` e `dataReferencia`.

### Adicionar uma nova intervenção
No bloco **8. INTERVENÇÕES**:
1. Copie um objeto inteiro (do `{` ao `}`, incluindo a vírgula depois);
2. Cole antes do colchete `]` que fecha a lista;
3. Troque o `id` para um valor novo e único (ex.: `"i8"`);
4. Preencha os campos com os dados reais recebidos do órgão responsável;
5. Campos sem informação: escreva `"Não informado"` (nunca deixe em branco);
6. Apague a linha `demonstrativo: true` quando o dado deixar de ser fictício.

O campo `situacao` deve ser exatamente um destes textos (para as etiquetas e
os filtros funcionarem corretamente):
`"Em planejamento"`, `"Em licitação"`, `"Em execução"`, `"Concluída"`,
`"Atrasada"`, `"Paralisada"`, `"Aguardando informação"`, `"Aguardando validação"`.

### Atualizar indicadores
Os contadores (municípios, intervenções por fase/situação) são calculados
**automaticamente** a partir da lista de intervenções — não precisam ser
editados à mão. Apenas os campos `investimentoPrevisto` e
`populacaoBeneficiadaEstimada`, no bloco **6. INDICADORES**, são digitados
manualmente.

### Adicionar um documento
No bloco **10. DOCUMENTOS E LINKS**, copie um item e preencha `titulo`,
`tipo`, `data`, `orgao`, `descricao`, `formato` e `url`. Se ainda não houver
link oficial, deixe `url: ""` — a página mostrará "Link a inserir"
automaticamente.

### Adicionar um marco na linha do tempo
No bloco **9. LINHA DO TEMPO**, copie um item e preencha `data`, `titulo`,
`descricao`, `categoria` e `fonte`. Se a data ainda não for oficial, use
`confirmado: false`.

### Trocar o logotipo
Quando o logotipo oficial do IRM for fornecido, salve o arquivo de imagem em
`assets/img/` e troque o valor de `logoUrl` no bloco **2. IDENTIDADE**.

## Como incorporar ao site institucional atual

Esta página foi feita para não depender de nenhuma tecnologia específica,
então há três formas de incorporação, dependendo do que a equipe que cuida
do site atual preferir:

1. **Página independente vinculada por link/menu** — publicar os arquivos
   desta pasta em um subdiretório do site atual (ex.: `/projeto-iguacu/`) e
   adicionar um link para ela no menu do site institucional. É a forma mais
   simples e com menor risco de conflito com o site existente.
2. **Incorporação via `<iframe>`** — criar uma página no site atual com um
   `<iframe>` apontando para o endereço onde `index.html` for publicado.
3. **Cópia de seções para o CMS atual** — se o site institucional usa um
   sistema de gerenciamento de conteúdo (CMS) próprio, as seções de
   `index.html` podem ser copiadas para dentro dos templates existentes,
   reaproveitando `css/styles.css` e `js/` como estão. Nesse caso, adapte os
   nomes de classes CSS caso haja conflito com estilos já existentes no CMS.

Em qualquer um dos três casos, **não é necessário nenhum banco de dados ou
painel administrativo** — a atualização continua sendo feita editando
`js/dados.js`.

## Fontes do conteúdo institucional já preenchido

O histórico (linha do tempo), a base legal, a estrutura do Grupo de
Trabalho (GT) e os contatos institucionais já estão preenchidos com base na
apresentação institucional do GT Projeto Iguaçu (reunião de 25/06/2026). Os
dados específicos de cada obra (empresa contratada, valores de contrato,
percentuais de execução) são **demonstrativos**, aguardando o envio oficial
pelos órgãos executores — ver `PENDENCIAS.md`.

O logotipo do cabeçalho/rodapé foi obtido do site oficial do IRM
(www.rj.gov.br/irm). A fotografia do rio e o mapa de localização da Baixada
Fluminense usados na página são imagens reais e de uso livre (Wikimedia
Commons, com crédito visível na própria página) — ver a tabela de créditos
em `PENDENCIAS.md`.

## Decisões de UI/UX baseadas no Guia (Docs/Guia_Melhores_Praticas_UI_UX_Projeto_Iguacu.docx)

- **Cores por situação**: a paleta das etiquetas (`css/styles.css`, classes
  `.etiqueta--*`) segue a tabela do guia — Concluída (verde), Em execução
  (azul), Em planejamento (cinza-azulado), Em licitação (roxo), Atrasada
  (laranja), Paralisada (vermelho), Aguardando validação (amarelo). Todas
  verificadas com contraste mínimo AA. A situação nunca é comunicada só por
  cor — o texto sempre acompanha.
- **Novo estado "Atrasada"**: adicionado ao modelo de dados (distinto de
  "Paralisada") para diferenciar obras em execução fora do cronograma de
  obras totalmente interrompidas.
- **Navegação**: botão "Voltar ao topo" (aparece ao rolar) e destaque
  automático do item de menu correspondente à seção visível.
- **Ordenação de tabela**: os cabeçalhos da tabela de intervenções são
  clicáveis para ordenar por qualquer coluna.
- **Glossário**: seção "Glossário de siglas e termos técnicos" em
  Transparência, explicando IRM, GT, INEA, PAC, PEDUI, DIRSMI, SEI, SIGA
  Águas, execução física/financeira e a diferença entre valor previsto,
  contratado, empenhado e pago.
- **Desempenho**: imagens fotográficas comprimidas/redimensionadas
  (fotografia do rio: -72% de tamanho) e carregamento adiado (`loading="lazy"`)
  na imagem abaixo da dobra.
- **Resiliência sem JavaScript**: título, subtítulo e nome da marca no
  cabeçalho têm texto estático de reserva no HTML (sobrescrito pelo
  JavaScript quando ele carrega), e um aviso `<noscript>` informa que a
  maior parte do conteúdo depende de JavaScript, com um canal de contato
  alternativo.

## Acessibilidade e desempenho

- HTML semântico, hierarquia de títulos, navegação por teclado e foco
  visível já implementados;
- link "Pular para o conteúdo" no topo da página;
- tabela de intervenções vira lista de cartões no celular, com alvos de
  toque de pelo menos 44px nos controles principais;
- nenhuma biblioteca externa é carregada — a página funciona offline após
  copiada para uma pasta local;
- respeita a preferência do sistema por "redução de movimento".
