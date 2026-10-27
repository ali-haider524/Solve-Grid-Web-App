import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import EffectSizeCalculator from "./EffectSizeCalculator";

export const metadata = createToolMetadata("effect-size-calculator");

export default function EffectSizePage() {
  return (
    <>
      <ToolSchema slug="effect-size-calculator" />
      <EffectSizeCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Effect size formulas, interpretation, and reporting"
        sections={[
          {
            heading: "Why report an effect size?",
            paragraphs: [
              "A p value only says whether a difference is likely to be real. The effect size says how big it is. APA 7 asks for an effect size with every main result, and supervisors and journals expect it.",
            ],
          },
          {
            heading: "Cohen's d and Hedges' g",
            formula: "d = (M₁ − M₂) ÷ SD_pooled,   SD_pooled = √[((n₁−1)s₁² + (n₂−1)s₂²) ÷ (n₁+n₂−2)],   g = d × (1 − 3 ÷ (4df − 1))",
            paragraphs: [
              "Example: M₁ = 82.3 (SD 7.4) and M₂ = 76.1 (SD 8.9), 30 per group. SD_pooled = 8.18, so d = 6.2 ÷ 8.18 = 0.76, a medium-to-large effect. Hedges' g (0.75) corrects the small upward bias of d in small samples.",
            ],
          },
          {
            heading: "Eta squared from ANOVA",
            formula: "partial η² = (F × df_effect) ÷ (F × df_effect + df_error)",
            paragraphs: [
              "From F(2, 57) = 6.42: η² = 12.84 ÷ 69.84 = .18, so the grouping explains about 18% of the variance, a large effect.",
            ],
          },
          {
            heading: "Which effect size goes with which test?",
            list: [
              "t-tests → Cohen's d (independent) or dz (paired); Hedges' g for small samples",
              "ANOVA → eta squared or partial eta squared",
              "Mann-Whitney U and Wilcoxon → r = z ÷ √N",
              "Correlation → r itself (r² for variance explained)",
              "Chi-square → Cramér's V (shown in the chi-square calculator)",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "Put the effect size after the p value: “t(58) = 2.94, p = .005, d = 0.76, 95% CI [0.23, 1.28].” For ANOVA: “F(2, 57) = 6.42, p = .003, partial η² = .18.” Drop the leading zero only for values that cannot exceed 1 (η², r), not for d.",
            ],
          },
          {
            heading: "References",
            list: [
              "Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences (2nd ed.). Lawrence Erlbaum.",
              "Hedges, L. V., & Olkin, I. (1985). Statistical Methods for Meta-Analysis. Academic Press.",
              "Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science. Frontiers in Psychology, 4, 863.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="effect-size-calculator" />
      <SiteFooter />
    </>
  );
}
