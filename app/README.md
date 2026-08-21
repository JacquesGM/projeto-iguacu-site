# Projeto Iguaçu — webapp (React + TypeScript + Vite + Tailwind)

Reconstrução do protótipo estático (`../index.html`, `../css/`, `../js/`) como
webapp multi-página, na mesma stack e com o mesmo nível de recurso do
PMetGIRS (`Residuos/app`): gráficos, exportação de dados em CSV/PDF, VLibras,
badges de situação e testes automatizados.

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run test     # suíte de testes (Vitest)
npm run build    # build de produção (tsc + vite build)
```

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
4. `npm run test` — há um teste que falha se a rodada arquivada tiver a mesma
   data de referência da rodada corrente, que é o sintoma de arquivamento
   trocado ou esquecido.

Pular o passo 1 não quebra o build: a seção de comparação simplesmente não
tem o que mostrar, em silêncio. Por isso ele vem primeiro.

## Pendências de dados oficiais

As mesmas pendências do protótipo estático continuam valendo — ver
`../PENDENCIAS.md` na raiz do projeto.
