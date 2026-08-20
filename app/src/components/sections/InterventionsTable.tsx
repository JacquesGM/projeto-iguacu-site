import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import intervencoesData from '../../data/intervencoes.json';
import municipiosData from '../../data/municipios.json';
import type { Intervencao, Municipio } from '../../types';
import { SituacaoBadge, SITUACOES_VALIDAS } from '../ui/SituacaoBadge';
import { EmptyState } from '../ui/EmptyState';
import { InterventionModal } from './InterventionModal';

const intervencoes = intervencoesData as Intervencao[];
const municipios = municipiosData as Municipio[];

const ALL = 'todos';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function nomeMunicipio(id: string): string {
  return municipios.find((m) => m.id === id)?.nome ?? 'Não informado';
}

// A Barragem de Gericinó é declarada para Nilópolis e Mesquita; os demais
// projetos têm um único município.
export function nomesMunicipios(item: Intervencao): string {
  return [item.municipioId, ...item.municipiosAdicionais].map(nomeMunicipio).join(' / ');
}

function ehDoMunicipio(item: Intervencao, municipioId: string): boolean {
  return item.municipioId === municipioId || item.municipiosAdicionais.includes(municipioId);
}

type CampoOrdenacao = 'nomeProjeto' | 'municipio' | 'tipo' | 'orgaoResponsavel' | 'situacao' | 'valorContrato' | 'ultimaAtualizacao';

function dataParaOrdenacao(valor: unknown): number {
  if (typeof valor !== 'string') return 0;
  const m = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return 0;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])).getTime();
}

function valorParaOrdenacao(item: Intervencao, campo: CampoOrdenacao): string | number {
  if (campo === 'municipio') return nomesMunicipios(item).toLowerCase();
  if (campo === 'valorContrato') return item.valorContrato ?? -1;
  if (campo === 'ultimaAtualizacao') return dataParaOrdenacao(item.ultimaAtualizacao);
  const valor = item[campo];
  return typeof valor === 'string' ? valor.toLowerCase() : String(valor ?? '');
}

const colunas: { campo: CampoOrdenacao; rotulo: string }[] = [
  { campo: 'nomeProjeto', rotulo: 'Projeto' },
  { campo: 'municipio', rotulo: 'Município' },
  { campo: 'tipo', rotulo: 'Tipo' },
  { campo: 'orgaoResponsavel', rotulo: 'Órgão executor' },
  { campo: 'situacao', rotulo: 'Situação' },
  { campo: 'valorContrato', rotulo: 'Valor do contrato' },
  { campo: 'ultimaAtualizacao', rotulo: 'Última atualização' },
];

const orgaos = [...new Set(intervencoes.map((i) => i.orgaoResponsavel))].sort();

export function InterventionsTable() {
  const [busca, setBusca] = useState('');
  const [municipioFiltro, setMunicipioFiltro] = useState(ALL);
  const [situacaoFiltro, setSituacaoFiltro] = useState(ALL);
  const [orgaoFiltro, setOrgaoFiltro] = useState(ALL);
  const [ordenacao, setOrdenacao] = useState<{ campo: CampoOrdenacao | null; direcao: 'asc' | 'desc' }>({
    campo: null,
    direcao: 'asc',
  });
  const [selecionada, setSelecionada] = useState<Intervencao | null>(null);

  const filtradas = useMemo(() => {
    const buscaLower = busca.trim().toLowerCase();
    return intervencoes.filter((i) => {
      if (municipioFiltro !== ALL && !ehDoMunicipio(i, municipioFiltro)) return false;
      if (situacaoFiltro !== ALL && i.situacao !== situacaoFiltro) return false;
      if (orgaoFiltro !== ALL && i.orgaoResponsavel !== orgaoFiltro) return false;
      if (buscaLower) {
        const alvo = [i.nomeProjeto, i.objeto, i.rio, i.orgaoResponsavel, i.tipo, nomesMunicipios(i)]
          .join(' ')
          .toLowerCase();
        if (!alvo.includes(buscaLower)) return false;
      }
      return true;
    });
  }, [busca, municipioFiltro, situacaoFiltro, orgaoFiltro]);

  const ordenadas = useMemo(() => {
    if (!ordenacao.campo) return filtradas;
    const campo = ordenacao.campo;
    const mult = ordenacao.direcao === 'asc' ? 1 : -1;
    return [...filtradas].sort((a, b) => {
      const va = valorParaOrdenacao(a, campo);
      const vb = valorParaOrdenacao(b, campo);
      if (va < vb) return -1 * mult;
      if (va > vb) return 1 * mult;
      return 0;
    });
  }, [filtradas, ordenacao]);

  function alternarOrdenacao(campo: CampoOrdenacao) {
    setOrdenacao((prev) =>
      prev.campo === campo ? { campo, direcao: prev.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: 'asc' },
    );
  }

  function limparFiltros() {
    setBusca('');
    setMunicipioFiltro(ALL);
    setSituacaoFiltro(ALL);
    setOrgaoFiltro(ALL);
  }

  const valorTexto = (v: number | null) => (v === null ? 'Não informado' : moeda.format(v));

  return (
    <div>
      <form
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        role="search"
        aria-label="Pesquisar e filtrar projetos"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="text-sm sm:col-span-2 lg:col-span-1">
          <span className="mb-1 block font-medium text-neutral-700">Pesquisar</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome do projeto, objeto, rio, órgão…"
            className="min-h-11 w-full rounded-md border border-neutral-400 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Município</span>
          <select
            value={municipioFiltro}
            onChange={(e) => setMunicipioFiltro(e.target.value)}
            className="min-h-11 w-full rounded-md border border-neutral-400 px-3 py-2 text-sm"
          >
            <option value={ALL}>Todos</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Situação</span>
          <select
            value={situacaoFiltro}
            onChange={(e) => setSituacaoFiltro(e.target.value)}
            className="min-h-11 w-full rounded-md border border-neutral-400 px-3 py-2 text-sm"
          >
            <option value={ALL}>Todas</option>
            {SITUACOES_VALIDAS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Órgão executor</span>
          <select
            value={orgaoFiltro}
            onChange={(e) => setOrgaoFiltro(e.target.value)}
            className="min-h-11 w-full rounded-md border border-neutral-400 px-3 py-2 text-sm"
          >
            <option value={ALL}>Todos</option>
            {orgaos.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500" role="status">
          {ordenadas.length} {ordenadas.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
        </p>
        <button
          type="button"
          onClick={limparFiltros}
          className="min-h-11 rounded-md border border-neutral-400 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Limpar filtros
        </button>
      </div>

      {ordenadas.length === 0 ? (
        <EmptyState message="Nenhum projeto encontrado para os filtros selecionados." onClear={limparFiltros} />
      ) : (
        <>
          {/* Tabela — telas médias e grandes */}
          <div className="hidden overflow-x-auto rounded-xl border border-neutral-200 md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  {colunas.map((c) => (
                    <th key={c.campo} scope="col" className="px-4 py-3 font-semibold">
                      <button
                        type="button"
                        onClick={() => alternarOrdenacao(c.campo)}
                        className="inline-flex items-center gap-1 hover:text-neutral-900"
                      >
                        {c.rotulo}
                        {ordenacao.campo === c.campo ? (
                          ordenacao.direcao === 'asc' ? (
                            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 text-neutral-300" />
                        )}
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {ordenadas.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="px-4 py-3 font-medium text-neutral-900">{item.nomeProjeto}</td>
                    <td className="px-4 py-3">{nomesMunicipios(item)}</td>
                    <td className="px-4 py-3">{item.tipo}</td>
                    <td className="px-4 py-3">{item.orgaoResponsavel}</td>
                    <td className="px-4 py-3">
                      <SituacaoBadge situacao={item.situacao} />
                    </td>
                    <td className="px-4 py-3">{valorTexto(item.valorContrato)}</td>
                    <td className="px-4 py-3">{item.ultimaAtualizacao}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelecionada(item)}
                        aria-haspopup="dialog"
                        className="min-h-9 rounded-md border border-neutral-400 px-3 text-xs font-medium text-brand-blue-700 hover:bg-brand-blue-50"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — celular */}
          <ul className="space-y-3 md:hidden">
            {ordenadas.map((item) => (
              <li key={item.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-neutral-900">{item.nomeProjeto}</p>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-neutral-500">Município</dt>
                    <dd className="text-right font-medium text-neutral-900">{nomesMunicipios(item)}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-neutral-500">Tipo</dt>
                    <dd className="text-right font-medium text-neutral-900">{item.tipo}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-neutral-500">Situação</dt>
                    <dd>
                      <SituacaoBadge situacao={item.situacao} />
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-neutral-500">Valor do contrato</dt>
                    <dd className="text-right font-medium text-neutral-900">{valorTexto(item.valorContrato)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => setSelecionada(item)}
                  aria-haspopup="dialog"
                  className="mt-3 min-h-11 w-full rounded-md border border-neutral-400 text-sm font-medium text-brand-blue-700 hover:bg-brand-blue-50"
                >
                  Ver detalhes
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <InterventionModal
        intervencao={selecionada}
        municipioNome={selecionada ? nomesMunicipios(selecionada) : ''}
        onClose={() => setSelecionada(null)}
      />
    </div>
  );
}
