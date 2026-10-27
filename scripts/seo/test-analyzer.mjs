import { analyzeComparison, compareRows, normalizeRows } from "./lib/analyzer.mjs";

const thresholds = {
  minimumOpportunityImpressions: 5,
  minimumLossBaselineImpressions: 10,
  impressionLossPercent: 40,
  impressionGainPercent: 50,
  lowCtrPercent: 1,
  protectGainPercent: 50,
  cannibalizationMinimumImpressions: 2,
};

const currentRaw = [
  { keys: ["quick win query", "https://solvegrid.online/equation-solver"], clicks: 0, impressions: 1, ctr: 0, position: 18 },
  { keys: ["emerging query", "https://solvegrid.online/graphing-calculator"], clicks: 0, impressions: 3, ctr: 0, position: 44 },
  { keys: ["standard deviation formula", "https://solvegrid.online/guides/standard-deviation-formula"], clicks: 0, impressions: 20, ctr: 0, position: 28 },
];
const previousRaw = [
  { keys: ["quick win query", "https://solvegrid.online/equation-solver"], clicks: 0, impressions: 1, ctr: 0, position: 25 },
  { keys: ["emerging query", "https://solvegrid.online/graphing-calculator"], clicks: 0, impressions: 4, ctr: 0, position: 48 },
  { keys: ["standard deviation formula", "https://solvegrid.online/guides/standard-deviation-formula"], clicks: 0, impressions: 5, ctr: 0, position: 40 },
];

const current = normalizeRows(currentRaw, ["query", "page"]);
const previous = normalizeRows(previousRaw, ["query", "page"]);
const comparison = compareRows(current, previous, ["query", "page"]);

const pageComparison = compareRows(
  [
    { page: "https://solvegrid.online/equation-solver", clicks: 0, impressions: 3, ctr: 0, position: 22 },
    { page: "https://solvegrid.online/optimization-lab", clicks: 0, impressions: 19, ctr: 0, position: 74 },
    { page: "https://solvegrid.online/guides/standard-deviation-formula", clicks: 0, impressions: 20, ctr: 0, position: 28 },
    { page: "https://solvegrid.online/guides/simple-interest-formula", clicks: 0, impressions: 0, ctr: 0, position: 0 },
  ],
  [
    { page: "https://solvegrid.online/equation-solver", clicks: 0, impressions: 49, ctr: 0, position: 31 },
    { page: "https://solvegrid.online/optimization-lab", clicks: 0, impressions: 294, ctr: 0, position: 50 },
    { page: "https://solvegrid.online/guides/standard-deviation-formula", clicks: 0, impressions: 5, ctr: 0, position: 40 },
    { page: "https://solvegrid.online/guides/simple-interest-formula", clicks: 0, impressions: 22, ctr: 0, position: 60 },
  ],
  ["page"],
);

const result = analyzeComparison({
  queryPageComparison: comparison,
  pageComparison,
  thresholds,
  priorityPages: ["/equation-solver", "/optimization-lab"],
});

if (!result.quickWins.some((item) => item.query === "quick win query")) {
  throw new Error("Expected low-volume position-18 query to be a quick win.");
}
if (!result.emerging.some((item) => item.query === "emerging query")) {
  throw new Error("Expected position-44 query to be emerging.");
}
if (!result.recoveryCandidates.some((item) => item.page.includes("optimization-lab"))) {
  throw new Error("Expected optimization-lab recovery candidate.");
}
if (!result.protect.some((item) => item.page.includes("standard-deviation-formula"))) {
  throw new Error("Expected standard-deviation protect signal.");
}
if (!result.deadTests.some((item) => item.page.includes("simple-interest-formula"))) {
  throw new Error("Expected zero-impression historical page to be a dead/test signal.");
}
if (!result.priorityActions.length) {
  throw new Error("Expected prioritized weekly actions.");
}

console.log("SEO analyzer V2 tests passed.");
