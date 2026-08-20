import { Component, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

const CHAVE_RECARGA_TENTADA = 'projeto-iguacu-recarga-apos-erro';

function ehFalhaDeCarregamentoDeChunk(error: unknown): boolean {
  const mensagem = error instanceof Error ? error.message : String(error);
  return /failed to fetch dynamically imported module|loading chunk .* failed|importing a module script failed/i.test(
    mensagem,
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  temErro: boolean;
  jaTentouRecarregar: boolean;
}

// Sem isso, qualquer exceção de renderização (ex.: um chunk lazy que não
// carrega mais porque o hash mudou num deploy novo enquanto a aba estava
// aberta) derruba a página inteira para uma tela em branco, sem nenhuma
// mensagem — o cidadão perde a página sem entender por quê.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { temErro: false, jaTentouRecarregar: false };

  static getDerivedStateFromError(): Partial<State> {
    return { temErro: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Erro capturado pelo ErrorBoundary:', error);

    if (ehFalhaDeCarregamentoDeChunk(error)) {
      const jaTentou = sessionStorage.getItem(CHAVE_RECARGA_TENTADA) === '1';
      if (!jaTentou) {
        sessionStorage.setItem(CHAVE_RECARGA_TENTADA, '1');
        window.location.reload();
        return;
      }
      this.setState({ jaTentouRecarregar: true });
    }
  }

  handleRecarregar = () => {
    sessionStorage.removeItem(CHAVE_RECARGA_TENTADA);
    window.location.reload();
  };

  render() {
    if (this.state.temErro) {
      return (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
          <h1 className="text-lg font-semibold text-neutral-900">Não foi possível carregar esta página</h1>
          <p className="text-sm text-neutral-600">
            {this.state.jaTentouRecarregar
              ? 'Já tentamos recarregar automaticamente e o problema continuou. Verifique sua conexão e tente de novo — se persistir, entre em contato pelo e-mail saneamento@irm.rj.gov.br.'
              : 'Isso costuma acontecer quando a página foi atualizada com o navegador ainda aberto numa versão anterior. Recarregar costuma resolver.'}
          </p>
          <button
            type="button"
            onClick={this.handleRecarregar}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand-blue-700 px-4 text-sm font-medium text-white hover:bg-brand-blue-600"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
