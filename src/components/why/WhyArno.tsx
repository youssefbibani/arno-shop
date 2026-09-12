"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import StatementBlock from "./StatementBlock";
import { NARRATIVE_STEPS } from "./narrative-data";
import { ScrollTrigger } from "@/lib/gsap";

const STEP_VH = 55;

export default function WhyArno() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = wrapper?.querySelector<HTMLElement>("[data-pin-inner]");
    if (!wrapper || !inner) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin: inner,
      scrub: 0.4,
      onUpdate: (self) => {
        const idx = Math.min(
          NARRATIVE_STEPS.length - 1,
          Math.floor(self.progress * NARRATIVE_STEPS.length)
        );
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="why" className="relative bg-ink text-cream">
      <div className="mx-auto max-w-[1440px] px-6 pt-24 md:px-10 md:pt-32">
        <Reveal>
          <Eyebrow className="text-cream/50">02 — Why ARNO</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.02] tracking-tight">
            More than coffee.
            <br />A place people <span className="italic text-rust-bright">gather</span> around.
          </h2>
        </Reveal>
      </div>

      {/* Short pin, word + image swap together, synced to scroll — same
          interaction at every breakpoint, stacked on mobile and side by
          side from md up. */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `${NARRATIVE_STEPS.length * STEP_VH}vh` }}
      >
        <div data-pin-inner className="flex h-screen w-full items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-6 md:grid-cols-[45%_1fr] md:gap-14 md:px-10">
            {/* Photo */}
            <div className="relative aspect-[1894/1600] w-full overflow-hidden rounded-2xl bg-ink-soft">
              {NARRATIVE_STEPS.map((s, i) => (
                <div
                  key={s.word}
                  className={clsx(
                    "absolute inset-0 transition-all duration-500 ease-out",
                    active === i
                      ? "scale-100 opacity-100"
                      : "scale-[1.03] opacity-0"
                  )}
                >
                  <Image
                    src={s.image}
                    alt={s.word}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
              <div className="absolute bottom-5 left-5 font-display text-xs italic text-cream/70">
                0{active + 1} / 0{NARRATIVE_STEPS.length}
              </div>
            </div>

            {/* Word — only the active one is on screen, replacing the last */}
            <div className="relative h-[190px] md:h-[240px]">
              {NARRATIVE_STEPS.map((s, i) => (
                <div
                  key={s.word}
                  className={clsx(
                    "absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-out",
                    active === i
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  )}
                >
                  <span className="font-impact text-[clamp(2.5rem,10vw,5.5rem)] uppercase leading-[0.9] tracking-tight text-cream md:text-[clamp(2.5rem,7vw,5.5rem)]">
                    {s.word}
                  </span>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-cream/65 md:mt-4">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StatementBlock />
    </section>
  );
}
