# Projeto Iguaçu — webapp (React + TypeScript + Vite + Tailwind)

Reconstrução do protótipo estático (`../index.html`, `../css/`, `../js/`) como
webapp multi-página, na mesma stack e com o mesmo nível de recurso do
PMetGIRS (`Residuos/app`): gráficos, exportação de dados em CSV/PDF, VLibras,
badges de situação e testes automatizados.

## Como rodar

Requer **Node 24** — a mesma versão do CI, e a que traz o npm 11 que gerou o
`package-lock.json`.

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run lint      # ESLint (react-hooks é a razão de ele existir)
npm run test      # suíte de testes em jsdom (Vitest)
npm run test:e2e  # ponta a ponta, num Chromium de verdade (Playwright)
npm run build     # build de produção (tsc + vite build)
```

Na primeira vez, `npm run test:e2e` precisa do navegador:
`npx playwright install chromium`. Ele sobe o `vite preview` sozinho — é o
build de produção que fica sob teste, não o `dev`.

### Duas suítes, e por quê

São duas porque medem coisas diferentes, e cada uma é cega para a metade da
outra:

| | `npm run test` (Vitest, jsdom) | `npm run test:e2e` (Playwright, Chromium) |
|---|---|---|
| Onde roda | sem layout nem pintura | navegador de verdade |
| Cobre | estrutura, ARIA, nomes acessíveis, ordem de títulos, dados | contraste de cor, alvo de toque, gráficos desenhados, teclado ponta a ponta |
| Não alcança | tudo que depende de geometria ou de cor pintada | o detalhe de dado, que ali seria lento demais |
| Quanto leva | ~5s | ~1min, incluindo o build |

Verde nas duas ainda não quer dizer "portal acessível": falta leitor de tela
de verdade (NVDA/VoiceOver) e aparelho de toque na mão. Quer dizer que não
houve regressão no que dá para automatizar.

### Desempenho

`npm run test:e2e` termina medindo as metas da §13 do escopo — **LCP ≤ 2,5 s e
CLS ≤ 0,1** — num perfil de 4G lento com a CPU quatro vezes mais devagar, que é
o celular modesto de quem consulta o portal, não a máquina de quem programa.
Junto vai um **orçamento de JavaScript por rota**: é ele que reprova quando uma
biblioteca pesada entra sem ninguém notar, porque byte não varia com a máquina
e tempo varia.

Essa parte roda com um worker só, num projeto separado do Playwright. Com dois
workers, os dois freando rede e CPU na mesma máquina, o LCP medido saltou de
1,5 s para 3,1 s — número da disputa entre os testes, não do portal.

### Lint

O `tsc` já roda em modo estrito e pega tipo errado. O ESLint entrou pelo que ele
não pega, que é a classe de erro que mais custou tempo aqui: efeito de React com
dependência faltando, `setState` dentro de efeito, componente criado durante o
render. Na primeira execução acusou cinco erros reais, todos corrigidos.

## Estrutura

- `src/data/*.json` — todo o conteúdo editável, transcrito 1:1 de
  `../js/dados.js` (nada foi inventado; dados demonstrativos continuam
  marcados com `demonstrativo: true`, campos sem informação oficial mostram
  "Não informado", "A confirmar", "Dado em validação" ou ficam com `url: ""`
  para virar "Link a inserir" na tela).
- `src/types/index.ts` — tipos TypeScript para cada bloco de dados.
- `src/routes.tsx` — registro central das 7 rotas (Início, Situação atual,
  Indicadores, Intervenções, Linha do tempo, Documentos, Transparência).
- `src/components/ui/SituacaoBadge.tsx` — as 8 situações possíveis, com cor,
  ícone e rótulo; a mesma cor de cada situação é reaproveitada nos gráficos.
- `src/components/charts/` — gráficos de distribuição (situação e município)
  em Recharts, com paleta validada pela skill de dataviz.
- `src/lib/download.ts` — exportação de dados em CSV e PDF (jsPDF carregado
  sob demanda, só quando alguém clica em "PDF").
- `scripts/generate-dados.js` — monta `public/dados.json`, o arquivo de dados
  abertos: os projetos, os municípios, as fontes, as datas e o dicionário de
  campos. Gerado no `dev` e no `build`, **nunca editado a mão**.

## Rodada de atualização

Cada rodada do GT vira um commit. Antes de editar os dados da rodada nova,
**arquive a rodada vigente** — é dela que sai a comparação "o que mudou", na
página de Transparência:

1. Copie o conteúdo de `src/data/intervencoes.json` para uma nova entrada **no
   topo** de `src/data/rodadasAnteriores.json`:

   ```json
   {
     "referencia": "06/08/2026",
     "rotulo": "Consolidação de 06/08/2026",
     "fonte": "Página oficial do Projeto Iguaçu — IRM (rj.gov.br/irm/node/387)",
     "projetos": [ ...o conteúdo de intervencoes.json... ]
   }
   ```

   O `referencia` é a data da rodada que está saindo de cartaz, não a nova.

2. Só então edite `src/data/intervencoes.json` com os dados da rodada nova.
3. Atualize `src/data/meta.json` (`ultimaAtualizacao`, `dataReferencia`,
   `proximaAtualizacao`) e acrescente a nota editorial em
   `src/data/changelog.json`.
   Se algum **campo** entrou ou saiu dos projetos, atualize também
   `src/data/dicionarioCampos.json` — há teste que falha se o dicionário e os
   dados divergirem, porque é ele que o `/dados.json` publica como descrição
   oficial de cada campo.
4. `npm run build` (ou `node scripts/generate-dados.js`) para regerar
   `public/dados.json`, e commite o arquivo regerado.
5. `npm run test`. Dois testes existem justamente para pegar o que passa
   despercebido: um falha se a rodada arquivada tiver a data de referência da
   rodada corrente (arquivamento trocado ou esquecido), outro falha se o
   `public/dados.json` commitado estiver defasado em relação aos dados.

Pular o passo 1 não quebra o build: a seção de comparação simplesmente não
tem o que mostrar, em silêncio. Por isso ele vem primeiro.

## Publicação

O CI publica no Firebase Hosting a cada push no `master`, depois de tipos,
testes e build passarem — mas **só quando o secret existir**. Enquanto não
existir, o job de deploy é *pulado* (não falha) e a publicação segue manual:

```sh
cd app && npm run build
cd .. && firebase deploy --only hosting --project carrinho-virtual-iw-48fc7
```

Para ligar a publicação automática, alguém com acesso ao projeto Firebase
precisa criar o secret `FIREBASE_SERVICE_ACCOUNT` no repositório:

1. No console do Firebase → Configurações do projeto → Contas de serviço →
   **Gerar nova chave privada**. Baixa um JSON.
2. No GitHub → Settings → Secrets and variables → Actions → **New repository
   secret**, com o nome `FIREBASE_SERVICE_ACCOUNT` e o **conteúdo inteiro do
   JSON** como valor.
3. Apagar o JSON baixado da máquina. Ele dá acesso de publicação ao projeto.

O `projectId` (`carrinho-virtual-iw-48fc7`) está fixo no workflow: é o ID
permanente do projeto no Google Cloud, não muda.

## Pendências de dados oficiais

As mesmas pendências do protótipo estático continuam valendo — ver
`../PENDENCIAS.md` na raiz do projeto.
