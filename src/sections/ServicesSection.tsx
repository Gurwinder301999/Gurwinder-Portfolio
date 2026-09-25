import { ArrowRight } from 'lucide-react';
import { services } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import SectionBadge from '../components/SectionBadge';
import ContactButton from '../components/ContactButton';

/**
 * Services section — a dark raised panel listing the five support disciplines
 * with a huge numeric index per row.
 *
 * The section keeps the #0C0C0C canvas of its neighbours so the rounded corner
 * reads as one continuous dark shell; the tonal lift lives on the inner surface
 * rather than on a white background, which used to glare against the rest of
 * the page. The generous bottom padding gives the following section's negative
 * top margin room to overlap without clipping.
 */
export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative z-20 overflow-hidden rounded-t-[40px] border-t border-white/[0.08] bg-[#0C0C0C] px-5 pb-28 pt-16 sm:rounded-t-[50px] sm:px-8 sm:pb-32 sm:pt-20 md:rounded-t-[60px] md:px-10 md:pb-40 md:pt-24"
    >
      {/* Ambient accents keep the panel from reading as a flat block */}
      <div
        aria-hidden
        className="glow-pulse pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(118,33,176,0.20),transparent_68%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(182,0,168,0.14),transparent_68%)] blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-4 text-center">
        <FadeIn delay={0} y={20}>
          <SectionBadge>Services</SectionBadge>
        </FadeIn>
        <FadeIn delay={0.1} y={30}>
          <h2 className="text-center font-black uppercase leading-[0.9] tracking-tight text-[clamp(3rem,12vw,10rem)]">
            <span className="hero-heading">Services</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.16} y={20}>
          <p className="max-w-[46rem] text-xs font-light uppercase tracking-[0.18em] text-[#D7E2EA]/62 sm:text-sm">
            Five ways I keep an office connected, supported, and documented
          </p>
        </FadeIn>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-5xl sm:mt-16">
        <div className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#101013] sm:rounded-[40px]">
          {services.map((service, index) => (
            <FadeIn
              key={service.number}
              delay={index * 0.08}
              y={26}
              className={index === 0 ? '' : 'border-t border-white/[0.08]'}
            >
              <article className="group flex flex-col gap-4 px-5 py-8 transition-colors duration-500 hover:bg-white/[0.025] sm:flex-row sm:gap-8 sm:px-8 sm:py-10 md:gap-12 md:px-10 md:py-12">
                <span className="text-[clamp(3rem,10vw,8.75rem)] font-black leading-[0.8] text-[#D7E2EA]/45 transition-colors duration-500 group-hover:text-[#D14AC0]">
                  {service.number}
                </span>
                <div className="flex flex-col gap-3 md:pt-3">
                  <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase leading-tight tracking-tight text-[#D7E2EA]">
                    {service.name}
                  </h3>
                  <p className="max-w-2xl text-[clamp(0.85rem,1.6vw,1.15rem)] font-light leading-relaxed text-[#D7E2EA]/70">
                    {service.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>

      <FadeIn
        delay={0.2}
        y={24}
        className="relative mx-auto mt-12 flex max-w-5xl flex-col items-start gap-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 className="text-[clamp(1.2rem,2.6vw,2rem)] font-semibold uppercase tracking-tight text-[#D7E2EA]">
            Need any of this handled?
          </h3>
          <p className="mt-2 max-w-md text-sm font-light text-[#D7E2EA]/62">
            Tell me what is breaking, slow, or missing — I will tell you how I would fix it.
          </p>
        </div>
        <ContactButton
          label={
            <>
              Get in Touch
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          }
          href="#contact"
        />
      </FadeIn>
    </section>
  );
}
