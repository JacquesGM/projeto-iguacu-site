import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * A metade da auditoria de acessibilidade que o jsdom não alcança.
 *
 * Lá não há layout nem pintura, então `color-contrast` e `target-size` estão
 * desligados de propósito em `src/test/acessibilidade.ts` e os gráficos nem
 * chegam a ser desenhados. Aqui há um navegador de verdade: as duas regras
 * ficam ligadas, e o que é varrido é o portal pintado.
 *
 * Roda nos dois formatos que os defeitos já mostraram importar — desktop e um
 * celular real —, porque `target-size` e o menu sanfonado só existem num
 * deles.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const ROTAS = [
  '/',
  '/situacao-atual',
  '/indicadores',
  '/intervencoes',
  '/linha-do-tempo',
  '/documentos',
  '/transparencia',
];

/**
 * O VLibras é injetado pelo gov.br e não está sob nosso controle; reprovar por
 * causa dele só ensinaria a ignorar este teste.
 */
const varredura = (page: import('@playwright/test').Page) =>
  new AxeBuilder({ page }).withTags(TAGS).exclude('div[vw]');

const resumir = (violacoes: { id: string; help: string; nodes: { target: unknown[] }[] }[]) =>
  violacoes.map((v) => `${v.id}: ${v.help} — em ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);

for (const rota of ROTAS) {
  test(`${rota} passa no axe com contraste e alvo de toque`, async ({ page }) => {
    await page.goto(rota);
    await page.getByRole('heading', { level: 1 }).waitFor();

    expect(resumir((await varredura(page).analyze()).violations)).toEqual([]);
  });
}

// A rota em repouso não mostra o modal, que começa fechado — e é onde o ARIA
// mais tem como quebrar. O equivalente em jsdom existe; este acrescenta o que
// só a pintura revela.
test('o detalhe do projeto aberto passa no axe', async ({ page }) => {
  await page.goto('/intervencoes');
  await page.getByRole('button', { name: 'Ver detalhes' }).first().click();
  await page.getByRole('dialog').waitFor();

  expect(resumir((await varredura(page).analyze()).violations)).toEqual([]);
});

test('o mapa desenhado não introduz violação', async ({ page }) => {
  await page.goto('/intervencoes');
  await page.locator('.leaflet-container').waitFor();

  const resultado = await varredura(page).include('.leaflet-container').analyze();
  expect(resumir(resultado.violations)).toEqual([]);
});

// Os gráficos do Recharts não existem em jsdom: o ResponsiveContainer não
// desenha nada sem dimensão. Esta é a única varredura que os vê.
test('os gráficos desenhados não introduzem violação', async ({ page }) => {
  await page.goto('/indicadores');
  await expect(page.locator('svg.recharts-surface').first()).toBeVisible();

  const resultado = await varredura(page).include('svg.recharts-surface').analyze();
  expect(resumir(resultado.violations)).toEqual([]);
});
