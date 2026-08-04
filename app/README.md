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

## Pendências de dados oficiais

As mesmas pendências do protótipo estático continuam valendo — ver
`../PENDENCIAS.md` na raiz do projeto.
