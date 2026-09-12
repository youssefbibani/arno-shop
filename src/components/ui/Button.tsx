"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import clsx from "clsx";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  tone?: "rust" | "cream" | "ink";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

/**
 * Magnetic CTA: nudges toward the cursor within a small radius, springs
 * back on leave. Purposeful micro-motion — signals "primary action".
 */
export default function Button({
  href,
  children,
  variant = "solid",
  tone = "rust",
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.4);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 whitespace-nowrap";

  const styles = {
    solid:
      tone === "rust"
        ? "bg-rust text-cream hover:bg-rust-deep"
        : tone === "cream"
        ? "bg-cream text-ink hover:bg-white"
        : "bg-ink text-cream hover:bg-ink-soft",
    outline:
      tone === "cream"
        ? "border border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
        : "border border-ink/25 text-ink hover:border-ink hover:bg-ink/5",
    ghost:
      tone === "cream"
        ? "text-cream/85 hover:text-cream"
        : "text-ink/80 hover:text-ink",
  } as const;

  const content = (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={clsx(base, styles[variant], className)}
      onClick={onClick}
    >
      <span>{children}</span>
      {variant !== "ghost" && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path
            d="M3 11L11 3M11 3H4.5M11 3V9.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return <button type={type}>{content}</button>;
}
