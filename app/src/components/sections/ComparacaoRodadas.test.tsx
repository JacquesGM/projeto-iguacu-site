import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import intervencoesData from '../../data/intervencoes.json';
import type { Intervencao, RodadaAnterior } from '../../types';
import { ComparacaoRodadas } from './ComparacaoRodadas';

const intervencoes = intervencoesData as Intervencao[];

const rodada = (projetos: Intervencao[]): RodadaAnterior => ({
  referencia: '06/08/2026',
  rotulo: 'Consolidação de 06/08/2026',
  fonte: 'Página oficial do IRM',
  projetos,
});

describe('sem rodada anterior arquivada', () => {
  it('explica que ainda não há o que comparar e diz quando começa', () => {
    render(<ComparacaoRodadas rodadas={[]} atuais={intervencoes} referenciaAtual="06/08/2026" />);
    expect(screen.getByText(/ainda não há rodada anterior/i)).toBeTruthy();
    expect(screen.getByText('08/10/2026')).toBeTruthy();
  });

  // O portal nao pode fingir uma comparacao que nao existe: numeros zerados
  // pareceriam "nada mudou", que e uma afirmacao diferente de "nao da para saber".
  it('não mostra contadores de mudança', () => {
    render(<ComparacaoRodadas rodadas={[]} atuais={intervencoes} referenciaAtual="06/08/2026" />);
    expect(screen.queryByText(/projetos com mudança/i)).toBeNull();
    expect(screen.queryByText(/projetos sem mudança/i)).toBeNull();
  });
});

describe('com rodada anterior arquivada', () => {
  const anterior = [
    { ...intervencoes[0], situacao: 'Em licitação' as Intervencao['situacao'], valorContrato: 1000 },
    { ...intervencoes[1] },
    { ...intervencoes[2], id: 'saiu-da-rodada', nomeProjeto: 'Projeto que saiu' },
  ];
  const atuais = [
    { ...intervencoes[0], situacao: 'Em andamento' as Intervencao['situacao'], valorContrato: 2000 },
    { ...intervencoes[1] },
    { ...intervencoes[3], id: 'entrou-na-rodada', nomeProjeto: 'Projeto que entrou' },
  ];

  const renderizar = () =>
    render(<ComparacaoRodadas rodadas={[rodada(anterior)]} atuais={atuais} referenciaAtual="08/10/2026" />);

  it('mostra o de → para de cada campo que mudou', () => {
    renderizar();
    expect(screen.getByText('Em licitação')).toBeTruthy();
    expect(screen.getByText('Em andamento')).toBeTruthy();
    expect(screen.getByText(/1\.000,00/)).toBeTruthy();
    expect(screen.getByText(/2\.000,00/)).toBeTruthy();
  });

  it('a direção da mudança está no texto, não só na seta', () => {
    renderizar();
    expect(screen.getAllByText('de').length).toBeGreaterThan(0);
    expect(screen.getAllByText('para').length).toBeGreaterThan(0);
  });

  it('lista quem entrou e quem saiu, cada um na sua seção', () => {
    renderizar();
    const entraram = screen.getByText('Entraram nesta rodada').parentElement!;
    expect(within(entraram).getByText('Projeto que entrou')).toBeTruthy();

    const sairam = screen.getByText(/não constam agora/).parentElement!;
    expect(within(sairam).getByText('Projeto que saiu')).toBeTruthy();
  });

  it('conta o projeto inalterado como sem mudança', () => {
    renderizar();
    expect(screen.getByText('projeto sem mudança')).toBeTruthy();
  });

  it('usa singular quando é um só', () => {
    renderizar();
    expect(screen.getByText('projeto entrou')).toBeTruthy();
    expect(screen.getByText('projeto saiu')).toBeTruthy();
    expect(screen.getByText('projeto com mudança')).toBeTruthy();
  });

  // A garantia de "nao interpretar" nao e uma lista de palavras proibidas: e
  // que cada linha de mudanca contenha exatamente os dois valores declarados,
  // sem nenhum texto nosso somado a eles.
  it('cada linha de mudança traz só os dois valores declarados', () => {
    const { container } = renderizar();
    const linhas = [...container.querySelectorAll('dd')];
    // O valor esperado sai do mesmo formatador que o componente usa: o
    // Intl.NumberFormat separa "R$" do numero com espaco nao separavel, e um
    // literal escrito a mao passaria a falhar por um caractere invisivel.
    const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    expect(linhas.length).toBe(2);
    expect(linhas.map((l) => l.textContent)).toEqual([
      'deEm licitaçãoparaEm andamento',
      `de${moeda.format(1000)}para${moeda.format(2000)}`,
    ]);
  });
});
