export type OrbitRingsProps = {
  className?: string;
  /** Diameter of the largest ring, in px. */
  size?: number;
};

/**
 * Three concentric 3D gyroscope rings that rotate on different axes around the
 * hero portrait, each carrying a small satellite dot.
 */
export default function OrbitRings({ className = '', size = 620 }: OrbitRingsProps) {
  const rings = [
    { key: 'a', scale: 1, cls: 'ring-a', duration: '20s', border: 'border-[#B600A8]/45' },
    { key: 'b', scale: 0.78, cls: 'ring-b', duration: '26s', border: 'border-[#D7E2EA]/30' },
    { key: 'c', scale: 0.56, cls: 'ring-c', duration: '32s', border: 'border-[#BE4C00]/40' },
  ];

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ width: size, height: size, perspective: '900px' }}
      aria-hidden
    >
      <div className="preserve-3d relative h-full w-full">
        {rings.map((ring) => {
          const ringSize = size * ring.scale;
          return (
            <div
              key={ring.key}
              className={`preserve-3d absolute left-1/2 top-1/2 rounded-full border ${ring.cls} ${ring.border}`}
              style={{
                width: ringSize,
                height: ringSize,
                marginLeft: -ringSize / 2,
                marginTop: -ringSize / 2,
                animationDuration: ring.duration,
                boxShadow: '0 0 45px rgba(118,33,176,0.22) inset',
              }}
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D7E2EA] shadow-[0_0_16px_6px_rgba(215,226,234,0.45)]" />
              <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#B600A8] shadow-[0_0_14px_5px_rgba(182,0,168,0.5)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
