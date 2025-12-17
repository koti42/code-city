"use client";

import { useState, useMemo } from "react";
import type { RepoTreeNode } from "@/lib/github";
import { getColorForExtension } from "@/lib/github";
import { Edges, Html } from "@react-three/drei";
import * as THREE from "three";

type BuildingProps = {
  node: RepoTreeNode;
  position: [number, number, number];
  onClick?: (path: string) => void;
};

function computeHeight(size: number | null): number {
  if (!size || size <= 0) {
    return 0.4;
  }

  const base = 0.4;
  const scale = 0.15;
  const height = base + Math.log10(size + 10) * scale;

  return Math.min(Math.max(height, 0.4), 4);
}

function lightenHex(color: string, amount: number): string {
  const c = new THREE.Color(color);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  hsl.l = Math.min(1, hsl.l + amount);
  const out = new THREE.Color();
  out.setHSL(hsl.h, hsl.s, hsl.l);
  return `#${out.getHexString()}`;
}

export function Building({ node, position, onClick }: BuildingProps) {
  const [hovered, setHovered] = useState(false);

  const height = useMemo(() => computeHeight(node.size), [node.size]);

  const baseColor = useMemo(
    () => getColorForExtension(node.extension),
    [node.extension],
  );

  const color = useMemo(
    () => (hovered ? lightenHex(baseColor, 0.15) : baseColor),
    [baseColor, hovered],
  );

  const y = height / 2;

  return (
    <group position={[position[0], y, position[2]]}>
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick(node.path);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.12}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          transmission={0.25}
          ior={1.4}
          thickness={0.6}
          reflectivity={0.85}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 1.2 : 0.45}
        />
        <Edges
          threshold={5}
          color={color}
        />
      </mesh>

      {hovered && (
        <Html distanceFactor={10} position={[0, height / 2 + 0.3, 0]}>
          <div className="rounded-md bg-black/80 px-2 py-1 text-xs text-white shadow-lg backdrop-blur">
            {node.name}
          </div>
        </Html>
      )}
    </group>
  );
}


