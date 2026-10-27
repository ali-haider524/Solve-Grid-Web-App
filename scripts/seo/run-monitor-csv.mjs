import path from "node:path";
import { mkdir } from "node:fs/promises";
import { analyzeComparison, compareRows } from "./lib/analyzer.mjs";
import {
  findCsvByName,
  parseGscComparisonCsv,
  parseGscSingleCsv,
  pathExists,
} from "./lib/csv.mjs";
import { readJson, writeJson, writeText } from "./lib/fs-utils.mjs";
import { buildMarkdownReport } from "./lib/report.mjs";

const root = process.cwd();
const config = await readJson(path.join(root, "seo.config.json"));
const inputRoot = path.resolve(root, process.env.SEO_CSV_INPUT_DIR || "seo-input");
const outputDir = path.resolve(root, process.env.SEO_OUTPUT_DIR || "seo-output");
const generatedAt = new Date().toISOString();
const warnings = [];

console.log("SolveGrid SEO CSV monitor starting in READ-ONLY mode.");
console.log(`Input directory: ${path.relative(root, inputRoot) || inputRoot}`);

async function loadComparisonExport() {
  const queriesPath = await findCsvByName(inputRoot, "Queries.csv");
  const pagesPath = await findCsvByName(inputRoot, "Pages.csv");
  if (!queriesPath || !pagesPath) return null;

  try {
    const [queries, pages] = await Promise.all([
      parseGscComparisonCsv(queriesPath, "query"),
      parseGscComparisonCsv(pagesPath, "page"),
    ]);
    return {
      kind: "comparison-export",
      sourceFiles: { queriesPath, pagesPath },
      periodInfo: queries.periodInfo || pages.periodInfo || null,
      currentQueries: queries.current,
      previousQueries: queries.previous,
      currentPages: pages.current,
      previousPages: pages.previous,
    };
  } catch (error) {
    warnings.push(`Comparison export auto-detection failed: ${error.message}`);
    return null;
  }
}

async function loadSeparateExports() {
  const currentRoot = path.join(inputRoot, "current");
  const previousRoot = path.join(inputRoot, "previous");
  if (!(await pathExists(currentRoot)) || !(await pathExists(previousRoot))) return null;

  const currentQueriesPath = await findCsvByName(currentRoot, "Queries.csv");
  const currentPagesPath = await findCsvByName(currentRoot, "Pages.csv");
  const previousQueriesPath = await findCsvByName(previousRoot, "Queries.csv");
  const previousPagesPath = await findCsvByName(previousRoot, "Pages.csv");

  const missing = [
    ["current/Queries.csv", currentQueriesPath],
    ["current/Pages.csv", currentPagesPath],
    ["previous/Queries.csv", previousQueriesPath],
    ["previous/Pages.csv", previousPagesPath],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (missing.length) throw new Error(`Missing CSV files: ${missing.join(", ")}`);

  const [currentQueries, currentPages, previousQueries, previousPages] = await Promise.all([
    parseGscSingleCsv(currentQueriesPath, "query"),
    parseGscSingleCsv(currentPagesPath, "page"),
    parseGscSingleCsv(previousQueriesPath, "query"),
    parseGscSingleCsv(previousPagesPath, "page"),
  ]);

  return {
    kind: "separate-exports",
    sourceFiles: { currentQueriesPath, currentPagesPath, previousQueriesPath, previousPagesPath },
    periodInfo: null,
    currentQueries,
    previousQueries,
    currentPages,
    previousPages,
  };
}

let input = await loadComparisonExport();
if (!input) input = await loadSeparateExports();

if (!input) {
  throw new Error(
    [
      "No usable Search Console CSV export was found.",
      "Preferred: export a comparison from Search Console and extract it into seo-input/ so Queries.csv and Pages.csv are present.",
      "Alternative: put non-comparison exports in seo-input/current/ and seo-input/previous/.",
      "See SEO_CSV_MONITOR_SETUP.md for exact steps.",
    ].join(" "),
  );
}

const queryComparison = compareRows(input.currentQueries, input.previousQueries, ["query"]);
const pageComparison = compareRows(input.currentPages, input.previousPages, ["page"]);
const analysis = analyzeComparison({
  queryComparison,
  queryPageComparison: [],
  pageComparison,
  thresholds: config.thresholds || {},
  queryPageHints: config.manualCsv?.queryPageHints || [],
  priorityPages: config.priorityPages || [],
});

if (input.periodInfo?.days && input.periodInfo.days < 14) {
  warnings.push(
    `This appears to be a ${input.periodInfo.days}-day comparison. Treat losses as alerts only; confirm broad content decisions with a 28-day comparison.`,
  );
}

warnings.push("CSV mode cannot detect query cannibalization unless query+page data is supplied by the API. Cannibalization is therefore intentionally omitted.");
warnings.push("CSV mode does not run URL Inspection, GA4, or PageSpeed. Those integrations can be added later without changing the ranking analyzer.");

const label = input.periodInfo
  ? `${input.periodInfo.currentLabel} vs ${input.periodInfo.previousLabel}`
  : "Search Console comparison export";

const windows = {
  manual: {
    label,
    comparisonDays: input.periodInfo?.days || null,
    ranges: null,
    current: { queries: input.currentQueries, pages: input.currentPages },
    previous: { queries: input.previousQueries, pages: input.previousPages },
    comparison: { queries: queryComparison, pages: pageComparison },
    analysis,
  },
};

const payload = {
  generatedAt,
  mode: "read-only-manual-csv-v2",
  inputKind: input.kind,
  sourceFiles: Object.fromEntries(Object.entries(input.sourceFiles).map(([key, value]) => [key, path.relative(root, value)])),
  periodInfo: input.periodInfo || null,
  config: {
    siteUrl: config.siteUrl,
    priorityPages: config.priorityPages,
  },
  windows,
  ga4: [],
  indexing: [],
  pagespeed: [],
  warnings,
};

await mkdir(outputDir, { recursive: true });
await writeJson(path.join(outputDir, "latest-data.json"), payload);
const report = buildMarkdownReport({
  generatedAt,
  config,
  windows,
  ga4: [],
  pagespeed: [],
  indexing: [],
  warnings,
  sourceMode: "manual-csv",
});
await writeText(path.join(outputDir, "latest-report.md"), report);

const actions = analysis.priorityActions || [];
const quickWins = analysis.quickWins || [];
const emerging = analysis.emerging || [];
const recovery = analysis.recoveryCandidates || [];
const protect = analysis.protect || [];
const topicSignals = analysis.topicSignals || [];

const aiBrief = [
  "# SolveGrid AI SEO Change Brief — Monitor V2",
  "",
  `Generated: ${generatedAt}`,
  "",
  `Comparison: ${label}`,
  "",
  "## Ranking guardrails",
  "",
  "- This report is advisory only; it never edits production files.",
  "- Do not rewrite pages because of one short-period fluctuation.",
  "- Prefer 28-day comparisons for content/title/H1 decisions.",
  "- Protect gaining pages and avoid unnecessary URL/title/H1/canonical changes.",
  "- Prefer internal links, intent coverage, examples, and UX improvements before metadata rewrites.",
  "- Implement at most one or two topic clusters per week.",
  "",
  "## Top actions this week",
  "",
  ...(actions.length
    ? actions.slice(0, 8).map((item, index) =>
        `${index + 1}. **${item.type}** — ${item.subject}${item.page ? ` → ${item.page}` : ""} | risk ${item.risk} | ${item.reason} | ${item.action}`,
      )
    : ["- No action crossed the V2 threshold. Keep monitoring."]),
  "",
  "## Quick wins — positions 8–30",
  "",
  ...(quickWins.length
    ? quickWins.slice(0, 10).map((item) =>
        `- **${item.query}**${item.page ? ` → ${item.page}` : ""} | ${Math.round(item.current.impressions)} impressions | position ${item.current.position.toFixed(1)} | score ${item.score}`,
      )
    : ["- No quick-win query this run."]),
  "",
  "## Emerging opportunities — positions 31–60",
  "",
  ...(emerging.length
    ? emerging.slice(0, 10).map((item) =>
        `- **${item.query}**${item.page ? ` → ${item.page}` : ""} | ${Math.round(item.current.impressions)} impressions | position ${item.current.position.toFixed(1)} | score ${item.score}`,
      )
    : ["- No emerging opportunity crossed the threshold."]),
  "",
  "## Recovery candidates",
  "",
  ...(recovery.length
    ? recovery.slice(0, 10).map((item) =>
        `- ${item.page}: ${Math.round(item.previous.impressions)} → ${Math.round(item.current.impressions)} impressions (${Math.round(item.changes.impressionsPercent)}%), position ${item.current.position.toFixed(1)}, recovery score ${item.recoveryScore}.`,
      )
    : ["- No recovery candidate crossed the threshold."]),
  "",
  "## Topic authority signals",
  "",
  ...(topicSignals.length
    ? topicSignals.slice(0, 10).map((item) =>
        `- ${item.page}: ${Math.round(item.current.impressions)} current impressions at position ${item.current.position.toFixed(1)}.`,
      )
    : ["- No topic authority page crossed the threshold."]),
  "",
  "## Pages to protect",
  "",
  ...(protect.length
    ? protect.map((item) => `- ${item.page}: ${item.reason}`)
    : ["- No page crossed the protection threshold in this export."]),
  "",
].join("\n");
await writeText(path.join(outputDir, "ai-change-brief.md"), `${aiBrief}\n`);

console.log(`CSV SEO monitor V2 complete. Report: ${path.relative(root, path.join(outputDir, "latest-report.md"))}`);
if (input.periodInfo?.days) console.log(`Detected comparison window: ${input.periodInfo.days} days.`);
console.log(`Quick wins: ${quickWins.length}; emerging: ${emerging.length}; recovery candidates: ${recovery.length}; protected pages: ${protect.length}.`);
console.log("No Google Cloud account or credentials were used.");
console.log("No production files were modified by the monitor.");
