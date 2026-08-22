import { expect, test } from '@playwright/test';

/**
 * Os gráficos desenhados, e o balão que só existe quando há cursor.
 *
 * Em jsdom o `ResponsiveContainer` do Recharts não tem dimensão e não desenha
 * nada, então os testes de lá cobrem a **tabela equivalente** e param aí. O
 * balão de detalhe nunca teve teste nenhum — foi o que permitiu que a mesma
 * implementação ficasse copiada em três arquivos, declarada dentro do corpo do
 * componente, remontando a cada render.
 */

test.describe('gráficos de Indicadores', () => {
  test.skip(({ isMobile }) => !!isMobile, 'o balão depende de cursor; no celular não há hover');

  test.beforeEach(async ({ page }) => {
    await page.goto('/indicadores');
    // Os gráficos chegam por import() dinâmico: sem esperar, o teste mede a
    // tela de carregamento.
    await expect(page.locator('svg.recharts-surface').first()).toBeVisible();
  });

  test('desenha os cinco gráficos', async ({ page }) => {
    await expect(page.locator('svg.recharts-surface')).toHaveCount(5);
  });

  test('o balão de contagem mostra categoria, quantidade e percentual', async ({ page }) => {
    // Cada gráfico tem o seu invólucro e o seu balão; sem escopo, o localizador
    // casa com os cinco balões da página e só um deles é o que se quer.
    const grafico = page.locator('.recharts-wrapper').first();
    await grafico.locator('.recharts-bar-rectangle').first().hover();

    const balao = grafico.locator('.recharts-tooltip-wrapper');
    await expect(balao).toBeVisible();
    // "N de 14 (P%)" — o total é o dos 14 projetos, e o percentual vem dele.
    await expect(balao).toContainText(/\d+ de 14 \(\d+%\)/);
    // A categoria sob o cursor tem de aparecer, não um rótulo vazio: é ela que
    // o Recharts entrega em `label`, e foi o que substituiu o acesso ao campo
    // do dado quando o balão saiu de dentro do componente.
    await expect(balao.locator('p').first()).not.toBeEmpty();
  });

  test('o balão de valor mostra o valor cheio, não o compacto da barra', async ({ page }) => {
    // O quarto gráfico é o primeiro dos dois de valor contratado.
    const grafico = page.locator('.recharts-wrapper').nth(3);
    await grafico.locator('.recharts-bar-rectangle').first().hover();

    const balao = grafico.locator('.recharts-tooltip-wrapper');
    await expect(balao).toBeVisible();
    // Cheio, com centavos — a barra mostra "R$ 304,6 mi" e o balão, o número
    // que ela esconde.
    await expect(balao).toContainText(/R\$\s?[\d.]+,\d{2}/);
    await expect(balao).toContainText(/%\s*do total/);
  });
});
