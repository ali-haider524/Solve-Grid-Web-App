import path from "node:path";
import { runQueryMapper } from "./lib/query-mapper.mjs";

console.log("SolveGrid SEO Query Mapper Phase 4 starting in advisory mode.");

const repoRoot = process.cwd();
const { output, jsonPath, mdPath } = runQueryMapper({
  repoRoot,
  auditPath: path.join(repoRoot, "seo-output", "recovery-audit.json"),
  inputRoot: path.join(repoRoot, "seo-input", "page-queries"),
  outputDir: path.join(repoRoot, "seo-output"),
});

const counts = output.pageResults.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] || 0) + 1;
  return acc;
}, {});

console.log("");
for (const [status, count] of Object.entries(counts)) console.log(`${status}: ${count}`);
console.log(`Report: ${path.relative(repoRoot, mdPath)}`);
console.log(`JSON: ${path.relative(repoRoot, jsonPath)}`);
console.log("");
console.log("No production files were modified.");
console.log("No Git command was run.");
console.log("No deployment was triggered.");
