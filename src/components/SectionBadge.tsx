import type { ReactNode } from 'react';

export type SectionBadgeProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

/**
 * Small uppercase eyebrow badge (mirrors the reference design's pill labels).
 * Dark theme only — the site is a single dark canvas by design.
 */
export default function SectionBadge({
  children,
  icon,
  className = '',
}: SectionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/20 bg-[#D7E2EA]/[0.04] px-3.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#D7E2EA]/80 ${className}`}
    >
      {icon ?? (
        <span className="accent-gradient h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(182,0,168,0.9)]" />
      )}
      {children}
    </span>
  );
}
