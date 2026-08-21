import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import intervencoesData from '../../data/intervencoes.json';
import type { Intervencao } from '../../types';
import { SeloProcedencia, SeloProcedenciaCompleto } from './SeloProcedencia';

const intervencoes = intervencoesData as Intervencao[];
const projeto = intervencoes[0];

describe('selo compacto', () => {
  it('nomeia quem declarou e quando', () => {
    const { container } = render(<SeloProcedencia intervencao={projeto} />);
    expect(container.textContent).toContain(projeto.orgaoResponsavel);
    expect(container.textContent).toContain(projeto.dataInformacao);
  });

  // O selo e sobre atribuicao: sem o "declarado por", vira so mais uma data
  // solta e perde a razao de existir.
  it('atribui a declaração, não só exibe a data', () => {
    const { container } = render(<SeloProcedencia intervencao={projeto} />);
    expect(container.textContent).toMatch(/declarado por/i);
  });
});

describe('selo completo', () => {
  const renderizar = (item: Intervencao = projeto) =>
    render(
      <MemoryRouter>
        <SeloProcedenciaCompleto intervencao={item} />
      </MemoryRouter>,
    );

  it('mostra a cadeia inteira: quem declarou, quando e de onde foi transcrito', () => {
    const { container } = renderizar();
    expect(container.textContent).toContain(projeto.orgaoResponsavel);
    expect(container.textContent).toContain(projeto.dataInformacao);
    expect(container.textContent).toContain(projeto.fonte);
  });

  it('é uma região identificável para quem navega por leitor de tela', () => {
    renderizar();
    expect(screen.getByRole('region', { name: /procedência/i })).toBeTruthy();
  });

  it('leva à metodologia em vez de repeti-la', () => {
    renderizar();
    const link = screen.getByRole('link', { name: /como o dado é apurado/i });
    expect(link.getAttribute('href')).toBe('/transparencia');
  });

  // O IRM consolida e publica; nao executa obra nem contrato. Afirmar o
  // contrario e o erro que o Prompt Mestre proibe explicitamente.
  it('não atribui a execução ao IRM', () => {
    const { container } = renderizar();
    expect(container.textContent).toMatch(/não executa as obras/i);
  });

  it('funciona para os 14 projetos, sem campo vazio', () => {
    for (const item of intervencoes) {
      const { container, unmount } = renderizar(item);
      expect(container.textContent).toContain(item.orgaoResponsavel);
      expect(container.textContent).toContain(item.fonte);
      expect(container.textContent).not.toContain('undefined');
      unmount();
    }
  });
});
