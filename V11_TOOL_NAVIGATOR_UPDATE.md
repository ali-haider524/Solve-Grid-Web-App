# SolveGrid V11 Tool Navigator Update

## What changed

This update changes only the shared `ToolHeader` navigation layer. It does not change calculator logic, public route names, `lib/tools.ts`, sitemap generation, metadata, JSON-LD, legal pages, or existing SEO content.

- Desktop `Tools` is now a compact navigator with category tabs and direct calculator links.
- Each direct link includes a short capability description so visitors can understand the tool before leaving the current page.
- Categories remain limited to one view at a time, so the menu does not become a giant overlay.
- Mobile uses a hamburger drawer with expandable category sections and direct tool links.
- All links use Next.js `Link`, so the header remains an internal crawlable-link pathway in addition to the sitemap, hub pages, footer, guides, and related-tool cards.

## QA completed

- `npm run verify:tools` passed: 21 tools and 21 public tool routes are connected.
- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- Local development smoke checks returned HTTP 200 for `/`, `/tools`, `/research-tools`, `/graphing-calculator`, `/differential-equation-solver`, `/sitemap.xml`, and `/robots.txt`.

## After copying this update

```cmd
cd C:\Users\Mecrovo\Calculator\solvegrid-web
npm install
npm run check
npm run dev
```

## Manual checks

1. Desktop (>= 841px): click `Tools`, switch each category, and open a direct tool link.
2. Mobile (320px to 412px): open the hamburger menu, expand one category, and verify that tool links remain readable.
3. Use Escape to close the desktop tool menu and mobile navigation drawer.
4. Confirm no calculator workspace is covered by the sticky header.
