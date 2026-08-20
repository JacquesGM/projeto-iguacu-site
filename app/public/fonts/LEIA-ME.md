# Rawline — auto-hospedagem da tipografia

A **Rawline** é a tipografia do Padrão Digital de Governo (gov.br), adotada para
que o cidadão reconheça um produto de governo. Licença **SIL Open Font License
1.1**, que permite auto-hospedar e redistribuir desde que o arquivo de licença
acompanhe os binários.

**Situação: os arquivos ainda não estão aqui.** O `tailwind.config.ts` já declara
`Rawline` como primeira opção da pilha; enquanto os arquivos não existirem, o
navegador segue para a fonte de interface do sistema, sem erro e sem requisição
perdida — não há `@font-face` apontando para arquivo inexistente.

## Por que não foram baixados automaticamente

O CDN oficial (`cdngovbr-ds.estaleiro.serpro.gov.br`) está inacessível a partir
do ambiente de desenvolvimento: o domínio resolve, mas a conexão não completa.
Não existe pacote `rawline` nem `@fontsource/rawline` no npm, e o repositório
oficial do design system não versiona os binários.

Baixar de sites genéricos de "free fonts" foi descartado de propósito: para um
portal público do Estado, binário de origem não verificável é risco de cadeia de
suprimentos.

## Como concluir

1. Baixe a Rawline da distribuição oficial do Padrão Digital de Governo:
   <https://www.gov.br/ds/fundamentos-visuais/tipografia> ou
   <https://cdngovbr-ds.estaleiro.serpro.gov.br/design-system/fonts/rawline/css/rawline.css>
   (o CSS lista as URLs dos arquivos).

2. Coloque nesta pasta os `.woff2` dos quatro pesos que o portal usa, com estes
   nomes exatos:

   ```
   app/public/fonts/rawline-400.woff2   (regular)
   app/public/fonts/rawline-500.woff2   (medium)
   app/public/fonts/rawline-600.woff2   (semibold)
   app/public/fonts/rawline-700.woff2   (bold)
   ```

   O portal também usa `font-extrabold` (800) no hero e nos números grandes. Sem
   o arquivo 800, o navegador sintetiza a partir do 700 — aceitável. Se quiser
   fidelidade, acrescente `rawline-800.woff2` e mais um bloco no CSS.

3. Copie o arquivo de licença da fonte para `app/public/fonts/OFL.txt`. A SIL OFL
   exige que ele acompanhe a redistribuição.

4. Cole no topo de `app/src/index.css`:

   ```css
   /* Rawline — Padrão Digital de Governo, SIL OFL 1.1. Ver public/fonts/OFL.txt.
      font-display: swap evita texto invisível enquanto a fonte carrega. */
   @font-face {
     font-family: 'Rawline';
     src: url('/fonts/rawline-400.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   @font-face {
     font-family: 'Rawline';
     src: url('/fonts/rawline-500.woff2') format('woff2');
     font-weight: 500;
     font-style: normal;
     font-display: swap;
   }
   @font-face {
     font-family: 'Rawline';
     src: url('/fonts/rawline-600.woff2') format('woff2');
     font-weight: 600;
     font-style: normal;
     font-display: swap;
   }
   @font-face {
     font-family: 'Rawline';
     src: url('/fonts/rawline-700.woff2') format('woff2');
     font-weight: 700;
     font-style: normal;
     font-display: swap;
   }
   ```

5. Em `app/index.html`, dentro do `<head>`, pré-carregue apenas o peso do texto
   corrido — pré-carregar todos atrasa a renderização em vez de acelerá-la:

   ```html
   <link rel="preload" href="/fonts/rawline-400.woff2" as="font" type="font/woff2" crossorigin />
   ```

6. `npm run build` e publique. Confira no navegador, na aba Rede, que os
   `.woff2` retornam 200 e que nenhuma requisição sai para domínio externo.

## O que já está pronto

- A **CSP** do `firebase.json` usa `font-src 'self' data:`, então fonte
  auto-hospedada funciona e fonte de terceiro é bloqueada — que é o
  comportamento desejado.
- A **política de cache** já trata `/assets/**` como imutável. Arquivos em
  `public/fonts/` são servidos da raiz e recebem a regra geral (`no-cache`); se
  quiser cache longo para as fontes, acrescente uma regra `/fonts/**` com
  `max-age=31536000, immutable` no `firebase.json` — o nome do arquivo não tem
  hash, então troque o nome ao trocar a versão da fonte.
- A **pilha de fallback** já está correta em `tailwind.config.ts`: `Rawline`,
  depois `system-ui` e as fontes nativas de cada sistema.
