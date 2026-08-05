import { CheckCircle2, Landmark, Users } from 'lucide-react';
import sobreProjetoData from '../../data/sobreProjeto.json';
import type { SobreProjeto } from '../../types';
import { Section } from '../ui/Section';

const sobre = sobreProjetoData as SobreProjeto;

export function Sobre() {
  return (
    <Section
      id="sobre"
      title="Sobre o Projeto Iguaçu"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-neutral-700">
          <div>
            <p className="font-semibold text-neutral-900">O que é</p>
            <p className="mt-1">{sobre.oQueE}</p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">O problema público</p>
            <p className="mt-1">{sobre.problemaPublico}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold text-neutral-900">Objetivos</p>
          <ul className="mt-2 space-y-2">
            {sobre.objetivos.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex gap-3 rounded-xl border border-brand-blue-200 bg-brand-blue-50 p-5">
        <Landmark aria-hidden="true" className="h-6 w-6 shrink-0 text-brand-blue-700" />
        <div>
          <p className="font-semibold text-brand-blue-900">{sobre.blocoPapelIRM.titulo}</p>
          <p className="mt-1 text-sm text-brand-blue-800">{sobre.blocoPapelIRM.texto}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="font-semibold text-neutral-900">Base legal</p>
          <ul className="mt-2 space-y-2 text-sm text-neutral-600">
            {sobre.baseLegal.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-2 font-semibold text-neutral-900">
            <Users aria-hidden="true" className="h-4 w-4 text-brand-blue-600" />
            Órgãos participantes
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-neutral-600">
            {sobre.orgaosParticipantes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-neutral-500">{sobre.municipiosContempladosTexto}</p>
        </div>
      </div>
    </Section>
  );
}
