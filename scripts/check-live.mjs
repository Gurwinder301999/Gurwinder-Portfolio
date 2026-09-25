/** Checks what GitHub Pages is actually serving for the live site. */
import https from 'node:https';

const url = process.argv[2] ?? 'https://gurwinder301999.github.io/Gurwinder-Portfolio/';

https
  .get(url, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      const script = body.match(/<script[^>]*src="([^"]+)"/);
      const css = body.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/);
      const canonical = body.match(/rel="canonical" href="([^"]+)"/);
      const ogImage = body.match(/property="og:image" content="([^"]+)"/);

      console.log('URL        :', url);
      console.log('STATUS     :', res.statusCode);
      console.log('script src :', script ? script[1] : '(NONE)');
      console.log('css href   :', css ? css[1] : '(NONE)');
      console.log('canonical  :', canonical ? canonical[1] : '(NONE)');
      console.log('og:image   :', ogImage ? ogImage[1] : '(NONE)');
      console.log('has #root  :', body.includes('id="root"'));
      console.log('unreplaced :', body.includes('__SITE_URL__') ? 'YES (unbuilt source!)' : 'no');
    });
  })
  .on('error', (err) => console.log('ERROR:', err.message));
