"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";
import ArnoCup from "./ArnoCup";
import ArnoStudioLighting from "./ArnoStudioLighting";

const BASE_SCALE = 0.56;
const MOBILE_SCALE_FACTOR = 0.72;
const CUP_HEIGHT = 3.6;

function Rig({ mobile, motion }: { mobile: boolean; motion: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const spinDelta = useRef(0);
  const lastSpinY = useRef(0);
  const parallax = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const o = outer.current;
    const s = spin.current;
    if (!o || !s) return;

    const p = heroProgress.value;

    // Scroll-linked composition change: cup drifts, scales down, gains a slow turn.
    const baseX = mobile ? 0 : 0.55;
    const sideOffset = mobile ? 0.0 : 0.75;
    const baseY = mobile ? -0.5 : -0.15;
    o.position.x = THREE.MathUtils.lerp(o.position.x, baseX + p * sideOffset, 0.12);
    o.position.y = THREE.MathUtils.lerp(o.position.y, baseY + p * -0.2, 0.12);
    const restScale = BASE_SCALE * (mobile ? MOBILE_SCALE_FACTOR : 1);
    const targetScale = THREE.MathUtils.lerp(
      restScale,
      restScale * (mobile ? 0.86 : 0.72),
      p
    );
    o.scale.setScalar(THREE.MathUtils.lerp(o.scale.x, targetScale, 0.12));

    // Idle ambient spin + drag + inertia
    if (!heroProgress.dragging) {
      heroProgress.dragVelY *= 0.945;
      if (Math.abs(heroProgress.dragVelY) < 0.00005) {
        heroProgress.dragVelY = 0.0014;
      }
      heroProgress.dragRotY += heroProgress.dragVelY;
    }

    // Hover turns the cup toward the cursor (no click needed); once the
    // pointer leaves, this eases back to 0 and the idle auto-spin above
    // carries the rotation instead.
    const hovering = heroProgress.hovering && !heroProgress.dragging;
    parallax.current.x = THREE.MathUtils.lerp(
      parallax.current.x,
      hovering ? heroProgress.pointerNX * 1.1 : 0,
      hovering ? 0.08 : 0.05
    );
    parallax.current.y = THREE.MathUtils.lerp(
      parallax.current.y,
      hovering ? heroProgress.pointerNY * 0.08 : 0,
      0.06
    );

    const targetY = heroProgress.dragRotY + parallax.current.x + p * 2.4;
    s.rotation.y = THREE.MathUtils.lerp(s.rotation.y, targetY, heroProgress.dragging ? 0.35 : 0.09);
    s.rotation.x = THREE.MathUtils.lerp(
      s.rotation.x,
      -0.06 + parallax.current.y,
      0.06
    );

    spinDelta.current = s.rotation.y - lastSpinY.current;
    lastSpinY.current = s.rotation.y;
  });

  return (
    <group
      ref={outer}
      position={[mobile ? 0 : 0.55, mobile ? -0.5 : -0.15, 0]}
      scale={BASE_SCALE * (mobile ? MOBILE_SCALE_FACTOR : 1)}
    >
      <group ref={spin} position={[0, 0.65, 0]}>
        <ArnoCup spinDelta={spinDelta} height={CUP_HEIGHT} motion={motion} />
      </group>
    </group>
  );
}

export default function CupScene({
  mobile = false,
  reduced = false,
}: {
  mobile?: boolean;
  reduced?: boolean;
}) {
  return (
    <>
      {/* No ground mesh in this scene, so the studio's cast shadow has
          nothing to land on — skip the shadow map rather than pay for it. */}
      <ArnoStudioLighting sceneScale={CUP_HEIGHT / 0.22095} shadows={false} />
      <Rig mobile={mobile} motion={!reduced} />
    </>
  );
}
