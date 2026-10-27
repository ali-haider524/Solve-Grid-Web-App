const SITE_ORIGIN = "https://solvegrid.online";

function n(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function pct(value) {
  return `${Math.round(n(value))}%`;
}

function pathOnly(value = "") {
  if (!value) return "";
  try {
    return new URL(value, `${SITE_ORIGIN}/`).pathname || "/";
  } catch {
    return String(value).startsWith("/") ? String(value) : `/${String(value)}`;
  }
}

function words(value = "") {
  const stop = new Set([
    "a", "an", "and", "the", "of", "to", "for", "with", "online", "calculator", "calculate",
    "calculating", "find", "how", "what", "is", "in", "on", "by", "from", "using", "solver",
  ]);
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token && !stop.has(token));
}

function clusterFor(value = "") {
  const text = String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ");
  if (/standard deviation|statistical|statistics|variance|quartile|iqr/.test(text)) return "statistics";
  if (/matrix|determinant|inverse|gaussian|rref|row reduction|rank|linear system/.test(text)) return "matrix";
  if (/optimization|optimisation|linear programming|objective function|\blp\b/.test(text)) return "optimization";
  if (/plot|graph|grapher|graphing/.test(text)) return "graphing";
  if (/nodal|circuit|conductance|ohm|resistor|voltage divider|\brc\b/.test(text)) return "circuit";
  if (/polynomial|root|zero/.test(text)) return "polynomial";
  if (/scientific notation|engineering notation|engineering prefix|scientific prefix/.test(text)) return "engineering-notation";
  if (/differential|euler|runge|rk4/.test(text)) return "differential-equations";
  if (/simple interest|compound interest|loan|markup|margin|profit|finance/.test(text)) return "finance";
  if (/unit|conversion|convert/.test(text)) return "unit-conversion";
  if (/equation|algebra|symbolic/.test(text)) return "equations";
  return "other";
}

function specialCandidates(query) {
  const text = String(query).toLowerCase();
  const rules = [
    [/numerical solver|numerical calculation/, ["/differential-equation-solver", "/equation-solver", "/research-tools"]],
    [/nodal analysis|conductance matrix/, ["/circuit-analysis", "/guides/two-node-nodal-analysis"]],
    [/plot|graph/, ["/graphing-calculator", "/guides/plot-multiple-equations"]],
    [/standard deviation|std dev/, ["/guides/standard-deviation-formula", "/statistics-calculator"]],
    [/engineering notation|scientific notation|engineering prefix|scientific prefix/, ["/guides/engineering-notation-and-scientific-notation", "/scientific-calculator"]],
    [/determinant|inverse matrix|matrix inverse/, ["/guides/matrix-inverse-and-determinant", "/matrix-calculator"]],
    [/matrix rank|rref|gaussian|row reduction/, ["/matrix-calculator", "/guides/gaussian-elimination-for-linear-systems"]],
    [/optimization|optimisation|linear programming/, ["/optimization-lab", "/guides/graphical-linear-programming-method"]],
    [/polynomial|complex root|roots? of polynomial/, ["/polynomial-solver", "/guides/polynomial-roots-and-complex-roots"]],
    [/slovin|yamane|sample size/, ["/sample-size-calculator", "/guides/slovin-formula-sample-size"]],
    [/cronbach|reliability/, ["/cronbach-alpha-calculator"]],
    [/likert|weighted mean/, ["/likert-scale-calculator", "/guides/likert-scale-interpretation"]],
    [/chi.square|cramer/, ["/chi-square-calculator"]],
    [/statistical test|which test/, ["/statistical-test-chooser", "/guides/choose-a-statistical-test"]],
    [/unit conversion|conversion formula/, ["/unit-converter", "/guides/unit-conversion-formulas"]],
  ];
  for (const [pattern, pages] of rules) if (pattern.test(text)) return pages;
  return [];
}

function similarity(query, page) {
  const q = new Set(words(query));
  const p = new Set(words(pathOnly(page)));
  if (!q.size || !p.size) return 0;
  let hits = 0;
  for (const token of q) if (p.has(token)) hits += 1;
  return hits / Math.max(q.size, 1);
}

function inferMapping(query, explicitPage, inventory) {
  if (explicitPage) {
    return {
      page: pathOnly(explicitPage),
      candidates: [pathOnly(explicitPage)],
      confidence: "HIGH",
      reason: "The monitor already mapped this query to a target page.",
    };
  }

  const allowed = new Set(inventory.map(pathOnly));
  const special = specialCandidates(query).filter((page) => allowed.has(page));

  // Broad numerical intent can legitimately belong to multiple existing tools.
  // Never auto-map it from slug similarity alone.
  if (/numerical solver|numerical calculation/i.test(String(query))) {
    const fallback = special.length ? special : ["/differential-equation-solver", "/equation-solver", "/research-tools"].filter((page) => allowed.has(page));
    return {
      page: "",
      candidates: [...new Set(fallback)].slice(0, 4),
      confidence: "LOW",
      reason: "Numerical-solver intent is broad; confirm the intended solver page before editing.",
    };
  }
  const scored = inventory
    .map((page) => ({ page: pathOnly(page), score: similarity(query, page) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.page);
  const candidates = [...new Set([...special, ...scored])].slice(0, 4);

  if (candidates.length === 1) {
    return { page: candidates[0], candidates, confidence: "MEDIUM", reason: "One strong existing-page candidate matched the query." };
  }
  if (candidates.length > 1) {
    return { page: "", candidates, confidence: "LOW", reason: "Multiple plausible pages exist; map the query before editing content." };
  }
  return { page: "", candidates: [], confidence: "LOW", reason: "No reliable existing-page mapping was found." };
}

function evidenceStrength(impressions, previousImpressions = 0) {
  const current = n(impressions);
  const previous = n(previousImpressions);
  if (current >= 30) return "HIGH";
  if (current >= 10) return "MEDIUM";
  if (current >= 5) return previous >= 50 ? "MEDIUM" : "LOW";
  return "LOW";
}

function confidenceRank(value) {
  return value === "HIGH" ? 3 : value === "MEDIUM" ? 2 : 1;
}

function mergeConfidence(a, b) {
  return confidenceRank(a) <= confidenceRank(b) ? a : b;
}

function actionFromOpportunity(item, mapping) {
  const current = item.current || {};
  const previous = item.previous || {};
  const evidence = evidenceStrength(current.impressions, previous.impressions);
  const mappedConfidence = mapping.page ? mapping.confidence : "LOW";
  const confidence = mergeConfidence(evidence, mappedConfidence);
  const position = n(current.position);
  const impressions = n(current.impressions);

  if (!mapping.page) {
    return {
      actionType: "QUERY_MAPPING",
      confidence: "LOW",
      risk: "LOW",
      directive: "Do not edit a page yet. Confirm which existing page Google should associate with this query.",
    };
  }

  if (impressions < 3) {
    return {
      actionType: "INTERNAL_LINKS_ONLY",
      confidence: "LOW",
      risk: "LOW",
      directive: "Treat this as a weak but useful signal. Add only highly relevant contextual internal links or a small intent clarification; do not rewrite the title/H1/page.",
    };
  }

  if (position > 0 && position <= 20) {
    return {
      actionType: "INTENT_REFINEMENT",
      confidence,
      risk: "LOW",
      directive: "Improve the opening task answer, one worked example, and contextual internal links. Preserve URL/canonical and avoid a broad rewrite.",
    };
  }

  if (position <= 40) {
    return {
      actionType: "CONTENT_EXPANSION",
      confidence,
      risk: "LOW",
      directive: "Expand the exact task coverage with one useful example and supporting links. Keep the page focused on its existing primary intent.",
    };
  }

  return {
    actionType: "CLUSTER_SUPPORT",
    confidence,
    risk: "LOW",
    directive: "Strengthen topical support and internal links first. Do not change URL/title/H1 based only on this ranking depth.",
  };
}

function actionFromRecovery(item) {
  const current = item.current || {};
  const previous = item.previous || {};
  const currentImpressions = n(current.impressions);
  const previousImpressions = n(previous.impressions);
  const evidence = evidenceStrength(currentImpressions, previousImpressions);
  const drop = n(item.changes?.impressionsPercent);
  const positionDelta = n(item.changes?.position);

  let confidence = evidence;
  if (previousImpressions >= 100 && currentImpressions >= 10) confidence = "HIGH";
  else if (previousImpressions >= 50 && currentImpressions >= 5) confidence = "MEDIUM";

  const technicalFirst = currentImpressions === 0 && previousImpressions >= 20;
  return {
    actionType: technicalFirst ? "TECHNICAL_VERIFY" : "RECOVERY_AUDIT",
    confidence,
    risk: "MEDIUM",
    directive: technicalFirst
      ? "Verify indexing, canonical, robots, fetchability, internal links, and whether the page still matches the queries that previously triggered impressions. Do not remove it only because impressions reached zero."
      : `Audit query fit, recent page changes, internal-link support, and usefulness. Visibility changed ${pct(drop)} and average position changed ${positionDelta.toFixed(1)} places. Preserve URL/canonical while investigating.`,
  };
}

function actionFromTopic(item) {
  const current = item.current || {};
  const previous = item.previous || {};
  const confidence = evidenceStrength(current.impressions, previous.impressions);
  return {
    actionType: "TOPIC_AUTHORITY_BUILD",
    confidence,
    risk: "LOW",
    directive: "Google is still testing this topic. Strengthen the cluster with focused internal links, clearer task answers, and supporting examples; avoid creating thin keyword-variant pages.",
  };
}

function itemKey(item) {
  return `${item.actionType}\u001f${item.page || item.subject || item.query || ""}`;
}

function candidateScore(item) {
  const confidenceBonus = item.confidence === "HIGH" ? 18 : item.confidence === "MEDIUM" ? 9 : 0;
  const actionBonus = {
    RECOVERY_AUDIT: 20,
    TECHNICAL_VERIFY: 18,
    INTENT_REFINEMENT: 16,
    CONTENT_EXPANSION: 12,
    TOPIC_AUTHORITY_BUILD: 10,
    CLUSTER_SUPPORT: 6,
    INTERNAL_LINKS_ONLY: 2,
    QUERY_MAPPING: 0,
  }[item.actionType] || 0;
  return n(item.baseScore) + confidenceBonus + actionBonus;
}

function chooseWeeklyFocus(items, protectClusters, maxClusters = 2) {
  const actionable = items
    .filter((item) => !["QUERY_MAPPING", "INTERNAL_LINKS_ONLY", "PROTECT"].includes(item.actionType))
    .filter((item) => !protectClusters.has(item.cluster))
    .map((item) => ({ ...item, finalScore: candidateScore(item) }))
    .sort((a, b) => b.finalScore - a.finalScore);

  const clusterMap = new Map();
  for (const item of actionable) {
    const existing = clusterMap.get(item.cluster);
    if (!existing) clusterMap.set(item.cluster, { cluster: item.cluster, items: [item], score: item.finalScore });
    else {
      existing.items.push(item);
      existing.score = Math.max(existing.score, item.finalScore) + Math.min(12, existing.items.length * 2);
    }
  }

  // Prefer one recovery-oriented cluster and one authority/growth cluster when evidence exists.
  const clusters = [...clusterMap.values()].sort((a, b) => b.score - a.score);
  const chosen = [];
  const recovery = clusters.find((c) => c.items.some((i) => i.actionType === "RECOVERY_AUDIT") && c.items.some((i) => i.confidence !== "LOW"));
  if (recovery) chosen.push(recovery);
  const growth = clusters.find((c) => !chosen.includes(c) && c.items.some((i) => ["TOPIC_AUTHORITY_BUILD", "INTENT_REFINEMENT", "CONTENT_EXPANSION"].includes(i.actionType)) && c.items.some((i) => i.confidence !== "LOW"));
  if (growth) chosen.push(growth);
  for (const cluster of clusters) {
    if (chosen.length >= maxClusters) break;
    if (!chosen.includes(cluster)) chosen.push(cluster);
  }

  return chosen.slice(0, maxClusters).map((cluster) => ({
    cluster: cluster.cluster,
    score: Math.round(cluster.score * 10) / 10,
    lead: cluster.items[0],
    supporting: cluster.items.slice(1, 4),
  }));
}

export function buildAnalystPlan(data, { maxWeeklyClusters = 2 } = {}) {
  const window = data?.windows?.manual || data?.windows?.["28d"] || Object.values(data?.windows || {})[0];
  if (!window?.analysis) throw new Error("latest-data.json does not contain a monitor analysis block.");
  const analysis = window.analysis;
  const currentPages = window.current?.pages || [];
  const previousPages = window.previous?.pages || [];
  const inventory = [...new Set([...currentPages, ...previousPages].map((row) => row.page).filter(Boolean))];
  const items = [];

  for (const item of [...(analysis.quickWins || []), ...(analysis.emerging || [])]) {
    const mapping = inferMapping(item.query, item.page, inventory);
    const action = actionFromOpportunity(item, mapping);
    const page = mapping.page || "";
    items.push({
      source: item.category || "OPPORTUNITY",
      subject: item.query,
      query: item.query,
      page,
      candidates: mapping.candidates,
      mappingConfidence: mapping.confidence,
      mappingReason: mapping.reason,
      cluster: clusterFor(`${item.query} ${page}`),
      baseScore: n(item.score),
      current: item.current,
      previous: item.previous,
      changes: item.changes,
      ...action,
    });
  }

  for (const item of analysis.recoveryCandidates || []) {
    const action = actionFromRecovery(item);
    items.push({
      source: "RECOVERY",
      subject: pathOnly(item.page),
      page: pathOnly(item.page),
      candidates: [pathOnly(item.page)],
      mappingConfidence: "HIGH",
      cluster: clusterFor(item.page),
      baseScore: n(item.recoveryScore),
      current: item.current,
      previous: item.previous,
      changes: item.changes,
      ...action,
    });
  }

  for (const item of analysis.deadTests || []) {
    const action = actionFromRecovery(item);
    items.push({
      source: "DEAD_TEST",
      subject: pathOnly(item.page),
      page: pathOnly(item.page),
      candidates: [pathOnly(item.page)],
      mappingConfidence: "HIGH",
      cluster: clusterFor(item.page),
      baseScore: 60,
      current: item.current,
      previous: item.previous,
      changes: item.changes,
      ...action,
    });
  }

  for (const item of analysis.topicSignals || []) {
    const action = actionFromTopic(item);
    items.push({
      source: "TOPIC_SIGNAL",
      subject: pathOnly(item.page),
      page: pathOnly(item.page),
      candidates: [pathOnly(item.page)],
      mappingConfidence: "HIGH",
      cluster: clusterFor(item.page),
      baseScore: Math.min(80, 35 + Math.log10(n(item.current?.impressions) + 1) * 20),
      current: item.current,
      previous: item.previous,
      changes: item.changes,
      ...action,
    });
  }

  const protect = (analysis.protect || []).map((item) => ({
    source: "PROTECT",
    subject: pathOnly(item.page),
    page: pathOnly(item.page),
    cluster: clusterFor(item.page),
    actionType: "PROTECT",
    confidence: "HIGH",
    risk: "HIGH",
    directive: item.reason,
    baseScore: 0,
  }));

  const protectClusters = new Set(protect.map((item) => item.cluster));
  const deduped = [];
  const seen = new Set();
  for (const item of [...items, ...protect]) {
    const key = itemKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  const weeklyFocus = chooseWeeklyFocus(deduped, protectClusters, maxWeeklyClusters);
  const unresolved = deduped.filter((item) => item.actionType === "QUERY_MAPPING");
  const weakSignals = deduped.filter((item) => item.confidence === "LOW" && item.actionType !== "PROTECT");

  return {
    generatedAt: new Date().toISOString(),
    sourceGeneratedAt: data.generatedAt || null,
    sourceMode: data.mode || null,
    comparison: window.label || data.periodInfo?.currentLabel || "unknown",
    policy: {
      mode: "advisory-only",
      maxWeeklyClusters,
      productionEdits: false,
      automaticGitPush: false,
      automaticDeploy: false,
      titleH1UrlCanonicalChanges: "blocked unless separately approved with stronger query evidence",
    },
    summary: {
      analyzedItems: deduped.length,
      weeklyFocusClusters: weeklyFocus.length,
      unresolvedMappings: unresolved.length,
      weakSignals: weakSignals.length,
      protectedPages: protect.length,
    },
    weeklyFocus,
    queue: deduped
      .filter((item) => item.actionType !== "PROTECT")
      .map((item) => ({ ...item, status: "PROPOSED", finalScore: candidateScore(item) }))
      .sort((a, b) => b.finalScore - a.finalScore),
    protect,
    unresolvedMappings: unresolved,
  };
}

export function markdownPlan(plan) {
  const out = [];
  out.push("# SolveGrid SEO Analyst — Phase 2\n");
  out.push(`Generated: ${plan.generatedAt}`);
  out.push(`Monitor source: ${plan.comparison}`);
  out.push("\nMode: **advisory only**. This agent does not edit production files, push Git, or deploy.\n");

  out.push("## Executive decision\n");
  out.push(`- Weekly focus clusters: **${plan.summary.weeklyFocusClusters}**`);
  out.push(`- Unresolved query mappings: **${plan.summary.unresolvedMappings}**`);
  out.push(`- Weak/low-sample signals: **${plan.summary.weakSignals}**`);
  out.push(`- Protected pages: **${plan.summary.protectedPages}**`);
  out.push("- Low-sample rankings (especially 1–2 impressions) are treated as signals, not proof.\n");

  out.push("## Recommended focus for this week\n");
  if (!plan.weeklyFocus.length) out.push("_No cluster has enough evidence for an implementation focus._\n");
  for (const [index, focus] of plan.weeklyFocus.entries()) {
    const lead = focus.lead;
    out.push(`### ${index + 1}. ${focus.cluster}`);
    out.push(`- Lead action: **${lead.actionType}** — ${lead.page || lead.subject}`);
    out.push(`- Confidence: **${lead.confidence}** | Risk: **${lead.risk}** | Score: ${focus.score}`);
    out.push(`- Why: ${lead.directive}`);
    if (lead.current) out.push(`- Current signal: ${n(lead.current.impressions)} impressions, position ${n(lead.current.position).toFixed(1)}, CTR ${(n(lead.current.ctr) * 100).toFixed(1)}%.`);
    if (lead.previous) out.push(`- Previous signal: ${n(lead.previous.impressions)} impressions, position ${n(lead.previous.position).toFixed(1)}.`);
    if (focus.supporting.length) {
      out.push("- Supporting evidence:");
      for (const item of focus.supporting) out.push(`  - ${item.actionType}: ${item.page || item.subject} (${item.confidence} confidence)`);
    }
    out.push("");
  }

  out.push("## Query mappings that must be confirmed before editing\n");
  if (!plan.unresolvedMappings.length) out.push("_None._\n");
  for (const item of plan.unresolvedMappings) {
    out.push(`- **${item.query}** → ${item.candidates.length ? item.candidates.join(", ") : "no reliable candidate"}. ${item.mappingReason}`);
  }
  out.push("");

  out.push("## Protected pages\n");
  if (!plan.protect.length) out.push("_None._\n");
  for (const item of plan.protect) out.push(`- ${item.page}: ${item.directive}`);
  out.push("");

  out.push("## Change rules\n");
  out.push("1. Never change URL, canonical, title, or H1 from a 1–2 impression signal alone.");
  out.push("2. Prefer contextual internal links, task-intent clarification, and one useful worked example before broad rewrites.");
  out.push("3. Work on at most two clusters per week.");
  out.push("4. Re-run the 28-day monitor after changes and compare against the next stable period.");
  out.push("5. Any future implementation agent must create a branch/PR, run `npm run check`, and wait for human approval.\n");

  return `${out.join("\n")}\n`;
}
