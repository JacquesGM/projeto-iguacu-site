import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * O que este lint acrescenta, e por que não é redundante com o `tsc`.
 *
 * O TypeScript já roda em modo estrito e pega tipo errado. O que ele **não**
 * pega é a classe de erro que mais custou tempo neste projeto: efeito de React
 * com dependência faltando ou com guarda por booleano em vez de por valor —
 * exatamente o que fez o foco ser roubado na carga inicial sob StrictMode, e o
 * que fez o mapa lançar em jsdom sem reprovar a suíte.
 *
 * Por isso `react-hooks` é a razão de existir deste arquivo; o resto é higiene.
 */
export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results', 'vite.config.js', 'vite.config.d.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Desligada, e a razão importa. Ela acusa arquivo que exporta um
      // componente e mais alguma coisa — `situacaoColorHex` ao lado do
      // `SituacaoBadge`, `moedaCompacta` ao lado do gráfico. O efeito é só no
      // Fast Refresh do `npm run dev`, e o preço de calar seria espalhar
      // quatro helpers por arquivos novos, longe de quem os usa. Deixá-la
      // ligada significaria seis avisos permanentes na saída — e saída que
      // sempre tem aviso é saída que ninguém lê.
      'react-refresh/only-export-components': 'off',

      // O Prompt Mestre (§14) pede "sem `any` não justificado". Aviso, não
      // erro: quando houver um justificado, o comentário do `eslint-disable`
      // é onde a justificativa fica escrita.
      '@typescript-eslint/no-explicit-any': 'warn',

      // `noUnusedLocals` do tsc já reprova variável sobrando; aqui só a
      // convenção do `_` para o que é intencionalmente ignorado.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Scripts de build: rodam no Node, não no navegador.
    files: ['scripts/**/*.js'],
    languageOptions: { globals: globals.node },
    extends: [js.configs.recommended],
  },
);
