"use client";

import { useState } from "react";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import TunisiaSVG from "./TunisiaSVG";
import LocationPanel from "./LocationPanel";
import EventTypeLegend from "./EventTypeLegend";
import { LOCATIONS, EventCategory } from "./locations";

export default function TunisiaMap() {
  const [selectedId, setSelectedId] = useState(LOCATIONS[0].id);
  const [filter, setFilter] = useState<EventCategory | null>(null);

  const selected = LOCATIONS.find((l) => l.id === selectedId) ?? LOCATIONS[0];

  function isMuted(id: string) {
    if (!filter) return false;
    const loc = LOCATIONS.find((l) => l.id === id);
    return !loc?.categories.includes(filter);
  }

  function toggleFilter(id: EventCategory) {
    setFilter((f) => (f === id ? null : id));
  }

  return (
    <section id="locations" className="relative bg-ink py-28 text-cream md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <Eyebrow className="text-cream/50">03 — Where ARNO Can Go</Eyebrow>
          <h2 className="mt-5 font-display text-[10vw] font-medium leading-[1.02] tracking-tight sm:text-[56px] md:text-[64px]">
            Wherever the event is.
            <br />
            ARNO can <span className="italic text-rust-bright">be there</span>.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/60">
            From sports events to private experiences, ARNO moves with the
            community.
          </p>
        </Reveal>

        {/* Desktop */}
        <div className="mt-16 hidden gap-10 md:grid md:grid-cols-[1.3fr_1fr]">
          <Reveal className="aspect-[2/3] max-h-[720px] rounded-[28px] border border-cream/10 bg-cream/[0.02] p-6">
            <TunisiaSVG
              locations={LOCATIONS}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isMuted={isMuted}
            />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center">
            <LocationPanel location={selected} />
            <p className="mt-4 px-1 text-[12px] leading-relaxed text-cream/35">
              Example coverage shown for illustration — confirmed active
              locations may vary.
            </p>
          </Reveal>
        </div>

        {/* Mobile */}
        <div className="mt-12 flex flex-col gap-6 md:hidden">
          <div className="aspect-[3/4] w-full rounded-[24px] border border-cream/10 bg-cream/[0.02] p-4">
            <TunisiaSVG
              locations={LOCATIONS}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isMuted={isMuted}
            />
          </div>

          <LocationPanel location={selected} />

          <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6">
            {LOCATIONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={clsx(
                  "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                  selectedId === l.id
                    ? "border-rust bg-rust text-cream"
                    : "border-cream/20 text-cream/65"
                )}
              >
                {l.name}
              </button>
            ))}
          </div>
          <p className="px-1 text-[12px] leading-relaxed text-cream/35">
            Example coverage shown for illustration — confirmed active
            locations may vary.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <Reveal>
            <EventTypeLegend active={filter} onToggle={toggleFilter} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
