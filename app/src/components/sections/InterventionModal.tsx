import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Intervencao } from '../../types';
import { SituacaoBadge } from '../ui/SituacaoBadge';
import { SeloProcedenciaCompleto } from '../ui/SeloProcedencia';
import { primeiraMaiuscula } from '../../lib/texto';

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-neutral-100 py-2.5 sm:grid-cols-[190px_1fr] sm:gap-3">
      <dt className="text-sm text-neutral-500">{rotulo}</dt>
      <dd className="text-sm text-neutral-900">{children}</dd>
    </div>
  );
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function textoOu(valor: string | number | null): string {
  if (valor === null || valor === '') return 'Não informado';
  return String(valor);
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
  const corpoRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!intervencao) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    // scrollTop antes do focus(): o foco num elemento mais alto que a
    // viewport faz o navegador rolar até o fim dele, escondendo o título no
    // topo do modal. Zerar o scroll do corpo evita esse comportamento.
    if (corpoRef.current) corpoRef.current.scrollTop = 0;
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
  }, [intervencao, onClose]);

  if (!intervencao) return null;

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
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl outline-none"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 p-6 pb-4 sm:p-8 sm:pb-4">
          <h2 id="modal-titulo" className="text-lg font-bold text-neutral-900">
            {intervencao.nomeProjeto}
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

        <div ref={corpoRef} className="overflow-y-auto p-6 pt-4 sm:p-8 sm:pt-4">
          <dl>
            <Linha rotulo="Objeto">{intervencao.objeto}</Linha>
            <Linha rotulo="Tipo">{primeiraMaiuscula(intervencao.tipo)}</Linha>
            <Linha rotulo="Município">{municipioNome}</Linha>
            <Linha rotulo="Rio / corpo hídrico">{intervencao.rio}</Linha>
            <Linha rotulo="Coordenadas">
              {intervencao.coordenadasTexto ?? 'Não informado'}
            </Linha>
            <Linha rotulo="Órgão responsável">{intervencao.orgaoResponsavel}</Linha>
            <Linha rotulo="Empresa contratada">
              {intervencao.empresaContratada ?? intervencao.empresaTexto ?? 'Não informado'}
            </Linha>
            <Linha rotulo="Processo">{textoOu(intervencao.processoSEI)}</Linha>
            <Linha rotulo="Programa / fonte do recurso">{textoOu(intervencao.programa)}</Linha>
            <Linha rotulo="Valor do contrato">
              {intervencao.valorContrato !== null ? moeda.format(intervencao.valorContrato) : 'Não informado'}
            </Linha>
            <Linha rotulo="Situação">
              <SituacaoBadge situacao={intervencao.situacao} />
            </Linha>
            <Linha rotulo="Prazo do contrato">
              {intervencao.prazoTexto ??
                (intervencao.prazoContratoMeses !== null ? `${intervencao.prazoContratoMeses} meses` : 'Não informado')}
            </Linha>
            <Linha rotulo="Início de vigência">
              {intervencao.dataInicioVigencia ?? intervencao.dataInicioVigenciaTexto ?? 'Não informado'}
            </Linha>
            <Linha rotulo="Término de vigência">
              {intervencao.dataTerminoVigencia ?? intervencao.dataTerminoVigenciaTexto ?? 'Não informado'}
            </Linha>
            {intervencao.observacoes && <Linha rotulo="Observações do órgão">{intervencao.observacoes}</Linha>}
          </dl>

          {/* A procedencia era as duas ultimas linhas da lista, com o mesmo peso
              visual do resto e por isso invisivel. Agora fecha o detalhe como
              bloco proprio. Fica DENTRO do corpo rolavel: fixo no rodape do
              modal, roubaria altura util num celular de 700px. */}
          <SeloProcedenciaCompleto intervencao={intervencao} />
        </div>
      </div>
    </div>
  );
}
