import React, { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type HeroSnowboardProps = {
  onReveal?: () => void;
  onFinish?: () => void;
  heroActive?: boolean;
};

function SnowboardModel() {
  const { scene } = useGLTF('/snowboardbrazuca.glb');
  const model = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDim) || maxDim < 1e-6) return;

    const scale = 12.5 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
  }, [model]);

  return <primitive object={model} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />;
}

function MovingSnowboard({ onReveal, onFinish }: HeroSnowboardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hasExitedRef = useRef(false);
  const hasTriggeredRevealRef = useRef(false);

  useFrame(() => {
    if (!groupRef.current || hasExitedRef.current) return;

    groupRef.current.position.x += 0.054;

    if (
      groupRef.current.position.x > 0 &&
      !hasTriggeredRevealRef.current
    ) {
      hasTriggeredRevealRef.current = true;
      onReveal?.();
    }

    if (groupRef.current.position.x > 9) {
      hasExitedRef.current = true;
      groupRef.current.position.x = 9.01;
      console.log('[HeroSnowboard] finished, disabling hero interaction');
      onFinish?.();
    }
  });

  return (
    <group ref={groupRef} position={[-9, -0.05, 0]}>
      <SnowboardModel />
    </group>
  );
}

function SceneContent({ onReveal, onFinish }: HeroSnowboardProps) {
  return (
    <>
      <Suspense fallback={null}>
        <MovingSnowboard onReveal={onReveal} onFinish={onFinish} />
      </Suspense>
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.22}
        scale={5}
        blur={2.5}
        far={4}
      />
    </>
  );
}

export function HeroSnowboard({
  onReveal,
  onFinish,
  heroActive = true,
}: HeroSnowboardProps) {
  const pointerStyle = { pointerEvents: heroActive ? ('auto' as const) : ('none' as const) };

  return (
    <section
      className="hero-snowboard"
      aria-label="Hero snowboard section"
      style={pointerStyle}
    >
      <div className="hero-canvas-layer" style={pointerStyle}>
        <Canvas
          className="hero-canvas"
          style={pointerStyle}
          shadows
          camera={{ position: [0, 0.3, 3], fov: 36, near: 0.1, far: 100 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          onCreated={({ camera }) => {
            camera.lookAt(0, 0, 0);
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 4]} intensity={1.2} />
          <directionalLight position={[-2, 1, 2]} intensity={0.3} />
          <SceneContent onReveal={onReveal} onFinish={onFinish} />
        </Canvas>
      </div>
    </section>
  );
}

useGLTF.preload('/snowboardbrazuca.glb');
