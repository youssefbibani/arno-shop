"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type ArnoCupProps = ThreeElements["group"] & {
  /** public/models/arno-cup.glb by default. */
  url?: string;
  /** Overall height including the straw, in scene units. */
  height?: number;
  /** Rig rotation delta; the parent rig still owns scroll and drag. */
  spinDelta?: React.RefObject<number>;
  /** Set false to freeze the ice's idle drift (prefers-reduced-motion). */
  motion?: boolean;
};

/** Modeled replacement for the old procedural CupAssembly. Insert inside
 * the existing <group ref={spin}> — it doesn't create a Canvas of its own. */
export const ArnoCup = forwardRef<THREE.Group, ArnoCupProps>(function ArnoCup(
  { url = "/models/arno-cup.glb", height = 3.6, spinDelta, motion = true, ...props },
  ref
) {
  const { scene } = useGLTF(url);
  const elapsed = useRef(0);
  const response = useRef(0);
  const model = useMemo(() => {
    // Clone transforms so independently mounted cups never move each other.
    // Shared geometries/materials remain owned by useGLTF's resource cache.
    const object = scene.clone(true);
    object.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = node.name === "Latte_Contents";
      // The dome ships alpha-blended (transparent:true, opacity ~0.4,
      // transmission:0) "so nested parts remain visible in conventional
      // viewers" (see arno-cup-3d/README.md) — against this scene's
      // transparent canvas that reads as flat grey plastic instead of
      // glass. Cup_Shell and the ice already use real transmission and
      // look right, so switch the dome to the same recipe.
      if (node.name === "Dome" && node.material instanceof THREE.MeshPhysicalMaterial) {
        const m = node.material;
        m.map = null;
        m.color = new THREE.Color(0xffffff);
        m.metalness = 0;
        m.transparent = false;
        m.opacity = 1;
        m.transmission = 0.95;
        m.roughness = 0.12;
        m.thickness = 0.06;
        m.ior = 1.45;
        m.clearcoat = 1;
        m.clearcoatRoughness = 0.08;
      }
    });
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const offset = box.getCenter(new THREE.Vector3()).multiplyScalar(-1);
    const iceRoot = object.getObjectByName("Ice");
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
      -0.1,
      0.1
    );
    for (const cube of model.ice) {
      cube.node.position.y = cube.y + Math.sin(elapsed.current * 0.65 + cube.phase) * 0.006;
      cube.node.rotation.x = cube.x + Math.sin(elapsed.current * 0.48 + cube.phase) * 0.012;
      cube.node.rotation.z = cube.z + response.current;
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

useGLTF.preload("/models/arno-cup.glb");
