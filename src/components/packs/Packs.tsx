"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import PackCard from "./PackCard";
import { PACKS } from "./packs-data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PIN_STEP_VH = 70;

type LenisLike = { scrollTo: (target: number, opts?: { immediate?: boolean }) => void };

export default function Packs() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const mm = gsap.matchMedia();

    // Mobile only — desktop keeps the plain 3-column row untouched.
    mm.add("(max-width: 767px)", () => {
      const inner = wrapper.querySelector<HTMLElement>("[data-pin-inner]");
      if (!inner) return;

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        pin: inner,
        scrub: 0.4,
        onUpdate: (self) => {
          // A plain scrollLeft, not a CSS transform, moves the cards —
          // a transformed ancestor causes some mobile browsers to fail to
          // repaint a nested overflow-y-auto card's content as it scrolls
          // into view, leaving later list items blank until something else
          // forces a repaint. scrollLeft doesn't trigger that bug.
          track.scrollLeft = self.progress * (track.scrollWidth - track.clientWidth);
          const idx = Math.min(
            PACKS.length - 1,
            Math.round(self.progress * (PACKS.length - 1))
          );
          setActive((prev) => (prev !== idx ? idx : prev));
        },
      });

      // Touch needs full manual arbitration here. Lenis's allowNestedScroll
      // (SmoothScroll.tsx) correctly hands scroll between a card and the
      // pin for wheel input, but a real touch gesture keeps its original
      // DOM target for its whole duration — once the starting card is
      // exhausted, the rest of that same swipe would otherwise fall straight
      // through to Lenis and race through the remaining cards in one motion
      // instead of giving each one its own turn. So every touchmove here is
      // captured, the *currently visible* card is looked up fresh each tick
      // (not the touch's original target), and scroll is routed by hand:
      // into that card while it has room, into the pin's own scroll
      // position (via Lenis, to stay in sync with it) once exhausted.
      let lastY = 0;

      function activeSlot() {
        const row = track!.firstElementChild;
        const cardWidth = track!.clientWidth || 1;
        const idx = Math.min(
          PACKS.length - 1,
          Math.max(0, Math.round(track!.scrollLeft / cardWidth))
        );
        return row?.children[idx] as HTMLElement | undefined;
      }

      function onTouchStart(e: TouchEvent) {
        lastY = e.touches[0].clientY;
      }

      function onTouchMove(e: TouchEvent) {
        const y = e.touches[0].clientY;
        const deltaY = lastY - y; // finger up -> positive -> reveal content below
        lastY = y;
        e.preventDefault();

        const slot = activeSlot();
        const maxScroll = slot ? slot.scrollHeight - slot.clientHeight : 0;
        const canConsume =
          !!slot &&
          ((deltaY > 0 && slot.scrollTop < maxScroll - 1) ||
            (deltaY < 0 && slot.scrollTop > 1));

        if (canConsume && slot) {
          slot.scrollTop += deltaY;
        } else {
          const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
          const target = window.scrollY + deltaY;
          if (lenis) lenis.scrollTo(target, { immediate: true });
          else window.scrollTo(0, target);
        }
      }

      inner.addEventListener("touchstart", onTouchStart, { passive: true });
      inner.addEventListener("touchmove", onTouchMove, { passive: false });

      return () => {
        st.kill();
        inner.removeEventListener("touchstart", onTouchStart);
        inner.removeEventListener("touchmove", onTouchMove);
      };
    });

    return () => mm.revert();
  }, []);

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
      </div>

      {/* Mobile: pinned, scroll drives the cards sliding horizontally —
          Corner, then Signature, then Brand Experience — same mechanic as
          the Why ARNO section's word swap. Each card is taller than one
          screen, so its slot scrolls internally first, handing control
          back to the pin once exhausted — see the touchmove handler above
          for touch, and SmoothScroll.tsx's allowNestedScroll for wheel. */}
      <div ref={wrapperRef} className="relative md:hidden" style={{ height: `${PACKS.length * PIN_STEP_VH}vh` }}>
        <div data-pin-inner className="flex h-screen w-full flex-col items-center justify-center px-6 pt-20">
          <div ref={trackRef} className="w-full max-w-[420px] overflow-hidden">
            <div className="flex">
              {PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="max-h-[64vh] w-full shrink-0 overflow-y-auto pt-4 [-webkit-overflow-scrolling:touch]"
                >
                  <PackCard pack={pack} fullHeight={false} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {PACKS.map((pack, i) => (
              <span
                key={pack.id}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  active === i ? "w-6 bg-rust" : "w-1.5 bg-ink/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
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
