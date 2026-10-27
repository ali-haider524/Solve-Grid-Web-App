import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import ShapiroWilkCalculator from "./ShapiroWilkCalculator";

export const metadata = createToolMetadata("shapiro-wilk-test-calculator");

export default function ShapiroWilkPage() {
  return (
    <>
      <ToolSchema slug="shapiro-wilk-test-calculator" />
      <ShapiroWilkCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Shapiro-Wilk test: interpretation, limits, and what to do next"
        sections={[
          {
            heading: "How to interpret the result",
            list: [
              "p ≥ .05 → no significant departure from normality; parametric tests are reasonable",
              "p < .05 → the data differ significantly from a normal distribution",
              "W close to 1 means the data are close to normal; lower W means a bigger departure",
            ],
          },
          {
            heading: "Formula",
            formula: "W = (Σ aᵢ x₍ᵢ₎)² ÷ Σ (xᵢ − x̄)²",
            paragraphs: [
              "x₍ᵢ₎ are the sorted values and aᵢ are weights derived from expected normal order statistics. SolveGrid uses Royston's (1995) algorithm, the same one used by SPSS, R, and SciPy.",
            ],
          },
          {
            heading: "My normality assumption is violated. What now?",
            list: [
              "Two independent groups → Mann-Whitney U test instead of the t-test",
              "Same people twice → Wilcoxon signed-rank test instead of the paired t-test",
              "Three or more groups → Kruskal-Wallis instead of one-way ANOVA",
              "Large samples (30+ per group) with mild skew → t-tests and ANOVA are usually robust",
              "Right-skewed data → a log or square-root transformation may help",
            ],
          },
          {
            heading: "Test the right thing",
            paragraphs: [
              "For a t-test or ANOVA, check normality within each group separately, not on all the data pooled. For a paired t-test, check the differences. For regression, check the residuals.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A Shapiro-Wilk test showed that exam scores were not normally distributed, W(11) = .79, p = .007; therefore a Mann-Whitney U test was used.” Report W with n, the p value, and what you did as a result.",
            ],
          },
          {
            heading: "References",
            list: [
              "Shapiro, S. S., & Wilk, M. B. (1965). An analysis of variance test for normality (complete samples). Biometrika, 52(3–4), 591–611.",
              "Royston, P. (1995). Remark AS R94: A remark on algorithm AS 181. Applied Statistics, 44(4), 547–551.",
              "Ghasemi, A., & Zahediasl, S. (2012). Normality tests for statistical analysis: A guide for non-statisticians. International Journal of Endocrinology and Metabolism, 10(2), 486–489.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="shapiro-wilk-test-calculator" />
      <SiteFooter />
    </>
  );
}
