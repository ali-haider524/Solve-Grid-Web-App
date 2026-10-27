# SolveGrid SEO Query Mapper — Phase 4

This phase adds page-specific Search Console evidence before implementation.

It does not edit the website.

## Install

Extract into the SolveGrid project root.

Files added:

```text
scripts/seo/run-query-mapper.mjs
scripts/seo/lib/query-mapper.mjs
scripts/seo/test-query-mapper.mjs
SEO_QUERY_MAPPER_PHASE4_SETUP.md
```

Add these package.json scripts:

```json
"seo:map": "node scripts/seo/run-query-mapper.mjs",
"seo:map:test": "node scripts/seo/test-query-mapper.mjs"
```

## Test

```powershell
npm run seo:map:test
```

Expected:

```text
SEO Query Mapper Phase 4 tests passed.
```

## First run

```powershell
npm run seo:map
```

The first run is useful even with no page-specific query exports. It will show exactly which exports are missing and which low-risk audit changes are already safe.

## Page-specific Search Console export format

For each target page:

1. Search Console → Performance → Search results.
2. Date → Compare → Last 28 days vs previous 28 days.
3. Add Page filter for the exact URL.
4. Open Queries.
5. Export CSV.
6. Put `Queries.csv` into the folder shown by `seo-output/change-gate.md`.

Examples:

```text
seo-input/page-queries/graphing-calculator/Queries.csv
seo-input/page-queries/guides__plot-multiple-equations/Queries.csv
seo-input/page-queries/matrix-calculator/Queries.csv
seo-input/page-queries/guides__matrix-inverse-and-determinant/Queries.csv
seo-input/page-queries/guides__gaussian-elimination-for-linear-systems/Queries.csv
```

Then run:

```powershell
npm run seo:map
```

Outputs:

```text
seo-output/change-gate.md
seo-output/change-gate.json
```

Only pages marked `READY_FOR_IMPLEMENTATION_REVIEW` or `READY_LOW_RISK_ONLY` should move to the implementation agent.
