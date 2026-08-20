import type { ReactNode } from 'react';

export function Section({
  id,
  title,
  subtitle,
  children,
  tone = 'default',
  headingLevel = 'h2',
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  tone?: 'default' | 'muted';
  /**
   * Nível do título da seção. Use 'h1' quando a seção for o conteúdo principal
   * da página — toda página precisa de exatamente um h1, e quem navega por
   * leitor de tela usa esse título para saber onde está. O padrão é 'h2'
   * porque a página inicial já tem o h1 no hero.
   */
  headingLevel?: 'h1' | 'h2';
}) {
  const headingId = `${id}-heading`;
  const Heading = headingLevel;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={`scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8 ${tone === 'muted' ? 'bg-neutral-50' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-6xl">
        <Heading id={headingId} className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          {title}
        </Heading>
        {subtitle && <p className="mt-2 max-w-3xl text-neutral-600">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
