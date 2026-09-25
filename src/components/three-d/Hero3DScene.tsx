import Cube3D from './Cube3D';
import GridFloor from './GridFloor';
import OrbitRings from './OrbitRings';
import ParticleField from './ParticleField';

export type Hero3DSceneProps = {
  className?: string;
};

/**
 * The animated 3D backdrop of the header: perspective grid floor, orbit rings,
 * rotating wireframe cubes, drifting particles and volumetric light blobs.
 * Everything here is pure CSS 3D (transform-style: preserve-3d) so it stays
 * cheap and dependency free.
 */
export default function Hero3DScene({ className = '' }: Hero3DSceneProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* volumetric light blobs */}
      <div className="glow-pulse absolute -left-24 top-[6%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(118,33,176,0.45),transparent_65%)] blur-2xl" />
      <div
        className="glow-pulse absolute -right-20 top-[2%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(182,0,168,0.32),transparent_65%)] blur-2xl"
        style={{ animationDelay: '1.6s' }}
      />
      <div
        className="glow-pulse absolute bottom-[8%] left-1/3 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(190,76,0,0.28),transparent_65%)] blur-2xl"
        style={{ animationDelay: '3.1s' }}
      />

      {/* perspective grid floor + dot matrix ceiling */}
      <GridFloor intensity={0.45} />
      <div className="dot-matrix absolute inset-x-0 top-0 h-56 opacity-[0.18] [mask-image:linear-gradient(to_bottom,#000,transparent)]" />

      {/* 3D gyroscope rings behind the portrait */}
      <OrbitRings className="hidden opacity-80 sm:block" size={680} />

      {/* rotating wireframe cubes on depth layers — on phones the copy fills the
          whole column, so the cubes are pushed onto the portrait / header bands */}
      <div className="preserve-3d absolute left-[8%] top-[46%] float-soft sm:top-[26%]" style={{ animationDelay: '0.4s' }}>
        <Cube3D size={72} duration={20} />
      </div>
      <div className="preserve-3d absolute right-[10%] top-[53%] float-soft" style={{ animationDelay: '1.4s' }}>
        <Cube3D size={54} duration={26} />
      </div>
      <div className="preserve-3d absolute left-[46%] top-[5%] float-soft sm:top-[12%]" style={{ animationDelay: '2.2s' }}>
        <Cube3D size={40} duration={32} />
      </div>

      <ParticleField count={28} />

      {/* vignette so the copy always stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,12,12,0.75)_100%)]" />
    </div>
  );
}
