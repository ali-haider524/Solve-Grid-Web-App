import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import AnovaCalculator from "./AnovaCalculator";

export const metadata = createToolMetadata("one-way-anova-calculator");

export default function OneWayAnovaPage() {
  return (
    <>
      <ToolSchema slug="one-way-anova-calculator" />
      <AnovaCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="One-way ANOVA formulas, assumptions, post hoc tests, and APA reporting"
        sections={[
          {
            heading: "When to use a one-way ANOVA",
            paragraphs: [
              "Use it to compare the means of three or more independent groups on one numeric outcome, for example exam scores under lecture, blended, and flipped teaching. With only two groups, use a t-test (the results are equivalent: F = t²). If the same people are measured in every condition, use a repeated-measures ANOVA instead.",
            ],
          },
          {
            heading: "Formula",
            formula: "F = MS_between ÷ MS_within,   MS_between = Σ nᵢ(x̄ᵢ − x̄)² ÷ (k − 1),   MS_within = Σ Σ (x − x̄ᵢ)² ÷ (N − k)",
            paragraphs: [
              "k is the number of groups and N the total sample size. A large F means the group means differ more than you would expect from the variation inside the groups. The p value comes from the F distribution with (k − 1, N − k) degrees of freedom.",
            ],
          },
          {
            heading: "Effect size: eta squared and omega squared",
            formula: "η² = SS_between ÷ SS_total,   ω² = (SS_between − (k − 1)·MS_within) ÷ (SS_total + MS_within)",
            paragraphs: [
              "Cohen's (1988) benchmarks for η² are .01 small, .06 medium, and .14 large. ω² is less biased in small samples, so some journals prefer it. For a one-way design, partial η² equals η².",
            ],
          },
          {
            heading: "Tukey HSD post hoc test",
            formula: "q = |x̄ᵢ − x̄ⱼ| ÷ √[(MS_within ÷ 2)(1/nᵢ + 1/nⱼ)]",
            paragraphs: [
              "A significant F only tells you that at least one mean differs. Tukey's honestly significant difference test compares every pair while keeping the familywise error rate at 5%. p values come from the studentized range distribution; with unequal group sizes this is the Tukey-Kramer method, the same as SPSS's \"Tukey\" option.",
            ],
          },
          {
            heading: "Assumptions to check",
            list: [
              "Independent observations: each participant belongs to one group only",
              "Roughly normal scores within each group (check with the Shapiro-Wilk test or Q-Q plots); ANOVA is fairly robust with 20+ per group",
              "Equal variances (homogeneity): check Levene's test. If p < .05, report Welch's ANOVA and use Games-Howell post hoc tests",
              "Ordinal outcome or strong skew: use the Kruskal-Wallis test with Dunn post hoc tests",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A one-way ANOVA showed a significant effect of teaching method on exam scores, F(2, 21) = 38.85, p < .001, η² = .79. Tukey HSD tests indicated that the flipped group (M = 83.11, SD = 2.93) scored higher than the blended group (M = 76.71, SD = 2.56), p = .001, which scored higher than the lecture group (M = 70.50, SD = 3.25), p = .002.”",
            ],
          },
          {
            heading: "References",
            list: [
              "Fisher, R. A. (1925). Statistical methods for research workers. Oliver and Boyd.",
              "Tukey, J. W. (1949). Comparing individual means in the analysis of variance. Biometrics, 5(2), 99–114.",
              "Kramer, C. Y. (1956). Extension of multiple range tests to group means with unequal numbers of replications. Biometrics, 12(3), 307–310.",
              "Welch, B. L. (1951). On the comparison of several mean values: An alternative approach. Biometrika, 38(3–4), 330–336.",
              "Brown, M. B., & Forsythe, A. B. (1974). Robust tests for the equality of variances. Journal of the American Statistical Association, 69(346), 364–367.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="one-way-anova-calculator" />
      <SiteFooter />
    </>
  );
}
