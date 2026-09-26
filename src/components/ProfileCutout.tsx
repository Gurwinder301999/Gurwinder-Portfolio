import { motion, useReducedMotion } from 'framer-motion';
import type { ProfileCutoutProps } from '../data/portfolio';

/**
 * Animated full-body cutout used in the About section.
 *
 * Auto-adjusting, in three senses:
 *  - the figure is cropped by the browser with `object-contain`, so it scales to
 *    the box without ever distorting its aspect ratio;
 *  - it sits on a responsive clamp() width rather than a fixed pixel size, so it
 *    shrinks on a phone and grows on a desktop;
 *  - the float loop is driven by framer-motion rather than a fixed CSS frame
 *    count, and is disabled entirely when the visitor prefers reduced motion.
 */
export default function ProfileCutout({
  src,
  alt,
  className = '',
  glow = true,
}: ProfileCutoutProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative flex justify-center ${className}`}>
      {glow ? (
        <span
          aria-hidden
          className="glow-pulse pointer-events-none absolute inset-x-2 bottom-4 top-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(118,33,176,0.45),transparent_70%)] blur-2xl"
        />
      ) : null}

      <motion.div
        className="relative w-[clamp(140px,42vw,200px)]"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -12, 0], rotate: [-1.2, 1.2, -1.2] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 6.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <img
          src={src}
          alt={alt}
          width={204}
          height={646}
          loading="lazy"
          decoding="async"
          className="relative z-10 block h-auto w-full select-none object-contain"
          draggable={false}
        />

        {/* Soft contact shadow so the figure does not look pasted on. */}
        <span
          aria-hidden
          className="absolute -bottom-1 left-1/2 z-0 h-5 w-3/4 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(12,12,12,0.85),transparent_70%)] blur-md"
        />
      </motion.div>
    </div>
  );
}
