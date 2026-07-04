# SolveGrid V4 Design System & Mobile UX Update

## What changed

- A single shared, sticky `ToolHeader` now appears on the home page, every calculator, every category hub, the tools directory, and the 404 page.
- The header uses one navigation model: All tools, Math, Engineering, and Everyday.
- Phone navigation remains reachable as a horizontally scrollable row instead of being hidden.
- Scientific Calculator and Polynomial Solver now use the shared site header; their calculator logic remains unchanged.
- The home page, tool directory, category hubs, footer, and below-tool SEO sections now use a smaller, more consistent card and spacing system.
- Tool workspaces remain the first focus. SEO content stays below the working UI so mobile users do not need to scroll through long explanatory blocks before calculating.
- Mobile styling has been tightened for graphing, matrix, statistics, equations, units, percentage, distance, and BMI pages. Matrix and table content stays horizontally scrollable inside its own card.

## What was not changed

- No public tool routes were renamed.
- The tool registry, sitemap, metadata helpers, JSON-LD, related-tool links, and calculation logic were preserved.
- No calculator formulas or advanced workspace functions were removed.

## Validation run

`npm run check` passed after this update:

- Registry route verification
- ESLint
- TypeScript
- Static production build

## Visual QA required locally

Use browser responsive mode at 320px, 360px, 375px, 390px, 412px, 768px, 1024px, and desktop. See `DESIGN_SYSTEM_MOBILE_QA.md` for the exact checks.
