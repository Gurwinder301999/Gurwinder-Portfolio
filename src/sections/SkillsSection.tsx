import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import SectionBadge from '../components/SectionBadge';
import Tilt3D from '../components/three-d/Tilt3D';

function SkillBar({ name, level, Icon, delay }: { name: string; level: number; Icon: (typeof skills)[number]['icon']; delay: number }) {
  return (
    <FadeIn delay={delay} y={20}>
      <div className="rounded-2xl border border-[#D7E2EA]/[0.1] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-[#B600A8]/40 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#D7E2EA]/[0.14] bg-white/[0.05]">
            <Icon className="h-4 w-4 text-[#D7E2EA]" />
          </span>
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-[#D7E2EA]/85">
            {name}
          </span>
          <span className="ml-auto text-xs font-semibold text-[#D7E2EA]/70">{level}%</span>
        </div>
        <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-white/[0.07]">
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, delay: delay + 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="accent-gradient block h-full rounded-full"
          />
        </div>
      </div>
    </FadeIn>
  );
}

/**
 * Skills section — the reference design's "Technologies I master" grid with
 * animated proficiency bars, tinted to the dark 3D theme.
 */
export default function SkillsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.2 });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!gridRef.current) return;
    const node = gridRef.current;
    const onMove = (event: PointerEvent) => {
      // Mouse only: a finger drag should not parallax the grid.
      if (event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      setPointer({
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    const onLeave = () => setPointer({ x: 0, y: 0 });

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section id="skills" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
      <div
        aria-hidden
        className="glow-pulse pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(118,33,176,0.28),transparent_66%)] blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-4 text-center">
        <FadeIn delay={0} y={20}>
          <SectionBadge>My Skills</SectionBadge>
        </FadeIn>
        <FadeIn delay={0.1} y={30}>
          <h2 className="text-[clamp(1.6rem,4.4vw,3.2rem)] font-semibold uppercase tracking-tight text-[#D7E2EA]">
            Technologies I <span className="hero-heading">handle daily</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.18} y={20}>
          <p className="max-w-[46rem] text-xs font-light uppercase tracking-[0.18em] text-[#D7E2EA]/62 sm:text-sm">
            Windows and Linux administration, networking, telephony and the service desk tooling around them
          </p>
        </FadeIn>
      </div>

      <Tilt3D max={5} className="relative mx-auto mt-12 w-full max-w-[1400px] sm:mt-16">
        <div
          ref={gridRef}
          className={`grid gap-4 transition-opacity duration-700 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 ${
            isInView ? 'opacity-100' : 'opacity-90'
          }`}
          style={{ transform: `translate3d(${pointer.x * 6}px, ${pointer.y * 4}px, 0)` }}
        >
          {skills.map((skill, index) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              Icon={skill.icon}
              delay={index * 0.06}
            />
          ))}
        </div>
      </Tilt3D>
    </section>
  );
}
