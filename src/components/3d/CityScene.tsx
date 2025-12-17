"use client";

import type { RepoTreeNode } from "@/lib/github";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { District } from "./District";

type CitySceneProps = {
  root: RepoTreeNode;
  onFileClick?: (path: string) => void;
};

function SceneContent({ root, onFileClick }: CitySceneProps) {
  return (
    <>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.4} />

      <directionalLight
        position={[8, 15, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <fog attach="fog" args={["#020617", 10, 80]} />

      <mesh
        receiveShadow
        rotation-x={-Math.PI / 2}
        position={[0, -0.01, 0]}
      >
        <planeGeometry args={[120, 120]} />
        <MeshReflectorMaterial
          blur={[400, 80]}
          resolution={1024}
          mixBlur={1}
          mixStrength={7}
          roughness={0.4}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#020617"
          metalness={0.8}
          mirror={0.9}
        />
      </mesh>

      <District node={root} origin={[0, 0, 0]} onFileClick={onFileClick} />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.7}
          radius={0.9}
        />
      </EffectComposer>
    </>
  );
}

export function CityScene({ root, onFileClick }: CitySceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [18, 18, 18], fov: 50, near: 0.1, far: 200 }}
      style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
    >
      <SceneContent root={root} onFileClick={onFileClick} />
    </Canvas>
  );
}


