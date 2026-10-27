import fs from "node:fs";
import path from "node:path";

const ROUTE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".mjs"];

function readText(filePath) {
  try { return fs.readFileSync(filePath, "utf8"); } catch { return ""; }
}

function rel(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).replaceAll("\\", "/");
}

function routeFileForPage(repoRoot, page) {
  if (!page || page === "/") return path.join(repoRoot, "app", "page.tsx");
  return path.join(repoRoot, "app", ...page.replace(/^\/+/, "").split("/"), "page.tsx");
}

function resolveLocalImport(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = path.resolve(path.dirname(fromFile), specifier);
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;

  for (const ext of ROUTE_EXTENSIONS) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  for (const ext of ROUTE_EXTENSIONS) {
    const indexFile = path.join(base, "index" + ext);
    if (fs.existsSync(indexFile)) return indexFile;
  }
  return null;
}

function collectLocalSources(repoRoot, entryFile, maxDepth = 2) {
  const seen = new Set();
  const queue = [{ file: entryFile, depth: 0 }];

  while (queue.length) {
    const { file, depth } = queue.shift();
    if (!file || seen.has(file) || !fs.existsSync(file)) continue;
    if (!path.resolve(file).startsWith(path.resolve(repoRoot))) continue;

    seen.add(file);
    if (depth >= maxDepth) continue;

    const text = readText(file);
    const importRx = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
    let match;
    while ((match = importRx.exec(text))) {
      const resolved = resolveLocalImport(file, match[1]);
      if (resolved) queue.push({ file: resolved, depth: depth + 1 });
    }
  }
  return [...seen];
}

function countMatches(text, regex) {
  return [...text.matchAll(regex)].length;
}

function unique(values) {
  return [...new Set(values)];
}

function allClusterPages(focus) {
  const pages = [];
  if (focus?.lead?.page) pages.push(focus.lead.page);
  for (const item of focus?.supporting ?? []) if (item?.page) pages.push(item.page);
  return unique(pages);
}

function makePageAudit(repoRoot, page, clusterPages, globalSources) {
  const routeFile = routeFileForPage(repoRoot, page);
  const exists = fs.existsSync(routeFile);
  const localSources = exists ? collectLocalSources(repoRoot, routeFile, 2) : [];
  const sources = unique([...localSources, ...globalSources.filter(fs.existsSync)]);
  const combined = sources.map(readText).join("\n");

  const clusterLinksFound = clusterPages
    .filter((candidate) => candidate && candidate !== page)
    .filter((candidate) => combined.includes(candidate));

  const hrefs = [];
  const hrefRx = /\bhref\s*=\s*(?:["']([^"']+)["']|\{\s*["']([^"']+)["']\s*\})/g;
  let hrefMatch;
  while ((hrefMatch = hrefRx.exec(combined))) hrefs.push(hrefMatch[1] || hrefMatch[2]);

  const signals = {
    metadata: /\bmetadata\b|createToolMetadata\s*\(/i.test(combined),
    canonical: /canonical/i.test(combined),
    h1Count: countMatches(combined, /<h1\b/gi),
    workedExample: /worked example|example:/i.test(combined),
    formulaCoverage: /\bformula\b|\\frac|MathJax|KaTeX/i.test(combined),
    faqCoverage: /FAQPage|frequently asked|faq/i.test(combined),
    schema: /ToolSchema|BreadcrumbList|FAQPage|application\/ld\+json/i.test(combined),
    relatedLinks: /ToolCrossLinks|related (?:tool|guide)|relatedGuide|guideButton/i.test(combined),
    internalHrefCount: hrefs.filter((href) => href?.startsWith("/")).length,
    clusterLinksFound,
  };

  const recommendations = [];

  if (!exists) {
    recommendations.push({
      type: "TECHNICAL_VERIFY",
      risk: "MEDIUM",
      reason: `Expected route file is missing: ${rel(repoRoot, routeFile)}`,
    });
  } else {
    if (clusterPages.length > 1 && clusterLinksFound.length === 0) {
      recommendations.push({
        type: "ADD_CONTEXTUAL_INTERNAL_LINK",
        risk: "LOW",
        reason: "No direct contextual link to another page in the same recovery cluster was detected.",
        suggestedTargets: clusterPages.filter((p) => p !== page),
      });
    }
    if (!signals.workedExample) {
      recommendations.push({
        type: "ADD_WORKED_EXAMPLE",
        risk: "LOW",
        reason: "No clear worked-example marker was detected in the route/component sources.",
      });
    }
    if (!signals.relatedLinks) {
      recommendations.push({
        type: "ADD_RELATED_LINK_BLOCK_OR_CONTEXT_LINK",
        risk: "LOW",
        reason: "No obvious related-tool/guide linking component or marker was detected.",
      });
    }
    if (!signals.schema) {
      recommendations.push({
        type: "VERIFY_STRUCTURED_DATA",
        risk: "LOW",
        reason: "No obvious structured-data helper was detected in the scanned sources.",
      });
    }
    if (!signals.metadata) {
      recommendations.push({
        type: "VERIFY_METADATA_PIPELINE",
        risk: "LOW",
        reason: "No metadata export/helper was detected in the scanned sources.",
      });
    }
  }

  return {
    page,
    routeFile: rel(repoRoot, routeFile),
    exists,
    sourceFiles: localSources.map((f) => rel(repoRoot, f)),
    signals,
    recommendations,
  };
}

function mdEscape(value) {
  return String(value ?? "").replaceAll("|", "\\|");
}

export function runRecoveryAudit({
  repoRoot = process.cwd(),
  analystPlanPath = path.join(process.cwd(), "seo-output", "analyst-plan.json"),
  outputDir = path.join(process.cwd(), "seo-output"),
} = {}) {
  if (!fs.existsSync(analystPlanPath)) {
    throw new Error(`Analyst plan not found: ${analystPlanPath}\nRun "npm run seo:analyst" first.`);
  }

  const plan = JSON.parse(fs.readFileSync(analystPlanPath, "utf8"));
  const focus = Array.isArray(plan.weeklyFocus) ? plan.weeklyFocus.slice(0, 2) : [];
  const protectedPages = new Set((plan.protect ?? []).map((item) => item.page).filter(Boolean));

  const globalSources = [
    path.join(repoRoot, "lib", "tools.ts"),
    path.join(repoRoot, "lib", "guides.ts"),
    path.join(repoRoot, "components", "ToolCrossLinks.tsx"),
    path.join(repoRoot, "components", "GuideArticle.tsx"),
  ];

  const clusters = focus.map((cluster) => {
    const pages = allClusterPages(cluster);
    return {
      cluster: cluster.cluster,
      score: cluster.score,
      leadPage: cluster.lead?.page ?? "",
      leadAction: cluster.lead?.actionType ?? "",
      leadConfidence: cluster.lead?.confidence ?? "",
      leadRisk: cluster.lead?.risk ?? "",
      pages,
      pageAudits: pages.map((page) => makePageAudit(repoRoot, page, pages, globalSources)),
    };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    sourceGeneratedAt: plan.generatedAt ?? null,
    mode: "read-only-recovery-audit",
    policy: {
      productionEdits: false,
      gitCommands: false,
      deploy: false,
      titleH1UrlCanonicalChanges: "BLOCKED",
      maxClusters: 2,
    },
    protectedPages: [...protectedPages],
    clusters,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, "recovery-audit.json");
  const mdPath = path.join(outputDir, "recovery-audit.md");
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), "utf8");

  const lines = [
    "# SolveGrid SEO Recovery Audit — Phase 3",
    "",
    `Generated: ${output.generatedAt}`,
    "",
    "Mode: **read-only**. No production file, Git branch, commit, push, or deployment is modified.",
    "",
    "## Guardrails",
    "",
    "- Title/H1/URL/canonical changes are blocked in this phase.",
    "- Only the top two Analyst Phase 2 clusters are audited.",
    "- Low-risk changes are limited to internal linking, intent clarification, examples, and verification.",
    "- Protected pages are not selected for edits.",
    "",
    "## Protected pages",
    "",
  ];

  for (const page of output.protectedPages) lines.push(`- ${page}`);
  if (!output.protectedPages.length) lines.push("- None supplied by Analyst Phase 2.");
  lines.push("");

  for (const cluster of clusters) {
    lines.push(`## Cluster: ${cluster.cluster}`);
    lines.push("");
    lines.push(`Lead: **${cluster.leadAction}** on \`${cluster.leadPage}\` | confidence ${cluster.leadConfidence} | risk ${cluster.leadRisk}`);
    lines.push("");
    lines.push("| Page | Route | H1 | Internal hrefs | Cluster links | Example | Schema | Suggested safe actions |");
    lines.push("| --- | --- | ---: | ---: | --- | --- | --- | --- |");

    for (const audit of cluster.pageAudits) {
      const actions = audit.recommendations.length
        ? audit.recommendations.map((r) => r.type).join(", ")
        : "No obvious source-level gap detected";
      lines.push(`| ${mdEscape(audit.page)} | ${mdEscape(audit.routeFile)} | ${audit.signals.h1Count} | ${audit.signals.internalHrefCount} | ${mdEscape(audit.signals.clusterLinksFound.join(", ") || "none")} | ${audit.signals.workedExample ? "yes" : "no"} | ${audit.signals.schema ? "yes" : "no"} | ${mdEscape(actions)} |`);
    }
    lines.push("");

    for (const audit of cluster.pageAudits) {
      lines.push(`### ${audit.page}`);
      lines.push("");
      lines.push(`- Route exists: **${audit.exists ? "yes" : "NO"}**`);
      lines.push(`- Scanned local sources: ${audit.sourceFiles.length ? audit.sourceFiles.map((s) => `\`${s}\``).join(", ") : "none"}`);
      lines.push(`- Same-cluster links detected: ${audit.signals.clusterLinksFound.length ? audit.signals.clusterLinksFound.join(", ") : "none"}`);

      if (audit.recommendations.length) {
        lines.push("- Safe candidates:");
        for (const r of audit.recommendations) lines.push(`  - **${r.type}** (${r.risk}) — ${r.reason}`);
      } else {
        lines.push("- Safe candidates: no obvious source-level gap; inspect search intent/history before editing.");
      }
      lines.push("");
    }
  }

  lines.push("## Next decision", "");
  lines.push("Use this audit with `analyst-plan.json` to prepare one small implementation pack for the matrix cluster and one for the graphing cluster. Keep each change independently testable.");
  lines.push("");

  fs.writeFileSync(mdPath, lines.join("\n"), "utf8");
  return { output, jsonPath, mdPath };
}
