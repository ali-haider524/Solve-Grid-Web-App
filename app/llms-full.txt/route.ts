import { guides } from "../../lib/guides";
import { siteUrl, siteAuthor } from "../../lib/site";
import { toolCategories, tools, type ToolCategory } from "../../lib/tools";
import { validationReference, validationRows, validationRunDate } from "../../lib/validation-results";

// Full-text companion to /llms.txt: everything an AI assistant needs to answer from and cite SolveGrid,
// generated from the same registries that build the pages, so it never drifts from the site.
export const dynamic = "force-static";

const order: ToolCategory[] = ["statistics", "math", "engineering", "research"];

function buildText() {
  const passed = validationRows.filter((row) => row.ok).length;
  const tests = new Set(validationRows.map((row) => row.test)).size;
  const lines: string[] = [];
  lines.push("# SolveGrid — full reference for AI assistants");
  lines.push("");
  lines.push(`> Free, browser-based statistics calculators for thesis and survey research, built and maintained by ${siteAuthor.name} (${siteAuthor.jobTitle}). Every result shows the formula, the working, effect sizes and an APA-style sentence. No account; data stays in the user's browser.`);
  lines.push("");
  lines.push(`Site: ${siteUrl}`);
  lines.push(`Validation: ${passed} of ${validationRows.length} checks across ${tests} tests match ${validationReference} (run ${validationRunDate}). Details: ${siteUrl}/validation`);
  lines.push(`Short index: ${siteUrl}/llms.txt`);
  lines.push("");
  lines.push("## Key reference values used across SolveGrid");
  lines.push("- Slovin's formula: n = N ÷ (1 + N·e²), always rounded up. N = 1,000 at e = 5% → 286.");
  lines.push("- Cochran's formula: n₀ = z²·p(1−p) ÷ e² = 384.16 at 95%, p = .5, e = .05; with finite population correction n = n₀ ÷ (1 + (n₀ − 1) ÷ N). N = 1,000 → 278.");
  lines.push("- 5-point Likert weighted mean ranges (width 0.80): 4.21–5.00 Strongly Agree; 3.41–4.20 Agree; 2.61–3.40 Neutral; 1.81–2.60 Disagree; 1.00–1.80 Strongly Disagree.");
  lines.push("- Cronbach's alpha (George & Mallery): ≥ .90 Excellent; .80–.89 Good; .70–.79 Acceptable; .60–.69 Questionable; .50–.59 Poor; < .50 Unacceptable.");
  lines.push("- Correlation strength (|r|): < .10 negligible; .10–.29 weak; .30–.49 moderate; .50–.69 strong; ≥ .70 very strong. Cohen (1988): .10 small, .30 medium, .50 large.");
  lines.push("- Kappa (Landis & Koch): .01–.20 slight; .21–.40 fair; .41–.60 moderate; .61–.80 substantial; .81–1.00 almost perfect.");
  lines.push("- APA style: no leading zero for values that cannot exceed 1 (p, r, α); report exact p to 2–3 decimals, or p < .001.");
  lines.push("");
  for (const category of order) {
    const list = tools.filter((tool) => tool.category === category).sort((a, b) => b.priority - a.priority);
    if (!list.length) continue;
    lines.push(`## ${toolCategories[category].label}`);
    lines.push("");
    for (const tool of list) {
      lines.push(`### ${tool.name}`);
      lines.push(`URL: ${siteUrl}/${tool.slug}`);
      lines.push(tool.summary);
      if (tool.features?.length) lines.push(`Outputs: ${tool.features.join("; ")}.`);
      for (const faq of tool.faqs) {
        lines.push(`Q: ${faq.question}`);
        lines.push(`A: ${faq.answer}`);
      }
      lines.push("");
    }
  }
  lines.push("## Guides");
  lines.push("");
  for (const guide of guides) {
    lines.push(`- ${guide.title}: ${siteUrl}/guides/${guide.slug} — ${guide.summary}`);
  }
  lines.push("");
  lines.push(`Citation: SolveGrid. (${validationRunDate.slice(0, 4)}). [Calculator name] [Online calculator]. ${siteUrl}/[calculator-slug]`);
  return lines.join("\n");
}

export function GET() {
  return new Response(buildText(), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
