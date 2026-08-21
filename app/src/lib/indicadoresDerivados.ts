import type { Intervencao, Municipio } from '../types';
import type { FatiaDeValor } from '../components/charts/ValorPorCategoriaChart';

/**
 * Indicadores calculados a partir dos 14 registros declarados.
 *
 * O que **não** está aqui é tão importante quanto o que está: avanço físico,
 * valor executado, valor pago, obras paralisadas e população beneficiada são
 * os indicadores que qualquer painel de obras exibe — e nenhum deles pode ser
 * calculado, porque a fonte não informa. Estimá-los a partir de prazo
 * decorrido ou de situação seria inventar número, que é justamente o que este
 * portal não faz.
 */

/**
 * Soma o valor de contrato por município.
 *
 * Um projeto atribuído a mais de um município (a Barragem de Gericinó, em
 * Nilópolis e Mesquita) é contado uma vez só, no município principal. Ratear
 * seria invenção: a fonte declara um valor único para o contrato inteiro e
 * não diz quanto cabe a cada município.
 */
export function valorPorMunicipio(intervencoes: Intervencao[], municipios: Municipio[]): FatiaDeValor[] {
  return municipios.map((municipio) => {
    const doMunicipio = intervencoes.filter((i) => i.municipioId === municipio.id);
    return {
      nome: municipio.nome,
      valor: doMunicipio.reduce((soma, i) => soma + (i.valorContrato ?? 0), 0),
      semValorDeclarado: doMunicipio.filter((i) => i.valorContrato === null).length,
    };
  });
}

/** Soma o valor de contrato por situação declarada. */
export function valorPorSituacao(intervencoes: Intervencao[]): FatiaDeValor[] {
  const porSituacao = new Map<string, Intervencao[]>();
  for (const item of intervencoes) {
    const lista = porSituacao.get(item.situacao) ?? [];
    lista.push(item);
    porSituacao.set(item.situacao, lista);
  }
  return [...porSituacao.entries()].map(([situacao, itens]) => ({
    nome: situacao,
    valor: itens.reduce((soma, i) => soma + (i.valorContrato ?? 0), 0),
    semValorDeclarado: itens.filter((i) => i.valorContrato === null).length,
  }));
}

export interface LinhaDeCompletude {
  rotulo: string;
  preenchidos: number;
  total: number;
}

/**
 * Quantos dos projetos têm cada dado declarado.
 *
 * É o portal medindo a própria lacuna, em vez de deixá-la implícita nos
 * "Não informado" espalhados pelas telas. Os rótulos dizem o critério, para
 * que ninguém precise adivinhar o que conta como preenchido — uma data de
 * término declarada como "Julho de 2028 (a confirmar)" é informação, mas não
 * é data, e aqui não conta como tal.
 */
export function completudeDosDados(intervencoes: Intervencao[]): LinhaDeCompletude[] {
  const total = intervencoes.length;
  const contar = (fn: (i: Intervencao) => boolean) => intervencoes.filter(fn).length;

  return [
    { rotulo: 'Com valor de contrato declarado', preenchidos: contar((i) => i.valorContrato !== null), total },
    { rotulo: 'Com processo SEI declarado', preenchidos: contar((i) => i.processoSEI !== null), total },
    { rotulo: 'Com coordenada declarada', preenchidos: contar((i) => i.pontos.length > 0), total },
    { rotulo: 'Com empresa já contratada', preenchidos: contar((i) => i.empresaContratada !== null), total },
    {
      rotulo: 'Com data de término de vigência',
      preenchidos: contar((i) => i.dataTerminoVigencia !== null),
      total,
    },
  ];
}
