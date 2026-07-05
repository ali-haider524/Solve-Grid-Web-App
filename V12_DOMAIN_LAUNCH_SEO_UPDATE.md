# SolveGrid V12 — Domain, Trust and Search Launch Hardening

## Scope

This update is deliberately conservative. It does not alter calculator algorithms, tool routes, tool registry entries, client-side workspaces, or the shared visual navigation system.

## What changed

- Production canonical fallback is now `https://solvegrid.online`.
- `.env.example` documents the real production domain and avoids publishing a fake support email.
- Added baseline response headers: `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive camera/microphone/geolocation policy.
- Expanded robots and sitemap support with the new Methodology page.
- Added `/methodology` explaining calculation methods, browser-based processing, assumptions, and feedback.
- Added two useful guide pages:
  - `/guides/ti-84-style-graphing-workflows`
  - `/guides/matrix-methods-for-linear-systems`
- All guide routes are now checked for metadata during launch verification.
- Added `npm run verify:launch` and updated `npm run check` / `npm run build` to run it.
- Added `GOOGLE_LAUNCH_RUNBOOK.md` and `SEO_CONTENT_PLAN_V12.md`.

## Local checks performed

- `npm run verify:tools` — passed
- `npm run verify:launch` — passed
- `npm run lint` — passed
- `npx tsc --noEmit` — passed
- Development smoke tests with `SITE_URL=https://solvegrid.online` returned `200` for the home page, tools hub, guides hub, Methodology page, new guides, sitemap, and robots.

## Build note

The sandbox production build compiled successfully and finished TypeScript, then encountered an environment `EPIPE` while Next.js was collecting static page data across 55 workers. This is a container/worker issue; run `npm run check` on your Windows project before publishing.
