import React, { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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

    const scale = 10 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
  }, [model]);

  return <primitive object={model} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />;
}

function MovingSnowboard() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.position.x += 0.034;

    if (groupRef.current.position.x > 9) {
      groupRef.current.position.x = -7;
    }
  });

  return (
    <group ref={groupRef} position={[-9, -0.05, 0]}>
      <SnowboardModel />
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <Suspense fallback={null}>
        <MovingSnowboard />
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

export function HeroSnowboard() {
  return (
    <section className="hero-snowboard" aria-label="Hero snowboard section">
      <div className="hero-canvas-layer">
        <Canvas
          className="hero-canvas"
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
          <SceneContent />
        </Canvas>
      </div>
    </section>
  );
}

useGLTF.preload('/snowboardbrazuca.glb');
