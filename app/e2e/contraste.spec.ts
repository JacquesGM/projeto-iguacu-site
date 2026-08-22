import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * O ponto cego do axe, medido à mão — e a prova de que a varredura enxerga.
 *
 * Sobre o gradiente do topo o axe **desiste**: devolve `color-contrast` como
 * "incomplete", com a mensagem "background color could not be determined due
 * to a background gradient". Incomplete não reprova teste nenhum, então esse
 * pedaço do portal ficaria para sempre sem verificação — justamente o pedaço
 * onde está o nome do projeto e a frase que explica o que ele é.
 *
 * A saída é medir o pixel: apaga-se a cor do texto, tira-se um retrato do que
 * ficou e compara-se cada ponto do fundo com a cor da letra, pela fórmula da
 * WCAG. É contraste de verdade, não estimativa.
 */

/** Luminância relativa da WCAG 2.x. */
const FORMULA = `
  const lum = ([r, g, b]) => {
    const f = (v) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const razao = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
`;

/**
 * O mínimo que a SC 1.4.3 exige para este texto: 3:1 se for "texto grande"
 * (24px, ou 18,66px em negrito), 4.5:1 em qualquer outro caso.
 */
function minimoExigido(px: number, peso: number) {
  const grande = px >= 24 || (px >= 18.66 && peso >= 700);
  return grande ? 3 : 4.5;
}

async function contrasteSobreOFundo(page: Page, seletores: string[]) {
  const alvos = await page.evaluate((sels) => {
    return sels.flatMap((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return [];
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return [{ sel, cor: cs.color, px: parseFloat(cs.fontSize), peso: parseInt(cs.fontWeight, 10) || 400, r: r.toJSON() }];
    });
  }, seletores);

  expect(alvos.map((a) => a.sel), 'algum seletor do hero deixou de existir').toEqual(seletores);

  // Some a cor do texto sem mexer no layout: o que sobrar dentro da caixa de
  // cada elemento é o fundo que ele de fato tem por trás.
  await page.addStyleTag({ content: '#topo * { color: transparent !important; text-shadow: none !important; }' });
  const png = (await page.screenshot({ scale: 'css' })).toString('base64');

  return page.evaluate(
    async ({ png, alvos, formula }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + png;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      const razao = new Function(`${formula} return razao;`)() as (a: number[], b: number[]) => number;
      const cor = (s: string) => s.match(/\d+/g)!.slice(0, 3).map(Number);

      return alvos.map((alvo) => {
        const texto = cor(alvo.cor);
        let pior = Infinity;
        let fundo = '';
        for (let y = Math.ceil(alvo.r.top); y < Math.floor(alvo.r.bottom); y += 2) {
          for (let x = Math.ceil(alvo.r.left); x < Math.floor(alvo.r.right); x += 2) {
            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;
            const i = (y * canvas.width + x) * 4;
            const p = [px[i], px[i + 1], px[i + 2]];
            const v = razao(texto, p);
            if (v < pior) {
              pior = v;
              fundo = `rgb(${p.join(',')})`;
            }
          }
        }
        return { sel: alvo.sel, px: alvo.px, peso: alvo.peso, razao: pior, fundo };
      });
    },
    { png, alvos, formula: FORMULA },
  );
}

test('o texto sobre o gradiente do topo tem contraste suficiente em todo ponto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();

  const medidas = await contrasteSobreOFundo(page, [
    '#topo p.uppercase',
    '#topo span.text-5xl',
    '#topo span.text-xl',
    '#topo p.max-w-xl',
  ]);

  const reprovados = medidas
    .filter((m) => m.razao < minimoExigido(m.px, m.peso))
    .map((m) => `${m.sel}: ${m.razao.toFixed(2)}:1 sobre ${m.fundo} — exigido ${minimoExigido(m.px, m.peso)}:1`);

  expect(reprovados).toEqual([]);
});

// Uma varredura que nunca reprova nao protege nada. Estes dois provam que as
// regras que so existem no navegador estao mesmo ligadas -- se alguem trocar
// as tags do axe e desligar `color-contrast` ou `target-size` sem perceber,
// aqui reprova.
test.describe('a varredura do navegador enxerga o que o jsdom não vê', () => {
  test('acusa contraste insuficiente e alvo de toque pequeno', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const ruim = document.createElement('div');
      ruim.innerHTML =
        '<p style="background:#ffffff;color:#eeeeee;font-size:12px">texto quase invisível</p>' +
        // Dois, colados: um alvo pequeno sozinho passa pela excecao de
        // espacamento da regra. Sao os vizinhos que a fazem reprovar.
        '<button style="width:12px;height:12px;padding:0;margin:0">x</button>' +
        '<button style="width:12px;height:12px;padding:0;margin:0">y</button>';
      document.body.append(ruim);
    });

    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .exclude('div[vw]')
      .analyze();

    const ids = resultado.violations.map((v) => v.id);
    expect(ids).toContain('color-contrast');
    expect(ids).toContain('target-size');
  });

  test('a medida de contraste sobre o fundo reprova quando o fundo muda', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { level: 1 }).waitFor();
    // Fundo branco atrás de texto branco: a medida tem de acusar ~1:1.
    await page.addStyleTag({ content: '#topo { background: #ffffff !important; }' });

    const [medida] = await contrasteSobreOFundo(page, ['#topo span.text-5xl']);
    expect(medida.razao).toBeLessThan(1.5);
  });
});
