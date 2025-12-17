"use client";

import type { RepoTreeNode } from "@/lib/github";
import { Building } from "./Building";

type DistrictProps = {
  node: RepoTreeNode;
  origin?: [number, number, number];
  spacing?: number;
  onFileClick?: (path: string) => void;
};

export function District({
  node,
  origin = [0, 0, 0],
  spacing = 2.0,
  onFileClick,
}: DistrictProps) {
  const children = node.children ?? [];

  const files = children.filter((child) => child.type === "blob");
  const folders = children.filter((child) => child.type === "tree");

  const items = [...folders, ...files];

  const count = items.length;

  if (count === 0) {
    return null;
  }

  const columns = Math.max(1, Math.ceil(Math.sqrt(count)));

  return (
    <group position={origin}>
      {items.map((child, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        const x = (col - (columns - 1) / 2) * spacing;
        const z = (row - Math.floor((count - 1) / columns) / 2) * spacing;

        if (child.type === "blob") {
          return (
            <Building
              key={child.path}
              node={child}
              position={[x, 0, z]}
              onClick={onFileClick}
            />
          );
        }

        return (
          <District
            key={child.path}
            node={child}
            origin={[x, 0, z]}
            spacing={spacing * 0.9}
            onFileClick={onFileClick}
          />
        );
      })}
    </group>
  );
}


