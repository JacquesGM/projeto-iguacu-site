import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { routes } from '../routes';

describe('every route renders without throwing', () => {
  for (const route of routes) {
    it(`${route.path} (${route.title})`, async () => {
      render(<MemoryRouter initialEntries={[route.path]}>{route.element}</MemoryRouter>);
      const headings = await screen.findAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  }
});

// Toda pagina precisa de exatamente um h1: e por ele que quem usa leitor de
// tela descobre onde esta. Seis das sete paginas ficaram sem h1 porque o
// componente Section emitia h2 fixo -- este teste impede a reincidencia.
describe('estrutura de titulos', () => {
  for (const route of routes) {
    it(`${route.path} tem exatamente um h1`, async () => {
      render(<MemoryRouter initialEntries={[route.path]}>{route.element}</MemoryRouter>);
      await screen.findAllByRole('heading');
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });

    it(`${route.path} nao pula niveis de titulo`, async () => {
      const { container } = render(
        <MemoryRouter initialEntries={[route.path]}>{route.element}</MemoryRouter>,
      );
      await screen.findAllByRole('heading');
      const niveis = [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) =>
        Number(el.tagName[1]),
      );
      let anterior = 0;
      for (const nivel of niveis) {
        if (anterior > 0) {
          expect(nivel, `salto de h${anterior} para h${nivel} em ${route.path}`).toBeLessThanOrEqual(
            anterior + 1,
          );
        }
        anterior = nivel;
      }
    });
  }
});
