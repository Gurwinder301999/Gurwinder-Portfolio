import { useEffect, useRef, useState } from 'react';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import ProjectLandingPage from './pages/ProjectLandingPage';
import LegalPage from './pages/LegalPage';
import { projects, type Project } from './data/portfolio';
import { legalDocBySlug } from './data/legal';
import { scrollToSection, type SectionId } from './utils/navigation';

/**
 * Parses current hash to determine if a project landing page is requested.
 * Supported format: #/project/:id or #project/:id
 */
function getProjectIdFromHash(hash: string): string | null {
  const match = hash.match(/^#\/?project\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Parses a legal document slug from the hash: #/legal/privacy.
 *
 * Returns undefined for "not a legal route" and null for "legal route with an
 * unknown slug", so the page can render a 404 instead of silently falling back
 * to the home page.
 */
function getLegalSlugFromHash(hash: string): string | null | undefined {
  const match = hash.match(/^#\/?legal\/([a-zA-Z0-9_-]+)/);
  if (!match) return undefined;
  return match[1];
}

/**
 * Page shell: dark #0C0C0C canvas, Kanit typography and the section order
 * Hero -> Marquee -> About -> Skills -> Services -> Projects -> Contact.
 * Also supports dedicated standalone project landing pages when clicking "View Project".
 */
export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    return getProjectIdFromHash(window.location.hash);
  });

  // Section a landing page asked us to reveal once the home page is mounted.
  const pendingSectionRef = useRef<SectionId | null>(null);

  // Legal pages are a separate route, and are checked before the project route
  // so a legal slug can never be read as a project id.
  const [legalSlug, setLegalSlug] = useState<string | null | undefined>(() =>
    getLegalSlugFromHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => {
      const pid = getProjectIdFromHash(window.location.hash);
      setActiveProjectId(pid);
      setLegalSlug(getLegalSlugFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // A legal page owns the whole viewport, so it must win over any project or
  // section state rather than rendering underneath them.
  if (legalSlug !== undefined) {
    return (
      <>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <LegalPage doc={legalSlug ? (legalDocBySlug[legalSlug] ?? null) : null} />
      </>
    );
  }

  // Landing pages have no contact form of their own, so reveal the home page
  // first and only then scroll to the requested section.
  useEffect(() => {
    if (activeProjectId) return;
    const pending = pendingSectionRef.current;
    if (!pending) return;
    pendingSectionRef.current = null;
    scrollToSection(pending);
  }, [activeProjectId]);

  const activeProject = activeProjectId
    ? projects.find((p) => p.id === activeProjectId) || null
    : null;

  const handleSelectProject = (project: Project) => {
    window.location.hash = `#/project/${project.id}`;
    setActiveProjectId(project.id);
  };

  /** Leaves the landing page and reveals a home page section. */
  const handleGoToSection = (section: SectionId) => {
    if (activeProject) {
      pendingSectionRef.current = section;
      setActiveProjectId(null);
    }
    window.location.hash = `#${section}`;
  };

  const handleBackToPortfolio = () => {
    setActiveProjectId(null);
    window.location.hash = '#projects';
  };

  const handleNavigateToProject = (projectId: string) => {
    window.location.hash = `#/project/${projectId}`;
    setActiveProjectId(projectId);
  };

  // If a valid project is active, display its dedicated landing page with identical theme
  if (activeProject) {
    return (
      <div id="app-shell" className="relative min-h-screen bg-[#0C0C0C] font-kanit text-[#D7E2EA]">
        <ScrollProgress />
        <ProjectLandingPage
          project={activeProject}
          onBack={handleBackToPortfolio}
          onNavigateToProject={handleNavigateToProject}
          onGoToSection={handleGoToSection}
        />
      </div>
    );
  }

  return (
    <div id="app-shell" className="relative min-h-screen bg-[#0C0C0C] font-kanit text-[#D7E2EA]">
      <ScrollProgress />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative overflow-x-clip">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection onSelectProject={handleSelectProject} />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
