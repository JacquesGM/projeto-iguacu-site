import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ramp derivada da paleta institucional já usada no protótipo estático
        // (css/styles.css: --azul-900/800/700/500/100). Os cinco valores
        // originais são preservados nos degraus abaixo; os demais são
        // interpolados para completar a escala.
        brand: {
          blue: {
            50: '#eaf2f8',
            100: '#d7e6f2',
            200: '#b3d0e6',
            300: '#8fb8da',
            400: '#5a97c4',
            500: '#2f7fb8',
            600: '#14639f',
            700: '#0b4f8a',
            800: '#0b3a63',
            900: '#082944',
            950: '#051b2d',
          },
          green: {
            50: '#e7f5ee',
            100: '#cfead9',
            200: '#a9dfc0',
            300: '#7bcaa0',
            400: '#4bb17e',
            500: '#2f9e75',
            600: '#248058',
            700: '#1f7a5c',
            800: '#16593f',
            900: '#0f3d2c',
          },
        },
        neutral: {
          50: '#f4f8fb',
          100: '#eceef1',
          200: '#c7d8e4',
          300: '#a8b9c7',
          400: '#8a97a3',
          500: '#5a6b78',
          600: '#4a5964',
          700: '#34424d',
          800: '#262e36',
          900: '#16232e',
        },
        status: {
          amber: '#7a5c00',
          orange: '#8a5300',
          red: '#9c2b2b',
          purple: '#5b2d90',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
