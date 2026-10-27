function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function threshold(thresholds, name, fallback) {
  const value = Number(thresholds?.[name]);
  return Number.isFinite(value) ? value : fallback;
}

function gscRow(row, dimensions) {
  const output = Object.fromEntries(dimensions.map((name, index) => [name, row.keys?.[index] || ""]));
  return {
    ...output,
    clicks: number(row.clicks),
    impressions: number(row.impressions),
    ctr: number(row.ctr),
    position: number(row.position),
  };
}

export function normalizeRows(rows, dimensions) {
  return rows.map((row) => gscRow(row, dimensions));
}

function keyFor(row, dimensions) {
  return dimensions.map((dimension) => row[dimension] || "").join("\u001f");
}

export function compareRows(currentRows, previousRows, dimensions) {
  const previousMap = new Map(previousRows.map((row) => [keyFor(row, dimensions), row]));
  const currentMap = new Map(currentRows.map((row) => [keyFor(row, dimensions), row]));
  const keys = new Set([...currentMap.keys(), ...previousMap.keys()]);

  return [...keys].map((key) => {
    const current = currentMap.get(key) || Object.fromEntries(dimensions.map((d) => [d, previousMap.get(key)?.[d] || ""]));
    const previous = previousMap.get(key) || Object.fromEntries(dimensions.map((d) => [d, currentMap.get(key)?.[d] || ""]));
    const base = Object.fromEntries(dimensions.map((d) => [d, current[d] || previous[d] || ""]));
    return {
      ...base,
      current,
      previous,
      changes: {
        clicksPercent: pctChange(current.clicks || 0, previous.clicks || 0),
        impressionsPercent: pctChange(current.impressions || 0, previous.impressions || 0),
        position: (current.position || 0) - (previous.position || 0),
        ctrPoints: ((current.ctr || 0) - (previous.ctr || 0)) * 100,
      },
    };
  });
}

function actionFor(row, thresholds) {
  const position = row.current.position;
  const ctrPercent = row.current.ctr * 100;
  const lowCtrPercent = threshold(thresholds, "lowCtrPercent", 1);

  if (!position) return "Collect more data before changing the page.";
  if (position <= 10 && ctrPercent < lowCtrPercent) {
    return "Protect the content; test title/meta snippet and search-result relevance only.";
  }
  if (position <= 20) {
    return "Near page one: strengthen the opening answer, snippet alignment, worked example, and contextual internal links. Avoid a full rewrite.";
  }
  if (position <= 30) {
    return "Quick-win range: improve search-intent coverage, one strong worked example, and internal links from closely related pages.";
  }
  if (position <= 60) {
    return "Emerging opportunity: deepen task coverage, supporting guides, and topical internal links before considering title/H1 changes.";
  }
  return "Authority-building range: keep technically healthy, support with tightly related content, and reassess after more data.";
}

function normalizedPath(value) {
  if (!value) return "";
  try {
    return new URL(value, "https://solvegrid.local").pathname.replace(/\/+$/, "") || "/";
  } catch {
    const text = String(value).split(/[?#]/, 1)[0];
    return (`/${text}`).replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
  }
}

function isPriorityPage(page, priorityPages = []) {
  if (!page) return false;
  const target = normalizedPath(page);
  return priorityPages.some((candidate) => normalizedPath(candidate) === target);
}

function opportunityScore(row, thresholds, priorityPages = []) {
  const impressions = row.current.impressions;
  const position = row.current.position;
  if (!position || impressions <= 0) return 0;

  const quickWinMin = threshold(thresholds, "quickWinMinimumImpressions", 1);
  const emergingMin = threshold(thresholds, "emergingMinimumImpressions", 2);
  const regularMin = threshold(thresholds, "minimumOpportunityImpressions", 5);

  const eligible =
    (position >= 8 && position <= 30 && impressions >= quickWinMin) ||
    (position > 30 && position <= 60 && impressions >= emergingMin) ||
    impressions >= regularMin;

  if (!eligible) return 0;

  let positionScore = 18;
  if (position <= 10) positionScore = 100;
  else if (position <= 20) positionScore = 95;
  else if (position <= 30) positionScore = 88;
  else if (position <= 40) positionScore = 76;
  else if (position <= 60) positionScore = 58;
  else positionScore = 30;

  const impressionScore = Math.min(28, Math.log10(impressions + 1) * 13);
  const zeroClickBoost = row.current.clicks === 0 ? 4 : 0;
  const trendBoost = row.changes?.impressionsPercent > 0 ? Math.min(8, row.changes.impressionsPercent / 25) : 0;
  const priorityBoost = isPriorityPage(row.page, priorityPages) ? 8 : 0;
  const clickPenalty = row.current.clicks > 0 ? Math.min(8, row.current.clicks * 1.5) : 0;

  return Math.round(
    (positionScore + impressionScore + zeroClickBoost + trendBoost + priorityBoost - clickPenalty) * 10,
  ) / 10;
}

function hintedPage(query, queryPageHints = []) {
  const normalized = String(query || "").toLowerCase();
  for (const hint of queryPageHints) {
    const terms = Array.isArray(hint.contains) ? hint.contains : [];
    if (terms.some((term) => normalized.includes(String(term).toLowerCase()))) return hint.page || "";
  }
  return "";
}

function classifyOpportunity(row, thresholds) {
  const position = row.current.position;
  const impressions = row.current.impressions;
  const quickWinMin = threshold(thresholds, "quickWinMinimumImpressions", 1);
  const emergingMin = threshold(thresholds, "emergingMinimumImpressions", 2);
  const authorityMin = threshold(thresholds, "topicSignalMinimumImpressions", 10);

  if (position >= 8 && position <= 30 && impressions >= quickWinMin) return "QUICK_WIN";
  if (position > 30 && position <= 60 && impressions >= emergingMin) return "EMERGING";
  if (impressions >= authorityMin) return "TOPIC_SIGNAL";
  return "WATCH";
}

function recoveryScore(row, priorityPages = []) {
  const history = Math.min(55, Math.log10((row.previous.impressions || 0) + 1) * 23);
  const retained = Math.min(20, Math.log10((row.current.impressions || 0) + 1) * 12);
  const position = row.current.position || 100;
  const positionScore = position <= 20 ? 30 : position <= 40 ? 22 : position <= 60 ? 14 : 6;
  const priorityBoost = isPriorityPage(row.page, priorityPages) ? 10 : 0;
  return Math.round((history + retained + positionScore + priorityBoost) * 10) / 10;
}

function buildPriorityActions({ quickWins, emerging, recoveryCandidates, topicSignals, protect }) {
  const protectedPages = new Set((protect || []).map((item) => item.page));
  const actions = [];

  for (const item of quickWins.slice(0, 5)) {
    actions.push({
      type: "QUICK_WIN",
      subject: item.query,
      page: item.page || "",
      score: item.score,
      risk: "LOW",
      reason: `Position ${item.current.position.toFixed(1)} with ${Math.round(item.current.impressions)} current impressions.`,
      action: item.page
        ? item.recommendation
        : "Map this query to the best existing page first; then improve only that page's intent coverage and internal links.",
    });
  }

  for (const item of recoveryCandidates.slice(0, 6)) {
    if (protectedPages.has(item.page)) continue;
    actions.push({
      type: "RECOVERY",
      subject: item.page,
      page: item.page,
      score: item.recoveryScore,
      risk: "MEDIUM",
      reason: `${Math.round(item.previous.impressions)} → ${Math.round(item.current.impressions)} impressions (${Math.round(item.changes.impressionsPercent)}%).`,
      action: "Audit the page against the queries it previously ranked for, internal-link support, content usefulness, and recent changes. Do not change URL/canonical; avoid title/H1 changes until query evidence supports them.",
    });
  }

  for (const item of emerging.slice(0, 4)) {
    actions.push({
      type: "EMERGING",
      subject: item.query,
      page: item.page || "",
      score: item.score - 8,
      risk: "LOW",
      reason: `Position ${item.current.position.toFixed(1)} with ${Math.round(item.current.impressions)} current impressions.`,
      action: item.recommendation,
    });
  }

  for (const item of topicSignals.slice(0, 4)) {
    if (protectedPages.has(item.page)) continue;
    actions.push({
      type: "TOPIC_AUTHORITY",
      subject: item.page,
      page: item.page,
      score: Math.min(85, 35 + Math.log10(item.current.impressions + 1) * 20),
      risk: "LOW",
      reason: `${Math.round(item.current.impressions)} current impressions indicate Google still associates the site with this topic.`,
      action: "Strengthen the surrounding cluster with contextual internal links and one genuinely useful supporting asset; avoid unnecessary page-level rewrites.",
    });
  }

  const order = { QUICK_WIN: 4, RECOVERY: 3, EMERGING: 2, TOPIC_AUTHORITY: 1 };
  return actions
    .sort((a, b) => (order[b.type] - order[a.type]) || (b.score - a.score))
    .slice(0, 10);
}

export function analyzeComparison({
  queryPageComparison = [],
  queryComparison = [],
  pageComparison = [],
  thresholds = {},
  queryPageHints = [],
  priorityPages = [],
}) {
  const opportunitySource = queryPageComparison.length
    ? queryPageComparison
    : queryComparison.map((row) => ({ ...row, page: hintedPage(row.query, queryPageHints) }));

  const opportunities = opportunitySource
    .map((row) => {
      const score = opportunityScore(row, thresholds, priorityPages);
      return {
        ...row,
        score,
        category: classifyOpportunity(row, thresholds),
        priorityPage: isPriorityPage(row.page, priorityPages),
        recommendation: actionFor(row, thresholds),
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);

  const quickWins = opportunities.filter((row) => row.category === "QUICK_WIN").slice(0, 15);
  const emerging = opportunities.filter((row) => row.category === "EMERGING").slice(0, 15);
  const queryTopicSignals = opportunities.filter((row) => row.category === "TOPIC_SIGNAL").slice(0, 15);

  const minimumLossBaselineImpressions = threshold(thresholds, "minimumLossBaselineImpressions", 10);
  const impressionLossPercent = threshold(thresholds, "impressionLossPercent", 40);
  const minimumOpportunityImpressions = threshold(thresholds, "minimumOpportunityImpressions", 5);
  const impressionGainPercent = threshold(thresholds, "impressionGainPercent", 50);
  const protectGainPercent = threshold(thresholds, "protectGainPercent", 50);
  const recoveryBaseline = threshold(thresholds, "recoveryBaselineImpressions", 20);
  const recoveryLossPercent = threshold(thresholds, "recoveryLossPercent", 70);
  const topicSignalMinimumImpressions = threshold(thresholds, "topicSignalMinimumImpressions", 10);
  const deadTestBaseline = threshold(thresholds, "deadTestBaselineImpressions", 10);
  const cannibalizationMinimumImpressions = threshold(thresholds, "cannibalizationMinimumImpressions", 2);

  const losers = pageComparison
    .filter(
      (row) =>
        row.previous.impressions >= minimumLossBaselineImpressions &&
        row.changes.impressionsPercent <= -impressionLossPercent,
    )
    .sort((a, b) => a.changes.impressionsPercent - b.changes.impressionsPercent)
    .slice(0, 20);

  const gainers = pageComparison
    .filter(
      (row) =>
        row.current.impressions >= minimumOpportunityImpressions &&
        row.changes.impressionsPercent >= impressionGainPercent,
    )
    .sort((a, b) => b.changes.impressionsPercent - a.changes.impressionsPercent)
    .slice(0, 20);

  const protect = gainers
    .filter((row) => row.changes.impressionsPercent >= protectGainPercent)
    .map((row) => ({
      page: row.page,
      reason: `Impressions are up ${Math.round(row.changes.impressionsPercent)}%; avoid unnecessary title, H1, URL, or canonical changes.`,
    }));

  const recoveryCandidates = pageComparison
    .filter(
      (row) =>
        row.previous.impressions >= recoveryBaseline &&
        row.current.impressions > 0 &&
        row.changes.impressionsPercent <= -recoveryLossPercent,
    )
    .map((row) => ({
      ...row,
      recoveryScore: recoveryScore(row, priorityPages),
      priorityPage: isPriorityPage(row.page, priorityPages),
    }))
    .sort((a, b) => b.recoveryScore - a.recoveryScore)
    .slice(0, 20);

  const deadTests = pageComparison
    .filter(
      (row) =>
        row.previous.impressions >= deadTestBaseline &&
        row.current.impressions === 0,
    )
    .sort((a, b) => b.previous.impressions - a.previous.impressions)
    .slice(0, 20);

  const protectedPages = new Set(protect.map((item) => item.page));
  const topicSignals = pageComparison
    .filter(
      (row) =>
        row.current.impressions >= topicSignalMinimumImpressions &&
        !protectedPages.has(row.page),
    )
    .sort((a, b) => b.current.impressions - a.current.impressions)
    .slice(0, 20);

  const queryPages = new Map();
  for (const row of queryPageComparison) {
    if (row.current.impressions < cannibalizationMinimumImpressions) continue;
    if (!queryPages.has(row.query)) queryPages.set(row.query, []);
    queryPages.get(row.query).push(row);
  }

  const cannibalization = [...queryPages.entries()]
    .filter(([, rows]) => new Set(rows.map((row) => row.page)).size > 1)
    .map(([query, rows]) => ({
      query,
      pages: rows
        .sort((a, b) => b.current.impressions - a.current.impressions)
        .slice(0, 4)
        .map((row) => ({
          page: row.page,
          impressions: row.current.impressions,
          position: row.current.position,
        })),
    }))
    .slice(0, 15);

  const priorityActions = buildPriorityActions({
    quickWins,
    emerging,
    recoveryCandidates,
    topicSignals,
    protect,
  });

  return {
    opportunities,
    quickWins,
    emerging,
    queryTopicSignals,
    losers,
    gainers,
    protect,
    recoveryCandidates,
    deadTests,
    topicSignals,
    priorityActions,
    cannibalization,
  };
}
