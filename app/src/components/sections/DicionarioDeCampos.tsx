import dicionarioData from '../../data/dicionarioCampos.json';

/**
 * O dicionário de campos, para quem lê a tela.
 *
 * Os 29 campos já eram publicados em `/dados.json`, mas só quem abre JSON via.
 * A §8.4 do Prompt Mestre pede o dicionário no conteúdo institucional, e a
 * razão é boa: é aqui que se responde "o que exatamente quer dizer este campo
 * vazio", que é a pergunta por trás de metade das dúvidas sobre o dado.
 *
 * A fonte é o mesmo arquivo que alimenta o `/dados.json`, então as duas
 * versões não têm como divergir — e há teste garantindo que o dicionário e os
 * campos reais dos projetos batem nos dois sentidos.
 */

interface CampoDoDicionario {
  campo: string;
  tipo: string;
  descricao: string;
  observacao?: string;
  valoresObservados?: string[];
}

const dicionario = dicionarioData as CampoDoDicionario[];

export function DicionarioDeCampos() {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-neutral-900">Dicionário de campos</h2>
      <p className="mt-1 text-sm text-neutral-600">
        O que cada um dos {dicionario.length} campos de um projeto significa, que tipo tem e o que quer dizer quando
        vem vazio. É a mesma descrição publicada em{' '}
        <a href={`${import.meta.env.BASE_URL}dados.json`} className="text-brand-blue-600 underline underline-offset-2">
          /dados.json
        </a>
        , gerada do mesmo arquivo — as duas não têm como divergir.
      </p>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-brand-blue-700 hover:underline">
          Ver os {dicionario.length} campos
        </summary>
        <div className="relative mt-3 overflow-x-auto">
          <table aria-label="Dicionário de campos dos projetos" className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300">
                <th scope="col" className="py-2 pr-4 font-semibold text-neutral-700">
                  Campo
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold text-neutral-700">
                  Tipo
                </th>
                <th scope="col" className="py-2 font-semibold text-neutral-700">
                  O que é
                </th>
              </tr>
            </thead>
            <tbody>
              {dicionario.map((campo) => (
                <tr key={campo.campo} className="border-b border-neutral-100 align-top last:border-0">
                  <th scope="row" className="whitespace-nowrap py-2 pr-4 text-left font-mono text-xs font-normal text-neutral-900">
                    {campo.campo}
                  </th>
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs text-neutral-600">{campo.tipo}</td>
                  <td className="py-2 text-neutral-700">
                    {campo.descricao}
                    {campo.valoresObservados && (
                      <span className="mt-1 block text-xs text-neutral-500">
                        Valores nesta rodada: {campo.valoresObservados.join(', ')}.
                      </span>
                    )}
                    {campo.observacao && (
                      <span className="mt-1 block text-xs text-neutral-500">{campo.observacao}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
