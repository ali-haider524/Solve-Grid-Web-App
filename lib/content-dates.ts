// Last real content change per path (no leading slash; "" = homepage).
// Update a path's date here whenever its main content changes, so crawlers see real freshness.
// Paths not listed fall back to SITE_BASELINE, the last site-wide content release before the statistics refocus.
export const SITE_BASELINE = "2026-07-30";

export const contentUpdated: Record<string, string> = {
  "": "2026-11-04",
  tools: "2026-10-28",
  guides: "2026-10-28",
  "research-statistics": "2026-10-28",
  about: "2026-10-28",
  "privacy-policy": "2026-10-28",
  "statistical-test-chooser": "2026-10-28",
  "sample-size-calculator": "2026-11-04",
  "cronbach-alpha-calculator": "2026-11-05",
  "likert-scale-calculator": "2026-11-04",
  "chi-square-calculator": "2026-11-04",
  "mann-whitney-u-test-calculator": "2026-10-28",
  "shapiro-wilk-test-calculator": "2026-10-28",
  "cohens-kappa-calculator": "2026-10-28",
  "effect-size-calculator": "2026-10-28",
  "wilcoxon-signed-rank-test-calculator": "2026-10-28",
  "kruskal-wallis-test-calculator": "2026-10-28",
  "intraclass-correlation-calculator": "2026-10-28",
  "sobel-test-calculator": "2026-10-28",
  "t-test-calculator": "2026-11-04",
  "one-way-anova-calculator": "2026-11-04",
  "correlation-calculator": "2026-11-04",
  "linear-regression-calculator": "2026-10-28",
  "friedman-test-calculator": "2026-10-28",
  "mcnemar-test-calculator": "2026-10-28",
  "power-analysis-calculator": "2026-11-04",
  "guides/how-to-report-chi-square-apa": "2026-10-28",
  "guides/how-to-report-regression-apa": "2026-10-28",
  "guides/how-to-report-correlation-apa": "2026-10-28",
  "statistics-calculator": "2026-11-04",
  "advanced-statistics": "2026-10-28",
  "guides/choose-a-statistical-test": "2026-11-03",
  "guides/slovin-formula-sample-size": "2026-11-03",
  "guides/likert-scale-interpretation": "2026-11-03",
  "guides/how-to-report-anova-apa": "2026-10-28",
  "guides/how-to-report-t-test-apa": "2026-10-28",
  "guides/standard-deviation-formula": "2026-11-03",
  "p-value-calculator": "2026-11-05",
  "confidence-interval-calculator": "2026-11-05",
  "margin-of-error-calculator": "2026-11-05",
  "fishers-exact-test-calculator": "2026-11-05",
  "two-way-anova-calculator": "2026-11-05",
  "repeated-measures-anova-calculator": "2026-11-05",
  "logistic-regression-calculator": "2026-11-05",
  "methodology": "2026-11-05",
  "validation": "2026-11-05",
};

export function lastUpdated(path: string): string {
  return contentUpdated[path] ?? SITE_BASELINE;
}
