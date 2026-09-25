import type { MouseEvent, ReactNode } from 'react';

export type GhostButtonProps = {
  label?: ReactNode;
  href?: string;
  className?: string;
  external?: boolean;
  download?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Ghost / outline pill button (the spec's "Live Project" button).
 * Dark theme only — the site is a single dark canvas by design.
 */
export default function LiveProjectButton({
  label = 'Live Project',
  href = '#projects',
  className = '',
  external = false,
  download = false,
  onClick,
}: GhostButtonProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      download={download || undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-300 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      {label}
    </a>
  );
}
