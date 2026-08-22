import { defineConfig, devices } from '@playwright/test';

/**
 * Testes de ponta a ponta, num navegador de verdade.
 *
 * Existem para cobrir exatamente o que o jsdom não alcança e que até aqui só
 * era verificado à mão: **contraste de cor** (precisa de pintura real),
 * **navegação por teclado** ao longo da página, e os **gráficos desenhados**
 * (o Recharts não desenha sem dimensão, então em jsdom eles simplesmente não
 * existem).
 *
 * Rodam contra o build de produção servido pelo `vite preview`, não contra o
 * `dev`: é o artefato que vai ao ar que interessa testar.
 */
// Declaração mínima em vez de @types/node, como em vite.config.ts: o arquivo
// só precisa de process.env, e uma dependência a mais não se justifica por isso.
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', testIgnore: /desempenho\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    // Um celular real: e aqui que estavam os defeitos de paisagem, de alvo de
    // toque e do menu que nao abria por inteiro.
    { name: 'celular', testIgnore: /desempenho\.spec\.ts/, use: { ...devices['Pixel 5'] } },

    // O desempenho corre sozinho, com `--workers=1` (ver o script `test:e2e`).
    // Nao e preciosismo: dois workers freando rede e CPU na mesma maquina
    // disputam o processador, e o LCP medido saltou de 1,5s para 3,1s -- numero
    // da contencao do teste, nao do portal. Byte nao sofre disso; tempo sofre.
    { name: 'desempenho', testMatch: /desempenho\.spec\.ts/, use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
