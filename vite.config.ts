import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Absolute site URL used for canonical links and social cards.
 *
 * VITE_SITE_URL is the real switch, but it is optional and CI may not have it
 * set. Falling back to empty would emit `href="/"`, and a relative canonical is
 * ignored by search engines while a relative og:image is dropped outright by
 * most social scrapers. So the live URL is the default and the variable only
 * exists to override it, such as after moving to a custom domain.
 */
const DEFAULT_SITE_URL = 'https://gurwinder301999.github.io/Gurwinder-Portfolio';
const SITE_URL = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

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

/**
 * Rewrites the font <link rel="preload"> in index.html to the hashed filename
 * Vite actually emitted.
 *
 * The preload is only worth having if it points at the real asset: a 404 here
 * is worse than no preload at all, and the source path does not exist in a
 * build. The dev-mode href in index.html is therefore a placeholder that gets
 * swapped for the emitted name at build time.
 */
function fontPreloadPlugin(): Plugin {
  const PLACEHOLDER = '/src/assets/fonts/kanit-latin-400.woff2';
  return {
    name: 'font-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const emitted = Object.keys(ctx.bundle ?? {}).find((n) =>
          n.includes('kanit-latin-400')
        );
        if (!emitted) return html;
        const escaped = PLACEHOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Relative, so a sub-path deploy such as /Gurwinder-Portfolio/ works.
        return html.replace(
          new RegExp(`<link rel="preload" as="font"[^>]*href="${escaped}"[^>]*>`),
          `<link rel="preload" as="font" type="font/woff2" href="./${emitted}" crossorigin>`
        );
      },
    },
  };
}

// GitHub Pages serves project sites from a sub-path such as /portfolio/, so the
// bundle must reference its own assets relatively. './' keeps one build working
// for user sites, project sites, and custom domains alike.
export default defineConfig({
  base: './',
  plugins: [react(), siteUrlPlugin(), fontPreloadPlugin()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
