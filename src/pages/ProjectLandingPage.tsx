import { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react';
import { projects, type Project } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import SectionBadge from '../components/SectionBadge';
import ContactButton from '../components/ContactButton';
import LiveProjectButton from '../components/LiveProjectButton';
import Tilt3D from '../components/three-d/Tilt3D';
import ProjectVisual from '../sections/projectVisuals';
import type { SectionId } from '../utils/navigation';

export type ProjectLandingPageProps = {
  project: Project;
  onBack: () => void;
  onNavigateToProject: (projectId: string) => void;
  /** Leaves the landing page and reveals the matching home page section. */
  onGoToSection: (section: SectionId) => void;
};
export default function ProjectLandingPage({
  project,
  onBack,
  onNavigateToProject,
  onGoToSection,
}: ProjectLandingPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const previousTitle = document.title;
    document.title = `${project.name} | Gurwinder Singh`;
    return () => {
      document.title = previousTitle;
    };
  }, [project]);

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return (
    <div className="relative min-h-screen bg-[#0C0C0C] font-kanit text-[#D7E2EA] selection:bg-[#B600A8] selection:text-white">
      {/* Ambient background glow accents */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#B600A8]/20 via-[#7621B0]/15 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] -left-40 h-[450px] w-[500px] rounded-full bg-[#BE4C00]/10 blur-[150px]" />
        <div className="absolute bottom-10 -right-40 h-[500px] w-[550px] rounded-full bg-[#7621B0]/15 blur-[160px]" />
      </div>

      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0C0C0C]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-8 sm:py-4 md:px-10">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#D7E2EA]/20 bg-white/[0.03] px-3 py-2 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#D7E2EA] transition-all duration-300 hover:border-[#D7E2EA]/50 hover:bg-white/[0.08] hover:text-white sm:gap-2.5 sm:px-4 sm:text-xs sm:tracking-[0.2em]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="hidden xs:inline">Back to</span>
            <span>Portfolio</span>
          </button>

          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/65 md:flex"
          >
            <button
              type="button"
              onClick={onBack}
              className="transition-colors hover:text-[#D7E2EA]"
            >
              Projects
            </button>
            <ChevronRight className="h-3 w-3 text-[#D14AC0]" />
            <span className="font-semibold text-white">{project.name}</span>
          </nav>

          <div className="flex items-center gap-3">
            <ContactButton
              label="Get In Touch"
              href="#contact"
              size="sm"
              className="px-4 py-2 text-[0.6rem] tracking-[0.16em] sm:px-6 sm:text-xs sm:tracking-widest"
              onClick={(e) => {
                e.preventDefault();
                onGoToSection('contact');
              }}
            />
          </div>
        </div>
      </header>

      {/* Main landing container */}
      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-12 sm:px-8 md:px-10 md:py-16">
        {/* Hero Section */}
        <section className="relative flex flex-col gap-6 border-b border-white/[0.08] pb-16 md:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FadeIn delay={0} y={15}>
              <div className="flex items-center gap-3">
                <SectionBadge>{project.category}</SectionBadge>
                <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 font-mono text-xs font-semibold text-[#D14AC0]">
                  PROJECT {project.number}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.05} y={15}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/70 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#D14AC0]" />
                  {project.period}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#D14AC0]" />
                  {project.location}
                </span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1} y={20}>
            <h1 className="hero-heading text-[clamp(2.5rem,7vw,6.5rem)] font-black uppercase leading-[0.92] tracking-tight">
              {project.name}
            </h1>
          </FadeIn>

          <FadeIn delay={0.15} y={20}>
            <p className="max-w-[52rem] text-lg font-light leading-relaxed text-[#D7E2EA]/85 sm:text-xl md:text-2xl">
              {project.tagline}
            </p>
          </FadeIn>

          {/* Quick tech stack tags */}
          <FadeIn delay={0.2} y={20}>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="mr-2 text-xs font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/60">
                Technologies:
              </span>
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[#D7E2EA]/20 bg-white/[0.03] px-3.5 py-1.5 text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/80 transition-colors hover:border-[#B600A8] hover:bg-[#B600A8]/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Key metrics / stats strip */}
          <FadeIn delay={0.25} y={20}>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {project.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101013] p-4 sm:p-5"
                >
                  <div className="accent-gradient absolute top-0 left-0 h-[2px] w-full" />
                  <p className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.62rem] font-light uppercase tracking-[0.22em] text-[#D7E2EA]/65 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
        {/* Live Interactive Visuals Showcase */}
        <section className="py-14 sm:py-16 md:py-20 border-b border-white/[0.08]">
          <div className="mb-8 flex flex-col gap-2">
            <SectionBadge>Live Console &amp; Topology</SectionBadge>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-[#D7E2EA] sm:text-3xl md:text-4xl">
              System Architecture &amp; Live Telemetry
            </h2>
            <p className="max-w-2xl text-xs font-light uppercase tracking-[0.18em] text-[#D7E2EA]/65 sm:text-sm">
              Simulated views of the terminal configuration, network topology, and interface status.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[40%_60%]">
            <div className="grid grid-rows-2 gap-4">
              <div className="h-[160px] overflow-hidden rounded-[32px] sm:h-[200px] md:h-auto">
                <ProjectVisual kind={project.visuals.leftTop} />
              </div>
              <div className="h-[160px] overflow-hidden rounded-[32px] sm:h-[200px] md:h-auto">
                <ProjectVisual kind={project.visuals.leftBottom} />
              </div>
            </div>

            <Tilt3D max={6} hoverLift={16} className="h-[240px] w-full sm:h-[300px] md:h-auto md:min-h-[360px]">
              <div className="h-full w-full overflow-hidden rounded-[32px]">
                <ProjectVisual kind={project.visuals.right} />
              </div>
            </Tilt3D>
          </div>
        </section>
        {/* Deep Dive Breakdown: Overview, Challenge, Solution */}
        <section className="py-14 sm:py-16 md:py-20 border-b border-white/[0.08]">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left column: Narrative Breakdown */}
            <div className="flex flex-col gap-10">
              <div>
                <SectionBadge>Executive Summary</SectionBadge>
                <h3 className="mt-3 text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
                  Project Scope &amp; Mission
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-[#D7E2EA]/80 sm:text-base">
                  {project.overview}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/[0.08] bg-[#101013] p-6 sm:p-7">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#BE4C00]/20 text-[#E0A458]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <h4 className="mt-4 text-base font-semibold uppercase tracking-wide text-white">
                    The Challenge
                  </h4>
                  <p className="mt-2 text-xs font-light leading-relaxed text-[#D7E2EA]/70 sm:text-sm">
                    {project.challenge}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/[0.08] bg-[#101013] p-6 sm:p-7">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#B600A8]/20 text-[#D14AC0]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <h4 className="mt-4 text-base font-semibold uppercase tracking-wide text-white">
                    The Solution
                  </h4>
                  <p className="mt-2 text-xs font-light leading-relaxed text-[#D7E2EA]/70 sm:text-sm">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* How It Works — plain-language walkthrough of the mechanics */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#101013] p-6 sm:p-8">
                <h4 className="flex items-center gap-2.5 text-base font-semibold uppercase tracking-wide text-white sm:text-lg">
                  <BookOpen className="h-5 w-5 text-[#8BE9A7]" />
                  How It Actually Works
                </h4>
                <p className="mt-2 text-xs font-light leading-relaxed text-[#D7E2EA]/60 sm:text-sm">
                  The mechanics behind the build, explained for a technical reader
                  who does not specialise in this stack.
                </p>
                <ol className="mt-6 space-y-4">
                  {project.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#D14AC0]/30 bg-[#B600A8]/10 text-xs font-bold text-[#D14AC0]">
                        {idx + 1}
                      </span>
                      <p className="text-xs leading-relaxed text-[#D7E2EA]/80 sm:text-sm">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Technical Highlights */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#101013] p-6 sm:p-8">
                <h4 className="flex items-center gap-2.5 text-base font-semibold uppercase tracking-wide text-white sm:text-lg">
                  <Workflow className="h-5 w-5 text-[#D14AC0]" />
                  Key Highlights &amp; Accomplishments
                </h4>
                <ul className="mt-5 space-y-3">
                  {project.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#D7E2EA]/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8BE9A7]" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column: Architecture & Key Deliverables */}
            <div className="flex flex-col gap-8">
              {/* Architecture Blueprint List */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#101013] p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#D14AC0]">
                  <Layers className="h-4 w-4" />
                  Technical Blueprint
                </span>
                <h4 className="mt-2 text-xl font-bold uppercase tracking-tight text-white">
                  Engineering Architecture
                </h4>
                <div className="mt-6 space-y-4">
                  {project.architecture.map((item, index) => (
                    <div
                      key={index}
                      className="group flex gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                    >
                      <span className="accent-gradient grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-white shadow-md">
                        0{index + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-light leading-relaxed text-[#D7E2EA]/80">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#101013] p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#8BE9A7]">
                  <Terminal className="h-4 w-4" />
                  Execution Checklist
                </span>
                <h4 className="mt-2 text-xl font-bold uppercase tracking-tight text-white">
                  Key Deliverables
                </h4>
                <ul className="mt-6 space-y-3.5">
                  {project.keyDeliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#D7E2EA]/75">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#B600A8]" />
                      <span className="leading-relaxed">{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Bottom CTA & Project Switcher */}
        <section className="py-14 sm:py-16 md:py-20">
          <div className="relative overflow-hidden rounded-[40px] border border-white/[0.1] bg-gradient-to-br from-[#121217] via-[#0C0C0C] to-[#1a0c1e] p-8 sm:p-12 md:p-16">
            <div className="accent-gradient absolute top-0 left-0 h-[3px] w-full" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <SectionBadge>Let&apos;s Collaborate</SectionBadge>
              <h3 className="hero-heading mt-4 text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-tight tracking-tight">
                Need similar infrastructure deployed?
              </h3>
              <p className="mt-3 max-w-xl text-xs font-light uppercase tracking-[0.18em] text-[#D7E2EA]/70 sm:text-sm">
                Available for IT support, network deployments, and VoIP setups across Delhi NCR.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <ContactButton
                  label="Get In Touch"
                  href="#contact"
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    onGoToSection('contact');
                  }}
                />
                <LiveProjectButton
                  label="Back to All Projects"
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Previous / Next Project Navigator */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onNavigateToProject(prevProject.id)}
              className="group flex flex-col items-start gap-2 rounded-3xl border border-white/[0.08] bg-[#101013] p-6 text-left transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.04]"
            >
              <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/62 group-hover:text-[#D14AC0]">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Previous Project
              </span>
              <p className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#D7E2EA] sm:text-xl">
                {prevProject.name}
              </p>
              <p className="text-xs font-light text-[#D7E2EA]/65 line-clamp-1">
                {prevProject.tagline}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToProject(nextProject.id)}
              className="group flex flex-col items-end gap-2 rounded-3xl border border-white/[0.08] bg-[#101013] p-6 text-right transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.04]"
            >
              <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/62 group-hover:text-[#D14AC0]">
                Next Project
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <p className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#D7E2EA] sm:text-xl">
                {nextProject.name}
              </p>
              <p className="text-xs font-light text-[#D7E2EA]/65 line-clamp-1">
                {nextProject.tagline}
              </p>
            </button>
          </div>
        </section>
      </main>

      {/* Landing page footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/60">
        <p>© {new Date().getFullYear()} Gurwinder Singh. All rights reserved.</p>
      </footer>
    </div>
  );
}
