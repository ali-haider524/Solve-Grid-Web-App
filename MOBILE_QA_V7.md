# SolveGrid V7 Mobile QA

Test every public tool at these viewport widths:

- 320px
- 360px
- 375px
- 390px
- 412px
- 768px
- desktop

## Must pass
- Header does not cover tool content.
- Only the logo and hamburger show on mobile.
- Tool drawer opens and closes with button, backdrop, and Escape.
- Main calculator, graph, or result card stays within the first two screen heights.
- No page-level horizontal scroll.
- Matrix and frequency tables scroll only within their own card.
- Form controls remain readable and do not trigger unwanted browser zoom.
- Graphing Calculator shows graph before equation controls on mobile.
- Use “Equations” in graph toolbar to jump to the edit panel.
- Footer links remain reachable without expanding page width.

## Manual spot tests
- Scientific: `ncr(8,2)`, `fact(5)`, `sinh(0)`.
- Graphing: add `y = 2x + 1`, `x = 3`, switch table, trace.
- Matrix: 4×4 determinant, RREF, multiplication, solve system.
- Statistics: ungrouped, frequency, grouped, and regression modes.
- Unit converter: switch category and swap units.
