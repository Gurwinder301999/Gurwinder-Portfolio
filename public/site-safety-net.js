/*
 * Safety net for an unbuilt deployment.
 *
 * If the bundle never mounts, the site is being served without being built
 * (the classic cause is GitHub Pages set to "Deploy from a branch" instead of
 * "GitHub Actions"), and the visitor gets a blank white page. This replaces
 * that with a real explanation.
 *
 * It is a separate file rather than an inline <script> so the Content-Security
 * Policy can use script-src 'self' with no inline exception. The markup below
 * is a fixed literal, so there is no injection surface.
 */
(function () {
  setTimeout(function () {
    var root = document.getElementById('root');
    if (!root || root.childElementCount > 0) return;

    root.innerHTML =
      '<div style="min-height:100vh;display:grid;place-items:center;padding:2rem;' +
      'font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#0C0C0C;color:#D7E2EA">' +
      '<div style="max-width:34rem;text-align:center">' +
      '<h1 style="font-size:1.5rem;margin:0 0 1rem">This site has not been built yet</h1>' +
      '<p style="line-height:1.6;color:#D7E2EA/70">' +
      'The page loaded but the application bundle did not. In the repository, open ' +
      '<strong>Settings &rarr; Pages &rarr; Build and deployment</strong> and set ' +
      '<strong>Source</strong> to <strong>GitHub Actions</strong>, then run the ' +
      '<em>Deploy to GitHub Pages</em> workflow again.' +
      '</p></div></div>';
  }, 2500);
})();
