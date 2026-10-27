# SolveGrid SEO Monitor — No Google Cloud / CSV Mode

This mode uses Google Search Console's normal CSV export. It requires **no Google Cloud account, no billing profile, no API key, and no service-account JSON**.

It is read-only. It never changes a page, metadata, sitemap, Git branch, or deployment.

## Recommended export: 28 days vs previous 28 days

In Google Search Console:

1. Open `solvegrid.online`.
2. Go to **Performance → Search results**.
3. Set **Search type: Web**.
4. Remove unintended Query/Page/Country/Device filters.
5. Click **Date → Compare → Compare last 28 days to previous period**.
6. Leave the report on the overall property (not one page) for the first monitor run.
7. Click **EXPORT → CSV**.
8. Extract the downloaded export.

The extracted export should contain files such as:

- `Queries.csv`
- `Pages.csv`
- `Countries.csv`
- `Devices.csv`
- `Search appearance.csv`
- `Dates.csv`
- `Filters.csv`

Only `Queries.csv` and `Pages.csv` are required by Phase 1 CSV mode.

## Put the export into the project

Copy/extract the Search Console export under:

```text
solvegrid-web/
└── seo-input/
    ├── Queries.csv
    ├── Pages.csv
    └── ...other exported files are fine
```

The monitor searches inside `seo-input/` recursively, so one extra extracted subfolder is also fine.

## Run the monitor

From the project root:

```powershell
npm run seo:validate
npm run seo:test
npm run seo:monitor:csv
```

Expected final lines:

```text
CSV SEO monitor complete. Report: seo-output/latest-report.md
No Google Cloud account or credentials were used.
No production files were modified by the monitor.
```

## Read the outputs

The command generates:

```text
seo-output/
├── latest-report.md
├── latest-data.json
└── ai-change-brief.md
```

### `latest-report.md`
Human-readable SEO diagnosis: traffic change, ranking opportunities, losing pages, and pages to protect.

### `latest-data.json`
Structured evidence for future automation.

### `ai-change-brief.md`
A conservative change brief for the future AI SEO agent. It does not execute any change.

## If your CSV export was NOT a comparison

Use two folders instead:

```text
seo-input/
├── current/
│   ├── Queries.csv
│   └── Pages.csv
└── previous/
    ├── Queries.csv
    └── Pages.csv
```

Then run the same command:

```powershell
npm run seo:monitor:csv
```

## Important limitations of manual CSV mode

Search Console's normal UI export provides Queries and Pages as separate tables. Therefore the monitor can reliably answer:

- which queries have opportunity
- which pages gained/lost visibility
- CTR and position priorities
- which gaining pages should be protected

But it cannot reliably know every query-to-page pairing or detect true cannibalization across the whole site from a single global CSV export. The API version can add that later.

The configured `queryPageHints` in `seo.config.json` only provide conservative suggested target pages for known SolveGrid topics. They do not change your site.

## Ranking policy

- Prefer 28-day evidence for changes.
- Use 7-day data as an alert, not as proof.
- Do not rewrite gaining pages.
- Prioritize queries around positions 11–40.
- Improve one or two topic clusters per week.
- Never auto-deploy SEO rewrites.
