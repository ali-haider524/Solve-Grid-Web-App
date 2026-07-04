# SolveGrid stable platform update

## Included fixes
- Rebuilt the central `lib/tools.ts` registry so tool data, related tools, category hubs, sitemap entries, and metadata use one compatible source.
- Fixed stale components that referenced removed fields such as `useCase`, `href`, `navLabel`, and `seoDescription`.
- Added `npm run verify:tools` and made every production build run the route-and-registry check first.
- `npm run check` now runs registry verification, ESLint, and the Next.js production build.
- Added responsive global safeguards for narrow mobile screens and iOS input zoom.
- Added a PWA web manifest and a 404 page.

## New tool
- `/statistics-calculator`
  - mean, median, mode, range
  - population/sample variance and standard deviation
  - frequency table
  - sample data chips
  - connected metadata, sitemap, related tools, category hub, footer, and JSON-LD

## Graphing Calculator update
- Starts with two valid sample equations: `x^2 - 4` and `sin(x)`.
- Supports up to six equation lines.
- Adds valid example equations when the Add button is used.
- Accepts `y =`, `y2 =`, `f(x) =`, and `x =` vertical-line inputs.
- Supports implicit multiplication such as `2x` and `2sin(x)`.
- Includes Reset, more templates, table view, trace, and mobile layout rules.

## Verification completed
- `npm run check` succeeded.
- Live route status checks returned 200 for Home, Tools, Graphing, Statistics, Unit Converter with URL prefill, Sitemap, Robots, and Manifest.

## Install
1. Back up the current project.
2. Extract this package.
3. Copy all source files into `C:\Users\Mecrovo\Calculator\solvegrid-web`.
4. Choose Replace when Windows asks.
5. Run:
   `npm install`
   `npm run check`
   `npm run dev`
