/** Compares workflow run timestamps to see which deployment published last. */
import https from 'node:https';

const REPO = process.argv[2] ?? 'Gurwinder301999/Gurwinder-Portfolio';

https
  .get(
    {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/actions/runs?per_page=8`,
      headers: { 'User-Agent': 'node', Accept: 'application/vnd.github+json' },
    },
    (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        const runs = JSON.parse(body).workflow_runs
          .slice()
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        console.log('Deployments (oldest -> newest):\n');
        runs.forEach((r, i) => {
          console.log(
            `${i + 1}. ${r.created_at}  ${r.name}  (event: ${r.event}, ${r.conclusion})`,
          );
        });

        const last = runs[runs.length - 1];
        console.log(`\nMost recent: "${last.name}"`);
        console.log(
          last.name === 'Deploy to GitHub Pages'
            ? '  -> this is the BUILD workflow (good)'
            : '  -> this is the LEGACY branch publisher (serves unbuilt source)',
        );
      });
    },
  )
  .on('error', (e) => console.log('ERROR', e.message));
