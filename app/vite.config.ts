import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// O alvo padrão é o Firebase Hosting, na raiz do domínio. Para publicar num
// subdiretório (ex.: site de projeto do GitHub Pages), passe BASE_PATH:
//   BASE_PATH=/projeto-iguacu-site/ npm run build
// O servidor de desenvolvimento continua sempre em "/".
// Declaração mínima em vez de @types/node: o arquivo só precisa de process.env,
// e uma dependência a mais no projeto não se justifica por isso.
declare const process: { env: Record<string, string | undefined> };

const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE_PATH : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // Os testes de ponta a ponta sao do Playwright e precisam de navegador; o
    // vitest tentava carrega-los e quebrava no `test.describe` dele.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
}));
