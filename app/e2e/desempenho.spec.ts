import { expect, test, type Page } from '@playwright/test';

/**
 * As metas de desempenho da §13 do Prompt Mestre, medidas de verdade.
 *
 * A §14 pedia "Lighthouse nas páginas principais". Isto faz o mesmo trabalho e
 * serve melhor ao caso: mede as mesmas Web Vitals, com os mesmos limites, mas
 * roda no CI a cada commit em vez de depender de alguém lembrar de abrir o
 * Lighthouse — e reprova quando alguém acrescenta uma biblioteca pesada.
 *
 * O perfil não é o da máquina de quem programa: **4G lento e CPU quatro vezes
 * mais devagar**, que é o celular modesto de quem consulta o portal na Baixada.
 * Sem esse freio, tudo passa e a medida não quer dizer nada.
 */

const ROTAS = ['/', '/situacao-atual', '/indicadores', '/intervencoes', '/linha-do-tempo', '/documentos', '/transparencia'];

/** §13: LCP ≤ 2,5 s e CLS ≤ 0,1. */
const LCP_MAXIMO_MS = 2500;
const CLS_MAXIMO = 0.1;

/**
 * Orçamento de JavaScript transferido, por rota. É o guarda-costas de verdade:
 * tempo varia com a máquina do CI, byte não varia. Os números são o que o
 * portal gasta hoje, com folga para mexida honesta e não para uma biblioteca
 * nova entrar sem ninguém notar.
 *
 * As três rotas fora do padrão pagam por algo que se vê na tela: o Recharts em
 * `/indicadores`, o Leaflet em `/intervencoes`. Ambos chegam por `import()`
 * dinâmico — as outras cinco rotas não baixam nenhum dos dois.
 */
const ORCAMENTO_JS_KB: Record<string, number> = {
  '/indicadores': 260,
  '/intervencoes': 200,
  padrao: 130,
};

/** LCP e CLS só chegam por PerformanceObserver, e só se ele existir antes da primeira pintura. */
const OBSERVADOR = `
  window.__vitais = { lcp: 0, cls: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__vitais.lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitais.cls += e.value;
  }).observe({ type: 'layout-shift', buffered: true });
`;

async function celularModesto(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  // Sem isto a segunda rota em diante mede o cache, não o carregamento.
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}

async function medir(page: Page, rota: string) {
  await page.addInitScript(OBSERVADOR);
  await celularModesto(page);

  await page.goto(rota, { waitUntil: 'load' });
  await page.getByRole('heading', { level: 1 }).waitFor();
  // Tempo para o que chega por import() dinâmico entrar na conta.
  await page.waitForTimeout(3000);

  return page.evaluate(() => {
    const v = (window as unknown as { __vitais: { lcp: number; cls: number } }).__vitais;
    const recursos = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const js = recursos.filter((r) => r.name.includes('.js'));
    return {
      ...v,
      jsKb: js.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024,
      maiores: js
        .slice()
        .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
        .map((r) => `${r.name.split('/').pop()} ${((r.transferSize || 0) / 1024).toFixed(0)}kB`),
    };
  });
}

/**
 * Roda no projeto `desempenho`, sozinho e com um worker só — ver
 * `playwright.config.ts`. Só no perfil de celular: é o formato em que as metas
 * apertam, e medir duas vezes a mesma coisa dobraria o tempo do CI sem dizer
 * nada de novo.
 *
 * **Se o CI reprovar por LCP e o orçamento de bytes passar**, olhe a máquina
 * antes do código: a medida é de tempo de parede e o runner é compartilhado.
 * A folga hoje é de ~40% (1,4–1,8s medidos contra 2,5s de meta), então uma
 * reprovação real costuma vir junto de byte a mais.
 */
test.describe('desempenho num celular modesto', () => {
  for (const rota of ROTAS) {
    test(`${rota} cumpre as metas da §13`, async ({ page }) => {
      const m = await medir(page, rota);

      // A medida em si pode falhar em silêncio: `getEntriesByType` não devolve
      // LCP nenhum, e o teste passaria comparando zero com 2500. Já aconteceu.
      expect(m.lcp, 'não veio LCP — o PerformanceObserver não chegou a tempo').toBeGreaterThan(0);

      const orcamento = ORCAMENTO_JS_KB[rota] ?? ORCAMENTO_JS_KB.padrao;
      expect(m.jsKb, `JS acima do orçamento em ${rota}: ${m.maiores.join(', ')}`).toBeLessThanOrEqual(orcamento);

      expect(m.lcp, `LCP de ${(m.lcp / 1000).toFixed(2)}s em ${rota}`).toBeLessThanOrEqual(LCP_MAXIMO_MS);
      expect(m.cls, `CLS de ${m.cls.toFixed(3)} em ${rota}`).toBeLessThanOrEqual(CLS_MAXIMO);
    });
  }
});
