import { useMemo } from 'react';

export type ParticleFieldProps = {
  count?: number;
  className?: string;
};

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  depth: number;
  hue: string;
};

/**
 * Floating depth particles. Each particle drifts upwards with a slight Z
 * translation, giving the hero a parallax "field of depth" feel.
 */
export default function ParticleField({ count = 26, className = '' }: ParticleFieldProps) {
  const particles = useMemo<Particle[]>(() => {
    let seed = 9137;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const palette = ['#D7E2EA', '#B600A8', '#7621B0', '#BBCCD7'];

    return Array.from({ length: count }, (_, id) => ({
      id,
      left: random() * 100,
      top: random() * 100,
      size: 2 + random() * 5,
      delay: random() * 8,
      duration: 9 + random() * 10,
      depth: 40 + random() * 160,
      hue: palette[Math.floor(random() * palette.length)],
    }));
  }, [count]);

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            background: particle.hue,
            boxShadow: `0 0 ${particle.size * 4}px ${particle.size}px ${particle.hue}33`,
            animation: `drift ${particle.duration}s linear ${particle.delay}s infinite`,
            transform: `translateZ(${particle.depth}px)`,
          }}
        />
      ))}
    </div>
  );
}
