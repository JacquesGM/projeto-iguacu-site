# Portal do Projeto Iguaçu — acompanhamento público

Portal de transparência das intervenções de controle de inundações e recuperação
ambiental das bacias dos rios Iguaçu, Botas e Sarapuí, na Baixada Fluminense,
consolidado pelo Instituto Rio Metrópole (IRM) no âmbito do GT IRM – Projeto
Iguaçu.

**Conteúdo publicado:** exclusivamente os **14 projetos declarados na página
oficial do IRM** (<https://www.rj.gov.br/irm/node/387>), consolidação de
06/08/2026, período de referência de 1º/01 a 23/07/2026. Próxima rodada de
atualização prevista pelo IRM: 08/10/2026.

## Estrutura de diretórios

```
Site/
├── app/                        → a aplicação (React + TypeScript + Vite)
│   ├── src/data/               → ⭐ os dados exibidos, em JSON
│   ├── src/components/         → componentes de interface
│   ├── src/pages/              → uma pasta por página do portal
│   └── README.md               → como rodar, testar e publicar
├── Docs/
│   ├── Modelo novo/            → escopo vigente e o prompt mestre v2.1
│   │   ├── Projetos_Portal_IRM_node387.json     ⭐ fonte de verdade dos 14 projetos
│   │   ├── ESCOPO_REDUZIDO_2026-08-20.md        reconciliação e pendências
│   │   └── Prompt_Mestre_..._v2.1.(md|docx)     escopo do produto
│   └── Modelo antigo/          → material de referência e histórico
│       ├── prototipo-estatico/ → 1ª versão em HTML puro, ARQUIVADA (dados fictícios)
│       ├── Guia_Melhores_Praticas_UI_UX_Projeto_Iguacu.docx
│       ├── Dados_BI.xlsx       → extração BI/INFOVIA de 23/07/2026 (registro de origem)
│       └── TextoSite/          → fichas e planilhas da rodada de agosto
├── PENDENCIAS.md               → o que ainda depende de validação humana
├── CHECKLIST.md                → verificações antes de publicar
└── .github/workflows/ci.yml    → tipos, testes e build a cada push
```

> **Atenção:** `Docs/Modelo antigo/prototipo-estatico/` contém a primeira versão
> do site, com **8 intervenções fictícias**. Ela está arquivada e **não deve ser
> publicada**. Ver o `LEIA-ME.md` dentro daquela pasta.

## Como rodar

```sh
cd app
npm ci
npm run dev      # servidor local
npm test         # 26 testes de integridade dos dados e de rotas
npm run build    # build de produção em app/dist
```

## Como atualizar o conteúdo

Os dados ficam em `app/src/data/`, um arquivo JSON por assunto. Para a rodada de
atualização seguinte, o arquivo principal é **`app/src/data/intervencoes.json`**,
que carrega os 14 projetos.

Regras que valem para qualquer edição:

1. **Só entra o que a fonte declara.** Campo sem informação fica `null` e a
   interface mostra "Não informado". Nunca preencha por dedução.
2. **Data declarada como texto** ("Aguardando licitação", "Janeiro de 2027 (a
   confirmar)") vai no campo `...Texto`, com o campo normalizado em `null`.
3. **Situação** só aceita os cinco valores declarados pelos órgãos: `Em
   licitação`, `Em andamento`, `Conclusão em breve`, `Baixa de cláusula
   suspensiva` e `Aguardando manifestação`.
4. **Não some categorias diferentes.** O portal mostra valor de contrato; não
   existe valor executado nem pago, porque a fonte não os informa.
5. **Rode `npm test` antes de publicar.** A suíte trava a publicação se a
   contagem de projetos, a soma dos contratos, as coordenadas, a cronologia ou o
   vocabulário de situação divergirem da consolidação oficial.

Depois de mudar os dados, atualize também `app/src/data/meta.json` (datas) e
`app/src/data/changelog.json` (o que mudou nesta rodada).

## Fontes do conteúdo

- **Projetos, valores, situações e coordenadas:** página oficial do Projeto
  Iguaçu no site do IRM, alimentada pelos formulários padronizados de
  atualização de status preenchidos pelos próprios órgãos executores.
- **Histórico, base legal e estrutura do GT:** Portaria IRM nº 195/2025,
  Inquérito Civil nº 04.22.0010.0042904/2024-19 (MPRJ/GAEMA), processo
  SEI-150018/000311/2025 e a apresentação institucional do GT de 25/06/2026.
- **Painel externo de indicadores:** SIGA Águas, do CBH Baía de Guanabara e da
  AGEVAP.
- **Imagens:** logotipos do site oficial do IRM; fotografia do rio Iguaçu de
  Gerson Tavares (CC BY 2.0, via Wikimedia Commons), ilustrativa e sem relação
  com obra específica. Créditos em `PENDENCIAS.md`.

O IRM consolida e divulga; **não é o órgão executor**. A execução é do INEA, da
Prefeitura Municipal de Belford Roxo, da PCNI–SEMIF e da EMOP, conforme o
projeto. O MPRJ atua pelo Inquérito Civil que originou o Grupo de Trabalho, não
como executor.

## Acessibilidade

WCAG 2.2 nível AA como meta, com o eMAG como referência de governo eletrônico:
HTML semântico, navegação completa por teclado, foco visível, link "pular para o
conteúdo", VLibras, situação nunca comunicada só por cor (cor + ícone + texto),
alternativa em lista para o mapa e tabela que vira lista de cartões no celular.

## Arquitetura

O portal é **inteiramente público e estático**: não há login, banco de dados nem
servidor de aplicação. Os dados vivem em JSON versionado neste repositório, o
build gera arquivos estáticos e o Firebase Hosting os serve pelo CDN.

```
app/src/data/*.json  →  npm run build  →  app/dist  →  Firebase Hosting
   (fonte, no Git)       (testes no CI)                (projeto-iguacu-irm.web.app)
```

Consequências práticas dessa escolha:

- **Custo R$ 0.** Plano Spark, sem conta de faturamento vinculada. Os limites
  gratuitos do Hosting são 10 GB de armazenamento e 10 GB/mês de transferência.
- **Sem superfície de ataque de dados.** Não existe endpoint de escrita: alterar
  o conteúdo exige acesso ao repositório.
- **Trilha de auditoria de graça.** O Git registra quem mudou o quê, quando e por
  quê — o histórico de versões que um portal de transparência precisa ter, sem
  construir nada para isso.
- **Sem cota de leitura.** O conteúdo é servido pelo CDN; um pico de acesso não
  derruba o portal nem estoura limite gratuito.

Projeto Firebase: `carrinho-virtual-iw-48fc7` (exibido como "Projeto Iguaçu"; o
ID é permanente no Google Cloud e não pode ser alterado). Site de Hosting:
`projeto-iguacu-irm`.

## Escopo do produto

`Docs/Modelo novo/Prompt_Mestre_Atualizacao_Portal_Projeto_Iguacu_v2.2` — versão
vigente, para o portal público estático. A v2.1 continua na pasta como registro
histórico: ela descrevia uma área administrativa privada com Firestore, papéis e
convites, descartada pela decisão de que o sistema é público e sem login.
