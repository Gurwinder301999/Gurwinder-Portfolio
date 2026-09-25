import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Absolute site URL used for canonical links and social cards.
 * Leave VITE_SITE_URL unset until the repo name is known; every consumer
 * degrades gracefully to a relative path.
 */
const SITE_URL = (process.env.VITE_SITE_URL ?? '').replace(/\/+$/, '');

/**
 * Replaces `__SITE_URL__` in index.html at build time so canonical/og tags can
 * point at a real absolute URL without hand-editing the HTML per environment.
 *
 * The token deliberately avoids `%`, which Vite's HTML pass would try to
 * percent-decode while resolving asset URLs.
 */
function siteUrlPlugin(): Plugin {
  return {
    name: 'site-url',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', SITE_URL);
    },
  };
}

// GitHub Pages serves project sites from a sub-path such as /portfolio/, so the
// bundle must reference its own assets relatively. './' keeps one build working
// for user sites, project sites, and custom domains alike.
export default defineConfig({
  base: './',
  plugins: [react(), siteUrlPlugin()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
