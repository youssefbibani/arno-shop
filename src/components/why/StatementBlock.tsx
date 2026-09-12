"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

const LINES = [
  "People don't remember\nwhere they bought a coffee.",
  "They remember\nwhere they had a moment.",
  "ARNO creates that place.",
];

const SECTION_VH = 180;

export default function StatementBlock() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(lineRefs.current[0], { autoAlpha: 1 });
      gsap.set(lineRefs.current.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          pin: wrapper.querySelector("[data-pin-inner]") as HTMLElement,
        },
      });

      tl.to(lineRefs.current[0], { autoAlpha: 0, y: -24, duration: 0.28 }, 0.16)
        .fromTo(
          lineRefs.current[1],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.24 },
          0.24
        )
        .to(lineRefs.current[1], { autoAlpha: 0, y: -24, duration: 0.24 }, 0.56)
        .fromTo(
          lineRefs.current[2],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.3 },
          0.66
        );
    }, wrapper);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-32 text-center">
        {LINES.map((l) => (
          <p
            key={l}
            className="whitespace-pre-line font-display text-[8vw] font-medium leading-[1.08] tracking-tight text-cream md:text-[42px]"
          >
            {l}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div
        data-pin-inner
        className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust/10 blur-[110px]" />
        {LINES.map((l, i) => (
          <div
            key={l}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="absolute inset-x-0 px-6 text-center"
          >
            <p
              className={
                "whitespace-pre-line font-display font-medium leading-[1.08] tracking-tight text-cream " +
                (i === 2
                  ? "text-[9vw] italic text-rust-bright md:text-[64px]"
                  : "text-[7vw] md:text-[50px]")
              }
            >
              {l}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
