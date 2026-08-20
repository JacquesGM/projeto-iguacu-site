// Gera public/sitemap.xml a partir das rotas declaradas em src/routes.tsx,
// para que o site seja indexado corretamente por buscadores. Roda antes do
// build (ver package.json), então o arquivo estático já sai correto em
// dist/. Extrai os paths por regex em vez de importar routes.tsx porque o
// arquivo usa JSX — evita depender de um transpilador só para isto.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.SITE_URL ?? 'https://projeto-iguacu-irm.web.app';

const routesSource = readFileSync(path.join(__dirname, '../src/routes.tsx'), 'utf8');
const paths = [...routesSource.matchAll(/path:\s*'([^']*)'/g)].map((m) => m[1]);

const indicadores = JSON.parse(readFileSync(path.join(__dirname, '../src/data/indicadores.json'), 'utf8'));
const [dia, mes, ano] = indicadores.dataUltimaAtualizacao.split('/');
const lastmod = `${ano}-${mes}-${dia}`;

const urls = paths
  .map((rota) => {
    const loc = rota === '/' ? `${SITE_URL}/` : `${SITE_URL}${rota}`;
    const priority = rota === '/' ? '1.0' : '0.8';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outPath = path.join(__dirname, '../public/sitemap.xml');
writeFileSync(outPath, sitemap, 'utf8');
console.log(`sitemap.xml gerado com ${paths.length} rotas em ${outPath}`);
