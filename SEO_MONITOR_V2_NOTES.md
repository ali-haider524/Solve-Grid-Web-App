# SolveGrid SEO Monitor V2

Replace these files in the existing project:

- `scripts/seo/run-monitor-csv.mjs`
- `scripts/seo/run-monitor.mjs`
- `scripts/seo/lib/analyzer.mjs`
- `scripts/seo/lib/csv.mjs`
- `scripts/seo/lib/report.mjs`
- `scripts/seo/test-analyzer.mjs`
- `scripts/seo/test-csv-import.mjs`

No calculator/page/component files are included or changed.

## What V2 adds

- Quick wins for positions 8–30, even at low early-site impression volume.
- Emerging opportunities for positions 31–60.
- Recovery candidates for pages that had strong prior visibility but retained some current visibility.
- Topic-authority signals based on current page impressions.
- Pages to protect when visibility is gaining.
- Historical/tested pages that fell to zero impressions, without recommending deletion.
- Priority-page scoring boost using the existing `priorityPages` config.
- A ranked "What to do this week" section.
- Automatic detection of 7-day/28-day comparison labels from standard Search Console comparison CSV headers.
- A short-window warning so 7-day drops are treated as alerts, not rewrite triggers.
- Stronger ranking guardrails in the report and AI brief.

## Backward compatibility

The new analyzer uses fallbacks for the new thresholds, so the existing `seo.config.json` can continue to work unchanged.

Optional future config keys if you want to tune behavior later:

```json
{
  "thresholds": {
    "quickWinMinimumImpressions": 1,
    "emergingMinimumImpressions": 2,
    "topicSignalMinimumImpressions": 10,
    "recoveryBaselineImpressions": 20,
    "recoveryLossPercent": 70,
    "deadTestBaselineImpressions": 10
  }
}
```

## Test after replacing

```powershell
node scripts/seo/test-analyzer.mjs
node scripts/seo/test-csv-import.mjs
npm run seo:monitor:csv
```

Then inspect:

- `seo-output/latest-report.md`
- `seo-output/ai-change-brief.md`
- `seo-output/latest-data.json`

## Data collection

`npm run seo:monitor:csv` remains a manual-data mode: the agent analyzes automatically after the Search Console CSV files are placed in `seo-input`.

The existing API runner (`run-monitor.mjs`) is the path to fully automatic collection. Once Google API authorization is configured, it can collect Search Console data directly and can also add GA4, URL Inspection, and PageSpeed data according to the existing environment/config switches.

Until API authorization is enabled, CSV mode is deliberately kept read-only and safe.
