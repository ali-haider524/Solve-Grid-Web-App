import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { runRecoveryAudit } from "./lib/recovery-auditor.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "solvegrid-seo-audit-"));
fs.mkdirSync(path.join(root, "seo-output"), { recursive: true });
fs.mkdirSync(path.join(root, "app", "matrix-calculator"), { recursive: true });
fs.mkdirSync(path.join(root, "app", "guides", "matrix-inverse-and-determinant"), { recursive: true });

fs.writeFileSync(
  path.join(root, "app", "matrix-calculator", "page.tsx"),
  `export const metadata = {}; export default function Page(){return <><h1>Matrix calculator</h1><a href="/guides/matrix-inverse-and-determinant">Guide</a></>}`,
  "utf8"
);

fs.writeFileSync(
  path.join(root, "app", "guides", "matrix-inverse-and-determinant", "page.tsx"),
  `export default function Page(){return <><h1>Inverse and determinant</h1><p>Worked example:</p></>}`,
  "utf8"
);

const plan = {
  generatedAt: new Date().toISOString(),
  weeklyFocus: [{
    cluster: "matrix",
    score: 100,
    lead: {
      page: "/guides/matrix-inverse-and-determinant",
      actionType: "RECOVERY_AUDIT",
      confidence: "HIGH",
      risk: "MEDIUM"
    },
    supporting: [{ page: "/matrix-calculator" }]
  }],
  protect: [{ page: "/differential-equation-solver" }]
};

fs.writeFileSync(
  path.join(root, "seo-output", "analyst-plan.json"),
  JSON.stringify(plan, null, 2),
  "utf8"
);

const result = runRecoveryAudit({
  repoRoot: root,
  analystPlanPath: path.join(root, "seo-output", "analyst-plan.json"),
  outputDir: path.join(root, "seo-output"),
});

assert.equal(result.output.clusters.length, 1);
assert.equal(result.output.protectedPages[0], "/differential-equation-solver");
assert.equal(result.output.clusters[0].pageAudits.length, 2);
assert.equal(result.output.clusters[0].pageAudits[0].signals.workedExample, true);
assert.equal(fs.existsSync(result.jsonPath), true);
assert.equal(fs.existsSync(result.mdPath), true);

console.log("SEO Recovery Auditor Phase 3 tests passed.");
