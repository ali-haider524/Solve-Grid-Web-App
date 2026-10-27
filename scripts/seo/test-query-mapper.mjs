import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { runQueryMapper } from "./lib/query-mapper.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "solvegrid-query-map-"));
fs.mkdirSync(path.join(root, "seo-output"), { recursive: true });
fs.mkdirSync(path.join(root, "seo-input", "page-queries", "graphing-calculator"), { recursive: true });

const audit = {
  generatedAt: new Date().toISOString(),
  protectedPages: [],
  clusters: [{
    cluster: "graphing",
    pages: ["/graphing-calculator", "/guides/plot-multiple-equations"],
    pageAudits: [
      {
        page: "/graphing-calculator",
        recommendations: [{ type: "ADD_CONTEXTUAL_INTERNAL_LINK", risk: "LOW", reason: "Missing cluster link." }]
      },
      { page: "/guides/plot-multiple-equations", recommendations: [] }
    ]
  }]
};
fs.writeFileSync(path.join(root, "seo-output", "recovery-audit.json"), JSON.stringify(audit), "utf8");

const csv = [
  "Top queries,Clicks Last 28 days,Clicks Previous 28 days,Impressions Last 28 days,Impressions Previous 28 days,CTR Last 28 days,CTR Previous 28 days,Position Last 28 days,Position Previous 28 days",
  '"plot equations online",0,0,4,10,0%,0%,35,42',
].join("\n");
fs.writeFileSync(path.join(root, "seo-input", "page-queries", "graphing-calculator", "Queries.csv"), csv, "utf8");

const result = runQueryMapper({
  repoRoot: root,
  auditPath: path.join(root, "seo-output", "recovery-audit.json"),
  inputRoot: path.join(root, "seo-input", "page-queries"),
  outputDir: path.join(root, "seo-output"),
});

const graph = result.output.pageResults.find((p) => p.page === "/graphing-calculator");
const guide = result.output.pageResults.find((p) => p.page === "/guides/plot-multiple-equations");
assert.equal(graph.status, "READY_FOR_IMPLEMENTATION_REVIEW");
assert.equal(graph.topQueries[0].query, "plot equations online");
assert.equal(guide.status, "HOLD_NEEDS_PAGE_QUERY_DATA");
assert.equal(fs.existsSync(result.mdPath), true);
console.log("SEO Query Mapper Phase 4 tests passed.");
