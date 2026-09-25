import { createElement, useMemo, type ElementType, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export type FadeInProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  /** Any intrinsic tag ('div', 'p', 'h2', 'span', 'section' ...). */
  as?: ElementType;
};

const motionTagCache = new Map<ElementType, ElementType>();

/** Builds (and caches) a motion component for the requested element type. */
function resolveMotionTag(tag: ElementType): ElementType {
  const cached = motionTagCache.get(tag);
  if (cached) return cached;
  const created = motion.create(tag as never) as unknown as ElementType;
  motionTagCache.set(tag, created);
  return created;
}

/**
 * whileInView reveal wrapper used across every section.
 */
export default function FadeIn({
  children,
  className,
  id,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
}: FadeInProps) {
  const Tag = useMemo(() => resolveMotionTag(as), [as]);

  return createElement(
    Tag,
    {
      id,
      className,
      initial: { opacity: 0, x, y },
      whileInView: { opacity: 1, x: 0, y: 0 },
      viewport: { once: true, margin: '50px', amount: 0 },
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
      style: { willChange: 'transform, opacity' },
    },
    children,
  );
}
