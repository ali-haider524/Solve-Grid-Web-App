# SolveGrid V9 — Research Labs Foundation

## New live workspace

- `/research-tools` — Research & Simulation Labs hub
- `/differential-equation-solver` — Differential Equations Lab

The ODE lab is a browser-based numerical workspace, not a symbolic proof engine. It supports:

- First-order ODEs: `y' = f(x, y)`
- Two-state systems: `y' = f(x, y, z)` and `z' = g(x, y, z)`
- Euler method
- Improved Euler / Heun method
- Classical Runge–Kutta 4 (RK4)
- Initial values, final x, and signed step size
- Solution plot, phase plot for two-state systems, and a sampled data table
- A fixed 10,000-step safety cap

## Quick verification values

### Exponential growth

- Mode: First-order ODE
- Equation: `y`
- Initial values: `x0 = 0`, `y0 = 1`
- Final x: `1`
- Step: `0.1`
- Method: RK4
- Expected final y: approximately `2.71828`

### Harmonic system

- Mode: Two-state system
- `dy/dx = z`
- `dz/dx = -y`
- `x0 = 0`, `y0 = 1`, `z0 = 0`
- Final x: `1`
- Step: `0.1`
- Method: RK4
- Expected final values: `y ≈ 0.54030`, `z ≈ -0.84147`

## SEO connections

The new ODE lab is in the central registry, Research category hub, header dropdown, mobile drawer, footer, related-tool links, JSON-LD, and sitemap. Two context guides were added:

- `/guides/euler-method-for-differential-equations`
- `/guides/runge-kutta-rk4-method`

## Scope boundary

The ODE lab produces numerical approximations. It does not claim symbolic closed forms, formal proofs, validated engineering design, stiff-system solvers, or production-grade scientific computing validation.
