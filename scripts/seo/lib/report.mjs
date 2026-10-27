function fmt(value, digits = 1) {
  return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: digits });
}

function percent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${fmt(value, 0)}%`;
}

function markdownTable(headers, rows) {
  if (!rows.length) return "_No items triggered the configured threshold._\n";
  const escape = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.map(escape).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`),
  ].join("\n") + "\n";
}

function totals(rows) {
  return rows.reduce(
    (acc, row) => {
      acc.clicks += row.clicks || 0;
      acc.impressions += row.impressions || 0;
      return acc;
    },
    { clicks: 0, impressions: 0 },
  );
}

function shortWindowNote(primary) {
  const days = Number(primary?.comparisonDays || 0);
  if (!days || days >= 14) return "";
  return `> **Short-window alert:** this comparison appears to cover ${days} days. Use it for monitoring/recovery alerts, not for broad content rewrites. Confirm important decisions with a 28-day comparison.\n\n`;
}

export function buildMarkdownReport({ generatedAt, config, windows, ga4, pagespeed, indexing, warnings, sourceMode = "api" }) {
  const primary = windows["28d"] || Object.values(windows)[0];
  const currentTotals = totals(primary?.current?.pages || []);
  const previousTotals = totals(primary?.previous?.pages || []);
  const clickChange = previousTotals.clicks
    ? ((currentTotals.clicks - previousTotals.clicks) / previousTotals.clicks) * 100
    : 0;
  const impressionChange = previousTotals.impressions
    ? ((currentTotals.impressions - previousTotals.impressions) / previousTotals.impressions) * 100
    : 0;

  let output = `# SolveGrid SEO Monitor\n\n`;
  output += `Generated: ${generatedAt}\n\n`;
  output += `Mode: **read-only monitoring and recommendations**. This automation never edits SEO pages, commits code, or deploys production.\n\n`;
  if (sourceMode === "manual-csv") {
    output += `Data source: **manual Google Search Console CSV export**. No Google Cloud credentials were used.\n\n`;
  } else {
    output += `Data source: **Google Search Console API**.\n\n`;
  }

  output += `## Executive snapshot (${primary?.label || "comparison"})\n\n`;
  output += `- Clicks: **${fmt(currentTotals.clicks, 0)}** (${percent(clickChange)} vs previous period)\n`;
  output += `- Impressions: **${fmt(currentTotals.impressions, 0)}** (${percent(impressionChange)} vs previous period)\n`;
  if (sourceMode === "manual-csv") {
    output += `- Periods come directly from the comparison export you downloaded from Search Console.\n\n`;
  } else {
    output += `- Search Console data is intentionally delayed by **${config.dataLagDays} days** to reduce partial-data noise.\n\n`;
  }
  output += shortWindowNote(primary);

  output += `## What to do this week\n\n`;
  output += markdownTable(
    ["Type", "Subject", "Target page", "Risk", "Why now", "Recommended action"],
    (primary?.analysis?.priorityActions || []).slice(0, 8).map((item) => [
      item.type,
      item.subject,
      item.page || "Map query first",
      item.risk,
      item.reason,
      item.action,
    ]),
  );

  output += `\n## Quick wins: positions 8–30\n\n`;
  output += markdownTable(
    ["Score", "Query", "Page", "Impr.", "Pos.", "CTR", "Recommended action"],
    (primary?.analysis?.quickWins || []).slice(0, 15).map((item) => [
      item.score,
      item.query,
      item.page || "Map query first",
      fmt(item.current.impressions, 0),
      fmt(item.current.position, 1),
      `${fmt(item.current.ctr * 100, 1)}%`,
      item.recommendation,
    ]),
  );

  output += `\n## Emerging opportunities: positions 31–60\n\n`;
  output += markdownTable(
    ["Score", "Query", "Page", "Impr.", "Pos.", "CTR", "Recommended action"],
    (primary?.analysis?.emerging || []).slice(0, 15).map((item) => [
      item.score,
      item.query,
      item.page || "Map query first",
      fmt(item.current.impressions, 0),
      fmt(item.current.position, 1),
      `${fmt(item.current.ctr * 100, 1)}%`,
      item.recommendation,
    ]),
  );

  output += `\n## Recovery candidates\n\n`;
  output += markdownTable(
    ["Score", "Page", "Current impr.", "Previous impr.", "Change", "Current pos.", "Priority page"],
    (primary?.analysis?.recoveryCandidates || []).map((item) => [
      item.recoveryScore,
      item.page,
      fmt(item.current.impressions, 0),
      fmt(item.previous.impressions, 0),
      percent(item.changes.impressionsPercent),
      fmt(item.current.position, 1),
      item.priorityPage ? "yes" : "no",
    ]),
  );

  output += `\n## Topic authority signals\n\n`;
  output += markdownTable(
    ["Page", "Current impr.", "Current pos.", "Trend"],
    (primary?.analysis?.topicSignals || []).map((item) => [
      item.page,
      fmt(item.current.impressions, 0),
      fmt(item.current.position, 1),
      percent(item.changes.impressionsPercent),
    ]),
  );

  output += `\n## Pages losing visibility\n\n`;
  output += markdownTable(
    ["Page", "Current impr.", "Previous impr.", "Change", "Current pos."],
    (primary?.analysis?.losers || []).map((item) => [
      item.page,
      fmt(item.current.impressions, 0),
      fmt(item.previous.impressions, 0),
      percent(item.changes.impressionsPercent),
      fmt(item.current.position, 1),
    ]),
  );

  output += `\n## Previously tested pages now at zero impressions\n\n`;
  output += markdownTable(
    ["Page", "Previous impr.", "Previous pos.", "Action"],
    (primary?.analysis?.deadTests || []).map((item) => [
      item.page,
      fmt(item.previous.impressions, 0),
      fmt(item.previous.position, 1),
      "Observe and verify query/page fit before rewriting. Do not remove only because impressions reached zero in one comparison.",
    ]),
  );

  output += `\n## Pages to protect\n\n`;
  output += markdownTable(
    ["Page", "Reason"],
    (primary?.analysis?.protect || []).map((item) => [item.page, item.reason]),
  );

  output += `\n## Possible query cannibalization\n\n`;
  output += markdownTable(
    ["Query", "Competing pages"],
    (primary?.analysis?.cannibalization || []).map((item) => [
      item.query,
      item.pages.map((page) => `${page.page} (${page.impressions} impr., pos ${fmt(page.position, 1)})`).join("; "),
    ]),
  );

  output += `\n## Indexing watch\n\n`;
  output += markdownTable(
    ["URL", "Verdict", "Coverage", "Google canonical", "Last crawl"],
    (indexing || []).map((item) => [
      item.url,
      item.verdict || "unknown",
      item.coverageState || "unknown",
      item.googleCanonical || "—",
      item.lastCrawlTime || "—",
    ]),
  );

  output += `\n## PageSpeed watch\n\n`;
  output += markdownTable(
    ["URL", "Device", "Perf", "SEO", "LCP", "CLS", "INP"],
    (pagespeed || []).map((item) => [
      item.url,
      item.strategy,
      item.scores?.performance ?? "—",
      item.scores?.seo ?? "—",
      item.metrics?.lcp?.displayValue || "—",
      item.metrics?.cls?.displayValue || "—",
      item.metrics?.inp?.displayValue || "—",
    ]),
  );

  output += `\n## GA4 landing-page engagement\n\n`;
  output += markdownTable(
    ["Landing page", "Sessions", "Engaged", "Engagement rate", "Avg session"],
    (ga4 || []).slice(0, 15).map((item) => [
      item.landingPage,
      fmt(item.sessions, 0),
      fmt(item.engagedSessions, 0),
      `${fmt(item.engagementRate * 100, 1)}%`,
      `${fmt(item.averageSessionDuration, 1)}s`,
    ]),
  );

  if (warnings?.length) {
    output += `\n## Warnings / optional integrations\n\n`;
    for (const warning of warnings) output += `- ${warning}\n`;
  }

  output += `\n## Change policy\n\n`;
  output += `1. Do not automatically rewrite pages because of one-day or one-week fluctuations.\n`;
  output += `2. Prefer 28-day evidence for content decisions; use 7-day data for alerts and recovery triage only.\n`;
  output += `3. Protect pages that are gaining visibility.\n`;
  output += `4. Maximum recommended implementation cadence: one or two topic clusters per week.\n`;
  output += `5. Prefer internal-link, intent-coverage, example, and UX improvements before URL/title/H1/canonical changes.\n`;
  output += `6. Any future AI change agent should create a branch/PR and require human approval; never push SEO rewrites directly to main.\n`;

  return output;
}
