import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Works for both the anchor and the no-href button branch of this component. */
export type ContactButtonClickHandler = (event: ReactMouseEvent<HTMLElement>) => void;

export type ContactButtonProps = {
  label?: ReactNode;
  href?: string;
  className?: string;
  external?: boolean;
  download?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: ContactButtonClickHandler;
};

const SIZE_CLASSES: Record<NonNullable<ContactButtonProps['size']>, string> = {
  sm: 'px-5 py-2 text-[0.7rem] sm:px-6 sm:py-2.5 sm:text-xs md:text-xs',
  md: 'px-8 py-3 text-xs sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base',
  lg: 'px-10 py-4 text-sm sm:px-12 sm:py-5 sm:text-base md:px-14 md:py-5 md:text-lg',
};

/**
 * Primary gradient pill CTA from the 3D landing-page spec.
 */
export default function ContactButton({
  label = 'Contact Me',
  href,
  className = '',
  external = false,
  download = false,
  size = 'md',
  onClick,
}: ContactButtonProps) {
  const shell = `accent-gradient group relative inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-widest text-white shadow-[0px_4px_4px_rgba(181,1,167,0.25),4px_4px_12px_#7721B1_inset] outline outline-2 -outline-offset-[3px] outline-white transition-transform duration-300 hover:scale-[1.03] ${SIZE_CLASSES[size]}`;


  const content = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0.35),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative flex items-center gap-2">{label}</span>
    </>
  );

  if (!href) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        className={`${shell} ${className}`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      download={download || undefined}
      className={`${shell} ${className}`}
    >
      {content}
    </motion.a>
  );
}
