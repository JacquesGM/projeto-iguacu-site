import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import intervencoesData from '../../data/intervencoes.json';
import type { Intervencao, SituacaoIntervencao } from '../../types';
import { GraficoComTabela } from './GraficoComTabela';
import { SituacaoDistributionChart } from './SituacaoDistributionChart';
import { MunicipioDistributionChart } from './MunicipioDistributionChart';
import { OrgaoDistributionChart } from './OrgaoDistributionChart';
import { ValorPorCategoriaChart } from './ValorPorCategoriaChart';
import * as barril from './graficos';

const intervencoes = intervencoesData as Intervencao[];

describe('GraficoComTabela', () => {
  const renderizar = () =>
    render(
      <GraficoComTabela
        titulo="Um título"
        cabecalhos={['Categoria', 'Quantidade']}
        linhas={[
          ['Alfa', '3'],
          ['Beta', '1'],
        ]}
        nota="Uma nota"
      >
        <svg>
          <text>ruído do gráfico</text>
        </svg>
      </GraficoComTabela>,
    );

  // O SVG do Recharts e dezenas de <text> soltos: um leitor de tela leria
  // numeros sem rotulo e fora de ordem. A tabela e a versao acessivel, entao
  // o grafico precisa mesmo sair da arvore de acessibilidade.
  it('esconde o gráfico da árvore de acessibilidade', () => {
    const { container } = renderizar();
    const envoltorio = container.querySelector('[aria-hidden="true"]');
    expect(envoltorio).toBeTruthy();
    expect(envoltorio!.textContent).toContain('ruído do gráfico');
  });

  it('expõe os mesmos dados numa tabela nomeada', () => {
    renderizar();
    const tabela = screen.getByRole('table', { name: 'Um título' });
    expect(within(tabela).getByText('Alfa')).toBeTruthy();
    expect(within(tabela).getByText('3')).toBeTruthy();
  });

  it('usa cabeçalho de coluna e de linha, para o leitor de tela situar a célula', () => {
    renderizar();
    const tabela = screen.getByRole('table', { name: 'Um título' });
    expect(within(tabela).getByRole('columnheader', { name: 'Categoria' })).toBeTruthy();
    expect(within(tabela).getByRole('rowheader', { name: 'Alfa' })).toBeTruthy();
  });

  it('mantém a nota de fonte visível', () => {
    renderizar();
    expect(screen.getByText('Uma nota')).toBeTruthy();
  });
});

// Este e o teste que importa a longo prazo: um grafico novo que esqueca a
// tabela reprova aqui, em vez de so falhar na proxima auditoria manual.
describe('todo gráfico do portal tem alternativa em tabela', () => {
  const graficos = [
    {
      nome: 'Projetos por situação',
      elemento: <SituacaoDistributionChart situacoes={intervencoes.map((i) => i.situacao as SituacaoIntervencao)} />,
    },
    { nome: 'Projetos por município', elemento: <MunicipioDistributionChart intervencoes={intervencoes} /> },
    { nome: 'Projetos por órgão executor', elemento: <OrgaoDistributionChart intervencoes={intervencoes} /> },
    {
      nome: 'Valor contratado por situação',
      elemento: (
        <ValorPorCategoriaChart
          titulo="Valor contratado por situação"
          dados={[{ nome: 'Em licitação', valor: 100, semValorDeclarado: 0 }]}
          rotuloCategoria="situação"
        />
      ),
    },
  ];

  const componentesCobertos = [
    SituacaoDistributionChart,
    MunicipioDistributionChart,
    OrgaoDistributionChart,
    ValorPorCategoriaChart,
  ];

  // A lista acima é escrita à mão, e lista escrita à mão envelhece: bastaria
  // acrescentar um gráfico ao barril e esquecer de vir aqui para a garantia
  // valer menos do que parece. Este teste amarra as duas pontas — o barril é
  // exatamente o que a página carrega sob demanda.
  it('cobre todos os gráficos exportados pelo barril, sem sobrar nem faltar', () => {
    const exportados = Object.keys(barril).sort();
    const cobertos = componentesCobertos.map((c) => c.name).sort();
    expect(cobertos).toEqual(exportados);
  });

  for (const grafico of graficos) {
    it(`${grafico.nome} tem tabela com linhas`, () => {
      render(grafico.elemento);
      const tabela = screen.getByRole('table', { name: grafico.nome });
      expect(within(tabela).getAllByRole('row').length).toBeGreaterThan(1);
    });

    // Em jsdom o ResponsiveContainer nao tem dimensao e nao desenha SVG
    // nenhum, entao nao da para procurar o <svg>. O que se verifica e que o
    // grafico passou pelo GraficoComTabela: e ele que poe o aria-hidden.
    it(`${grafico.nome} desenha dentro do invólucro que esconde da acessibilidade`, () => {
      const { container } = render(grafico.elemento);
      expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
    });
  }
});
