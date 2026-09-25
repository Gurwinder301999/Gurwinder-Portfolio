/**
 * Serves the production build from a nested folder so we can prove the
 * sub-path behaviour GitHub Pages project sites rely on.
 *
 * Usage: node scripts/serve-subpath.mjs [port]
 * Then open http://localhost:8099/portfolio/
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist', import.meta.url));
const port = Number(process.argv[2] ?? 8099);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.pdf': 'application/pdf',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

createServer(async (req, res) => {
  // Everything is mounted under /portfolio/ to mirror a GitHub Pages project site.
  const url = (req.url ?? '/').split('?')[0];
  if (!url.startsWith('/portfolio/')) {
    res.writeHead(302, { Location: '/portfolio/' });
    res.end();
    return;
  }

  let rel = decodeURIComponent(url.slice('/portfolio/'.length)) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';

  // Block traversal above the dist directory.
  const target = join(distDir, normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!target.startsWith(distDir)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const info = await stat(target);
    const file = info.isDirectory() ? join(target, 'index.html') : target;
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
  }
}).listen(port, () => {
  console.log(`Serving dist/ at http://localhost:${port}/portfolio/`);
});
