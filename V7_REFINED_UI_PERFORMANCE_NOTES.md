# SolveGrid V7 — Refined UI, Performance, and Scientific Functions

## What changed
- Replaced the crowded top navigation with one **Tools** directory menu and one **Guides** link on desktop.
- Mobile navigation now uses a dedicated hamburger drawer; category tabs no longer occupy calculator space.
- The mobile header is normal-flow rather than sticky, preventing a calculator or graph from appearing behind it.
- Scientific Calculator S1 is slimmer: compact display, lower visual weight, concise tools menu, and fewer unrelated workspace links.
- Graphing Calculator uses deferred equation compilation, a capped canvas pixel ratio, lower sampling limits, and animation-frame redraw scheduling.
- Graphing Calculator keeps the graph panel before equation controls on narrow screens.
- Calculator cards use a compact shared spacing scale so results stay closer to controls.

## Scientific Calculator additions
Open **TOOLS → FUNC** to insert:
- `ncr(n, r)` for combinations
- `npr(n, r)` for permutations
- `fact(n)` for factorials
- `gcd(a, b)` and `lcm(a, b)`
- `sinh(x)`, `cosh(x)`, `tanh(x)`
- `floor(x)`, `ceil(x)`, `round(x)`, and `sign(x)`

Examples:
- `ncr(8, 2)` → `28`
- `npr(8, 2)` → `56`
- `fact(5)` → `120`
- `gcd(48, 18)` → `6`
- `lcm(12, 18)` → `36`
- `sinh(0)` → `0`

## Safety and scope
SolveGrid now has broad advanced workflows across scientific calculation, graphing, equations, matrices, statistics, units, finance, and everyday calculations. It is not a replacement for specialist CAD, symbolic proof, numerical simulation, or domain-validated engineering software. Important academic, clinical, legal, research, or safety-critical work should be verified independently.

## Required verification
Run:

```cmd
npm install
npm run check
npm run dev
```

Then test:
- `/scientific-calculator`
- `/graphing-calculator`
- `/matrix-calculator`
- `/statistics-calculator`
- `/unit-converter`
- `/percentage-calculator`

