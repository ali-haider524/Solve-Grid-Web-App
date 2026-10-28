import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FriedmanCalculator from "./FriedmanCalculator";

export const metadata = createToolMetadata("friedman-test-calculator");

export default function FriedmanPage() {
  return (
    <>
      <ToolSchema slug="friedman-test-calculator" />
      <FriedmanCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Friedman test formula, effect size, post hoc tests, and APA reporting"
        sections={[
          {
            heading: "When to use the Friedman test",
            paragraphs: [
              "Use it when the same participants are measured under three or more conditions or time points and the outcome is ordinal (such as Likert ratings) or clearly not normal. It is the non-parametric alternative to a one-way repeated-measures ANOVA. With only two related measurements, use the Wilcoxon signed-rank test instead.",
            ],
          },
          {
            heading: "Formula",
            formula: "χ²F = [12 ÷ (n·k·(k + 1))] · ΣRⱼ² − 3n(k + 1),   df = k − 1",
            paragraphs: [
              "Each participant's scores are ranked across the k conditions (ties get average ranks), and Rⱼ is the sum of ranks for condition j over all n participants. The statistic is divided by a tie correction, 1 − Σ(t³ − t) ÷ (n(k³ − k)), and compared with a chi-square distribution.",
            ],
          },
          {
            heading: "Effect size: Kendall's W",
            formula: "W = χ²F ÷ (n(k − 1))",
            paragraphs: [
              "Kendall's coefficient of concordance runs from 0 (no consistent differences) to 1 (every participant ranks the conditions the same way). A common guide (Cohen-style benchmarks used by Tomczak & Tomczak, 2014) is .1 small, .3 moderate, and .5 large.",
            ],
          },
          {
            heading: "Post hoc comparisons",
            paragraphs: [
              "A significant Friedman test says that at least one condition differs. This calculator compares each pair of mean ranks with z = (R̄ᵢ − R̄ⱼ) ÷ √[k(k + 1) ÷ 6n] and a Bonferroni adjustment. An equally accepted approach is to run Wilcoxon signed-rank tests on each pair and apply the same correction.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A Friedman test showed a significant difference in confidence ratings across the three time points, χ²(2, N = 10) = 16.55, p < .001, W = .83. Bonferroni-adjusted pairwise comparisons showed that ratings at week 8 (Mdn = 4.5) were higher than at week 1 (Mdn = 3.0), p < .001.” Report medians, not means, for each condition.",
            ],
          },
          {
            heading: "References",
            list: [
              "Friedman, M. (1937). The use of ranks to avoid the assumption of normality implicit in the analysis of variance. Journal of the American Statistical Association, 32(200), 675–701.",
              "Kendall, M. G., & Babington Smith, B. (1939). The problem of m rankings. Annals of Mathematical Statistics, 10(3), 275–287.",
              "Demšar, J. (2006). Statistical comparisons of classifiers over multiple data sets. Journal of Machine Learning Research, 7, 1–30.",
              "Tomczak, M., & Tomczak, E. (2014). The need to report effect size estimates revisited. Trends in Sport Sciences, 1(21), 19–25.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="friedman-test-calculator" />
      <SiteFooter />
    </>
  );
}
