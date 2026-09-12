import clsx from "clsx";
import Button from "@/components/ui/Button";
import { Pack, PackIcon } from "./packs-data";

function MetaIcon({ icon, className }: { icon: PackIcon; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 20 20",
    fill: "none" as const,
  };
  switch (icon) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 6v4.2l3 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="7.6" cy="7.2" r="2.7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.6 16c.7-2.7 2.6-4.1 5-4.1s4.3 1.4 5 4.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M13.1 5.1c1.3.2 2.3 1.2 2.3 2.8 0 1.5-1 2.5-2.2 2.8M16 15.5c-.5-2-1.6-3.3-3.3-3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "cup":
      return (
        <svg {...common}>
          <path d="M4.5 4h9.4l-1 9.5A2 2 0 0 1 10.9 15h-3a2 2 0 0 1-2-1.5L4.5 4Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3.3 4h11.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M13.9 6h1.3a2 2 0 0 1 0 4h-1.6" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path
            d="M10 3.2c.4 2.6 1 4.2 1.9 5.1.9.9 2.5 1.5 5.1 1.9-2.6.4-4.2 1-5.1 1.9-.9.9-1.5 2.5-1.9 5.1-.4-2.6-1-4.2-1.9-5.1-.9-.9-2.5-1.5-5.1-1.9 2.6-.4 4.2-1 5.1-1.9.9-.9 1.5-2.5 1.9-5.1Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M5.5 2.8h6l3 3v10.4a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M11.5 2.8v3h3M7.2 10.4h5.2M7.2 13h5.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function PackCard({ pack }: { pack: Pack }) {
  const featured = pack.featured;

  return (
    <div
      className={clsx(
        "group relative flex h-full flex-col rounded-[28px] border p-8 transition-all duration-400 md:p-9",
        featured
          ? "border-ink bg-ink text-cream shadow-[0_30px_60px_-25px_rgba(11,10,8,0.45)] md:-my-4 md:pb-12 md:pt-11"
          : "border-ink/10 bg-white/70 text-ink hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-30px_rgba(11,10,8,0.25)]"
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rust px-3.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-cream shadow-sm">
          Le plus choisi
        </span>
      )}

      {/* Header */}
      <div>
        <span
          className={clsx(
            "font-display text-xs",
            featured ? "text-cream/45" : "text-ink/35"
          )}
        >
          {pack.index}
        </span>
        <h3 className="mt-2 font-display text-[28px] font-medium leading-tight tracking-tight md:text-[32px]">
          {pack.name}
        </h3>
        <p
          className={clsx(
            "mt-1.5 text-[14.5px] font-medium",
            featured ? "text-rust-bright" : "text-rust"
          )}
        >
          {pack.tagline}
        </p>
        <p
          className={clsx(
            "mt-4 text-[14.5px] leading-relaxed",
            featured ? "text-cream/65" : "text-ink/60"
          )}
        >
          {pack.description}
        </p>
      </div>

      {/* Meta stats */}
      <div
        className={clsx(
          "mt-7 flex divide-x rounded-2xl border py-4",
          featured ? "divide-cream/15 border-cream/15" : "divide-ink/10 border-ink/10"
        )}
      >
        {pack.meta.map((m) => (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5 px-2 text-center">
            <MetaIcon icon={m.icon} className={clsx("h-4 w-4", featured ? "text-rust-bright" : "text-rust")} />
            <span className="text-[13.5px] font-semibold leading-none">{m.value}</span>
            <span
              className={clsx(
                "text-[10.5px] uppercase tracking-wide",
                featured ? "text-cream/40" : "text-ink/40"
              )}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-7 flex-1">
        {pack.featuresIntro && (
          <p className={clsx("mb-3 text-[13px] font-medium", featured ? "text-cream/55" : "text-ink/45")}>
            {pack.featuresIntro}
          </p>
        )}
        <ul className="flex flex-col gap-2.5">
          {pack.features.map((item) => (
            <li
              key={item}
              className={clsx(
                "flex items-start gap-2.5 text-[13.5px] leading-snug",
                featured ? "text-cream/80" : "text-ink/70"
              )}
            >
              <span
                className={clsx(
                  "mt-[7px] h-1 w-1 shrink-0 rounded-full",
                  featured ? "bg-rust-bright" : "bg-rust"
                )}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className={clsx("mt-8 border-t pt-6", featured ? "border-cream/15" : "border-ink/10")}>
        <p className={clsx("text-[12.5px] leading-relaxed", featured ? "text-cream/45" : "text-ink/45")}>
          {pack.useCase}
        </p>
        <Button
          href="#final-cta"
          variant={featured ? "solid" : "outline"}
          tone={featured ? "cream" : "ink"}
          className="mt-5 w-full !px-6"
        >
          {pack.cta}
        </Button>
      </div>
    </div>
  );
}
