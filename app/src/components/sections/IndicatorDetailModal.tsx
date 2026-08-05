import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { DetalheIndicador } from '../../types';

export function IndicatorDetailModal({
  detalhe,
  onClose,
}: {
  detalhe: DetalheIndicador | null;
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
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl outline-none"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 p-6 pb-4">
          <h2 id="indicador-modal-titulo" className="text-lg font-bold text-neutral-900">
            {detalhe.titulo}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 pt-4">
          <p className="text-sm text-neutral-700">{detalhe.texto}</p>
          <p className="mt-4 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-600">Fonte: </span>
            {detalhe.fonte}
          </p>
        </div>
      </div>
    </div>
  );
}
