import { ArrowLeft, FileText, Mail, ShieldCheck } from 'lucide-react';
import type { LegalDoc } from '../data/legal';
import { legalDocs } from '../data/legal';
import { profile } from '../data/portfolio';
import SectionBadge from '../components/SectionBadge';

type LegalPageProps = { doc: LegalDoc | null };

/**
 * Renders one legal document, or a 404 if the slug is unknown.
 *
 * Deliberately plain typography. Legal text set in a display face at 4rem is
 * technically readable and practically unreadable, and the job of this page is
 * to be read end to end.
 *
 * Navigation is plain hash anchors rather than a router: this app is a
 * hash-routed single page with no react-router dependency, and #/legal/privacy
 * keeps the same "works from a sub-path" property every other route has.
 */
export default function LegalPage({ doc }: LegalPageProps) {
  if (!doc) {
    return (
      <main id="app-shell" className="relative min-h-screen bg-[#0C0C0C] font-kanit text-[#D7E2EA]">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-5 py-24 sm:px-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white">Page not found</h1>
          <p className="text-base text-[#D7E2EA]/80">
            That policy does not exist. The available policies are listed below.
          </p>
          <ul className="flex flex-col gap-2">
            {legalDocs.map((d) => (
              <li key={d.slug}>
                <a
                  href={`#/legal/${d.slug}`}
                  className="text-base text-[#D7E2EA] underline decoration-[#B600A8] underline-offset-4"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
          <a href="#home" className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#D7E2EA] underline">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to portfolio
          </a>
        </div>
      </main>
    );
  }

  return (
    <div id="app-shell" className="relative min-h-screen bg-[#0C0C0C] font-kanit text-[#D7E2EA]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(ellipse_at_top,rgba(118,33,176,0.18),transparent_70%)]"
        aria-hidden
      />

      <main id="main-content" tabIndex={-1} className="relative mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        <a
          href="#home"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA] underline decoration-[#B600A8] decoration-2 underline-offset-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to portfolio
        </a>

        <header className="mt-10 border-b border-white/10 pb-8">
          <SectionBadge>Legal</SectionBadge>
          <h1 className="mt-5 text-[clamp(2rem,6vw,3.25rem)] font-black uppercase leading-[1.05] tracking-tight text-white">
            {doc.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#D7E2EA]/80">{doc.summary}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#D7E2EA]/60">
            Last updated {doc.updated}
          </p>
        </header>

        {/* Long-form legal copy: the whole point is that it can be read straight
            through, so this is the one place on the site that opts out of the
            animated section treatment. */}
        <div className="mt-10 flex flex-col gap-10">
          {doc.sections.map((section, i) => (
            <section key={section.heading} aria-labelledby={`legal-h-${i}`}>
              <h2 id={`legal-h-${i}`} className="text-lg font-semibold uppercase tracking-[0.1em] text-white">
                {section.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph, j) =>
                  paragraph.includes('@') ? (
                    <a
                      key={j}
                      href={`mailto:${paragraph.trim()}`}
                      className="w-fit text-base text-[#D7E2EA] underline decoration-[#B600A8] decoration-2 underline-offset-4"
                    >
                      {paragraph}
                    </a>
                  ) : (
                    <p key={j} className="text-base leading-[1.75] text-[#D7E2EA]/80">
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>


        <aside className="mt-14 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D14AC0]" aria-hidden />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Plain-language summary
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#D7E2EA]/75">
                This site is a static portfolio. It sets no cookies, runs no analytics, and collects no
                personal data. Nothing you do here is tracked or sold. If you want to ask anything about
                it, email{' '}
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[#D7E2EA] underline decoration-[#B600A8] underline-offset-4"
                >
                  {profile.email}
                </a>
                .
              </p>
            </div>
          </div>
        </aside>

        <nav aria-label="Other policies" className="mt-10 border-t border-white/10 pt-8">
          <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/60">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            Other policies
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {legalDocs
              .filter((d) => d.slug !== doc.slug)
              .map((d) => (
                <li key={d.slug}>
                  <a
                    href={`#/legal/${d.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors duration-200 hover:border-[#B600A8]/50"
                  >
                    <span className="block text-sm font-semibold text-white">{d.title}</span>
                    <span className="mt-1 block text-xs text-[#D7E2EA]/70">{d.summary}</span>
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <p className="mt-12 flex items-center gap-2 text-xs text-[#D7E2EA]/60">
          <Mail className="h-3.5 w-3.5" aria-hidden />
          Questions?{' '}
          <a
            href={`mailto:${profile.email}`}
            className="text-[#D7E2EA] underline decoration-[#B600A8] underline-offset-4"
          >
            {profile.email}
          </a>
        </p>
      </main>
    </div>
  );
}
