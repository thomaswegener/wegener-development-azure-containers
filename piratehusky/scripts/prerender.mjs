import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { mkdir, readFile, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const ssrDir = path.join(rootDir, 'dist-ssr');

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://piratehusky.no';
const LANG = process.env.PRERENDER_LANG || 'en';

const routes = [
  '/',
  '/tours',
  '/tours/dog-sledding',
  '/tours/hiking',
  '/tours/kayaking',
  '/tours/skiing',
  '/youtube',
  '/accommodation',
  '/accommodation/camp',
  '/accommodation/lodge',
  '/about/about',
  '/about/sustainability',
  '/about/guides',
  '/about/dogs',
  '/about/contact',
  '/locations/porsanger',
  '/locations/hammerfest',
  '/locations/nordkapp',
  '/sledespesialisten',
];

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildSeoHead(seo) {
  if (!seo) return '';
  const tags = [];

  if (seo.description) {
    tags.push(`<meta name="description" content="${escapeHtml(seo.description)}">`);
  }
  if (seo.noIndex) {
    tags.push('<meta name="robots" content="noindex, nofollow">');
  }
  if (seo.url) {
    tags.push(`<link rel="canonical" href="${escapeHtml(seo.url)}">`);
    tags.push(`<meta property="og:url" content="${escapeHtml(seo.url)}">`);
  }
  if (seo.type) {
    tags.push(`<meta property="og:type" content="${escapeHtml(seo.type)}">`);
  }
  if (seo.title) {
    tags.push(`<meta property="og:title" content="${escapeHtml(seo.title)}">`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.title)}">`);
  }
  if (seo.description) {
    tags.push(`<meta property="og:description" content="${escapeHtml(seo.description)}">`);
    tags.push(`<meta name="twitter:description" content="${escapeHtml(seo.description)}">`);
  }
  if (seo.image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(seo.image)}">`);
    tags.push('<meta name="twitter:card" content="summary_large_image">');
    tags.push(`<meta name="twitter:image" content="${escapeHtml(seo.image)}">`);
  } else {
    tags.push('<meta name="twitter:card" content="summary">');
  }

  return tags.length ? `\n    ${tags.join('\n    ')}\n` : '';
}

function applySeoToTemplate(template, { title, seoHead } = {}) {
  let html = template;
  html = html.replace(/<html lang="[^"]*">/i, `<html lang="${LANG}">`);
  if (title) {
    const titleTag = `<title>${escapeHtml(title)}</title>`;
    if (html.includes('<title>')) {
      html = html.replace(/<title>[^<]*<\/title>/, titleTag);
    } else {
      html = html.replace('</head>', `  ${titleTag}\n</head>`);
    }
  }

  if (seoHead) {
    if (html.includes('<meta property="og:title"')) {
      html = html.replace(/(\s*<meta property="og:title"[^>]*>\s*)+/g, '');
    }
    html = html.replace('</title>', `</title>${seoHead}`);
  }
  return html;
}

function injectAppHtml(template, appHtml) {
  return template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
}

function routeToOutPath(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const clean = route.replace(/^\/+/, '');
  return path.join(distDir, clean, 'index.html');
}

async function main() {
  const templatePath = path.join(distDir, 'index.html');
  const template = await readFile(templatePath, 'utf-8');

  const ssrEntryPath = path.join(ssrDir, 'entry-server.js');
  const { render } = await import(pathToFileURL(ssrEntryPath).href);

  for (const route of routes) {
    const { html: appHtml, seo } = await render(route, { origin: SITE_ORIGIN, lang: LANG });
    const seoHead = buildSeoHead(seo);
    const withSeo = applySeoToTemplate(template, { title: seo?.title, seoHead });
    const finalHtml = injectAppHtml(withSeo, appHtml);

    const outPath = routeToOutPath(route);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, finalHtml, 'utf-8');
  }
}

main().catch((error) => {
  console.error('[prerender] Failed', error);
  process.exit(1);
});
