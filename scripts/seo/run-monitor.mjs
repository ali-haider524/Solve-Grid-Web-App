import path from "node:path";
import { mkdir } from "node:fs/promises";
import { analyzeComparison, compareRows, normalizeRows } from "./lib/analyzer.mjs";
import { ANALYTICS_SCOPE, queryLandingPages } from "./lib/analytics.mjs";
import { comparisonRange } from "./lib/dates.mjs";
import { readJson, writeJson, writeText } from "./lib/fs-utils.mjs";
import { getGoogleAccessToken } from "./lib/google-auth.mjs";
import { runPageSpeed } from "./lib/pagespeed.mjs";
import { buildMarkdownReport } from "./lib/report.mjs";
import {
  inspectUrl,
  querySearchAnalytics,
  SEARCH_CONSOLE_SCOPE,
} from "./lib/search-console.mjs";

const root = process.cwd();
const outputDir = path.join(root, process.env.SEO_OUTPUT_DIR || "seo-output");
const config = await readJson(path.join(root, "seo.config.json"));
const warnings = [];
const generatedAt = new Date().toISOString();

function absoluteUrl(page) {
  return new URL(page, `${config.siteUrl.replace(/\/$/, "")}/`).toString();
}

function envEnabled(name, defaultValue = false) {
  const raw = process.env[name];
  if (raw == null || raw === "") return defaultValue;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

console.log("SolveGrid SEO monitor starting in READ-ONLY mode.");
console.log(`Search Console property: ${config.searchConsoleSiteUrl}`);
console.log(`Stable data lag: ${config.dataLagDays} days`);

const scopes = [SEARCH_CONSOLE_SCOPE];
const ga4PropertyId = process.env.GA4_PROPERTY_ID?.trim();
if (ga4PropertyId) scopes.push(ANALYTICS_SCOPE);
const token = await getGoogleAccessToken([...new Set(scopes)]);

const windows = {};
for (const comparison of config.comparisons) {
  const ranges = comparisonRange(comparison.days, config.dataLagDays);
  console.log(
    `Collecting ${comparison.id}: ${ranges.current.startDate}..${ranges.current.endDate} vs ${ranges.previous.startDate}..${ranges.previous.endDate}`,
  );

  const request = (range, dimensions) =>
    querySearchAnalytics({
      token,
      siteUrl: config.searchConsoleSiteUrl,
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions,
      searchType: config.searchType,
    });

  const [currentQueryPageRaw, previousQueryPageRaw, currentPagesRaw, previousPagesRaw] =
    await Promise.all([
      request(ranges.current, ["query", "page"]),
      request(ranges.previous, ["query", "page"]),
      request(ranges.current, ["page"]),
      request(ranges.previous, ["page"]),
    ]);

  const currentQueryPage = normalizeRows(currentQueryPageRaw, ["query", "page"]);
  const previousQueryPage = normalizeRows(previousQueryPageRaw, ["query", "page"]);
  const currentPages = normalizeRows(currentPagesRaw, ["page"]);
  const previousPages = normalizeRows(previousPagesRaw, ["page"]);
  const queryPageComparison = compareRows(currentQueryPage, previousQueryPage, ["query", "page"]);
  const pageComparison = compareRows(currentPages, previousPages, ["page"]);
  const analysis = analyzeComparison({
    queryPageComparison,
    pageComparison,
    thresholds: config.thresholds || {},
    priorityPages: config.priorityPages || [],
  });

  windows[comparison.id] = {
    label: `${comparison.days} days vs previous ${comparison.days} days`,
    ranges,
    current: { queryPage: currentQueryPage, pages: currentPages },
    previous: { queryPage: previousQueryPage, pages: previousPages },
    comparison: { queryPage: queryPageComparison, pages: pageComparison },
    analysis,
  };
}

let ga4 = [];
if (ga4PropertyId) {
  try {
    const primary = windows["28d"] || Object.values(windows)[0];
    ga4 = await queryLandingPages({
      token,
      propertyId: ga4PropertyId,
      startDate: primary.ranges.current.startDate,
      endDate: primary.ranges.current.endDate,
    });
  } catch (error) {
    warnings.push(`GA4 collection failed: ${error.message}`);
  }
} else {
  warnings.push("GA4_PROPERTY_ID is not configured; Search Console monitoring still ran successfully.");
}

const indexing = [];
if (envEnabled("SEO_INDEXING_ENABLED", true)) {
  for (const page of config.indexingPages || []) {
    const url = absoluteUrl(page);
    try {
      const result = await inspectUrl({
        token,
        siteUrl: config.searchConsoleSiteUrl,
        inspectionUrl: url,
        languageCode: config.languageCode,
      });
      const index = result.indexStatusResult || {};
      indexing.push({
        url,
        verdict: index.verdict || null,
        coverageState: index.coverageState || null,
        robotsTxtState: index.robotsTxtState || null,
        indexingState: index.indexingState || null,
        lastCrawlTime: index.lastCrawlTime || null,
        pageFetchState: index.pageFetchState || null,
        googleCanonical: index.googleCanonical || null,
        userCanonical: index.userCanonical || null,
      });
    } catch (error) {
      warnings.push(`Index inspection failed for ${url}: ${error.message}`);
    }
  }
}

const pagespeed = [];
if (envEnabled("PAGESPEED_ENABLED", false)) {
  const apiKey = process.env.PAGESPEED_API_KEY?.trim() || "";
  for (const page of config.pagespeedPages || []) {
    const url = absoluteUrl(page);
    for (const strategy of ["mobile", "desktop"]) {
      try {
        pagespeed.push(await runPageSpeed(url, strategy, apiKey));
      } catch (error) {
        warnings.push(`PageSpeed failed for ${url} (${strategy}): ${error.message}`);
      }
    }
  }
} else {
  warnings.push("PageSpeed is disabled for this run. Enable PAGESPEED_ENABLED=true for weekly performance checks.");
}

const payload = {
  generatedAt,
  mode: "read-only",
  config: {
    siteUrl: config.siteUrl,
    searchConsoleSiteUrl: config.searchConsoleSiteUrl,
    dataLagDays: config.dataLagDays,
    priorityPages: config.priorityPages,
  },
  windows,
  ga4,
  indexing,
  pagespeed,
  warnings,
};

await mkdir(outputDir, { recursive: true });
await writeJson(path.join(outputDir, "latest-data.json"), payload);
const report = buildMarkdownReport({
  generatedAt,
  config,
  windows,
  ga4,
  pagespeed,
  indexing,
  warnings,
});
await writeText(path.join(outputDir, "latest-report.md"), report);

const primary = windows["28d"] || Object.values(windows)[0];
const aiBrief = [
  "# SolveGrid AI SEO Change Brief",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Safety / ranking guardrails",
  "",
  "- Do not push or deploy automatically.",
  "- Do not change URLs, canonicals, titles, H1s, or successful pages without evidence.",
  "- Protect gaining pages.",
  "- Prefer one or two topic clusters per week.",
  "- Any code change must pass npm run check and be reviewed in a pull request.",
  "- Do not generate mass pages for keyword variants.",
  "",
  "## Top evidence-backed opportunities",
  "",
  ...(primary?.analysis?.opportunities || []).slice(0, 10).map(
    (item, index) =>
      `${index + 1}. **${item.query}** → ${item.page} | ${Math.round(item.current.impressions)} impressions | position ${item.current.position.toFixed(1)} | ${item.recommendation}`,
  ),
  "",
  "## Pages to protect",
  "",
  ...(primary?.analysis?.protect?.length
    ? primary.analysis.protect.map((item) => `- ${item.page}: ${item.reason}`)
    : ["- No page crossed the protection threshold this run."]),
  "",
].join("\n");
await writeText(path.join(outputDir, "ai-change-brief.md"), `${aiBrief}\n`);

console.log(`SEO monitor complete. Report: ${path.relative(root, path.join(outputDir, "latest-report.md"))}`);
console.log("No production files were modified by the monitor.");
