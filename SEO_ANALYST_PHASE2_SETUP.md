# SolveGrid SEO Analyst — Phase 2 Setup

This phase is intentionally **advisory only**. It reads the monitor output and produces a conservative weekly SEO action queue. It does not edit Next.js pages, run Git, push to GitHub, or deploy.

## 1. Copy these files into the SolveGrid project

```text
scripts/seo/run-analyst.mjs
scripts/seo/lib/analyst.mjs
scripts/seo/test-analyst.mjs
```

## 2. Add one npm script

In `package.json`, inside `scripts`, add:

```json
"seo:analyst": "node scripts/seo/run-analyst.mjs",
"seo:analyst:test": "node scripts/seo/test-analyst.mjs"
```

Do not remove your existing SEO monitor scripts.

## 3. Test Phase 2

```powershell
npm run seo:analyst:test
```

Expected:

```text
SEO Analyst Phase 2 tests passed.
```

## 4. Run Monitor V2 first

```powershell
npm run seo:monitor:csv
```

This must create:

```text
seo-output/latest-data.json
```

## 5. Run the analyst

```powershell
npm run seo:analyst
```

It creates:

```text
seo-output/analyst-plan.md
seo-output/analyst-plan.json
seo-output/analyst-queue.json
```

## Important ranking safeguards

- A query with only 1–2 impressions is never treated as proof.
- Unmapped queries are held at `QUERY_MAPPING`; no page should be edited until the target is confirmed.
- Pages gaining visibility are protected.
- At most two clusters are recommended per week.
- URL, canonical, title, and H1 changes are blocked by policy unless stronger evidence is reviewed separately.
- The future implementation agent should work through a branch/PR, run `npm run check`, and require human approval.

## Optional environment settings

Change the number of weekly focus clusters (default 2):

```powershell
$env:SEO_MAX_WEEKLY_CLUSTERS="2"
npm run seo:analyst
```

Use a different monitor data file:

```powershell
$env:SEO_ANALYST_INPUT="seo-output/latest-data.json"
npm run seo:analyst
```
