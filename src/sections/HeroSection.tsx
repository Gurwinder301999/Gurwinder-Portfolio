import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Download, MapPin, Sparkles } from 'lucide-react';
import Hero3DScene from '../components/three-d/Hero3DScene';
import Tilt3D from '../components/three-d/Tilt3D';
import Magnet from '../components/Magnet';
import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import LiveProjectButton from '../components/LiveProjectButton';
import { heroTech, profile } from '../data/portfolio';

function CodeLine({ line }: { line: string }) {
  const parts = line.split(/('.*?')/g);

  return (
    <span className="block whitespace-pre">
      {parts.map((part, index) =>
        part.startsWith("'") ? (
          <span key={index} className="text-[#E0A458]">
            {part}
          </span>
        ) : (
          <span key={index} className="text-[#BBCCD7]/85">
            {part}
          </span>
        ),
      )}
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [0, 14]);

  const stageRotateY = useSpring(0, { stiffness: 55, damping: 18, mass: 0.7 });
  const stageRotateX = useSpring(0, { stiffness: 55, damping: 18, mass: 0.7 });
  const stageShiftX = useSpring(0, { stiffness: 45, damping: 20 });
  const stageShiftY = useSpring(0, { stiffness: 45, damping: 20 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Ignore touch input so the 3D stage does not lurch when a phone is tapped.
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    stageRotateY.set(px * 10);
    stageRotateX.set(-py * 7);
    stageShiftX.set(px * 26);
    stageShiftY.set(py * 20);
  };

  const resetStage = () => {
    stageRotateY.set(0);
    stageRotateX.set(0);
    stageShiftX.set(0);
    stageShiftY.set(0);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetStage}
      className="relative flex min-h-screen flex-col overflow-x-clip pt-24 sm:pt-28 md:pt-32"
    >
      <motion.div style={{ scale: sceneScale, rotateX: sceneRotate }} className="absolute inset-0">
        <Hero3DScene />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 sm:px-8 md:px-10"
      >
        <div className="flex flex-1 items-center perspective-1200">
          <motion.div
            style={{ rotateX: stageRotateX, rotateY: stageRotateY, transformStyle: 'preserve-3d' }}
            className="grid w-full items-center gap-12 py-6 lg:grid-cols-12 lg:gap-8"
          >
            <div className="preserve-3d lg:col-span-7">
              <FadeIn delay={0} y={-20}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/20 bg-[#D7E2EA]/[0.05] px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#D7E2EA]/85 backdrop-blur-sm sm:text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#D14AC0]" />
                  {profile.badge}
                </span>
              </FadeIn>

              <FadeIn delay={0.15} y={40} className="mt-6 sm:mt-7">
                <p className="text-[clamp(1.6rem,4.6vw,3.4rem)] font-black uppercase leading-none tracking-tight text-[#D7E2EA]">
                  Hi, I&apos;m
                </p>
                <h1
                  style={{ transform: 'translateZ(60px)' }}
                  className="hero-heading text-glow -mt-1 break-words text-[clamp(2.6rem,12vw,4rem)] font-black uppercase leading-[0.92] tracking-tight xs:text-[11vw] sm:text-[10.5vw] md:text-[9vw] lg:-mt-2 lg:text-[6.8vw] xl:text-[5.9vw]"
                >
                  {profile.firstName}{' '}
                  <span className="inline-block align-top text-[0.5em] sm:text-[7vw] sm:leading-none lg:text-[4.4vw] xl:text-[3.8vw]">/</span>
                </h1>
                <h2 className="mt-2 text-[clamp(1.15rem,3.4vw,2.5rem)] font-semibold uppercase leading-tight tracking-tight text-[#D7E2EA] lg:mt-3">
                  {profile.role}
                </h2>
              </FadeIn>

              <FadeIn delay={0.25} y={20} className="mt-6 max-w-[34rem]">
                <p className="text-[clamp(0.85rem,1.5vw,1.05rem)] font-light leading-relaxed text-[#D7E2EA]/75">
                  {profile.summary}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.22em] text-[#D7E2EA]/65">
                  <MapPin className="h-3.5 w-3.5 text-[#D14AC0]" />
                  {profile.location}
                </p>
              </FadeIn>

              <FadeIn delay={0.35} y={20} className="mt-8 flex flex-wrap items-center gap-4">
                <ContactButton
                  label={
                    <>
                      View My Work
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  }
                  href="#projects"
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
              </FadeIn>
            </div>

            {/* portrait + floating code card, layered on the Z axis */}
            <div className="preserve-3d lg:col-span-5">
              <FadeIn delay={0.6} y={30}>
                <Magnet
                  padding={150}
                  strength={3}
                  activeTransition="transform 0.3s ease-out"
                  inactiveTransition="transform 0.6s ease-in-out"
                >
                  <Tilt3D
                    max={12}
                    hoverLift={30}
                    glare
                    className="preserve-3d relative mx-auto w-[min(76vw,400px)] lg:w-full lg:max-w-[430px]"
                  >
                    <div className="preserve-3d relative">
                      <div
                        aria-hidden
                        className="absolute -inset-6 rounded-[52px] bg-[radial-gradient(circle_at_50%_25%,rgba(118,33,176,0.6),rgba(182,0,168,0.2)_45%,transparent_72%)] blur-2xl"
                      />

                      <div className="relative overflow-hidden rounded-[36px] border-2 border-[#D7E2EA]/25 bg-[#101013] shadow-[0_50px_120px_-40px_rgba(118,33,176,0.9)] sm:rounded-[44px]">
                        <img
                          src={profile.photo}
                          alt={`Portrait of ${profile.name}, IT Support Engineer`}
                          width={400}
                          height={500}
                          loading="eager"
                          decoding="async"
                          className="aspect-[4/5] w-full bg-[#101013] object-cover object-top"
                        />
                        <div
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/50 to-transparent"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white sm:text-base">
                              {profile.name}
                            </p>
                            <p className="text-[0.62rem] font-light uppercase tracking-[0.22em] text-[#D7E2EA]/70">
                              {profile.role}
                            </p>
                          </div>
                          <span className="rounded-full border border-[#D7E2EA]/40 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-[#D7E2EA]">
                            Delhi, IN
                          </span>
                        </div>
                      </div>

                      {/* floating code card, pushed forward on Z */}
                      <div
                        style={{ transform: 'translateZ(90px)' }}
                        className="absolute -bottom-6 left-0 w-[min(78%,248px)] overflow-hidden rounded-2xl border border-[#D7E2EA]/15 bg-[#0C0C0C]/90 p-3 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:-bottom-8 sm:-left-8 sm:w-[286px] sm:p-4"
                      >
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                          <span className="accent-gradient h-2 w-2 rounded-full" />
                          <span className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/70">
                            engineer.ts
                          </span>
                          <span className="ml-auto flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D7E2EA]/25" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D7E2EA]/25" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#B600A8]/70" />
                          </span>
                        </div>
                        <div className="relative mt-3 font-mono text-[0.62rem] leading-[1.7] sm:text-[0.7rem]">
                          {profile.codeCard.map((line) => (
                            <CodeLine key={line} line={line} />
                          ))}
                          <span
                            aria-hidden
                            className="scanline pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
                          />
                        </div>
                      </div>

                      {/* floating stat chip */}
                      <div
                        style={{ transform: 'translateZ(130px)' }}
                        className="absolute right-0 top-4 rounded-2xl border border-[#D7E2EA]/15 bg-[#0C0C0C]/85 px-3 py-2 backdrop-blur-xl sm:-right-6 sm:top-6 sm:px-3.5 sm:py-2.5"
                      >
                        <p className="text-lg font-black leading-none text-[#D7E2EA] sm:text-xl">99.9%</p>
                        <p className="text-[0.55rem] font-light uppercase tracking-[0.24em] text-[#D7E2EA]/68">
                          uptime kept
                        </p>
                      </div>
                    </div>
                  </Tilt3D>
                </Magnet>
              </FadeIn>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------ tech strip */}
        <FadeIn delay={0.4} y={24} className="mt-8 border-t border-white/[0.07] pt-6 sm:mt-10 sm:pt-8">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.34em] text-[#D7E2EA]/62 sm:text-xs">
            Technologies I Work With
          </p>
          <ul className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
            {heroTech.map(({ label, icon: Icon }) => (
              <li key={label} className="group perspective-1000">
                <span className="flex items-center gap-2 rounded-2xl border border-[#D7E2EA]/[0.14] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B600A8]/60 hover:bg-white/[0.07] sm:px-4 sm:py-3">
                  <Icon className="h-4 w-4 text-[#D7E2EA] transition-colors duration-300 group-hover:text-[#D14AC0] sm:h-5 sm:w-5" />
                  <span className="text-[0.68rem] font-light uppercase tracking-[0.14em] text-[#D7E2EA]/70 sm:text-xs">
                    {label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* ------------------------------------------------ bottom bar */}
        <div className="mt-auto flex flex-col items-start justify-between gap-6 pb-7 pt-10 sm:flex-row sm:items-end sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p className="max-w-[260px] text-[clamp(0.7rem,1.4vw,1.2rem)] font-light uppercase leading-snug tracking-wide text-[#D7E2EA]/80 sm:max-w-[320px] md:max-w-[380px]">
              {profile.tagline}
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <ContactButton label="Contact Me" href="#contact" />
          </FadeIn>
        </div>
      </motion.div>
    </section>
  );
}
