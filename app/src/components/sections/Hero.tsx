import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import apresentacaoData from '../../data/apresentacao.json';
import metaData from '../../data/meta.json';
import type { Apresentacao, Meta } from '../../types';
import rioIguacu from '../../assets/rio-iguacu-nascente.jpg';

const apresentacao = apresentacaoData as Apresentacao;
const meta = metaData as Meta;

export function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden bg-gradient-to-br from-brand-blue-700 via-brand-blue-600 to-brand-green-600 text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="text-left text-sm font-semibold uppercase tracking-wide text-white">
            Instituto Rio Metrópole — Acompanhamento público
          </p>
          <h1 id="hero-titulo" tabIndex={-1} className="mt-3 outline-none">
            <span className="block text-5xl font-extrabold leading-none tracking-tight sm:text-6xl lg:text-7xl">
              {apresentacao.titulo}
            </span>
            <span className="mt-3 block h-1 w-16 rounded-full bg-brand-green-300" />
            <span className="mt-3 block text-xl font-medium leading-snug text-brand-blue-50 sm:text-2xl">
              {apresentacao.subtitulo}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-blue-50 sm:text-lg">{apresentacao.textoIntro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/intervencoes"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue-700 hover:bg-brand-blue-50"
            >
              Consultar projetos
            </Link>
            <Link
              to="/documentos"
              className="rounded-md border border-white/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Acessar documentos
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-2 text-sm text-brand-blue-50 sm:flex-row sm:items-center sm:gap-4">
            <span>
              Última atualização: <strong className="font-semibold text-white">{meta.ultimaAtualizacao}</strong>
            </span>
            <Link
              to="/transparencia"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-100 hover:bg-amber-500/20"
            >
              <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
              {meta.avisoVersaoBeta}
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <figure className="isolate overflow-hidden rounded-2xl border border-white/20 bg-white/10">
            <img src={rioIguacu} alt={apresentacao.imagemAlt} className="h-full w-full object-cover" />
          </figure>
          <p className="mt-3 text-center text-xs text-white/70">{apresentacao.imagemCredito}</p>
        </div>
      </div>
    </section>
  );
}
