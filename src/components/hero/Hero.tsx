"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import CupPoster from "./CupPoster";
import { gsap } from "@/lib/gsap";
import { heroProgress } from "@/lib/heroProgress";
import { useReducedMotion } from "@/lib/hooks";

const CupCanvas = dynamic(() => import("./CupCanvas"), {
  ssr: false,
  loading: () => <CupPoster />,
});

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const introCopyRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            heroProgress.value = self.progress;
          },
        },
      });

      tl.to(heroCopyRef.current, { autoAlpha: 0, y: -56, duration: 0.36, ease: "power1.in" }, 0)
        .to(cueRef.current, { autoAlpha: 0, duration: 0.15 }, 0)
        .fromTo(
          introCopyRef.current,
          { autoAlpha: 0, y: 46 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.52
        )
        .fromTo(
          glowRef.current,
          { opacity: 0.35, scale: 0.9 },
          { opacity: 1, scale: 1.15, duration: 1, ease: "none" },
          0
        );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative bg-ink"
      style={{ height: reduced ? "100vh" : "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base + animated backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#2f2013_0%,#1a1410_55%,#1a1410_100%)]" />
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-[38%] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust/16 blur-[120px]"
        />

        {/* 3D cup */}
        <div className="absolute inset-0">
          <CupCanvas />
        </div>

        {/* Hero copy — pointer-events-none so the 3D cup underneath stays
            hoverable/draggable; individual children opt back in (buttons). */}
        <div ref={heroCopyRef} className="pointer-events-none absolute inset-0 z-10">
          <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+2.5rem)] z-10 px-6 md:top-[calc(var(--nav-h)+3.5rem)] md:px-10">
            <div className="mx-auto max-w-[1440px]">
              <Eyebrow className="text-cream/60">ARNO Coffee</Eyebrow>
              <h1 className="mt-5 max-w-2xl font-display text-[15vw] font-medium leading-[0.94] tracking-tight text-cream sm:text-[80px] md:text-[92px] lg:text-[104px]">
                Coffee moves.
                <br />
                <span className="italic text-rust-bright">So do we.</span>
              </h1>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 px-6 md:bottom-28 md:px-10">
            <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <p className="max-w-xs text-[15px] leading-relaxed text-cream/65 [text-shadow:0_2px_12px_rgba(0,0,0,0.85)] md:max-w-sm">
                A mobile specialty coffee experience built for events,
                communities and brands.
              </p>
              <div className="pointer-events-auto flex flex-wrap items-center gap-4">
                <Button href="#packs" tone="rust">
                  Bring ARNO to Your Event
                </Button>
                <Button href="#why" variant="outline" tone="cream">
                  Explore the Experience
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 02 intro — revealed as the cup drifts aside */}
        <div
          ref={introCopyRef}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 opacity-0 md:px-10"
        >
          <div className="mx-auto max-w-[1440px]">
            <Eyebrow className="text-cream/60">02 — Why ARNO</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-[9vw] font-medium leading-[1.02] tracking-tight text-cream sm:text-[52px] md:text-[58px]">
              More than coffee.
              <br />A place people <span className="italic text-rust-bright">gather</span> around.
            </h2>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-cream/45"
        >
          <span className="eyebrow text-[10px]">Scroll</span>
          <span className="h-9 w-px animate-pulse bg-cream/40" />
        </div>
      </div>
    </section>
  );
}
