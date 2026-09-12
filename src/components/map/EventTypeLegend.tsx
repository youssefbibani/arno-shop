"use client";

import clsx from "clsx";
import { EVENT_CATEGORIES, EventCategory } from "./locations";

export default function EventTypeLegend({
  active,
  onToggle,
}: {
  active: EventCategory | null;
  onToggle: (id: EventCategory) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-cream/10 md:grid-cols-4">
      {EVENT_CATEGORIES.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={clsx(
              "group flex flex-col items-start gap-2.5 px-5 py-5 text-left transition-colors duration-300",
              isActive ? "bg-rust" : "bg-ink hover:bg-cream/[0.06]"
            )}
          >
            <span
              className={clsx(
                "eyebrow",
                isActive ? "text-cream/80" : "text-cream/35"
              )}
            >
              {c.label}
            </span>
            <ul className="space-y-0.5">
              {c.examples.map((ex) => (
                <li
                  key={ex}
                  className={clsx(
                    "text-[12.5px] leading-snug transition-colors duration-300",
                    isActive ? "text-cream" : "text-cream/55"
                  )}
                >
                  {ex}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
