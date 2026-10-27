# SolveGrid SEO Automation – Phase 1

This package adds a read-only SEO monitoring agent. It does **not** edit calculator pages, change metadata, commit code, push to `main`, request indexing, or deploy the site.

## What it monitors

- Google Search Console query + page performance
- 7-day vs previous 7-day trends
- 28-day vs previous 28-day trends
- ranking opportunities by query/page
- large impression losses and gains
- pages that should be protected from unnecessary edits
- possible query cannibalization
- URL Inspection status for priority pages
- GA4 landing-page engagement (optional but recommended)
- PageSpeed/Lighthouse for priority pages on the weekly run

Search Console data uses a 3-day lag by default so recommendations are less sensitive to incomplete recent data.

## Required Google setup

### 1. Create a Google Cloud service account

Use a Google Cloud project dedicated to SolveGrid monitoring. Enable:

- Google Search Console API
- Google Analytics Data API
- PageSpeed Insights API (only if you want a key for scheduled PageSpeed calls)

Download one service-account JSON key and keep it private. Never commit the JSON file to Git.

### 2. Give the service account Search Console access

In Search Console for `solvegrid.online`, add the service account email as a user with enough access to read Search Console data. The configured property is:

`sc-domain:solvegrid.online`

### 3. Give the same service account GA4 access

In GA4, add the service-account email to the SolveGrid property with Viewer access.

You also need the numeric GA4 Property ID (not the measurement ID that starts with `G-`).

### 4. Create GitHub Actions secrets

Repository → Settings → Secrets and variables → Actions → New repository secret.

Add:

- `GOOGLE_SERVICE_ACCOUNT_B64`
- `GA4_PROPERTY_ID`
- `PAGESPEED_API_KEY` (optional)

To create the base64 service-account secret in PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\service-account.json"))
```

Copy the resulting single-line string into the `GOOGLE_SERVICE_ACCOUNT_B64` GitHub secret.

## Local setup

You can use the JSON file locally without encoding it:

```powershell
$env:GOOGLE_SERVICE_ACCOUNT_FILE="C:\secure\solvegrid-seo-service-account.json"
$env:GA4_PROPERTY_ID="YOUR_NUMERIC_GA4_PROPERTY_ID"
$env:PAGESPEED_ENABLED="true"
$env:PAGESPEED_API_KEY="YOUR_OPTIONAL_API_KEY"
npm run seo:monitor
```

The output is written to `seo-output/` and is ignored by Git.

## GitHub schedule

- Tuesday-Sunday: Search Console, GA4, and indexing monitor
- Monday: the same checks plus mobile/desktop PageSpeed checks
- Manual: Actions → SolveGrid SEO Monitor → Run workflow

GitHub scheduled workflows can start later than the exact cron minute. This does not affect the analysis because the Search Console window intentionally ends three days earlier.

## How recommendations are interpreted

- Position 1-10 + low CTR: protect content; focus on snippet/title relevance
- Position 11-20: improve direct answer, snippet alignment, internal links
- Position 21-40: strongest content opportunity; add worked examples and search-intent depth
- Position 41-60: build topical authority, supporting guides, and legitimate external mentions
- Position above 60: generally lower immediate priority unless impression volume is unusually high

The rules are deliberately conservative. A future Phase 2 AI agent can consume `seo-output/ai-change-brief.md`, but any code change should create a branch/pull request and require human approval.

## Safe workflow for Phase 2

1. Monitor automatically.
2. Analyze automatically.
3. Generate an evidence-backed change brief.
4. AI prepares a branch/PR for one topic cluster.
5. `npm run check` must pass.
6. Human reviews the diff.
7. Human merges and deploys.
8. Monitor the affected cluster for at least 7-14 days before another major rewrite.

Never let an SEO agent continuously rewrite production pages or force-push `main`.

## No Google Cloud / payment-card fallback

If Google Cloud signup or billing verification is unavailable, use the manual Search Console CSV mode instead. It uses the same conservative ranking analyzer and does not need an API key.

See `SEO_CSV_MONITOR_SETUP.md`, then run:

```powershell
npm run seo:monitor:csv
```

When Google Cloud access becomes available later, switch back to `npm run seo:monitor`; the CSV workflow does not lock you into a separate analysis system.
