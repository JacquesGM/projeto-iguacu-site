import { expect, test } from '@playwright/test';

/**
 * Onde o botão do VLibras vai parar.
 *
 * O defeito que este teste guarda: o CSS do plugin deixa `div[vw]` como
 * `position: fixed` **sem nenhum deslocamento**, contando que a inicialização o
 * posicione. O componente é renderizado no fim do layout — de propósito, para
 * não entrar na frente do "Ir para o conteúdo" na ordem de foco —, então a
 * posição estática dele cai no rodapé do documento. Resultado: o botão nascia a
 * 2.294 px do topo numa janela de 720 px, fora da tela, sem nada acusar.
 *
 * **Por que o teste força o tamanho.** O botão só ganha 40×40 quando o CSS do
 * gov.br chega, e depender da rede externa faria este teste falhar quando o
 * problema fosse a internet do CI. O que se verifica aqui é a **âncora**, que é
 * nossa: dado um botão de 40×40, ele tem de cair dentro da janela.
 */

const TAMANHO_FORCADO = `
  div[vw].enabled { display: block !important; }
  div[vw] [vw-access-button] { display: block !important; width: 40px !important; height: 40px !important; }
`;

test('o botão fica dentro da janela, encostado na direita', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.addStyleTag({ content: TAMANHO_FORCADO });

  const m = await page.evaluate(() => {
    const r = (document.querySelector('div[vw] [vw-access-button]') as HTMLElement).getBoundingClientRect();
    return { r: r.toJSON(), vw: window.innerWidth, vh: window.innerHeight };
  });

  expect(m.r.height, 'o botão não tem altura — o seletor mudou?').toBeGreaterThan(0);
  expect(m.r.top, `botão a ${m.r.top}px do topo, numa janela de ${m.vh}px`).toBeLessThan(m.vh);
  expect(m.r.bottom).toBeGreaterThan(0);
  expect(m.r.left).toBeLessThan(m.vw);
  expect(m.r.right).toBeGreaterThan(0);

  // Encostado na direita nos dois formatos: no meio da lateral no desktop, no
  // canto inferior no celular, sempre com folga de margem.
  expect(m.vw - m.r.right, 'longe demais da borda direita').toBeLessThan(40);

  if (isMobile) {
    // Acima do "Voltar ao topo" (bottom-5, 48px de altura), para não cobri-lo.
    expect(m.vh - m.r.bottom).toBeGreaterThan(60);
  } else {
    // No meio vertical, com tolerância para a margem que o plugin aplica.
    expect(Math.abs(m.r.top + m.r.height / 2 - m.vh / 2)).toBeLessThan(40);
  }
});

// A prova de que a medida acima enxerga: sem a âncora do nosso CSS, o botão vai
// para o fim do documento — que foi exatamente o estado em produção.
test('sem a âncora, o botão cairia fora da janela', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.addStyleTag({
    content:
      TAMANHO_FORCADO +
      `div[vw].enabled { top: auto !important; bottom: auto !important; right: auto !important;
                         left: auto !important; transform: none !important; }`,
  });

  const m = await page.evaluate(() => {
    const r = (document.querySelector('div[vw] [vw-access-button]') as HTMLElement).getBoundingClientRect();
    return { top: r.top, vh: window.innerHeight };
  });

  expect(m.top, 'sem âncora o botão deveria cair no rodapé do documento').toBeGreaterThan(m.vh);
});
