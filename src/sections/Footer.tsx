import { ArrowUp, Heart, Terminal } from 'lucide-react';
import { footerColumns, profile } from '../data/portfolio';
import FadeIn from '../components/FadeIn';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] px-5 pb-10 pt-14 sm:px-8 md:px-10">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <FadeIn delay={0} y={18} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="accent-gradient grid h-10 w-10 place-items-center rounded-xl outline outline-2 -outline-offset-[3px] outline-white/70">
              <Terminal className="h-5 w-5 text-white" strokeWidth={2.2} />
            </span>
            <span className="text-base font-semibold uppercase tracking-[0.22em] text-[#D7E2EA]">
              {profile.name}
            </span>
          </div>
          <p className="max-w-[26rem] text-sm font-light leading-relaxed text-[#D7E2EA]/68">
            IT Support Engineer — desktop support, network administration, VoIP / IP telephony and Windows /
            Linux server administration. Based in {profile.location}.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="w-fit text-sm font-light uppercase tracking-[0.16em] text-[#D7E2EA]/70 underline decoration-[#B600A8]/60 decoration-2 underline-offset-4 transition-colors duration-300 hover:text-white"
          >
            {profile.email}
          </a>
        </FadeIn>

        {footerColumns.map((column, columnIndex) => (
          <FadeIn key={column.title} delay={0.08 + columnIndex * 0.06} y={18} className="flex flex-col gap-4">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/60">
              {column.title}
            </p>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="text-sm font-light uppercase tracking-[0.14em] text-[#D7E2EA]/70 transition-colors duration-300 hover:text-[#D7E2EA]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1400px] flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
        <p className="text-[0.68rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/60">
          © {year} {profile.name}. All rights reserved.
        </p>
        <p className="flex items-center gap-2 text-[0.68rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/60">
          Built with React, Tailwind &amp; Framer Motion
          <Heart className="h-3.5 w-3.5 text-[#D14AC0]" />
        </p>
        <a
          href="#home"
          className="group inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/70 transition-colors duration-300 hover:text-[#D7E2EA]"
        >
          Back to top
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#D7E2EA]/25 transition-transform duration-300 group-hover:-translate-y-1">
            <ArrowUp className="h-3.5 w-3.5" />
          </span>
        </a>
      </div>
    </footer>
  );
}
