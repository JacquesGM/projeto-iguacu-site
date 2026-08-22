import { describe, expect, it } from 'vitest';
import firebase from '../../firebase.json';

/**
 * A política de segurança da hospedagem, sob teste.
 *
 * Existe por um erro que passou meses despercebido: a CSP autorizava
 * `https://vlibras.gov.br`, mas o arquivo servido de lá é **só um carregador**
 * — o plugin de verdade vem de `https://cdn.jsdelivr.net`. Bloqueado ele, o
 * VLibras não era carregado, o CSS que torna o botão visível nunca chegava e o
 * widget **não existia** na página: altura zero, invisível, em desktop e em
 * celular. O §17.9 ("o VLibras continua funcional") reprovava em silêncio,
 * porque a única evidência era uma linha no console de quem abrisse o portal.
 *
 * Cada origem aqui está amarrada ao que ela serve. Tirar uma quebra um recurso
 * concreto, e o teste diz qual — em vez de deixar a descoberta para o próximo
 * a olhar o console.
 */

const cabecalhos = firebase.hosting.headers;

const politica = (() => {
  const bloco = cabecalhos.find((h) => h.source === '**');
  const csp = bloco?.headers.find((c) => c.key === 'Content-Security-Policy')?.value;
  if (!csp) throw new Error('sem Content-Security-Policy em firebase.json');
  return Object.fromEntries(
    csp
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const [nome, ...valores] = d.split(/\s+/);
        return [nome, valores];
      }),
  ) as Record<string, string[]>;
})();

describe('Content-Security-Policy da hospedagem', () => {
  const exigidas: Array<[string, string, string]> = [
    ['script-src', "'self'", 'o próprio pacote da aplicação'],
    ['script-src', 'https://vlibras.gov.br', 'o carregador do widget de Libras'],
    ['script-src', 'https://cdn.jsdelivr.net', 'o plugin de Libras em si, que o carregador do gov.br busca lá'],
    ['img-src', 'https://*.tile.openstreetmap.org', 'os ladrilhos do mapa de projetos'],
    ['img-src', 'data:', 'ícones embutidos do Leaflet'],
    ['connect-src', 'https://vlibras.gov.br', 'os recursos que o widget de Libras busca depois de aberto'],
  ];

  for (const [diretiva, origem, paraQue] of exigidas) {
    it(`${diretiva} autoriza ${origem} — ${paraQue}`, () => {
      expect(politica[diretiva], `diretiva ${diretiva} ausente da CSP`).toBeDefined();
      expect(politica[diretiva]).toContain(origem);
    });
  }

  // O outro lado: a CSP tem de continuar restritiva onde importa. Um
  // `'unsafe-inline'` em script-src anularia boa parte da proteção, e um
  // `default-src *` abriria tudo por descuido.
  const proibidas: Array<[string, string]> = [
    ['script-src', "'unsafe-inline'"],
    ['script-src', "'unsafe-eval'"],
    ['default-src', '*'],
    ['object-src', "'self'"],
  ];

  for (const [diretiva, valor] of proibidas) {
    it(`${diretiva} não pode conter ${valor}`, () => {
      expect(politica[diretiva] ?? []).not.toContain(valor);
    });
  }

  it('nega enquadramento por terceiros e restringe base e formulários', () => {
    expect(politica['frame-ancestors']).toEqual(["'none'"]);
    expect(politica['base-uri']).toEqual(["'self'"]);
    expect(politica['form-action']).toEqual(["'self'"]);
    expect(politica['object-src']).toEqual(["'none'"]);
  });
});

describe('cache e reescrita da hospedagem', () => {
  // §13: cache imutável para o que é versionado no nome, `no-cache` no resto.
  // Trocado, ou o portal serve versão velha por um ano, ou o CDN não guarda
  // nada e cada visita paga tudo de novo.
  it('trata assets versionados como imutáveis e o resto como no-cache', () => {
    const valor = (fonte: string) =>
      cabecalhos.find((h) => h.source === fonte)?.headers.find((c) => c.key === 'Cache-Control')?.value;

    expect(valor('**')).toBe('no-cache');
    expect(valor('/assets/**')).toContain('immutable');
    expect(valor('/fonts/**')).toContain('immutable');
  });

  // O portal é uma SPA: sem esta reescrita, abrir /intervencoes direto — de um
  // link compartilhado, de um resultado de busca — devolveria 404. É também o
  // que tornou dispensável o 404.html herdado do GitHub Pages.
  it('serve o index.html em qualquer rota', () => {
    expect(firebase.hosting.rewrites).toContainEqual({ source: '**', destination: '/index.html' });
  });

  // O /dados.json é a promessa de dados abertos: sem CORS ninguém o lê por
  // fetch de outra origem, e a promessa não se cumpre.
  it('libera CORS no /dados.json', () => {
    const dados = cabecalhos.find((h) => h.source === '/dados.json');
    expect(dados?.headers).toContainEqual({ key: 'Access-Control-Allow-Origin', value: '*' });
  });
});
