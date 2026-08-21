import type { Intervencao, RodadaAnterior } from '../types';

/**
 * Compara a rodada de atualização corrente com a anterior e diz, projeto a
 * projeto, o que mudou.
 *
 * A regra que rege isto é a mesma do resto do portal: **não interpretar**. A
 * comparação mostra "de → para" e para por aí. Não afirma que uma situação
 * "avançou" nem que um valor "aumentou por causa de X": a fonte declara
 * estados, não progresso, e ordenar as situações numa escala seria dedução
 * nossa. Quem lê tira a conclusão.
 *
 * O que entra na comparação é o **valor exibido**, com a mesma precedência que
 * o detalhe do projeto usa. Quando a fonte declara uma data como texto
 * ("Janeiro de 2027 (a confirmar)"), é esse texto que aparece no portal e é
 * ele que é comparado. Comparar o campo normalizado faria a página anunciar
 * mudança onde só mudou a nossa normalização.
 */

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const NAO_INFORMADO = 'Não informado';

function texto(valor: string | null | undefined): string {
  const limpo = (valor ?? '').trim();
  return limpo.length > 0 ? limpo : NAO_INFORMADO;
}

/**
 * O valor como o portal o exibe. A ordem dos argumentos importa e segue a
 * mesma do detalhe do projeto: o campo principal quando existe, o texto
 * declarado pela fonte quando não. Comparar outra coisa faria a página
 * anunciar mudança onde só mudou a nossa normalização.
 */
function comoExibido(principal: string | null, declarado: string | null): string {
  return texto(principal ?? declarado);
}

function contagemCoordenadas(item: Intervencao): string {
  const n = item.pontos.length;
  if (n === 0) return 'Sem coordenada declarada';
  return n === 1 ? '1 coordenada' : `${n} coordenadas`;
}

interface CampoComparado {
  campo: string;
  rotulo: string;
  ler: (item: Intervencao) => string;
}

/**
 * Campos que valem uma linha de "o que mudou". A lista é deliberadamente
 * curta: são os que respondem a alguma pergunta de quem acompanha a obra.
 */
export const CAMPOS_COMPARADOS: CampoComparado[] = [
  { campo: 'nomeProjeto', rotulo: 'Nome do projeto', ler: (i) => texto(i.nomeProjeto) },
  { campo: 'situacao', rotulo: 'Situação', ler: (i) => texto(i.situacao) },
  {
    campo: 'valorContrato',
    rotulo: 'Valor do contrato',
    ler: (i) => (i.valorContrato === null ? NAO_INFORMADO : moeda.format(i.valorContrato)),
  },
  { campo: 'orgaoResponsavel', rotulo: 'Órgão executor', ler: (i) => texto(i.orgaoResponsavel) },
  {
    campo: 'empresaContratada',
    rotulo: 'Empresa contratada',
    ler: (i) => comoExibido(i.empresaContratada, i.empresaTexto),
  },
  { campo: 'processoSEI', rotulo: 'Processo SEI', ler: (i) => texto(i.processoSEI) },
  {
    campo: 'dataInicioVigencia',
    rotulo: 'Início da vigência',
    ler: (i) => comoExibido(i.dataInicioVigencia, i.dataInicioVigenciaTexto),
  },
  {
    campo: 'dataTerminoVigencia',
    rotulo: 'Término da vigência',
    ler: (i) => comoExibido(i.dataTerminoVigencia, i.dataTerminoVigenciaTexto),
  },
  {
    campo: 'prazoContrato',
    rotulo: 'Prazo do contrato',
    ler: (i) =>
      i.prazoTexto?.trim()
        ? i.prazoTexto.trim()
        : i.prazoContratoMeses === null
          ? NAO_INFORMADO
          : `${i.prazoContratoMeses} meses`,
  },
  { campo: 'objeto', rotulo: 'Objeto', ler: (i) => texto(i.objeto) },
  { campo: 'coordenadas', rotulo: 'Coordenadas', ler: contagemCoordenadas },
];

export interface MudancaCampo {
  campo: string;
  rotulo: string;
  de: string;
  para: string;
}

export interface ProjetoAlterado {
  id: string;
  nomeProjeto: string;
  mudancas: MudancaCampo[];
}

export interface ComparacaoRodadas {
  referenciaAnterior: string;
  rotuloAnterior: string;
  referenciaAtual: string;
  /** Estavam ausentes na rodada anterior. */
  entraram: Intervencao[];
  /** Constavam da rodada anterior e não estão na atual. */
  sairam: Intervencao[];
  alterados: ProjetoAlterado[];
  /** Presentes nas duas rodadas sem nenhuma diferença nos campos comparados. */
  semMudanca: number;
}

export function compararProjetos(antes: Intervencao, depois: Intervencao): MudancaCampo[] {
  const mudancas: MudancaCampo[] = [];
  for (const { campo, rotulo, ler } of CAMPOS_COMPARADOS) {
    const de = ler(antes);
    const para = ler(depois);
    if (de !== para) mudancas.push({ campo, rotulo, de, para });
  }
  return mudancas;
}

export function compararRodadas(
  anterior: RodadaAnterior,
  atuais: Intervencao[],
  referenciaAtual: string,
): ComparacaoRodadas {
  const antesPorId = new Map(anterior.projetos.map((p) => [p.id, p]));
  const idsAtuais = new Set(atuais.map((p) => p.id));

  const entraram: Intervencao[] = [];
  const alterados: ProjetoAlterado[] = [];
  let semMudanca = 0;

  for (const atual of atuais) {
    const antes = antesPorId.get(atual.id);
    if (!antes) {
      entraram.push(atual);
      continue;
    }
    const mudancas = compararProjetos(antes, atual);
    if (mudancas.length === 0) {
      semMudanca += 1;
      continue;
    }
    alterados.push({ id: atual.id, nomeProjeto: atual.nomeProjeto, mudancas });
  }

  const sairam = anterior.projetos.filter((p) => !idsAtuais.has(p.id));

  return {
    referenciaAnterior: anterior.referencia,
    rotuloAnterior: anterior.rotulo,
    referenciaAtual,
    entraram,
    sairam,
    alterados,
    semMudanca,
  };
}

/**
 * A rodada anterior mais recente, ou `null` quando ainda não há nenhuma
 * arquivada — que é o estado até a primeira atualização depois de 06/08/2026.
 *
 * A ordenação é pela posição no arquivo, não por data: as datas vêm como
 * texto dd/mm/aaaa da fonte e ordená-las exigiria convertê-las. O arquivo é
 * mantido com a rodada mais recente no topo.
 */
export function rodadaMaisRecente(rodadas: RodadaAnterior[]): RodadaAnterior | null {
  return rodadas.length > 0 ? rodadas[0] : null;
}
