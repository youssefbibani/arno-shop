import { Anton, Caveat } from "next/font/google";

/**
 * Used for the hand-lettered "Arno" wordmark baked into the 3D cup's
 * label texture. Self-hosted by next/font (no runtime CDN fetch) —
 * loaded here and applied to <html> in the root layout so the browser
 * registers it early enough for canvas text to pick it up.
 */
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

/**
 * Heavy condensed display face used for the big all-caps section words
 * (e.g. "Why ARNO" index). Anton only ships one weight (400), which is
 * already black/condensed by design.
 */
export const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});
