export type GridFloorProps = {
  className?: string;
  /** Opacity of the grid lines. */
  intensity?: number;
};

/**
 * Perspective grid "floor" that scrolls towards the viewer — the classic
 * 3D-DCC / synthwave depth cue, built from a single animated gradient.
 */
export default function GridFloor({ className = '', intensity = 0.5 }: GridFloorProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[46vh] overflow-hidden ${className}`}
      style={{ perspective: '520px', perspectiveOrigin: '50% 0%' }}
    >
      <div
        className="grid-floor absolute inset-x-[-40%] bottom-[-30%] top-0 origin-top"
        style={{
          transform: 'rotateX(74deg)',
          opacity: intensity,
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent" />
    </div>
  );
}
