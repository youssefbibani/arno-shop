# ARNO Coffee

Marketing site for ARNO — a mobile specialty coffee experience for events, communities and brands in Tunisia.

Built with [Next.js](https://nextjs.org) (App Router), [Tailwind CSS](https://tailwindcss.com), [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering/) for scroll-driven animation, and [react-three-fiber](https://r3f.docs.pmnd.rs/) for the interactive 3D cup in the hero section.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run start` — serve the production build locally
- `npm run lint` — ESLint

## Structure

- `src/app` — root layout and the single page route
- `src/components` — one folder per section (`hero`, `why`, `map`, `packs`, `cta`, `layout`), plus shared `ui` primitives
- `src/lib` — shared utilities (GSAP setup, fonts, hooks, the hero scroll-progress store)
- `public/models` — the 3D cup asset (`.glb`)

## Deployment

Deployed on [Vercel](https://vercel.com) — pushes to `main` deploy automatically. Next's built-in Image Optimization API requires a Node-capable host (Vercel works out of the box); a static export would need additional configuration.
