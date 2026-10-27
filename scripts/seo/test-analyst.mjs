import { buildAnalystPlan } from "./lib/analyst.mjs";

const data = {
  generatedAt: "2026-08-28T00:00:00.000Z",
  mode: "read-only-manual-csv-v2",
  windows: {
    manual: {
      label: "Last 28 days vs Previous 28 days",
      current: {
        pages: [
          { page: "https://solvegrid.online/guides/matrix-inverse-and-determinant", impressions: 28, clicks: 0, ctr: 0, position: 69 },
          { page: "https://solvegrid.online/statistics-calculator", impressions: 20, clicks: 0, ctr: 0, position: 45 },
          { page: "https://solvegrid.online/equation-solver", impressions: 3, clicks: 0, ctr: 0, position: 22 },
        ],
      },
      previous: {
        pages: [
          { page: "https://solvegrid.online/guides/matrix-inverse-and-determinant", impressions: 205, clicks: 0, ctr: 0, position: 43 },
          { page: "https://solvegrid.online/statistics-calculator", impressions: 10, clicks: 0, ctr: 0, position: 60 },
          { page: "https://solvegrid.online/equation-solver", impressions: 49, clicks: 1, ctr: 0.02, position: 31 },
        ],
      },
      analysis: {
        quickWins: [
          {
            category: "QUICK_WIN",
            query: "determinant and inverse of a matrix",
            page: "/guides/matrix-inverse-and-determinant",
            score: 104,
            current: { impressions: 1, clicks: 0, ctr: 0, position: 26 },
            previous: { impressions: 1, clicks: 0, ctr: 0, position: 53 },
            changes: { impressionsPercent: 0, position: -27 },
          },
          {
            category: "QUICK_WIN",
            query: "numerical solver",
            page: "",
            score: 103,
            current: { impressions: 1, clicks: 0, ctr: 0, position: 11 },
            previous: { impressions: 1, clicks: 0, ctr: 0, position: 87 },
            changes: { impressionsPercent: 0, position: -76 },
          },
        ],
        emerging: [],
        recoveryCandidates: [
          {
            page: "https://solvegrid.online/guides/matrix-inverse-and-determinant",
            recoveryScore: 87,
            current: { impressions: 28, clicks: 0, ctr: 0, position: 69 },
            previous: { impressions: 205, clicks: 0, ctr: 0, position: 43 },
            changes: { impressionsPercent: -86, position: 26 },
          },
        ],
        deadTests: [],
        topicSignals: [
          {
            page: "https://solvegrid.online/statistics-calculator",
            current: { impressions: 20, clicks: 0, ctr: 0, position: 45 },
            previous: { impressions: 10, clicks: 0, ctr: 0, position: 60 },
            changes: { impressionsPercent: 100, position: -15 },
          },
        ],
        protect: [],
      },
    },
  },
};

const plan = buildAnalystPlan(data);
const determinant = plan.queue.find((item) => item.query === "determinant and inverse of a matrix");
if (!determinant) throw new Error("Expected determinant quick-win signal.");
if (determinant.actionType !== "INTERNAL_LINKS_ONLY") throw new Error("One-impression signal must not trigger an aggressive rewrite.");
const numerical = plan.queue.find((item) => item.query === "numerical solver");
if (!numerical) throw new Error("Expected numerical solver mapping item.");
if (numerical.actionType !== "QUERY_MAPPING") throw new Error("Ambiguous numerical solver query must be mapped before editing.");
if (!plan.weeklyFocus.length || plan.weeklyFocus.length > 2) throw new Error("Expected one or two weekly focus clusters.");
if (!plan.queue.some((item) => item.actionType === "RECOVERY_AUDIT")) throw new Error("Expected recovery audit.");
console.log("SEO Analyst Phase 2 tests passed.");
