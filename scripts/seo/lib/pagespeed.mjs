import { fetchJson } from "./http.mjs";

function score(category) {
  const value = category?.score;
  return typeof value === "number" ? Math.round(value * 100) : null;
}

function auditValue(audits, id) {
  const audit = audits?.[id];
  if (!audit) return null;
  return {
    score: typeof audit.score === "number" ? Math.round(audit.score * 100) : null,
    displayValue: audit.displayValue || null,
    numericValue: typeof audit.numericValue === "number" ? audit.numericValue : null,
  };
}

export async function runPageSpeed(url, strategy = "mobile", apiKey = "") {
  const params = new URLSearchParams({ url, strategy });
  for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
    params.append("category", category);
  }
  if (apiKey) params.set("key", apiKey);

  const response = await fetchJson(
    `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
    {},
    `PageSpeed ${strategy} ${url}`,
  );

  const lighthouse = response.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};

  return {
    url,
    strategy,
    fetchedAt: new Date().toISOString(),
    scores: {
      performance: score(categories.performance),
      accessibility: score(categories.accessibility),
      bestPractices: score(categories["best-practices"]),
      seo: score(categories.seo),
    },
    metrics: {
      lcp: auditValue(audits, "largest-contentful-paint"),
      cls: auditValue(audits, "cumulative-layout-shift"),
      inp: auditValue(audits, "interaction-to-next-paint"),
      tbt: auditValue(audits, "total-blocking-time"),
    },
  };
}
