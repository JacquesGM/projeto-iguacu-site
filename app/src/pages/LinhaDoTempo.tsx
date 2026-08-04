import linhaDoTempoData from '../data/linhaDoTempo.json';
import type { MarcoLinhaDoTempo } from '../types';
import { Section } from '../components/ui/Section';

const marcos = linhaDoTempoData as MarcoLinhaDoTempo[];

export function LinhaDoTempo() {
  return (
    <Section
      id="linha-do-tempo"
      title="Linha do tempo institucional"
      subtitle="Do primeiro estudo técnico, em 1996, até a fase atual do Projeto Iguaçu."
    >
      <ol className="relative space-y-6 border-l-2 border-brand-blue-200 pl-6">
        {marcos.map((marco) => (
          <li key={marco.id} className="relative">
            <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-blue-600 ring-2 ring-brand-blue-100" />
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-600">{marco.data}</p>
            <p className="text-xs text-neutral-500">{marco.categoria}</p>
            <p className="mt-1 font-semibold text-neutral-900">{marco.titulo}</p>
            <p className="mt-1 text-sm text-neutral-600">{marco.descricao}</p>
            <p className="mt-1.5 text-xs text-neutral-500">
              Fonte: {marco.fonte}
              {!marco.confirmado && ' — Data em validação'}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
