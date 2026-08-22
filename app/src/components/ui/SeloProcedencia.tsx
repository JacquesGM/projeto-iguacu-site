import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import type { Intervencao } from '../../types';

/**
 * Diz, junto do dado, quem o declarou e quando.
 *
 * Num portal de transparência o número sozinho não basta: "R$ 86.595.162,77"
 * não responde quem afirmou isso nem em que data. A procedência já estava no
 * portal — nas duas últimas linhas do detalhe, iguais a todas as outras e
 * portanto invisíveis. Aqui ela vira um bloco próprio, e acompanha o projeto
 * onde ele for lido.
 *
 * **Sobre o "declarado por".** O campo é o `orgaoResponsavel`, que é o órgão
 * executor. Atribuir a declaração a ele não é dedução nossa: a página de
 * Transparência registra que os dados "são declarados pelos próprios órgãos
 * responsáveis pela execução (…) em formulário padronizado", e o IRM
 * consolida antes de publicar. A variante completa mostra essa cadeia inteira
 * — quem declarou, quando, e de onde o portal transcreveu — para que a
 * afirmação possa ser conferida em vez de aceita.
 */

export function SeloProcedencia({ intervencao }: { intervencao: Intervencao }) {
  return (
    <p className="mt-3 flex items-start gap-1.5 text-xs text-neutral-500">
      <BadgeCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        Declarado por <span className="font-medium text-neutral-700">{intervencao.orgaoResponsavel}</span> em{' '}
        {intervencao.dataInformacao}
      </span>
    </p>
  );
}

function Item({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="sm:grid sm:grid-cols-[140px_1fr] sm:gap-3">
      <dt className="text-neutral-500">{rotulo}</dt>
      <dd className="text-neutral-800">{children}</dd>
    </div>
  );
}

export function SeloProcedenciaCompleto({ intervencao }: { intervencao: Intervencao }) {
  return (
    <section
      aria-label="Procedência do dado"
      className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
    >
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
        <BadgeCheck aria-hidden="true" className="h-4 w-4 text-brand-blue-700" />
        Procedência deste dado
      </h3>

      <dl className="mt-3 space-y-2 text-sm">
        <Item rotulo="Declarado por">{intervencao.orgaoResponsavel}</Item>
        <Item rotulo="Data da informação">{intervencao.dataInformacao}</Item>
        <Item rotulo="Transcrito de">{intervencao.fonte}</Item>
      </dl>

      <p className="mt-3 text-xs text-neutral-600">
        Os órgãos executores declaram os dados dos próprios projetos em formulário padronizado; o Instituto Rio
        Metrópole confere e consolida antes de publicar, e não executa as obras.{' '}
        <Link to="/transparencia" className="text-brand-blue-700 underline underline-offset-2">
          Como o dado é apurado
        </Link>
        .
      </p>
    </section>
  );
}
