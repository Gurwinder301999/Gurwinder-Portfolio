import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { aboutText, focusAreas, profile, stats, timeline } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import SectionBadge from '../components/SectionBadge';
import ContactButton from '../components/ContactButton';
import LiveProjectButton from '../components/LiveProjectButton';
import Cube3D from '../components/three-d/Cube3D';

type OrnamentProps = {
  x?: number;
  delay: number;
  className: string;
  variant: 'orb' | 'cube' | 'disc' | 'capsule';
  size: number;
  /** Edge the shape stays anchored to while it is scaled down on small screens. */
  origin?: 'left' | 'right';
};

/**
 * Decorative 3D corner object (glass orb / wireframe cube / orbiting disc).
 * These replace the reference design's bitmap 3D icons with pure CSS 3D so the
 * page has zero external asset dependencies.
 */
function Ornament({ x = 0, delay, className, variant, size, origin = 'left' }: OrnamentProps) {
  const shape =
    variant === 'cube' ? (
      <Cube3D size={size} duration={24} />
    ) : variant === 'disc' ? (
      <div
        className="preserve-3d relative rounded-full border border-[#D7E2EA]/25"
        style={{ width: size, height: size, transform: 'rotateX(68deg)' }}
      >
        <span className="absolute inset-3 rounded-full border border-[#B600A8]/50" />
        <span className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(215,226,234,0.5),transparent_70%)]" />
      </div>
    ) : variant === 'capsule' ? (
      <div
        className="rounded-[999px] border border-[#D7E2EA]/20 bg-[linear-gradient(140deg,rgba(215,226,234,0.22),rgba(118,33,176,0.35),transparent)] shadow-[0_30px_70px_-30px_rgba(118,33,176,0.9)]"
        style={{ width: size, height: size * 0.62 }}
      />
    ) : (
      <div
        className="rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff,rgba(187,204,215,0.65)_32%,rgba(118,33,176,0.75)_72%)] shadow-[0_40px_90px_-30px_rgba(118,33,176,0.95)]"
        style={{ width: size, height: size }}
      />
    );

  return (
    <FadeIn
      delay={delay}
      duration={0.9}
      x={x}
      y={0}
      className={`pointer-events-none absolute ${className}`}
    >
      <div className="float-soft" style={{ animationDelay: `${delay + 0.3}s` }}>
        {/* the shapes keep their px size while the wrapper narrows, so phones get a
            scaled-down copy instead of an oversized object sitting on the copy */}
        <div className={origin === 'right' ? 'origin-top-right scale-[0.35] xs:scale-75 sm:scale-100' : 'origin-top-left scale-[0.35] xs:scale-75 sm:scale-100'}>
          <div style={{ perspective: '900px' }}>{shape}</div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      {/* On phones the copy spans the full column, so the ornaments live in the
          section's empty top/bottom padding bands; from `sm` up they return to the
          reference design's corner positions. */}
      <Ornament variant="orb" size={150} delay={0.1} x={-80} origin="left" className="-left-[1%] top-[3.2%] w-[90px] opacity-70 sm:left-[3%] sm:top-[8%] sm:w-[130px] md:w-[170px]" />
      <Ornament variant="capsule" size={150} delay={0.25} x={-80} origin="left" className="bottom-[-3.5%] left-[1%] w-[80px] opacity-70 sm:bottom-[10%] sm:left-[8%] sm:w-[120px] md:w-[160px]" />
      <Ornament variant="cube" size={110} delay={0.15} x={80} origin="right" className="right-[1%] top-[3.2%] w-[84px] opacity-75 sm:right-[3%] sm:top-[8%] sm:w-[120px] md:w-[150px]" />
      <Ornament variant="disc" size={130} delay={0.3} x={80} origin="right" className="bottom-[-2.5%] right-[4%] w-[90px] opacity-75 sm:bottom-[10%] sm:right-[8%] sm:w-[130px] md:w-[180px]" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40} className="flex flex-col items-center gap-5 text-center">
          <SectionBadge>About Me</SectionBadge>
          <h2 className="hero-heading text-center font-black uppercase leading-[0.9] tracking-tight text-[clamp(3rem,12vw,9rem)]">
            About Me
          </h2>
        </FadeIn>

        <div className="grid w-full items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <AnimatedText
              text={aboutText}
              className="max-w-[560px] justify-start text-left text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
            />

            <div className="flex flex-wrap items-center gap-4">
              <ContactButton
                label={
                  <>
                    Let&apos;s Talk
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                }
                href="#contact"
              />
              <LiveProjectButton
                label={
                  <>
                    Download CV
                    <Download className="h-4 w-4" />
                  </>
                }
                href={profile.resumeUrl}
                download
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {focusAreas.map(({ label, icon: Icon }, index) => (
                <FadeIn key={label} delay={index * 0.05} y={18}>
                  <span className="flex items-center gap-3 rounded-2xl border border-[#D7E2EA]/[0.12] bg-white/[0.03] px-4 py-3 transition-colors duration-300 hover:border-[#B600A8]/40 hover:bg-white/[0.06]">
                    <Icon className="h-4 w-4 shrink-0 text-[#D14AC0]" />
                    <span className="text-[0.72rem] font-light uppercase tracking-[0.16em] text-[#D7E2EA]/75">
                      {label}
                    </span>
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label, icon: Icon }, index) => (
                <FadeIn key={label} delay={index * 0.1} y={24}>
                  <div className="group h-full rounded-3xl border border-[#D7E2EA]/[0.12] bg-white/[0.03] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#B600A8]/45 sm:p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#D7E2EA]/[0.15] bg-white/[0.05] transition-transform duration-500 group-hover:rotate-6">
                      <Icon className="h-5 w-5 text-[#D7E2EA]" />
                    </span>
                    <p className="mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-none text-[#D7E2EA]">
                      {value}
                    </p>
                    <p className="mt-2 text-[0.7rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/68">
                      {label}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <ol className="relative flex flex-col gap-4 border-l border-[#D7E2EA]/[0.12] pl-5">
              {timeline.map((entry, index) => {
                const Icon = entry.icon;
                return (
                  <FadeIn key={entry.title} delay={index * 0.12} y={22} as="li" className="relative">
                    <span className="absolute -left-[9px] mt-1 grid h-4 w-4 place-items-center rounded-full border border-[#D7E2EA]/25 bg-[#0C0C0C]">
                      <span className="accent-gradient h-1.5 w-1.5 rounded-full" />
                    </span>
                    <div className="rounded-2xl border border-[#D7E2EA]/[0.1] bg-white/[0.02] p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/65">
                        <Icon className="h-3.5 w-3.5 text-[#D14AC0]" />
                        {entry.period}
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-[#D7E2EA] sm:text-lg">{entry.title}</h3>
                      <p className="text-xs font-light uppercase tracking-[0.14em] text-[#D7E2EA]/62">
                        {entry.place}
                      </p>
                      <p className="mt-2 text-sm font-light leading-relaxed text-[#D7E2EA]/65">
                        {entry.detail}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </ol>

            <FadeIn delay={0.2} y={20}>
              <p className="flex items-center gap-2 text-[0.68rem] font-light uppercase tracking-[0.22em] text-[#D7E2EA]/62">
                <Sparkles className="h-3.5 w-3.5 text-[#D14AC0]" />
                Home lab · ticketing &amp; SLA · preventive maintenance
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
