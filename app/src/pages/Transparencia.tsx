import transparenciaData from '../data/transparencia.json';
import contatosData from '../data/contatos.json';
import type { Contato, Transparencia as TransparenciaType } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';

const transparencia = transparenciaData as TransparenciaType;
const contatos = contatosData as Contato[];

function Definicao({ termo, significado }: { termo: string; significado: string }) {
  return (
    <div className="border-b border-neutral-100 py-2.5 sm:grid sm:grid-cols-[220px_1fr] sm:gap-3">
      <dt className="font-medium text-neutral-900">{termo}</dt>
      <dd className="mt-0.5 text-neutral-600 sm:mt-0">{significado}</dd>
    </div>
  );
}

export function Transparencia() {
  return (
    <Section
      id="transparencia"
      title="Transparência e metodologia"
      subtitle="De onde vêm os dados, quem os fornece e como o IRM os consolida."
      tone="muted"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-neutral-700">
          <div>
            <p className="font-semibold text-neutral-900">Origem dos dados</p>
            <p className="mt-1">{transparencia.origemDados}</p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Responsáveis pelo fornecimento</p>
            <p className="mt-1">{transparencia.responsaveisFornecimento}</p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Consolidação</p>
            <p className="mt-1">{transparencia.consolidacaoIRM}</p>
          </div>
        </div>
        <div className="space-y-4 text-neutral-700">
          <div>
            <p className="font-semibold text-neutral-900">Data de referência e periodicidade</p>
            <p className="mt-1">
              Data de referência: {transparencia.dataReferencia}. {transparencia.periodicidade}
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Limitações desta versão</p>
            <p className="mt-1">{transparencia.limitacoes}</p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Canal para esclarecimentos e correções</p>
            <p className="mt-1">{transparencia.canalContato}</p>
          </div>
        </div>
      </div>

      <Card className="mt-8 border-amber-300 bg-amber-50">
        <p className="text-sm text-amber-900">{transparencia.avisoConsolidacao}</p>
      </Card>

      <div className="mt-10">
        <p className="text-lg font-semibold text-neutral-900">Significado das situações</p>
        <dl className="mt-3">
          {transparencia.significadoSituacoes.map((item) => (
            <Definicao key={item.situacao} termo={item.situacao} significado={item.significado} />
          ))}
        </dl>
      </div>

      <div className="mt-10">
        <p className="text-lg font-semibold text-neutral-900">Glossário de siglas e termos técnicos</p>
        <dl className="mt-3">
          {transparencia.glossario.map((item) => (
            <Definicao key={item.termo} termo={item.termo} significado={item.significado} />
          ))}
        </dl>
      </div>

      <div className="mt-10">
        <p className="text-lg font-semibold text-neutral-900">Contatos do Grupo de Trabalho</p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {contatos.map((c) => (
            <li key={c.email} className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
              <p className="font-semibold text-neutral-900">{c.nome}</p>
              <p className="text-neutral-600">{c.cargo}</p>
              <a href={`mailto:${c.email}`} className="text-brand-blue-600 hover:underline">
                {c.email}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
