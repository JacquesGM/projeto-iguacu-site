import { AlertTriangle } from 'lucide-react';
import linhaDoTempoData from '../data/linhaDoTempo.json';
import situacaoAtualData from '../data/situacaoAtual.json';
import type { MarcoLinhaDoTempo, SituacaoAtual as SituacaoAtualType } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';

const marcos = linhaDoTempoData as MarcoLinhaDoTempo[];
const situacao = situacaoAtualData as SituacaoAtualType;

export function LinhaDoTempo() {
  return (
    <Section
      id="linha-do-tempo"
      title="Linha do tempo institucional"
      subtitle="Do primeiro estudo técnico, em 1996, até a fase atual do Projeto Iguaçu."
    >
      <Card className="mb-6 border-amber-300 bg-amber-50">
        <div className="flex gap-3">
          <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-900">{situacao.escopoRessalva}</p>
        </div>
      </Card>

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
