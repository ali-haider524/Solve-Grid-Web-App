import path from "node:path";
import { runRecoveryAudit } from "./lib/recovery-auditor.mjs";

console.log("SolveGrid SEO Recovery Auditor Phase 3 starting in READ-ONLY mode.");

const repoRoot = process.cwd();
const { output, mdPath, jsonPath } = runRecoveryAudit({
  repoRoot,
  analystPlanPath: path.join(repoRoot, "seo-output", "analyst-plan.json"),
  outputDir: path.join(repoRoot, "seo-output"),
});

console.log("");
console.log(`Clusters audited: ${output.clusters.length}`);
console.log(`Protected pages respected: ${output.protectedPages.length}`);
console.log(`Markdown report: ${path.relative(repoRoot, mdPath)}`);
console.log(`JSON report: ${path.relative(repoRoot, jsonPath)}`);
console.log("");
console.log("No production files were modified.");
console.log("No Git command was run.");
console.log("No deployment was triggered.");
