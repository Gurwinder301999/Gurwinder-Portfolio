import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Terminal, X } from 'lucide-react';
import { navLinks, profile } from '../data/portfolio';
import ContactButton from '../components/ContactButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.replace('#', '')))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    // Lock background scroll while the mobile sheet is open, and reset the
    // state if the viewport grows into the desktop layout.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
      className="fixed inset-x-0 top-0 z-[60]"
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/[0.06] bg-[#0C0C0C]/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-3 sm:px-8 md:px-10 md:py-4"
        >
          <a href="#home" className="group flex items-center gap-3" aria-label={`${profile.name} home`}>
            <span className="accent-gradient relative grid h-10 w-10 place-items-center rounded-xl outline outline-2 -outline-offset-[3px] outline-white/80 transition-transform duration-300 group-hover:rotate-6">
              <Terminal className="h-5 w-5 text-white" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#D7E2EA] sm:text-base">
                Gurwinder
              </span>
              <span className="mt-1 text-[0.6rem] font-light uppercase tracking-[0.3em] text-[#D7E2EA]/65">
                IT Support · Delhi
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative text-sm font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70 lg:text-[1.05rem] ${
                      isActive ? 'text-white' : 'text-[#D7E2EA]'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`accent-gradient absolute -bottom-1.5 left-0 h-[2px] w-full origin-left rounded-full transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <ContactButton label="Hire Me" href="#contact" size="sm" className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#D7E2EA]/20 bg-white/[0.03] text-[#D7E2EA] transition-colors duration-300 hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden border-t border-white/[0.06] bg-[#0C0C0C]/95 backdrop-blur-xl lg:hidden"
            >
              <ul className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 px-5 py-4 sm:px-8">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors duration-200 hover:bg-white/[0.06]"
                    >
                      {link.label}
                      <span className="text-xs text-[#D7E2EA]/60">0{index + 1}</span>
                    </a>
                  </motion.li>
                ))}
                <li className="px-3 pt-2 sm:hidden">
                  <ContactButton
                    label="Hire Me"
                    href="#contact"
                    size="sm"
                    onClick={() => setMenuOpen(false)}
                  />
                </li>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
