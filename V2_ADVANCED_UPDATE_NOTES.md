# SolveGrid V2 Advanced Core Upgrade

This update is based on the uploaded `solvegrid-web-v2-source` project. It preserves the existing 10 public tool routes, registry-driven sitemap, shared navigation, metadata, schema, related-tool links, category hubs, and footer links.

## Advanced tool upgrades

### Graphing Calculator
- Supports up to 8 equation lines.
- Users can add blank expressions, add templates, hide/show lines, choose line colours, use `y =`, `y2 =`, `f(x) =`, implicit multiplication such as `2x`, and vertical lines such as `x = 3`.
- Includes graph, table, trace, zoom, window settings, approximate x-intercepts, and approximate intersections.

### Matrix & Vector Calculator
- Supports 2×2 through 8×8 matrix workspaces.
- Includes determinant, inverse, transpose, RREF, rank, matrix multiplication, and `A · x = b` solving.
- Supports rectangular matrices for transpose, RREF, rank, and multiplication.
- Cells accept decimals and simple fractions such as `1/2`.
- Wide matrices scroll horizontally on mobile instead of breaking the layout.

### Unit Converter
- Uses one registry-driven conversion catalog with 17 categories:
  length, area, volume, mass, temperature, time, speed, acceleration, angle, digital storage, force, pressure, energy, power, torque, frequency, and density.
- Starts from 0 and supports URL-prefilled conversions and share links.

### Percentage Calculator
- Adds 10 workflows: percent-of, find percentage, change, increase, decrease, reverse increase, reverse decrease, markup, margin, and compound growth.
- Supports URL-prefilled values and share links.

### Statistics Calculator
- Supports raw data, value:frequency data, and simple linear regression from paired X/Y data.
- Adds quartiles, IQR, coefficient of variation, frequency tables, and regression statistics.

### BMI Calculator
- Keeps the existing adult-only scope.
- Adds an optional age field that blocks adult BMI classification for entered ages below 20.
- It does not estimate child/teen BMI-for-age percentiles.

## Platform safeguards

`npm run check` now confirms:
1. Every public calculator route exists in `lib/tools.ts`.
2. Every registry entry has a matching page route.
3. Every tool page imports its metadata, JSON-LD schema, and related-tool links.
4. ESLint, TypeScript, and the production build pass.

## Manual test values

- Graphing: `y = x^2 - 4`, `y2 = 2x + 1`, `x = 3`, `sqrt(x)`, `1/x`
- Matrix inverse: A = `[[2,1,0],[1,3,1],[0,1,2]]`
- Matrix multiplication: A = `[[1,2,3],[4,5,6]]`, B = `[[7,8],[9,10],[11,12]]`
- Units: 1000 metres to kilometres; 1 atmosphere to kPa; 1 kWh to joules.
- Percentage: Original 80, increase 25%; Cost 100, selling price 125; Starting 1000, rate 5%, periods 3.
- Statistics raw: `2, 4, 4, 4, 5, 5, 7, 9`
- Statistics frequency: `1:2, 2:3, 3:5, 4:2`
- Regression X: `1,2,3,4`, Y: `2,4,5,8`
