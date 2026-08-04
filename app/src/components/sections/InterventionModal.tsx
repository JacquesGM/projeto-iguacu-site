import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Intervencao } from '../../types';
import { SituacaoBadge } from '../ui/SituacaoBadge';

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-neutral-100 py-2.5 sm:grid-cols-[190px_1fr] sm:gap-3">
      <dt className="text-sm text-neutral-500">{rotulo}</dt>
      <dd className="text-sm text-neutral-900">{children}</dd>
    </div>
  );
}

function valorOuTexto(valor: number | string): string {
  return typeof valor === 'number' ? `${valor}%` : valor;
}

export function InterventionModal({
  intervencao,
  municipioNome,
  onClose,
}: {
  intervencao: Intervencao | null;
  municipioNome: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!intervencao) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();
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
  }, [intervencao, onClose]);

  if (!intervencao) return null;

  const linkLimpo = intervencao.linkDocumento.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-titulo" className="text-lg font-bold text-neutral-900">
            {intervencao.nomeProjeto}
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

        <dl className="mt-4">
          <Linha rotulo="Descrição">{intervencao.descricao}</Linha>
          <Linha rotulo="Município">{municipioNome}</Linha>
          <Linha rotulo="Rio">{intervencao.rio}</Linha>
          <Linha rotulo="Localização">{intervencao.localizacaoTexto}</Linha>
          <Linha rotulo="Órgão responsável">{intervencao.orgaoResponsavel}</Linha>
          <Linha rotulo="Empresa contratada">{intervencao.empresaContratada}</Linha>
          <Linha rotulo="Contrato">{intervencao.contrato}</Linha>
          <Linha rotulo="Valor contratado">{intervencao.valorContrato}</Linha>
          <Linha rotulo="Fonte do recurso">{intervencao.fonteRecurso}</Linha>
          <Linha rotulo="Fase">{intervencao.fase}</Linha>
          <Linha rotulo="Situação">
            <SituacaoBadge situacao={intervencao.situacao} />
          </Linha>
          <Linha rotulo="Execução física">{valorOuTexto(intervencao.execucaoFisica)}</Linha>
          <Linha rotulo="Execução financeira">{valorOuTexto(intervencao.execucaoFinanceira)}</Linha>
          <Linha rotulo="Data de início prevista/vigência">{intervencao.dataInicioVigencia}</Linha>
          <Linha rotulo="Data prevista de conclusão">{intervencao.dataPrevista}</Linha>
          <Linha rotulo="Data atualizada de conclusão">{intervencao.dataAtualizada}</Linha>
          <Linha rotulo="Motivo de atraso/paralisação">{intervencao.motivoAtrasoParalisacao}</Linha>
          <Linha rotulo="Próximo marco">{intervencao.proximoMarco}</Linha>
          <Linha rotulo="Data da informação">{intervencao.dataInformacao}</Linha>
          <Linha rotulo="Fonte">{intervencao.fonte}</Linha>
          <Linha rotulo="Link para documento público">
            {linkLimpo === '' ? (
              'Link a inserir'
            ) : (
              <a
                href={linkLimpo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue-600 hover:underline"
              >
                Acessar documento
              </a>
            )}
          </Linha>
          {intervencao.demonstrativo && (
            <Linha rotulo="Aviso">
              <span className="text-status-orange">Registro demonstrativo — não representa informação oficial.</span>
            </Linha>
          )}
        </dl>
      </div>
    </div>
  );
}
