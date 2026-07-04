# SolveGrid SEO growth plan

## Product promise
SolveGrid is a connected collection of free browser-based calculators for students, engineers, educators, and everyday users. Each public page must solve one distinct task well.

## Live SEO routes
- `/tools` — directory and internal-link hub
- `/math-calculators` — math collection hub
- `/engineering-calculators` — scientific and engineering collection hub
- `/everyday-calculators` — everyday collection hub
- `/scientific-calculator`
- `/graphing-calculator`
- `/equation-solver`
- `/polynomial-solver`
- `/matrix-calculator`
- `/statistics-calculator`
- `/unit-converter`
- `/percentage-calculator`
- `/distance-calculator`
- `/bmi-calculator` — adults only, a neutral screening tool and not a diagnosis

## Search-intent clusters
1. Graphing and algebra: graphing calculator, equation solver, quadratic solver, cubic solver, polynomial roots, matrix inverse.
2. Data and statistics: statistics calculator, mean median mode calculator, standard deviation calculator, variance calculator.
3. Scientific and engineering: scientific calculator online, trigonometry calculator, logarithm calculator, engineering unit converter.
4. Everyday calculation: unit converter, percentage calculator, distance between two points calculator, speed distance time calculator, adult BMI calculator.

## Page rules
Every tool page must have:
- A working calculator above the fold.
- One unique H1, title, description, and canonical URL.
- A visible explanation, use cases, FAQs, breadcrumbs, and related-tool links.
- Structured data matching visible page content.
- A registry entry in `lib/tools.ts`.
- A route at `app/<tool-slug>/page.tsx`.
- Mobile checks at 320px, 375px, 390px, 412px, 768px, and desktop widths.

## Future tools worth building
Build only after the existing tools are accurate and tested:
1. Probability Calculator: factorial, nCr, nPr, binomial probability.
2. Ohm's Law Calculator.
3. Voltage Divider Calculator.
4. Resistor Color Code Calculator.
5. RC Time Constant Calculator.
6. Loan and compound interest calculator only if the content is accurate, neutral, and locally compliant.

## Content and backlink approach
- Publish original short guides that use a real SolveGrid tool: graphing quadratics, calculating standard deviation, using Ohm's law, and matrix inverses.
- Offer an embeddable mini calculator only after the primary tools are stable.
- Reach out to education, tutoring, and STEM communities with original guides and genuinely useful tools.
- Do not buy bulk backlinks, copy content, or publish thin keyword-only pages.

## Query-prefill links
Only a deliberate SolveGrid URL can prefill a calculator. A general search engine result cannot know a visitor's private numeric value.

Example:
`/unit-converter?value=1000&category=area&from=m2&to=km2`

## Research-lab cluster
- `/research-tools` — research hub with direct routes to visible working labs.
- `/differential-equation-solver` — numerical initial-value problems and systems.
- `/symbolic-algebra` — simplification, differentiation, numerical evaluation, and comparison scope.
- `/optimization-lab` — continuous two-variable linear programming via feasible corner points.
- `/circuit-analysis` — ideal DC resistor and two-node nodal analysis.
- `/advanced-statistics` — t-tests, correlation/regression, and one-way ANOVA with assumptions.

### Research content rules
- Add guides only after the connected method is visible and testable in the workspace.
- Label numerical, idealized, and assumption-sensitive outputs clearly.
- Keep a research tool's main workspace above explanatory content on small screens.
- Do not claim formal proof, clinical interpretation, electrical certification, or simulation scope that the tool does not provide.
