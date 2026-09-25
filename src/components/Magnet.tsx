import { useEffect, useRef, useState, type ReactNode } from 'react';

export type MagnetProps = {
  children: ReactNode;
  /** Extra distance (px) around the element that still triggers the magnet. */
  padding?: number;
  /** Higher value = subtler pull. */
  strength?: number;
  disabled?: boolean;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  wrapperClassName?: string;
};

/**
 * Mouse-following magnetic hover effect: the inner element is pulled towards
 * the cursor while it is inside the (padded) magnet area, then eases back.
 */
export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  disabled = false,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
  wrapperClassName = '',
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || disabled) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover = window.matchMedia('(hover: none)').matches;
    if (reduceMotion || noHover) return;

    const reset = () => {
      inner.style.transition = inactiveTransition;
      inner.style.transform = 'translate3d(0, 0, 0)';
      setIsActive(false);
    };

    const handleMove = (event: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = Math.abs(centerX - event.clientX);
      const distanceY = Math.abs(centerY - event.clientY);
      const isWithin = distanceX < rect.width / 2 + padding && distanceY < rect.height / 2 + padding;

      if (!isWithin) {
        reset();
        return;
      }

      const offsetX = (event.clientX - centerX) / strength;
      const offsetY = (event.clientY - centerY) / strength;

      inner.style.transition = activeTransition;
      inner.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      setIsActive(true);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    // `mouseleave` never fires on `window`; listen on the document instead so
    // the card snaps back when the pointer leaves the browser viewport.
    document.addEventListener('mouseleave', reset);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', reset);
    };
  }, [padding, strength, disabled, activeTransition, inactiveTransition]);

  return (
    <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
      <div
        ref={innerRef}
        className={`${className} ${isActive ? 'magnet-active' : ''}`}
        style={{ willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  );
}
