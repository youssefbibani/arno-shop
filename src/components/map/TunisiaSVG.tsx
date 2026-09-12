"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { ArnoLocation } from "./locations";

const TUNISIA_PATH =
  "M170,50 C200,40 250,45 290,55 C330,65 350,90 370,95 " +
  "C400,85 415,70 440,80 C460,90 465,105 455,125 " +
  "C440,140 415,135 395,125 C375,145 355,155 345,165 " +
  "C360,180 385,195 400,220 C415,250 425,280 428,310 " +
  "C431,335 433,355 428,380 C420,410 405,440 395,470 " +
  "C385,495 375,505 385,525 C400,545 415,555 410,575 " +
  "C400,600 380,630 355,660 C330,690 305,715 285,740 " +
  "C265,765 250,785 240,805 C233,818 228,828 222,838 " +
  "L210,825 C200,805 195,780 192,750 " +
  "C188,710 183,670 178,630 C172,580 166,530 161,480 " +
  "C155,420 150,360 147,300 C144,240 143,180 148,130 " +
  "C152,100 160,72 170,50 Z";

export default function TunisiaSVG({
  locations,
  selectedId,
  onSelect,
  isMuted,
}: {
  locations: ArnoLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isMuted: (id: string) => boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markersRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const markers = markersRef.current;
    if (!svg || !path || !markers) return;

    if (reduced) {
      gsap.set(path, { strokeDashoffset: 0 });
      gsap.set(markers.children, { opacity: 1, scale: 1 });
      return;
    }

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(markers.children, { opacity: 0, scale: 0, transformOrigin: "center" });

    const st = ScrollTrigger.create({
      trigger: svg,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.9,
          ease: "power2.inOut",
        });
        gsap.to(markers.children, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(2.2)",
          stagger: 0.09,
          delay: 1.0,
        });
      },
    });

    return () => st.kill();
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 900"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Stylized map of Tunisia with example ARNO coverage cities"
    >
      <defs>
        <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a62424" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a62424" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d={TUNISIA_PATH}
        fill="rgba(243,238,226,0.03)"
        stroke="#f3eee2"
        strokeOpacity="0.5"
        strokeWidth="1.6"
        strokeLinejoin="round"
        ref={pathRef}
      />

      <g ref={markersRef}>
        {locations.map((loc) => {
          const active = selectedId === loc.id;
          const muted = isMuted(loc.id);
          return (
            <g
              key={loc.id}
              transform={`translate(${loc.x} ${loc.y})`}
              onClick={() => onSelect(loc.id)}
              onPointerEnter={() => onSelect(loc.id)}
              className="cursor-pointer"
            >
              <circle r="22" fill="transparent" />
              {active && (
                <circle r="16" fill="url(#pulseGrad)" className="animate-ping" />
              )}
              <circle
                r={active ? 6.5 : 4.5}
                className={clsx(
                  "transition-all duration-300",
                  muted ? "fill-cream/20" : active ? "fill-rust" : "fill-cream/70"
                )}
              />
              <circle
                r={active ? 11 : 8}
                fill="none"
                strokeWidth="1"
                className={clsx(
                  "transition-all duration-300",
                  muted ? "stroke-cream/10" : active ? "stroke-rust/70" : "stroke-cream/30"
                )}
              />
              <text
                x={loc.labelSide === "left" ? -14 : 14}
                y="4"
                textAnchor={loc.labelSide === "left" ? "end" : "start"}
                className={clsx(
                  "font-sans text-[13px] tracking-wide transition-all duration-300",
                  muted
                    ? "fill-cream/20"
                    : active
                    ? "fill-cream font-semibold"
                    : "fill-cream/55"
                )}
              >
                {loc.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
