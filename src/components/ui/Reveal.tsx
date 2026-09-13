"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  duration?: number;
  start?: string;
  once?: boolean;
};

/**
 * Secondary-motion reveal: fades + rises (or slides, via `x`) a block into
 * place as it enters the viewport. Used for typography, images and section
 * intros — not for the primary hero/map/pack moments which get bespoke
 * timelines.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 28,
  duration = 1,
  start = "top 88%",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, x, y });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
        }),
      onEnterBack: once
        ? undefined
        : () =>
            gsap.to(el, {
              opacity: 1,
              x: 0,
              y: 0,
              duration,
              ease: "power3.out",
            }),
      onLeaveBack: once
        ? undefined
        : () => gsap.to(el, { opacity: 0, x, y, duration: 0.5 }),
    });

    return () => st.kill();
  }, [delay, x, y, duration, start, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
