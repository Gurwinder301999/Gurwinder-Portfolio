import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient progress bar pinned to the very top of the page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="accent-gradient fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
    />
  );
}
