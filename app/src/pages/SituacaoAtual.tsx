import situacaoAtualData from '../data/situacaoAtual.json';
import type { SituacaoAtual as SituacaoAtualType } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';

const situacao = situacaoAtualData as SituacaoAtualType;

export function SituacaoAtual() {
  return (
    <Section
      id="situacao-atual"
      title="Situação atual"
      subtitle="Fase, marcos e atividades em andamento do Projeto Iguaçu."
      tone="muted"
    >
      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-neutral-500">Fase atual</dt>
            <dd className="mt-1 font-medium text-neutral-900">{situacao.faseAtual}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Situação geral</dt>
            <dd className="mt-1 font-medium text-neutral-900">{situacao.situacaoGeral}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Último marco</dt>
            <dd className="mt-1 font-medium text-neutral-900">{situacao.ultimoMarco}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Próximo marco</dt>
            <dd className="mt-1 font-medium text-neutral-900">{situacao.proximoMarco}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Data de referência</dt>
            <dd className="mt-1 font-medium text-neutral-900">{situacao.dataReferencia}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-6">
        <p className="font-semibold text-neutral-900">Atividades em andamento</p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          {situacao.atividadesEmAndamento.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue-500" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-6 text-sm text-neutral-500">
        Legenda de situações: Em planejamento · Em licitação · Em execução · Concluída · Atrasada ·
        Paralisada · Aguardando informação · Aguardando validação.
      </p>
    </Section>
  );
}
