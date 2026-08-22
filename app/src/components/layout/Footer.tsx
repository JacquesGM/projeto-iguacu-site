import { Link } from 'react-router-dom';
import rodapeData from '../../data/rodape.json';
import metaData from '../../data/meta.json';
import type { Meta, Rodape } from '../../types';
import logoIrm from '../../assets/logo-irm-branca-horizontal.png';
import { routes } from '../../routes';

const rodape = rodapeData as Rodape;
const meta = metaData as Meta;

const colunas = [
  {
    titulo: 'Privacidade e acessibilidade',
    itens: [
      'Não são coletados dados pessoais nesta página pública.',
      'Busca-se conformidade com WCAG 2.1 nível AA e o eMAG; use o botão "Texto maior" no topo da página.',
    ],
  },
  {
    titulo: 'Dados abertos',
    itens: [
      'Os dados públicos do Projeto Iguaçu são estruturados com fonte e data de referência.',
      'Baixe os dados de indicadores, projetos e documentos em CSV ou PDF diretamente nas páginas correspondentes.',
    ],
    // O /dados.json e gerado no build a partir dos mesmos arquivos que a tela
    // le, entao nao ha como ele divergir do que esta publicado.
    link: { href: 'dados.json', texto: 'Todos os projetos em JSON, com dicionário de campos' },
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logoIrm} alt={rodape.nomeInstituto} className="h-9 w-auto" />
            <p className="mt-3 text-sm text-neutral-400">{rodape.diretoriaResponsavel}</p>
            <p className="mt-3 text-sm">
              <a href={`mailto:${rodape.canalInstitucional}`} className="text-brand-blue-300 hover:text-brand-blue-200 hover:underline">
                {rodape.canalInstitucional}
              </a>
            </p>
            <p className="mt-3 text-sm">
              <a
                href={rodape.linkSitePrincipal}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-brand-blue-300 hover:text-brand-blue-200 hover:underline"
              >
                Site institucional do IRM
              </a>
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Mapa do site</p>
            <ul className="mt-2 space-y-2 text-sm">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="text-brand-blue-300 hover:text-brand-blue-200 hover:underline">
                    {route.label ?? route.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <p className="text-sm font-semibold text-white">{coluna.titulo}</p>
              <ul className="mt-2 space-y-2 text-sm text-neutral-400">
                {coluna.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {coluna.link && (
                  <li>
                    <a
                      href={`${import.meta.env.BASE_URL}${coluna.link.href}`}
                      className="text-brand-blue-300 hover:text-brand-blue-200 hover:underline"
                    >
                      {coluna.link.texto}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-neutral-800 pt-6 text-xs text-neutral-300">
          <p>
            Última atualização desta página: <strong className="text-white">{meta.ultimaAtualizacao}</strong>.{' '}
            {rodape.avisoAtualizacao} Consulte a seção{' '}
            <Link to="/transparencia" className="text-brand-blue-300 underline underline-offset-2 hover:text-brand-blue-200">
              Transparência
            </Link>
            .
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} {rodape.nomeInstituto}. {meta.avisoVersaoBeta}
          </p>
        </div>
      </div>
    </footer>
  );
}
