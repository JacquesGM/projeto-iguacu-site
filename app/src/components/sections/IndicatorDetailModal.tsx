import { useEffect, useRef } from 'react';
import { ChevronRight, X } from 'lucide-react';
import type { DetalheIndicador, ItemPopupIndicador } from '../../types';
import { situacaoColorHex } from '../ui/SituacaoBadge';

function ItemLista({ item, onClick }: { item: ItemPopupIndicador; onClick?: () => void }) {
  const cor = item.cor ?? (item.situacao ? situacaoColorHex(item.situacao) : '#94a3b8');
  const conteudo = (
    <>
      <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cor }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-900">{item.titulo}</span>
        {item.subtitulo && <span className="block text-xs text-neutral-500">{item.subtitulo}</span>}
      </span>
      {item.valorTexto && (
        <span className="shrink-0 text-xs font-medium text-neutral-700">{item.valorTexto}</span>
      )}
      {onClick && <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-400" />}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-neutral-50"
      >
        {conteudo}
      </button>
    );
  }

  return <div className="flex items-start gap-2.5 rounded-lg px-2 py-2">{conteudo}</div>;
}

export function IndicatorDetailModal({
  detalhe,
  fontePadrao,
  itens = [],
  onSelecionarItem,
  onClose,
}: {
  detalhe: DetalheIndicador | null;
  fontePadrao: string;
  itens?: ItemPopupIndicador[];
  onSelecionarItem?: (intervencaoId: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!detalhe) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [detalhe, onClose]);

  if (!detalhe) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="indicador-modal-titulo"
        tabIndex={-1}
        className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl bg-white shadow-xl outline-none"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 p-6 pb-4">
          <h2 id="indicador-modal-titulo" className="text-lg font-bold text-neutral-900">
            {detalhe.titulo}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">O que é</p>
          <p className="mt-1 text-sm text-neutral-800">{detalhe.oQueE}</p>

          {detalhe.ressalva && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">Ressalva</p>
              <p className="mt-1 text-sm text-neutral-800">{detalhe.ressalva}</p>
            </>
          )}

          {itens.length > 0 && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {detalhe.rotuloLista ?? 'Detalhamento'}
              </p>
              <div className="mt-1 divide-y divide-neutral-100 border-y border-neutral-100">
                {itens.map((item) => (
                  <ItemLista
                    key={item.id}
                    item={item}
                    onClick={
                      item.intervencaoId && onSelecionarItem
                        ? () => onSelecionarItem(item.intervencaoId as string)
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}

          <p className="mt-5 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
            Fonte: {detalhe.fonte ?? fontePadrao}
          </p>
        </div>
      </div>
    </div>
  );
}
