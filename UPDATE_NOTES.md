# SolveGrid Quality + SEO Update

## What this update fixes
- Unit Converter now starts at `0`, not `1000`.
- Unit Converter supports query-prefilled share links:
  `/unit-converter?value=1000&category=area&from=m2&to=km2`
- Percentage and Distance tools now start at zero values.
- Adult BMI fields start blank because zero is not a valid adult height or weight measurement.
- Graphing Calculator starts with one valid graph line only; empty added lines no longer create a red error immediately.
- Graphing Calculator now supports up to six plotted lines, `y =` input, implicit multiplication such as `2x + 1`, and vertical-line syntax such as `x = 3`.
- Mobile layout rules were strengthened for the Unit Converter and Graphing Calculator.
- New topic hubs: `/math-calculators`, `/engineering-calculators`, `/everyday-calculators`.
- Topic hubs are included in the sitemap and linked from header/footer.

## Install
1. Stop the local server with `Ctrl + C`.
2. Extract this ZIP.
3. Copy all extracted contents into:
   `C:\Users\Mecrovo\Calculator\solvegrid-web`
4. Replace existing files when asked.
5. Open CMD in the project folder and run:
   `npm install`
   `npm run dev`

## Test
- `/unit-converter`
- `/unit-converter?value=1000&category=area&from=m2&to=km2`
- `/graphing-calculator`
- `/math-calculators`
- `/engineering-calculators`
- `/everyday-calculators`
- `/sitemap.xml`
