# SolveGrid Design System & Mobile QA

This update keeps the existing calculator logic, routes, registry, sitemap, metadata, and structured data unchanged. It unifies the site header, footer, mobile spacing, tool cards, category hubs, and below-tool SEO sections.

## Required visual checks

Test each page at 320px, 360px, 375px, 390px, 412px, 768px, 1024px, and 1440px.

- Header navigation scrolls horizontally on small screens; it must not wrap into clipped text.
- Every primary action remains visible and at least 40px tall on touch screens.
- Matrix and data tables scroll inside their own cards, never across the full page.
- Graph canvas remains visible without horizontal page overflow.
- Calculator workspaces appear before explanatory SEO content.
- Footer links wrap inside their columns and do not cause horizontal scrolling.

## SEO design rule

A tool’s workspace is the primary content. Its FAQ, feature list, related tools, and category links stay below the workspace to support users and internal linking without obstructing calculation tasks.
