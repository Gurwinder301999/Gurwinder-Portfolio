import { useEffect, useRef, useState } from 'react';
import { marqueeTiles, type TechItem } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import SectionBadge from '../components/SectionBadge';
import useMediaQuery from '../hooks/useMediaQuery';

const ACCENTS = [
  'radial-gradient(circle at 18% 15%, rgba(182,0,168,0.35), transparent 62%)',
  'radial-gradient(circle at 78% 20%, rgba(118,33,176,0.35), transparent 62%)',
  'radial-gradient(circle at 25% 80%, rgba(190,76,0,0.3), transparent 62%)',
  'radial-gradient(circle at 70% 75%, rgba(100,105,115,0.4), transparent 62%)',
];

function Tile({ item, index }: { item: TechItem; index: number }) {
  const Icon = item.icon;

  return (
    <article
      className="group relative flex h-[180px] w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#D7E2EA]/[0.12] bg-[#101013] p-4 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#B600A8]/50 sm:h-[270px] sm:w-[420px] sm:p-6"
      style={{ backgroundImage: ACCENTS[index % ACCENTS.length] }}
    >
      <div aria-hidden className="dot-matrix absolute inset-0 opacity-[0.08]" />

      <div className="relative flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#D7E2EA]/[0.15] bg-white/[0.05] transition-transform duration-500 group-hover:rotate-6 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 text-[#D7E2EA] sm:h-6 sm:w-6" strokeWidth={1.8} />
        </span>
        <span className="text-[0.55rem] font-light uppercase tracking-[0.3em] text-[#D7E2EA]/60 sm:text-[0.65rem]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative">
        <h3 className="text-base font-semibold uppercase leading-tight tracking-wide text-[#D7E2EA] sm:text-2xl">
          {item.label}
        </h3>
        <span className="accent-gradient mt-2 block h-[3px] w-14 rounded-full transition-all duration-500 group-hover:w-24 sm:mt-3 sm:w-16" />
      </div>
    </article>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const node = sectionRef.current;
      if (!node) return;
      const sectionTop = node.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const rowOne = marqueeTiles.slice(0, 11);
  const rowTwo = marqueeTiles.slice(11);
  // Tiles are 280px on phones and 420px from `sm` up, separated by a 12px gap.
  // The negative offset must match the rendered copy width or the rows tear.
  const tileWidth = useMediaQuery('(min-width: 640px)') ? 420 : 280;
  const tileGap = 12;
  const rowOneCopyWidth = rowOne.length * (tileWidth + tileGap) + tileGap;
  const rowTwoCopyWidth = rowTwo.length * (tileWidth + tileGap) + tileGap;
  const shift = offset - 200;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0C0C0C] pb-10 pt-20 sm:pt-24 md:pt-28"
      aria-label="Tools and technologies"
    >
      <FadeIn delay={0} y={24} className="mx-auto mb-8 flex w-full max-w-[1600px] flex-col items-center gap-4 px-5 text-center sm:mb-12 sm:px-8 md:px-10">
        <SectionBadge>Daily Toolkit</SectionBadge>
        <h2 className="text-[clamp(1.4rem,3.4vw,2.6rem)] font-semibold uppercase tracking-tight text-[#D7E2EA]">
          Everything I keep <span className="hero-heading">running</span>
        </h2>
        <p className="max-w-[42rem] text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/62 sm:text-sm">
          Scroll to drift through the stack — the rows move with you
        </p>
      </FadeIn>

      <div className="flex flex-col gap-3">
        {[rowOne, rowTwo].map((row, rowIndex) => {
          const copyWidth = rowIndex === 0 ? rowOneCopyWidth : rowTwoCopyWidth;
          const translate = rowIndex === 0 ? shift : -shift;

          return (
            <div key={rowIndex} className="relative w-full overflow-hidden">
              <div
                className="flex w-max gap-3"
                style={{
                  transform: `translateX(${translate}px)`,
                  marginLeft: -copyWidth,
                  willChange: 'transform',
                }}
              >
                {[0, 1, 2].map((copy) =>
                  row.map((item, index) => (
                    <Tile key={`${copy}-${item.label}-${index}`} item={item} index={rowIndex * 11 + index} />
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0C0C0C] to-transparent sm:w-32"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0C0C0C] to-transparent sm:w-32"
      />
    </section>
  );
}
