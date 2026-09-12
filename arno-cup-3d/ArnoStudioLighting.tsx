'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/** The same locally generated reflection environment used by the 360° viewer. */
function createStudio() {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0.025, 0.024, 0.022);
  studio.add(new THREE.Mesh(
    new THREE.BoxGeometry(14, 12, 14),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.032, 0.030, 0.027),
      side: THREE.BackSide,
    }),
  ));
  const panel = (x: number, y: number, z: number, width: number, height: number, power: number, color: string) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }),
    );
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
  };
  panel(3, 4, 4, 1.8, 3.3, 13, '#fff7ed');
  panel(-4, 1, 3, 0.65, 4, 1.8, '#f4f6ff');
  panel(1, 5, -3, 2, 2, 4.8, '#ffffff');
  panel(-3, 1, -4, 0.9, 3, 0.75, '#ffffff');
  return studio;
}

export type ArnoStudioLightingProps = {
  /** Use 1 with the raw GLB; use height / 0.22095 with the normalized ArnoCup. */
  sceneScale?: number;
  shadows?: boolean;
};

/** Mount once inside your existing Canvas, replacing its environment and lights. */
export default function ArnoStudioLighting({ sceneScale = 16.3, shadows = true }: ArnoStudioLightingProps) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const studio = createStudio();
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(studio, 0.04);
    const previous = {
      environment: scene.environment,
      intensity: scene.environmentIntensity,
      toneMapping: gl.toneMapping,
      exposure: gl.toneMappingExposure,
    };
    scene.environment = target.texture;
    scene.environmentIntensity = 0.42;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.20;
    pmrem.dispose();
    studio.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => material.dispose());
      }
    });
    return () => {
      if (scene.environment === target.texture) {
        scene.environment = previous.environment;
        scene.environmentIntensity = previous.intensity;
        gl.toneMapping = previous.toneMapping;
        gl.toneMappingExposure = previous.exposure;
      }
      target.dispose();
    };
  }, [gl, scene]);

  return (
    <>
      <hemisphereLight args={['#ffe8c8', '#b08866', 0.34]} />
      <directionalLight
        color="#fff8ee" intensity={5.8}
        position={[0.60 * sceneScale, 0.55 * sceneScale, 0.20 * sceneScale]}
        castShadow={shadows}
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-0.3 * sceneScale} shadow-camera-right={0.3 * sceneScale}
        shadow-camera-top={0.3 * sceneScale} shadow-camera-bottom={-0.3 * sceneScale}
        shadow-camera-near={0.05 * sceneScale} shadow-camera-far={1.5 * sceneScale}
        shadow-normalBias={0.0003 * sceneScale} shadow-bias={-0.00002}
        shadow-radius={2}
      />
      <directionalLight color="#f4f6ff" intensity={0.035} position={[-0.5 * sceneScale, 0.1 * sceneScale, 0.4 * sceneScale]} />
    </>
  );
}
