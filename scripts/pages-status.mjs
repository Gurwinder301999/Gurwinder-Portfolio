/**
 * Reads and (optionally) repairs the GitHub Pages build source.
 *
 * The repo must be served by "GitHub Actions", not "Deploy from a branch".
 * Branch mode publishes the repository verbatim with no build, so the raw
 * index.html ships with its unrecompiled /src/main.tsx reference and visitors
 * get a blank page.
 *
 * Usage:
 *   node scripts/pages-status.mjs          # report only
 *   node scripts/pages-status.mjs --fix    # switch to GitHub Actions
 */

import { execFileSync } from 'node:child_process';
import https from 'node:https';

const OWNER = 'Gurwinder301999';
const REPO = 'Gurwinder-Portfolio';
const API_HOST = 'api.github.com';

/** Pulls the stored GitHub token out of the configured credential helper. */
function getToken() {
  const input = 'protocol=https\nhost=github.com\n\n';
  const raw = execFileSync('git', ['credential', 'fill'], {
    input,
    encoding: 'utf8',
  });
  const match = raw.match(/^password=(.+)$/m);
  return match ? match[1].trim() : null;
}

function api(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: API_HOST,
        path,
        method,
        headers: {
          'User-Agent': 'node',
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = data ? JSON.parse(data) : null;
          } catch {
            parsed = { raw: data };
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      },
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const token = getToken();
if (!token) {
  console.log('No GitHub credential available. Run `git push` once to authenticate.');
  process.exit(1);
}

const whoami = await api('GET', '/user', token);
console.log(`Authenticated as: ${whoami.body?.login ?? 'unknown'}`);

const page = await api('GET', `/repos/${OWNER}/${REPO}/pages`, token);
if (page.status === 404) {
  console.log('\nPages site not found.');
  process.exit(1);
}
if (page.status !== 200) {
  console.log(`Could not read Pages config (HTTP ${page.status}):`, page.body?.message);
  process.exit(1);
}

console.log(`\nPages settings`);
console.log(`  url         : ${page.body.html_url}`);
console.log(`  build_type  : ${page.body.build_type}`);
console.log(`  source      : ${page.body.source?.branch ?? 'workflow'}${page.body.source?.path ? ' /' + page.body.source.path : ''}`);
console.log(`  status      : ${page.body.status}`);

if (page.body.build_type === 'workflow') {
  console.log('\nAlready correct: served by GitHub Actions.');
  if (!process.argv.includes('--deploy')) {
    process.exit(0);
  }
  console.log('\nRe-dispatching the deploy workflow...');
  const run = await api(
    'POST',
    `/repos/${OWNER}/${REPO}/actions/workflows/deploy.yml/dispatches`,
    token,
    { ref: 'main' },
  );
  console.log(
    run.status === 204
      ? '  -> workflow dispatched'
      : `  -> dispatch returned HTTP ${run.status}: ${run.body?.message}`,
  );
  process.exit(run.status === 204 ? 0 : 1);
}

if (!process.argv.includes('--fix')) {
  console.log('\nThis is the blank-page cause. Re-run with --fix to repair it.');
  process.exit(1);
}

console.log('\nSwitching build_type to "workflow"...');
const updated = await api('PUT', `/repos/${OWNER}/${REPO}/pages`, token, {
  build_type: 'workflow',
});

// 204 (No Content) is a valid success response when GitHub has nothing to echo.
if (updated.status === 200 || updated.status === 204) {
  console.log('  -> change accepted (HTTP ' + updated.status + ')');
} else {
  console.log(`  -> FAILED (HTTP ${updated.status}):`, updated.body?.message);
  process.exit(1);
}

// Re-read to confirm it actually took effect.
const verify = await api('GET', `/repos/${OWNER}/${REPO}/pages`, token);
console.log(`  -> build_type is now: ${verify.body?.build_type}`);

if (verify.body?.build_type !== 'workflow') {
  console.log('\nStill not on "workflow". Change it manually:');
  console.log(`  https://github.com/${OWNER}/${REPO}/settings/pages`);
  process.exit(1);
}

console.log('\nNow re-running the deploy workflow so the site publishes...');
const run = await api('POST', `/repos/${OWNER}/${REPO}/actions/workflows/deploy.yml/dispatches`, token, {
  ref: 'main',
});
console.log(run.status === 204 ? '  -> workflow dispatched' : `  -> dispatch returned HTTP ${run.status}: ${run.body?.message}`);
