# V5 Mobile Navigation, Workspace UX and Finance Expansion

## What changed

- Replaced the always-visible category strip with a single desktop **Tools** dropdown.
- Added a mobile hamburger drawer with Math, Engineering, Everyday, and Guides links.
- Kept all tools reachable through crawlable links in the drawer, footer, category hubs, and `/tools` directory.
- Reworked Percentage Calculator into a compact mode selector so the result panel is not pushed far below a list of options.
- On mobile, Graphing Calculator now shows the graph before the equation control panel, with an **Equations** shortcut.
- On mobile, Equation Solver and Statistics Calculator use compact native selectors instead of tall workflow-card stacks.
- Unit Converter switches to a single category select on phones rather than showing the entire category list.

## New calculator routes

- `/profit-loss-calculator`
- `/simple-interest-calculator`
- `/compound-interest-calculator`
- `/loan-calculator`
- `/discount-calculator`

All new tools are in `lib/tools.ts`, appear in category hubs and footer navigation, are included in the dynamic sitemap, receive metadata and JSON-LD, and have related-tool links.

## New SEO guide routes

- `/guides/percentage-increase-and-decrease`
- `/guides/profit-margin-vs-markup`
- `/guides/simple-interest-formula`
- `/guides/loan-payment-formula`
- `/guides/plot-multiple-equations`

Guides are intentionally separate from calculator workspaces so explanation content does not push primary inputs and results down on mobile.
