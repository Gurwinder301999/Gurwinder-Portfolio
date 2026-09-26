import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, Calendar, Check, MapPin } from 'lucide-react';
import { projects, type Project } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import useMediaQuery from '../hooks/useMediaQuery';
import SectionBadge from '../components/SectionBadge';
import LiveProjectButton from '../components/LiveProjectButton';
import Tilt3D from '../components/three-d/Tilt3D';
import ProjectVisual from './projectVisuals';

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onSelectProject?: (project: Project) => void;
};

function ProjectCard({ project, index, total, progress, onSelectProject }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index * (1 / total), 1], [1, targetScale]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  const handleOpenLanding = () => {
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      window.location.hash = `#/project/${project.id}`;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center py-6 first:pt-0 md:sticky md:top-32 md:h-[85vh] md:py-0"
    >
      <motion.article
        style={{ scale, top: isDesktop ? `${index * 28}px` : 0 }}
        className="relative flex h-full w-full max-w-[1400px] flex-col gap-3 overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 shadow-[0_60px_140px_-70px_rgba(0,0,0,1)] sm:gap-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-end gap-4 sm:gap-6">
            <span className="text-[clamp(2.4rem,7vw,7rem)] font-black leading-[0.78] text-[#D7E2EA]">
              {project.number}
            </span>
            <div className="pb-1">
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/62 sm:text-[0.65rem]">
                {project.category}
              </p>
              <h3
                onClick={handleOpenLanding}
                className="cursor-pointer text-[clamp(1.15rem,2.8vw,2.6rem)] font-medium uppercase leading-tight tracking-tight text-[#D7E2EA] transition-colors duration-200 hover:text-white"
              >
                {project.name}
              </h3>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.58rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/62 sm:text-[0.65rem]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-[#D14AC0]" />
                  {project.period}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#D14AC0]" />
                  {project.location}
                </span>
              </p>
            </div>
          </div>

          <LiveProjectButton
            label={
              <>
                View Project
                <ArrowUpRight className="h-4 w-4" />
              </>
            }
            href={`#/project/${project.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleOpenLanding();
            }}
            className="hidden sm:inline-flex"
          />
        </header>

        <div
          onClick={handleOpenLanding}
          className="grid min-h-0 flex-1 cursor-pointer gap-3 transition-opacity duration-300 hover:opacity-95 md:grid-cols-[40%_60%] md:gap-4"
          title="Click to view the full project landing page"
        >
          <div className="grid min-h-0 gap-3 md:grid-rows-[clamp(130px,16vw,230px)_1fr] md:gap-4">
            <div className="h-[150px] overflow-hidden rounded-[32px] border border-[#D7E2EA]/[0.1] sm:h-[190px] sm:rounded-[40px] md:h-auto">
              <motion.div style={{ scale: visualScale }} className="h-full w-full">
                <ProjectVisual kind={project.visuals.leftTop} />
              </motion.div>
            </div>
            <div className="h-[150px] overflow-hidden rounded-[32px] border border-[#D7E2EA]/[0.1] sm:h-[190px] sm:rounded-[40px] md:h-auto md:min-h-0">
              <motion.div style={{ scale: visualScale }} className="h-full w-full">
                <ProjectVisual kind={project.visuals.leftBottom} />
              </motion.div>
            </div>
          </div>

          <Tilt3D max={6} hoverLift={18} className="h-[220px] w-full sm:h-[280px] md:h-auto md:min-h-0">
            <div className="h-full min-h-0 overflow-hidden rounded-[32px] border border-[#D7E2EA]/[0.1] sm:rounded-[40px]">
              <motion.div style={{ scale: visualScale }} className="h-full w-full">
                <ProjectVisual kind={project.visuals.right} />
              </motion.div>
            </div>
          </Tilt3D>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[#D7E2EA]/[0.2] px-3 py-1.5 text-[0.58rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/70 sm:text-[0.62rem]"
              >
                {tech}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <p className="max-w-[28rem] text-[0.68rem] font-light leading-snug text-[#D7E2EA]/65 sm:text-xs">
              {project.summary}
            </p>
            <button
              type="button"
              onClick={handleOpenLanding}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/30 bg-white/[0.04] px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-[#D7E2EA] transition-colors hover:border-[#B600A8] hover:bg-[#B600A8]/20 sm:hidden"
            >
              View Project
              <ArrowUpRight className="h-3 w-3 text-[#D14AC0]" />
            </button>
          </div>
        </footer>

        <ul className="hidden gap-4 lg:grid lg:grid-cols-3">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-2 text-[0.68rem] font-light leading-snug text-[#D7E2EA]/70"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D14AC0]" />
              <span className="line-clamp-2">{highlight}</span>
            </li>
          ))}
        </ul>
      </motion.article>
    </div>
  );
}

export type ProjectsSectionProps = {
  onSelectProject?: (project: Project) => void;
};

export default function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] pt-16 sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px] md:pt-24"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-4 px-5 text-center sm:px-8 md:px-10">
        <FadeIn delay={0} y={20}>
          <SectionBadge>Featured Projects</SectionBadge>
        </FadeIn>
        <FadeIn delay={0.08} y={30}>
          <h2 className="hero-heading text-center font-black uppercase leading-[0.9] tracking-tight text-[clamp(3rem,12vw,10rem)]">
            Projects
          </h2>
        </FadeIn>
        <FadeIn delay={0.14} y={20}>
          <p className="max-w-[44rem] text-xs font-light uppercase tracking-[0.18em] text-[#D7E2EA]/62 sm:text-sm">
            Deployments from the field — IP telephony, Linux servers and service desk operations
          </p>
        </FadeIn>
      </div>

      <div ref={sectionRef} className="relative mt-10 px-3 sm:px-6 md:px-10">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            onSelectProject={onSelectProject}
          />
        ))}
        {/* Trailing runway for the sticky stack to resolve into. Desktop needs
            room for the last card to unstick; on phones the cards flow
            normally, so the spacer is removed to avoid dead space. */}
        <div aria-hidden className="hidden h-[10vh] md:block" />
      </div>
    </section>
  );
}
