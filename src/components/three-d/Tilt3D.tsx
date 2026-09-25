import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export type Tilt3DProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  max?: number;
  /** Perspective distance in px for the wrapper. */
  perspective?: number;
  /** Show a light glare that follows the pointer. */
  glare?: boolean;
  /** Lift the card out of the plane while hovered. */
  hoverLift?: number;
  style?: CSSProperties;
};

/**
 * Mouse driven 3D tilt container: rotateX / rotateY are derived from the
 * pointer position and smoothed with springs, so children can be layered on
 * the Z axis with translateZ for a real depth effect.
 */
export default function Tilt3D({
  children,
  className = '',
  max = 10,
  perspective = 1200,
  glare = false,
  hoverLift = 0,
  style,
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 140, damping: 18, mass: 0.6 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 18, mass: 0.6 });
  const lift = useSpring(0, { stiffness: 160, damping: 20 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), rgba(118,33,176,0.12) 35%, transparent 62%)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = containerRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Mouse only: touch input should not tilt the card.
    if (event.pointerType !== 'mouse') return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * max * 2);
    rotateX.set((0.5 - py) * max * 2);
    lift.set(hoverLift);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(glare ? 1 : 0);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
    glareOpacity.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <div ref={containerRef} className={className} style={{ perspective: `${perspective}px`, ...style }}>
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          z: lift,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative h-full w-full preserve-3d"
      >
        {children}
        {glare ? (
          <motion.span
            aria-hidden
            style={{ background: glareBackground, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        ) : null}
      </motion.div>
    </div>
  );
}
