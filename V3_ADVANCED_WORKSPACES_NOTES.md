# SolveGrid V3: Advanced workspaces

This update improves existing public routes only. It does not change route slugs, sitemap generation, tool registry rules, metadata generation, JSON-LD, related-tool links, or category hubs.

## Statistics Calculator

Route: `/statistics-calculator`

Working data modes:

- Ungrouped / raw values
- Discrete value-frequency table
- Grouped class intervals with frequencies
- Paired X/Y values for regression

Selectable outputs:

- Count, sum, mean, median, mode, minimum, maximum, range
- Q1, Q3, IQR, configurable percentile
- Population or sample variance and standard deviation
- Coefficient of variation, skewness, and outlier count
- Correlation, covariance, regression equation, R², and optional prediction

Quick checks:

- Raw: `1, 2, 3, 4, 5` → mean `3`, median `3`, sample SD `1.58113883`
- Frequency: `1` frequency `2`, `2` frequency `3`, `3` frequency `5` → count `10`, mean `2.3`
- Grouped: `0–10:3`, `10–20:7`, `20–30:5` → grouped estimates appear with an explanation
- Paired: `(1,2), (2,4), (3,5), (4,8)` → positive slope and correlation

## Matrix Calculator

Route: `/matrix-calculator`

Working operations:

- Addition, subtraction, multiplication, scalar multiplication
- Transpose, determinant, trace, inverse
- REF, RREF, rank
- Cofactor matrix and adjugate up to 5×5
- 2×2 eigenvalues
- A·x=b systems from 2 to 10 variables
- Auto, Gaussian, Gauss-Jordan / RREF, inverse, and Cramer's rule methods

Quick checks:

- `[[1,2],[3,4]]` determinant → `-2`
- `[[1,2],[3,4]]` inverse → `[[-2,1],[1.5,-0.5]]`
- System A `[[2,1,-1],[-3,-1,2],[-2,1,2]]`, b `[8,-11,-3]` → `x=2, y=3, z=-1`
- Eigen 2×2 `[[4,1],[2,3]]` → eigenvalues `5` and `2`

## Equation Solver

Route: `/equation-solver`

Working workflows:

- Linear one-variable equations
- Quadratic equations including complex roots
- Cubic equations including real and complex roots
- Coefficient-table linear systems from 2 to 8 variables
- Gaussian elimination, Gauss-Jordan/RREF, matrix inverse, and Cramer's rule where valid
- Explicit link to Polynomial Solver for degree 4–10 roots

Quick checks:

- Linear: `2x + 8 = 0` → `x = -4`
- Quadratic: `x² - 5x + 6 = 0` → `x = 2, 3`
- Cubic: `x³ - 6x² + 11x - 6 = 0` → `1, 2, 3`
- 3-variable system example → `x=2, y=3, z=-1`

## SEO implementation rule

Feature names are shown visibly to users as "Key functions" on enhanced tool pages and are also represented in each page's title, description, keyword metadata, FAQs, use cases, schema-backed page content, internal links, and sitemap-connected route. Do not add phrases that are not backed by a working feature.

## Mobile QA

Test at 320px, 360px, 375px, 390px, 412px, tablet, and desktop.

- Tool input appears before long explanation.
- Tables and matrix grids scroll inside their cards.
- Buttons remain visible and usable.
- Inputs use at least 16px text on small screens where a browser would otherwise zoom.
- No whole-page horizontal overflow.
