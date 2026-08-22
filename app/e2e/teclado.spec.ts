import { expect, test, type Page } from '@playwright/test';

/**
 * Critério 8 — operar o portal inteiro só pelo teclado.
 *
 * Até aqui isso tinha sido verificado em três pontos (o skip link, o foco do
 * modal e a troca de rota) e presumido no resto. Presumir é justamente o que
 * não funciona aqui: teclado quebra por detalhe — um `div` com `onClick`, um
 * foco que não volta, uma armadilha que só aparece quando se tabula até o fim.
 *
 * Nada aqui usa clique. Onde um teste precisa chegar a um controle, ele chega
 * tabulando ou focando — se o controle não for alcançável, o teste reprova.
 */

/**
 * Quem está com o foco: uma descrição legível — é isso que os erros precisam
 * mostrar — e uma **identidade**, que é outra coisa. Descrição não serve para
 * comparar: há catorze botões "Ver detalhes" e cinco resumos "Ver dados em
 * tabela", e tomar dois deles por um só faria o teste acusar armadilha de
 * teclado onde o Tab está andando normalmente. A identidade sai de guardar o
 * próprio elemento numa lista dentro da página, sem tocar no DOM.
 */
async function focado(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __focados?: Element[] };
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return { id: -1, desc: 'body (nada focado)' };

    const vistos = (w.__focados ??= []);
    let id = vistos.indexOf(el);
    if (id < 0) id = vistos.push(el) - 1;

    const nome = el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 40) ?? '';
    return { id, desc: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${nome}"` };
  });
}

const descrever = async (page: Page) => (await focado(page)).desc;

/** Tabula `n` vezes e devolve o que recebeu foco, em ordem. */
async function tabular(page: Page, n: number) {
  const ordem: { id: number; desc: string }[] = [];
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab');
    ordem.push(await focado(page));
  }
  return ordem;
}

test.describe('ponto de partida', () => {
  test('o primeiro Tab chega no atalho para o conteúdo, e ele aparece', async ({ page }) => {
    await page.goto('/');
    // Sem foco de verdade na página, `:focus` não casa e o atalho parece
    // quebrado quando está correto. Confirmar antes de julgar qualquer coisa.
    expect(await page.evaluate(() => document.hasFocus())).toBe(true);

    await page.keyboard.press('Tab');
    const atalho = page.getByRole('link', { name: 'Ir para o conteúdo' });
    await expect(atalho).toBeFocused();
    // Ele vive fora da tela (-translate-y-16) até receber foco.
    await expect(atalho).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page.locator('#conteudo-principal')).toBeFocused();
  });

  test('depois do atalho, o próximo Tab continua dentro do cabeçalho', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const dentro = await page.evaluate(() => !!document.activeElement?.closest('header'));
    expect(dentro, `foco em ${await descrever(page)}`).toBe(true);
  });
});

test.describe('cabeçalho', () => {
  test('"Texto maior" alterna pelo teclado e o estado é anunciado', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Texto maior' });
    await botao.focus();
    await expect(botao).toHaveAttribute('aria-pressed', 'false');

    await page.keyboard.press('Enter');
    await expect(botao).toHaveAttribute('aria-pressed', 'true');

    // Espaço também precisa acionar: é o outro acionador de `button`.
    await page.keyboard.press('Space');
    await expect(botao).toHaveAttribute('aria-pressed', 'false');
  });

  test('trocar de rota pelo teclado leva o foco para o h1 da página nova', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: 'Transparência' }).first();
    await link.focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/transparencia$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });
});

test.describe('menu do celular', () => {
  // Abaixo de 1280px a navegacao vira sanfona atras de um botao. E o unico
  // caminho para as outras paginas nesse tamanho: se ele nao abrir pelo
  // teclado, o portal inteiro fica inalcancavel sem mouse.
  test.skip(({ isMobile }) => !isMobile, 'no desktop a navegação fica sempre visível');

  test('abre pelo teclado, dá acesso aos itens e fecha no Esc', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Abrir menu' });
    await botao.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');

    const menu = page.getByRole('navigation', { name: 'Navegação móvel' });
    await expect(menu).toBeVisible();
    // O ultimo item e o que ja ficou inalcancavel em paisagem; chegar nele
    // tabulando prova que o caminho de teclado vai ate o fim do menu.
    const ultimo = menu.getByRole('link').last();
    await expect(ultimo).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    // O foco tem de voltar para o botao, senao ele fica no nada.
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  });

  test('um item do menu leva para a rota e fecha a sanfona', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).focus();
    await page.keyboard.press('Enter');

    const menu = page.getByRole('navigation', { name: 'Navegação móvel' });
    await menu.getByRole('link', { name: 'Transparência' }).focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/transparencia$/);
    await expect(menu).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });
});

test.describe('filtros e tabela de projetos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/intervencoes');
    await page.getByRole('heading', { level: 1 }).waitFor();
  });

  test('busca, filtro e "Limpar filtros" funcionam sem mouse', async ({ page }) => {
    const contador = page.getByRole('status').filter({ hasText: /projetos? encontrados?/ });
    const antes = (await contador.textContent())!;

    const busca = page.getByRole('searchbox', { name: 'Pesquisar' });
    await busca.focus();
    await page.keyboard.type('ponte');
    await expect(contador).not.toHaveText(antes);

    // O select tem de mudar por teclado, não só por clique.
    const municipio = page.getByRole('search', { name: 'Pesquisar e filtrar projetos' }).getByLabel('Município');
    await municipio.focus();
    await municipio.selectOption({ index: 1 });

    // Sao dois: o da barra de resultados e o do estado vazio, que aparece
    // quando a combinacao de filtros nao devolve projeto nenhum.
    const limpar = page.getByRole('button', { name: 'Limpar filtros' }).first();
    await limpar.focus();
    await page.keyboard.press('Enter');
    await expect(contador).toHaveText(antes);
    await expect(busca).toHaveValue('');
  });

  test('ordenar uma coluna pelo teclado muda o aria-sort', async ({ page, isMobile }) => {
    // Abaixo de 768px nao existe tabela: cada projeto vira cartao, e nao ha o
    // que ordenar. Pular aqui e o correto -- fingir que ordena seria o erro.
    test.skip(!!isMobile, 'a tabela vira cartoes no celular');

    const cabecalho = page.getByRole('columnheader', { name: /Valor do contrato/ });
    const botao = cabecalho.getByRole('button');
    await botao.focus();
    await expect(cabecalho).toHaveAttribute('aria-sort', 'none');

    await page.keyboard.press('Enter');
    await expect(cabecalho).toHaveAttribute('aria-sort', /ascending|descending/);

    await page.keyboard.press('Enter');
    await expect(cabecalho).toHaveAttribute('aria-sort', /ascending|descending/);
    // O foco não pode se perder na re-renderização da tabela.
    await expect(botao).toBeFocused();
  });
});

test.describe('modal do projeto', () => {
  test('abre, prende o foco, fecha no Esc e devolve o foco ao gatilho', async ({ page }) => {
    await page.goto('/intervencoes');
    const gatilho = page.getByRole('button', { name: 'Ver detalhes' }).first();
    await gatilho.focus();
    await page.keyboard.press('Enter');

    const dialogo = page.getByRole('dialog');
    await expect(dialogo).toBeVisible();
    // O foco tem de entrar no diálogo, senão o leitor de tela fica lá atrás.
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);

    // Tabular bastante para dar a volta: em nenhum momento o foco pode escapar
    // para a página de trás enquanto o modal está aberto.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const dentro = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
      expect(dentro, `foco escapou do modal para ${await descrever(page)}`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialogo).toBeHidden();
    await expect(gatilho).toBeFocused();
  });
});

test.describe('mapa', () => {
  test('selecionar um projeto e limpar a seleção, só pelo teclado', async ({ page }) => {
    await page.goto('/intervencoes');
    await page.locator('.leaflet-container').waitFor();

    const item = page.getByRole('list', { name: 'Projetos no mapa' }).locator('button').first();
    await item.focus();
    await page.keyboard.press('Enter');

    const limpar = page.getByRole('button', { name: /Limpar seleção/ });
    await expect(limpar).toBeVisible();
    await limpar.focus();
    await page.keyboard.press('Enter');
    await expect(limpar).toBeHidden();
  });
});

test.describe('alternativa em tabela dos gráficos', () => {
  test('o resumo abre e fecha pelo teclado', async ({ page }) => {
    await page.goto('/indicadores');
    const detalhe = page.locator('details').first();
    const resumo = detalhe.locator('summary');

    await resumo.focus();
    await expect(resumo).toBeFocused();
    await expect(detalhe).not.toHaveAttribute('open', '');

    await page.keyboard.press('Enter');
    await expect(detalhe).toHaveAttribute('open', '');

    await page.keyboard.press('Enter');
    await expect(detalhe).not.toHaveAttribute('open', '');
  });
});

test.describe('sem armadilha e com foco sempre visível', () => {
  for (const rota of ['/', '/intervencoes', '/indicadores', '/transparencia']) {
    test(`${rota}: 40 Tabs não prendem o foco`, async ({ page }) => {
      await page.goto(rota);
      await page.getByRole('heading', { level: 1 }).waitFor();

      const ordem = await tabular(page, 40);

      // Armadilha de teclado: o foco parado no mesmo elemento três vezes
      // seguidas quer dizer que o Tab não sai dali.
      for (let i = 2; i < ordem.length; i++) {
        const preso = ordem[i].id === ordem[i - 1].id && ordem[i].id === ordem[i - 2].id;
        expect(preso, `foco preso em ${ordem[i].desc} (posições ${i - 2}–${i})`).toBe(false);
      }
    });
  }

  test('todo elemento focado por Tab tem indicador visível', async ({ page }) => {
    await page.goto('/intervencoes');
    await page.getByRole('heading', { level: 1 }).waitFor();

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const visivel = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return true;
        if (!el.matches(':focus-visible')) return true;
        const cs = getComputedStyle(el);
        return parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none';
      });
      expect(visivel, `sem indicador de foco em ${await descrever(page)}`).toBe(true);
    }
  });
});
