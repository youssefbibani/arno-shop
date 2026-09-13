"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import CupScene from "./CupScene";
import { heroProgress } from "@/lib/heroProgress";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";

export default function CupCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    heroProgress.dragging = true;
    lastX.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) {
      heroProgress.pointerNX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      heroProgress.pointerNY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    if (dragging.current) {
      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      heroProgress.dragRotY += deltaX * 0.0085;
      heroProgress.dragVelY = deltaX * 0.0085;
    }
  }

  function endDrag() {
    dragging.current = false;
    heroProgress.dragging = false;
  }

  function onPointerEnter() {
    heroProgress.hovering = true;
  }

  function onPointerLeave() {
    endDrag();
    heroProgress.hovering = false;
  }

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerUp={endDrag}
      onPointerLeave={onPointerLeave}
      onPointerCancel={endDrag}
      className="h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      <Canvas
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.35, 5.2], fov: 32 }}
        frameloop={inView ? "always" : "never"}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <CupScene mobile={mobile} reduced={reduced} />
          {!mobile && !reduced && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.35}
                luminanceThreshold={0.82}
                luminanceSmoothing={0.3}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.25} darkness={0.55} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
