import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reposiciona a página a cada troca de rota: rola para o topo e leva o foco
 * para o `h1` da nova página.
 *
 * O foco não é detalhe: numa SPA o leitor de tela não anuncia a troca de
 * página. O `document.title` muda, mas isso só é lido em carregamento de
 * verdade. Sem mover o foco, quem usa leitor de tela clica em "Indicadores",
 * nada é anunciado e o cursor virtual continua no menu. Levar o foco ao `h1`
 * faz o leitor ler o título da nova página, que é justamente a informação
 * que falta, e ainda coloca quem navega por teclado no começo do conteúdo.
 *
 * No primeiro carregamento o foco não é tocado — aí a página é anunciada
 * normalmente, e roubar o foco atrapalharia.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  // Guarda a rota, nao um booleano de "primeira vez": no StrictMode o efeito
  // roda duas vezes na montagem, e um booleano deixaria a segunda execucao
  // mover o foco como se fosse troca de rota.
  const rotaAnterior = useRef(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (rotaAnterior.current === pathname) return;
    rotaAnterior.current = pathname;

    const titulo = document.querySelector<HTMLElement>('main h1');
    if (!titulo) return;

    // tabindex -1 torna o h1 focável por código sem entrar na ordem de tabulação.
    titulo.setAttribute('tabindex', '-1');
    titulo.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
