/** Lightweight non-WebGL stand-in: Suspense fallback while the 3D bundle
 * loads, and the permanent visual for prefers-reduced-motion. */
export default function CupPoster({ animate = true }: { animate?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust/25 blur-[90px]"
          aria-hidden="true"
        />
        <svg
          width="220"
          height="300"
          viewBox="0 0 220 300"
          fill="none"
          className={animate ? "relative animate-[spin_18s_linear_infinite]" : "relative"}
          style={{ transformOrigin: "50% 55%" }}
        >
          <path
            d="M46 40h128l-14 210a20 20 0 0 1-20 18H80a20 20 0 0 1-20-18L46 40Z"
            stroke="#f3eee2"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <path
            d="M40 40h140"
            stroke="#f3eee2"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <path
            d="M118 40V8M118 8c0 10 24 10 24 22"
            stroke="#a62424"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
