# Tipografia — Rawline

O portal usa a **Rawline**, tipografia do Padrão Digital de Governo (gov.br),
adotada para que o cidadão reconheça um produto de governo. Ela é
**auto-hospedada**: nenhuma requisição sai para domínio externo — o que a CSP do
`firebase.json` (`font-src 'self' data:`) inclusive impediria.

## Arquivos

| Arquivo | Peso | Uso |
|---|---:|---|
| `public/fonts/rawline-400.woff2` | 400 | texto corrido |
| `public/fonts/rawline-500.woff2` | 500 | navegação, rótulos, botões |
| `public/fonts/rawline-600.woff2` | 600 | subtítulos |
| `public/fonts/rawline-700.woff2` | 700 | títulos |
| `public/fonts/rawline-800.woff2` | 800 | hero e números grandes |

Declarados em `src/index.css`. Só o peso 400 é pré-carregado no `index.html`:
pré-carregar todos disputaria banda com o HTML e atrasaria a primeira
renderização.

## Procedência

Os binários vieram de <https://fonts.cdnfonts.com/css/rawline>, em 20/08/2026.
**Não é a distribuição oficial.** O CDN do Padrão Digital de Governo
(`cdngovbr-ds.estaleiro.serpro.gov.br`) estava inacessível do ambiente de
desenvolvimento — o domínio resolve, a conexão não completa — e não existe
pacote `rawline` nem `@fontsource/rawline` no npm.

Como a origem não é a oficial, os arquivos foram **verificados antes de entrar
no repositório**:

- assinatura de container `wOFF` válida nos cinco;
- tamanho declarado no cabeçalho igual ao tamanho real do arquivo, o que
  descarta conteúdo anexado depois do fim da fonte;
- tabela `name` legível, declarando família **Rawline**, versão **4.020**;
- autoria **Matt McInerney, Pablo Impallari, Rodrigo Fuenzalida** — os mesmos da
  Raleway, de que a Rawline deriva, coerente com a procedência conhecida;
- licença **SIL Open Font License 1.1** embutida no próprio binário, com URL.

**Vale substituir pelos arquivos oficiais** quando o CDN do gov.br estiver
acessível, refazendo o subset. A verificação acima reduz o risco, mas não
equivale a baixar da fonte primária.

## Processamento

Os originais eram WOFF com latim estendido e cirílico completos — alfabetos que
o portal não usa. Foram subsetados para latim mais a acentuação do português e
convertidos para WOFF2 (Brotli):

```
580.920 bytes  ->  154.872 bytes   (-74%)
```

O subset preservou a tabela `name` de propósito: a SIL OFL exige que o texto da
licença acompanhe o binário redistribuído. O `public/fonts/OFL.txt` cumpre a
mesma exigência de forma visível e é publicado junto com o site.

Intervalos mantidos: `U+0020-007E`, `U+00A0-00FF`, `U+0100-017F`,
`U+2010-2027`, `U+2030-205E`, mais `€ ™ ² ³ º ª ×`. Se algum caractere aparecer
como retângulo vazio, ficou fora dessa faixa — refaça o subset incluindo-o.

## Fallback

`tailwind.config.ts` define a pilha: `Rawline`, depois `system-ui`,
`-apple-system`, `"Segoe UI"`, `Roboto`, `"Helvetica Neue"`, `Arial`. Com
`font-display: swap`, o texto aparece na fonte do sistema enquanto a Rawline
carrega, em vez de deixar a página em branco.
