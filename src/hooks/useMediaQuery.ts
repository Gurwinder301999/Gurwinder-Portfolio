import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook. Returns `false` on the server / first render so
 * markup stays deterministic, then syncs to the real value after mount.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const list = window.matchMedia(query);
    const sync = () => setMatches(list.matches);

    sync();
    list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

/**
 * True on devices whose primary input is a finger rather than a mouse.
 *
 * Decorative 3D (perspective / preserve-3d / translateZ) is disabled for these
 * devices: inside a preserve-3d subtree, mobile browsers frequently mis-hit-test
 * descendants, which silently swallows taps on buttons and links.
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}