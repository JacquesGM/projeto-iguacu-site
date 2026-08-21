import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { routes } from '../routes';
import { descreverViolacoes, violacoesDeAcessibilidade } from '../test/acessibilidade';

/**
 * Varredura automática de acessibilidade em cada rota.
 *
 * O portal declara buscar WCAG 2.1 AA no rodapé. Até aqui isso era verificado
 * à mão, de vez em quando — o que deixou passar, por exemplo, cinco gráficos
 * sem alternativa acessível. Aqui a verificação passa a rodar em todo commit.
 *
 * Os limites do que isto pega estão documentados em `src/test/acessibilidade.ts`
 * e são reais: contraste de cor e alvo de toque ficam de fora. Verde aqui não
 * quer dizer portal acessível; quer dizer que não houve regressão estrutural.
 */

// Um teste que nunca reprova nao protege nada. Este prova que a varredura
// enxerga: se as sete rotas passam, e porque estao limpas, nao porque o axe
// esta desligado ou recebendo o container errado.
describe('a varredura enxerga violação de verdade', () => {
  it('acusa imagem sem alternativa textual e botão sem nome', async () => {
    const { container } = render(
      <div>
        <img src="x.png" />
        <button type="button" />
      </div>,
    );
    const violacoes = await violacoesDeAcessibilidade(container);
    const ids = violacoes.map((v) => v.id);
    expect(ids).toContain('image-alt');
    expect(ids).toContain('button-name');
  }, 20_000);

  it('descreve a violação com o seletor e o link de ajuda', async () => {
    const { container } = render(<img src="x.png" />);
    const texto = descreverViolacoes(await violacoesDeAcessibilidade(container));
    expect(texto).toContain('image-alt');
    expect(texto).toContain('https://');
  }, 20_000);
});

// A rota renderizada e so o estado de repouso. O modal e onde o ARIA mais tem
// como quebrar -- role, aria-modal, titulo referenciado, foco -- e ele nao
// aparece em nenhuma varredura de rota, porque comeca fechado.
describe('acessibilidade com o modal de projeto aberto', () => {
  it('o detalhe do projeto aberto não tem violação do axe', async () => {
    const rota = routes.find((r) => r.path === '/intervencoes')!;
    const { container } = render(<MemoryRouter initialEntries={[rota.path]}>{rota.element}</MemoryRouter>);
    await screen.findAllByRole('heading');

    const abrir = screen.getAllByRole('button', { name: 'Ver detalhes' })[0];
    await userEvent.click(abrir);
    await screen.findByRole('dialog');

    const violacoes = await violacoesDeAcessibilidade(container);
    expect(violacoes, `
${descreverViolacoes(violacoes)}
`).toEqual([]);
  }, 30_000);
});

describe('acessibilidade automática por rota', () => {
  for (const rota of routes) {
    it(`${rota.path} (${rota.title}) não tem violação do axe`, async () => {
      const { container } = render(<MemoryRouter initialEntries={[rota.path]}>{rota.element}</MemoryRouter>);
      await screen.findAllByRole('heading');

      const violacoes = await violacoesDeAcessibilidade(container);
      expect(violacoes, `\n${descreverViolacoes(violacoes)}\n`).toEqual([]);
    }, 20_000);
  }
});
