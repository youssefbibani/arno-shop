"use client";

import clsx from "clsx";
import Button from "@/components/ui/Button";
import { ArnoLocation, EVENT_CATEGORIES } from "./locations";

export default function LocationPanel({
  location,
}: {
  location: ArnoLocation;
}) {
  return (
    <div
      key={location.id}
      className="animate-[fadeIn_0.4s_ease-out] rounded-2xl border border-cream/12 bg-cream/[0.04] p-7 md:p-8"
    >
      <span className="eyebrow text-cream/40">{location.region}</span>
      <h3 className="mt-2 font-display text-4xl font-medium tracking-tight text-cream md:text-[44px]">
        {location.name}
      </h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-cream/60">
        {location.blurb}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {EVENT_CATEGORIES.filter((c) => location.categories.includes(c.id)).map(
          (c) => (
            <span
              key={c.id}
              className={clsx(
                "rounded-full border border-cream/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-cream/70"
              )}
            >
              {c.label} Events
            </span>
          )
        )}
      </div>

      <div className="mt-7">
        <Button href="#packs" tone="rust" className="!px-6 !py-3 !text-[12px]">
          Bring ARNO Here
        </Button>
      </div>
    </div>
  );
}
