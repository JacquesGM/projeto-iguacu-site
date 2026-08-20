import documentosData from '../data/documentos.json';
import fontesData from '../data/fontes.json';
import type { Documento } from '../types';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { DownloadButton } from '../components/ui/DownloadButton';
import type { DownloadColumn } from '../lib/download';

const documentos = documentosData as Documento[];
const fontes = fontesData as string[];

const colunasDocumentos: DownloadColumn<Documento>[] = [
  { key: 'titulo', label: 'Título' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'data', label: 'Data' },
  { key: 'orgao', label: 'Órgão' },
  { key: 'formato', label: 'Formato' },
  { key: 'descricao', label: 'Descrição' },
  { key: 'url', label: 'Link' },
];

export function Documentos() {
  return (
    <Section
      id="documentos"
      title="Documentos e links"
      headingLevel="h1"
      subtitle="Atos normativos, relatórios, apresentações e sistemas públicos relacionados ao Projeto Iguaçu."
    >
      <div className="mb-6">
        <DownloadButton
          filename="documentos-projeto-iguacu"
          title="Documentos e links — Projeto Iguaçu"
          data={documentos}
          columns={colunasDocumentos}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {documentos.map((doc) => {
          const linkLimpo = doc.url.trim();
          return (
            <Card key={doc.id} className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-blue-600">{doc.tipo}</span>
              <p className="mt-1 font-semibold text-neutral-900">{doc.titulo}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {[doc.orgao, doc.data, doc.formato].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-2 text-sm text-neutral-600">{doc.descricao}</p>
              <div className="mt-4">
                {linkLimpo === '' ? (
                  <span className="inline-block rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-500">
                    Link a inserir
                  </span>
                ) : (
                  <a
                    href={linkLimpo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-md bg-brand-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-600"
                  >
                    Acessar documento
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-900">Fontes gerais</h2>
        <ul className="mt-2 space-y-1 text-sm text-neutral-600">
          {fontes.map((fonte) => (
            <li key={fonte}>{fonte}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
