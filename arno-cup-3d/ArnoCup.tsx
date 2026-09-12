'use client';

import { forwardRef, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export type ArnoCupProps = ThreeElements['group'] & {
  /** Place arno-cup.glb in public/models. */
  url?: string;
  /** Overall height including the straw, in your existing scene units. */
  height?: number;
  /** Optional existing Rig rotation delta; parent owns scroll and drag. */
  spinDelta?: MutableRefObject<number>;
  /** Set false when motion should be reduced. */
  motion?: boolean;
};

/** Insert inside your existing <group ref={spin}>. Does not create a Canvas. */
export const ArnoCup = forwardRef<THREE.Group, ArnoCupProps>(function ArnoCup(
  { url = '/models/arno-cup.glb', height = 3.6, spinDelta, motion = true, ...props },
  ref,
) {
  const { scene } = useGLTF(url);
  const elapsed = useRef(0);
  const response = useRef(0);
  const model = useMemo(() => {
    // Clone transforms so independently mounted cups never move each other.
    // Shared geometries/materials remain owned by useGLTF's resource cache.
    const object = scene.clone(true);
    object.traverse((node) => {
      if (node instanceof THREE.Mesh) node.castShadow = node.name === 'Latte_Contents';
    });
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const offset = box.getCenter(new THREE.Vector3()).multiplyScalar(-1);
    const iceRoot = object.getObjectByName('Ice');
    const ice = (iceRoot?.children ?? []).map((node, i) => ({
      node,
      y: node.position.y,
      x: node.rotation.x,
      z: node.rotation.z,
      phase: i * 1.618,
    }));
    return { object, offset, normalizer: 1 / Math.max(size.y, 0.000001), ice };
  }, [scene]);

  useFrame((_state, frameDelta) => {
    if (!motion) return;
    const dt = Math.min(frameDelta, 0.05);
    elapsed.current += dt;
    response.current *= Math.exp(-7 * dt);
    const rotationDelta = spinDelta?.current ?? 0;
    response.current = THREE.MathUtils.clamp(
      response.current + THREE.MathUtils.clamp(rotationDelta, -0.2, 0.2) * 0.22,
      -0.10,
      0.10,
    );
    for (const ice of model.ice) {
      ice.node.position.y = ice.y + Math.sin(elapsed.current * 0.65 + ice.phase) * 0.006;
      ice.node.rotation.x = ice.x + Math.sin(elapsed.current * 0.48 + ice.phase) * 0.012;
      ice.node.rotation.z = ice.z + response.current;
    }
  });

  return (
    <group ref={ref} {...props}>
      <group scale={height * model.normalizer}>
        <primitive object={model.object} position={model.offset} dispose={null} />
      </group>
    </group>
  );
});

export default ArnoCup;
