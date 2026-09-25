import type { CSSProperties } from 'react';

export type Cube3DProps = {
  /** Edge length in px. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Duration of one full rotation. */
  duration?: number;
};

const FACE_BASE =
  'absolute inset-0 border border-[#D7E2EA]/25 bg-[radial-gradient(circle_at_30%_20%,rgba(182,0,168,0.22),rgba(12,12,12,0.55))] shadow-[inset_0_0_40px_rgba(118,33,176,0.35)]';

/**
 * Pure CSS 3D wireframe cube (6 faces translated on the Z axis).
 */
export default function Cube3D({ size = 96, className = '', style, duration = 18 }: Cube3DProps) {
  const half = size / 2;

  const faces: { key: string; transform: string }[] = [
    { key: 'front', transform: `translateZ(${half}px)` },
    { key: 'back', transform: `rotateY(180deg) translateZ(${half}px)` },
    { key: 'right', transform: `rotateY(90deg) translateZ(${half}px)` },
    { key: 'left', transform: `rotateY(-90deg) translateZ(${half}px)` },
    { key: 'top', transform: `rotateX(90deg) translateZ(${half}px)` },
    { key: 'bottom', transform: `rotateX(-90deg) translateZ(${half}px)` },
  ];

  return (
    <div className={`pointer-events-none ${className}`} style={{ perspective: '800px', ...style }}>
      <div
        className="preserve-3d cube-spin relative"
        style={{ width: size, height: size, animationDuration: `${duration}s` }}
      >
        {faces.map((face) => (
          <span key={face.key} className={FACE_BASE} style={{ transform: face.transform }} />
        ))}
      </div>
    </div>
  );
}
