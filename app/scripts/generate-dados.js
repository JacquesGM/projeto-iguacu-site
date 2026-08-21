// Gera public/dados.json: os 14 projetos em JSON, com metadados de origem e um
// dicionario descrevendo cada campo. E o mesmo dado que a tela mostra, servido
// num endereco estavel para quem quer reusar em vez de raspar a pagina.
//
// Isto nao contradiz o "nao ha API" da arquitetura: nao ha servidor de
// aplicacao nenhum, e um arquivo estatico a mais no CDN.
//
// O arquivo e MONTADO aqui, nunca editado a mao: se fosse editavel, sairia do
// ar em silencio na primeira rodada em que alguem esquecesse de sincroniza-lo
// com intervencoes.json. Roda antes do build (ver package.json).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.SITE_URL ?? 'https://projeto-iguacu-irm.web.app';
const REPOSITORIO = 'https://github.com/JacquesGM/projeto-iguacu-site';

function ler(nome) {
  return JSON.parse(readFileSync(path.join(__dirname, '../src/data', nome), 'utf8'));
}

const meta = ler('meta.json');
const projetos = ler('intervencoes.json');
const municipios = ler('municipios.json');
const fontes = ler('fontes.json');
const dicionario = ler('dicionarioCampos.json');

const dados = {
  titulo: 'Projetos do Projeto Iguaçu — Instituto Rio Metrópole',
  descricao:
    'Projetos de controle de inundações e recuperação ambiental das bacias dos rios Iguaçu, Botas e Sarapuí, ' +
    'na Baixada Fluminense, declarados pelos órgãos executores e prefeituras e consolidados pelo Instituto Rio ' +
    'Metrópole no âmbito do GT IRM – Projeto Iguaçu.',
  paginaHumana: `${SITE_URL}/intervencoes`,
  repositorio: REPOSITORIO,

  dataReferencia: meta.dataReferencia,
  ultimaAtualizacao: meta.ultimaAtualizacao,
  proximaAtualizacao: meta.proximaAtualizacao,
  periodicidade: meta.periodicidadeAtualizacao,

  // Nao ha licenca de uso declarada pela fonte. Inventar uma seria afirmar
  // uma condicao juridica que ninguem declarou, entao o campo diz o que se
  // sabe e a quem perguntar. Consta em PENDENCIAS.md.
  condicoesDeUso: {
    licencaDeclarada: null,
    observacao:
      'A fonte não declara licença de uso para estes dados. Eles são públicos e vêm da página oficial do IRM; ' +
      'na dúvida sobre redistribuição, procure o GT pelo contato abaixo. Ao reusar, cite a fonte e a data de ' +
      'referência.',
    contato: 'saneamento@irm.rj.gov.br',
  },

  advertencias: [
    'Os dados são declarados pelos próprios órgãos executores e prefeituras; o IRM consolida e publica, não executa.',
    'O valor apresentado é o valor do CONTRATO. A fonte não informa valor executado, medido ou pago, nem percentual de avanço.',
    'Campos sem informação declarada vêm como null — nunca como zero, nunca estimados.',
    'Datas que a fonte declara como texto ficam no campo "...Texto" correspondente e não são convertidas em data.',
    'Seis dos 14 projetos não têm coordenada declarada; seu campo "pontos" vem vazio, sem aproximação pelo município.',
  ],

  fontes,
  dicionarioDeCampos: dicionario,

  totais: {
    projetos: projetos.length,
    municipios: municipios.length,
    valorContratado: projetos.reduce((soma, p) => soma + (p.valorContrato ?? 0), 0),
  },

  municipios,
  projetos,
};

const destino = path.join(__dirname, '../public/dados.json');
writeFileSync(destino, `${JSON.stringify(dados, null, 2)}\n`, 'utf8');
console.log(`dados.json gerado com ${projetos.length} projetos e ${dicionario.length} campos documentados em ${destino}`);
