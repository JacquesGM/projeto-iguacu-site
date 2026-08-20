// Gera public/rss.xml a partir de src/data/changelog.json, para que
// jornalistas, o MP e movimentos sociais possam assinar as atualizações
// desta página num leitor de RSS comum. Roda antes do build (ver
// package.json), então o arquivo estático já sai correto em dist/.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.SITE_URL ?? 'https://projeto-iguacu-irm.web.app';
const DIAS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MESES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function paraRfc822(dataBr) {
  const [d, m, y] = dataBr.split('/').map(Number);
  const data = new Date(Date.UTC(y, m - 1, d));
  const dia = String(data.getUTCDate()).padStart(2, '0');
  return `${DIAS[data.getUTCDay()]}, ${dia} ${MESES[data.getUTCMonth()]} ${data.getUTCFullYear()} 00:00:00 GMT`;
}

function escapeXml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const changelogPath = path.join(__dirname, '../src/data/changelog.json');
const changelog = JSON.parse(readFileSync(changelogPath, 'utf8'));

const itens = changelog
  .map(
    (item) => `    <item>
      <title>Atualização de ${item.data}</title>
      <link>${SITE_URL}/transparencia</link>
      <guid isPermaLink="false">projeto-iguacu-${item.data.replace(/\//g, '-')}-${Buffer.from(item.descricao).toString('base64').slice(0, 12)}</guid>
      <pubDate>${paraRfc822(item.data)}</pubDate>
      <description>${escapeXml(item.descricao)}</description>
    </item>`,
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Projeto Iguaçu — Atualizações (Instituto Rio Metrópole)</title>
    <link>${SITE_URL}/transparencia</link>
    <description>Registro de atualizações da página pública de acompanhamento do Projeto Iguaçu.</description>
    <language>pt-BR</language>
${itens}
  </channel>
</rss>
`;

const outPath = path.join(__dirname, '../public/rss.xml');
writeFileSync(outPath, rss, 'utf8');
console.log(`rss.xml gerado com ${changelog.length} itens em ${outPath}`);
