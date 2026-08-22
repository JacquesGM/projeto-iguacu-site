import { useEffect, useRef } from 'react';

const VLIBRAS_SCRIPT_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js';

/**
 * Widget oficial de tradução em Libras (vlibras.gov.br), padrão em sites .gov.br.
 * Carrega o script externo do governo federal uma única vez.
 *
 * **O detalhe que fazia o widget não existir:** o arquivo de `vlibras.gov.br` é
 * só um carregador — ele injeta o plugin de verdade (hoje em
 * `cdn.jsdelivr.net`) de forma assíncrona. Quando o `onload` dele dispara,
 * `window.VLibras` ainda não existe, então o `new Widget()` era pulado em
 * silêncio e nada mais o chamava. Sem `Widget()` construído, o botão fica com o
 * `display: none` que o CSS do próprio plugin lhe dá: altura zero, invisível.
 *
 * Por isso a espera ativa. Ela desiste depois de {@link LIMITE_MS} — se o
 * gov.br estiver fora do ar, o portal não fica sondando para sempre.
 */
const LIMITE_MS = 20_000;
const INTERVALO_MS = 200;

export function VLibrasWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let timer: number | undefined;
    const limite = Date.now() + LIMITE_MS;

    const iniciarQuandoChegar = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        return;
      }
      if (Date.now() < limite) {
        timer = window.setTimeout(iniciarQuandoChegar, INTERVALO_MS);
      }
    };

    if (!document.querySelector(`script[src="${VLIBRAS_SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = VLIBRAS_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    iniciarQuandoChegar();

    return () => window.clearTimeout(timer);
  }, []);

  const accessProps = { vw: '', className: 'enabled' };
  const buttonProps = { 'vw-access-button': '', className: 'active' };
  const wrapperProps = { 'vw-plugin-wrapper': '' };

  return (
    <div {...accessProps}>
      <div {...buttonProps} />
      <div {...wrapperProps}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
