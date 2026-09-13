"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import PackCard from "./PackCard";
import { PACKS } from "./packs-data";

export default function Packs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  const updateFocus = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    let closest = 0;
    let minDist = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      // Distance from this card's own snap point, not from the viewport's
      // geometric center — the layout snaps cards to the left edge (with a
      // peek of the next one), so "centered" isn't the right frame of
      // reference. This way the actual snapped card always lands at 1/1.
      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
      const drift = Math.min(dist / (card.offsetWidth + 16), 1);
      card.style.transform = `scale(${1 - drift * 0.08})`;
      card.style.opacity = `${1 - drift * 0.5}`;
    });

    setActive(closest);
  }, []);

  function handleScroll() {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      updateFocus();
      rafRef.current = null;
    });
  }

  function goTo(i: number) {
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  useEffect(() => {
    updateFocus();
  }, [updateFocus]);

  return (
    <section id="packs" className="relative bg-cream py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">04 — Formules ARNO</Eyebrow>
          <h2 className="mt-5 font-display text-[10vw] font-medium leading-[1.02] tracking-tight text-ink sm:text-[56px] md:text-[64px]">
            Choisissez votre expérience <span className="italic text-rust">ARNO</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
            D&apos;une réception intime à une activation de marque, on adapte
            ARNO à votre événement.
          </p>
        </Reveal>

        {/* Mobile: native swipe carousel (no scroll-hijack) — the centered
            card eases into focus, off-center ones recede, and the dots
            double as tap targets. */}
        <Reveal className="mt-16 md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="no-scrollbar relative -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 pt-4"
          >
            {PACKS.map((pack, i) => (
              <div
                key={pack.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="w-[86vw] shrink-0 snap-start"
              >
                <PackCard pack={pack} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {PACKS.map((pack, i) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Voir la formule ${pack.name}`}
                className="-m-2 p-2"
              >
                <span
                  className={clsx(
                    "block h-1.5 rounded-full transition-all duration-300",
                    active === i ? "w-6 bg-rust" : "w-1.5 bg-ink/20"
                  )}
                />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Desktop: full row, all three visible at once */}
        <div className="mx-auto mt-16 hidden max-w-[1180px] gap-6 md:mt-24 md:grid md:grid-cols-3 md:items-center md:gap-6">
          {PACKS.map((pack, i) => (
            <Reveal key={pack.id} delay={0.06 * i} className="h-full">
              <PackCard pack={pack} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
