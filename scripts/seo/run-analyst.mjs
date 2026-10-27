import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { buildAnalystPlan, markdownPlan } from "./lib/analyst.mjs";

const root = process.cwd();
const input = path.resolve(root, process.env.SEO_ANALYST_INPUT || "seo-output/latest-data.json");
const outputDir = path.resolve(root, process.env.SEO_OUTPUT_DIR || "seo-output");
const maxWeeklyClusters = Math.max(1, Math.min(4, Number(process.env.SEO_MAX_WEEKLY_CLUSTERS || 2)));

console.log("SolveGrid SEO Analyst Phase 2 starting in ADVISORY-ONLY mode.");
console.log(`Input: ${path.relative(root, input) || input}`);

const data = JSON.parse(await readFile(input, "utf8"));
const plan = buildAnalystPlan(data, { maxWeeklyClusters });

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "analyst-plan.json"), `${JSON.stringify(plan, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "analyst-plan.md"), markdownPlan(plan), "utf8");
await writeFile(
  path.join(outputDir, "analyst-queue.json"),
  `${JSON.stringify({ generatedAt: plan.generatedAt, queue: plan.queue, protect: plan.protect }, null, 2)}\n`,
  "utf8",
);

console.log(`Weekly focus clusters: ${plan.summary.weeklyFocusClusters}`);
for (const focus of plan.weeklyFocus) {
  console.log(`- ${focus.cluster}: ${focus.lead.actionType} -> ${focus.lead.page || focus.lead.subject} (${focus.lead.confidence})`);
}
console.log(`Unresolved query mappings: ${plan.summary.unresolvedMappings}`);
console.log(`Weak signals held back from aggressive changes: ${plan.summary.weakSignals}`);
console.log(`Protected pages: ${plan.summary.protectedPages}`);
console.log(`Report: ${path.relative(root, path.join(outputDir, "analyst-plan.md"))}`);
console.log("No production files were modified. No Git command was run. No deployment was triggered.");
