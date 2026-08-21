import { Outlet } from 'react-router-dom';
import { SkipLink } from './SkipLink';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { ScrollToTop } from './ScrollToTop';
import { RouteTitle } from './RouteTitle';
import { VLibrasWidget } from './VLibrasWidget';
import { ErrorBoundary } from './ErrorBoundary';

export function RootLayout() {
  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <RouteTitle />
      <Header />
      {/* tabIndex -1 no alvo do "Ir para o conteudo": o Chrome move o ponto de
          partida da tabulacao sozinho, mas so um alvo focavel garante que o
          cursor do leitor de tela va junto em todos os navegadores. */}
      <main id="conteudo-principal" tabIndex={-1}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
      <VLibrasWidget />
    </>
  );
}
