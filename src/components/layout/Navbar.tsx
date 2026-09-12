"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import Button from "@/components/ui/Button";

const LINKS = [
  { label: "Why ARNO", href: "#why" },
  { label: "Locations", href: "#locations" },
  { label: "Packs", href: "#packs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  function go(href: string) {
    setOpen(false);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) lenis.scrollTo(href, { offset: -24, duration: 1.3 });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-ink/10 bg-cream/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-6 md:px-10">
          <Link
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="flex items-center gap-2.5"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-crimson/40">
              <Image
                src="/logo-mark.png"
                alt=""
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </span>
            <span
              className={clsx(
                "font-display text-[22px] font-semibold tracking-tight transition-colors duration-500",
                scrolled || open ? "text-ink" : "text-cream"
              )}
            >
              ARNO
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className={clsx(
                  "relative text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-500 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
                  scrolled ? "text-ink/75 hover:text-ink" : "text-cream/80 hover:text-cream"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              href="#packs"
              variant="solid"
              tone="rust"
              className="!px-5 !py-2.5 !text-[12px]"
            >
              Book ARNO
            </Button>
          </div>

          {/* Spacer to preserve nav layout — the real toggle button is
              rendered below, outside <header>, so it can sit above the
              full-screen mobile menu (a z-50 sibling of <header>, which
              would otherwise paint over anything z-indexed inside header's
              own stacking context, no matter how high). */}
          <div className="h-9 w-9 md:hidden" aria-hidden="true" />
        </nav>
      </header>

      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-6 top-6 z-[70] flex h-9 w-9 flex-col items-center justify-center gap-[6px] md:hidden"
      >
        <span
          className={clsx(
            "block h-px w-6 transition-all duration-300",
            open
              ? "translate-y-[3.5px] rotate-45 bg-cream"
              : scrolled
              ? "bg-ink"
              : "bg-cream"
          )}
        />
        <span
          className={clsx(
            "block h-px w-6 transition-all duration-300",
            open
              ? "-translate-y-[3.5px] -rotate-45 bg-cream"
              : scrolled
              ? "bg-ink"
              : "bg-cream"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-center bg-ink px-8"
          >
            <div className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  onClick={() => go(l.href)}
                  className="text-left font-display text-[13vw] leading-[1.05] text-cream/95 xs:text-[54px]"
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-10"
            >
              <Button href="#packs" tone="rust" onClick={() => setOpen(false)}>
                Book ARNO
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
