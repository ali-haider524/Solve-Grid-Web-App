# SolveGrid V8 refined experience update

## What changed

- Rebuilt the shared header into a compact, opaque sticky header that never sits transparently over calculator content.
- Desktop navigation now uses one **Tools** dropdown plus Guides and About; category links remain inside the tool menu instead of using permanent rows.
- Mobile navigation uses one hamburger drawer with every calculator category, guides, and support links.
- Refined the Scientific Calculator into a smaller device-like workspace with a shorter display, compact near-square keys, calmer navy surface, and clearer hierarchy.
- Added scientific input functions: `fact`, `ncr`, `npr`, `gcd`, `lcm`, `nthroot`, `sinh`, `cosh`, `tanh`, `floor`, `ceil`, `round`, and `sign`.
- Reduced mobile hero spacing and card padding across Graphing, Equation, Statistics, Matrix, Percentage, Unit, Distance, and finance calculators.
- Statistics result-selection options are collapsed by default on mobile so the main data/result workflow stays visible.
- Matrix operation choices scroll inside the matrix card on phones rather than pushing the result area far down the page.
- Graph canvas appears before its equation editor on mobile, while the editor remains available directly below it.

## Search and internal-link improvements

- Added an internal guide registry shared by the Guides hub, tool pages, and sitemap.
- Added four practical guides: Gaussian elimination, matrix inverse and determinant, standard deviation, and engineering notation.
- Related tool sections display relevant guides for the active calculator.
- Added visible scientific-calculator features matching its actual supported functions.

## Current scope

This remains an advanced browser-based calculation platform. Dedicated future workspaces are still needed for symbolic proof, circuit simulation, optimization, numerical differential equations, statistical hypothesis testing, and domain-specific research workflows. They should be added as separate tools with their own routes and SEO contracts.
