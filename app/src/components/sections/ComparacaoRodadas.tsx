import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import intervencoesData from '../../data/intervencoes.json';
import rodadasData from '../../data/rodadasAnteriores.json';
import metaData from '../../data/meta.json';
import type { Intervencao, Meta, RodadaAnterior } from '../../types';
import { compararRodadas, rodadaMaisRecente } from '../../lib/comparacaoRodadas';

const intervencoes = intervencoesData as Intervencao[];
const rodadasAnteriores = rodadasData as RodadaAnterior[];
const meta = metaData as Meta;

function Contagem({ n, singular, plural }: { n: number; singular: string; plural: string }) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <span className="block text-2xl font-bold text-neutral-900">{n}</span>
      <span className="text-sm text-neutral-600">{n === 1 ? singular : plural}</span>
    </li>
  );
}

function ListaDeProjetos({ titulo, projetos }: { titulo: string; projetos: Intervencao[] }) {
  if (projetos.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-neutral-900">{titulo}</h3>
      <ul className="mt-2 space-y-1.5">
        {projetos.map((p) => (
          <li key={p.id} className="text-sm text-neutral-700">
            {p.nomeProjeto}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Os dados vêm por prop com valor padrão para que o estado preenchido possa
 * ser testado hoje: até 08/10/2026 não existe rodada anterior arquivada, e
 * sem isso a metade mais importante do componente ficaria sem cobertura.
 */
interface Props {
  rodadas?: RodadaAnterior[];
  atuais?: Intervencao[];
  referenciaAtual?: string;
}

export function ComparacaoRodadas({
  rodadas = rodadasAnteriores,
  atuais = intervencoes,
  referenciaAtual = meta.ultimaAtualizacao,
}: Props = {}) {
  const anterior = useMemo(() => rodadaMaisRecente(rodadas), [rodadas]);
  const comparacao = useMemo(
    () => (anterior ? compararRodadas(anterior, atuais, referenciaAtual) : null),
    [anterior, atuais, referenciaAtual],
  );

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-neutral-900">O que mudou entre as rodadas</h2>

      {!comparacao ? (
        <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-700">
            A rodada de <strong>{referenciaAtual}</strong> é a primeira publicada com o escopo atual, então
            ainda não há rodada anterior com que compará-la. A partir da próxima atualização, prevista para{' '}
            <strong>{meta.proximaAtualizacao}</strong>, esta seção passa a listar, projeto a projeto, o que mudou:
            situação, valor de contrato, empresa, prazos, coordenadas, e quais projetos entraram ou saíram.
          </p>
          <p className="mt-3 text-sm text-neutral-600">
            Os dados publicados antes de {referenciaAtual} vinham de outra fonte — a extração do BI/INFOVIA
            de {meta.dataReferencia} — com escopo e identificadores diferentes. Compará-los com os atuais produziria
            uma lista de entradas e saídas que refletiria a troca de fonte, não o andamento das obras. Por isso a
            comparação começa em {referenciaAtual}. O histórico completo continua no{' '}
            <a
              href="https://github.com/JacquesGM/projeto-iguacu-site"
              className="text-brand-blue-600 underline underline-offset-2"
            >
              repositório público
            </a>
            , commit a commit.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-neutral-600">
            Da rodada de <strong>{comparacao.referenciaAnterior}</strong> para a de{' '}
            <strong>{comparacao.referenciaAtual}</strong>. Os valores aparecem como os órgãos os declararam: a
            página mostra o antes e o depois lado a lado e para por aí, sem classificar a mudança como avanço ou
            atraso.
          </p>

          {/* Duas colunas já no celular: empilhados, quatro números ocupariam
              uma tela inteira de rolagem para dizer muito pouco. */}
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Contagem n={comparacao.alterados.length} singular="projeto com mudança" plural="projetos com mudança" />
            <Contagem n={comparacao.entraram.length} singular="projeto entrou" plural="projetos entraram" />
            <Contagem n={comparacao.sairam.length} singular="projeto saiu" plural="projetos saíram" />
            <Contagem n={comparacao.semMudanca} singular="projeto sem mudança" plural="projetos sem mudança" />
          </ul>

          {comparacao.alterados.length > 0 && (
            <ul className="mt-6 space-y-4">
              {comparacao.alterados.map((projeto) => (
                <li key={projeto.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-neutral-900">{projeto.nomeProjeto}</h3>
                  <dl className="mt-3 space-y-2.5">
                    {projeto.mudancas.map((m) => (
                      <div key={m.campo} className="text-sm">
                        <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{m.rotulo}</dt>
                        {/* O `relative` prende os `sr-only` daqui: sendo absolutos sem
                            ancestral posicionado, eles se posicionariam pelo documento e
                            fariam a página rolar na horizontal. Ja aconteceu na tabela.
                            O tracejado e a seta sao so visuais — a direcao da mudanca
                            precisa estar no texto para quem usa leitor de tela. */}
                        <dd className="relative mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="sr-only">de</span>
                          <span className="text-neutral-500 line-through">{m.de}</span>
                          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                          <span className="sr-only">para</span>
                          <span className="font-medium text-neutral-900">{m.para}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          )}

          <ListaDeProjetos titulo="Entraram nesta rodada" projetos={comparacao.entraram} />
          <ListaDeProjetos
            titulo={`Constavam em ${comparacao.referenciaAnterior} e não constam agora`}
            projetos={comparacao.sairam}
          />
        </>
      )}
    </div>
  );
}
