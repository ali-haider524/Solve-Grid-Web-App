import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import PowerAnalysisCalculator from "./PowerAnalysisCalculator";

export const metadata = createToolMetadata("power-analysis-calculator");

export default function PowerAnalysisPage() {
  return (
    <>
      <ToolSchema slug="power-analysis-calculator" />
      <PowerAnalysisCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Power analysis: what it is, how sample size is calculated, and how to report it"
        sections={[
          {
            heading: "What a power analysis tells you",
            paragraphs: [
              "Statistical power is the probability that your study detects an effect that really exists (1 − β). An a priori power analysis, run before data collection, finds the smallest sample that gives the power you want, usually 80%, for an expected effect size and significance level (α = .05). Supervisors and ethics committees ask for it to show that the study is neither underpowered nor wastefully large.",
            ],
          },
          {
            heading: "The four linked quantities",
            list: [
              "Effect size: how big a difference or relationship you expect (Cohen's d, f, r, or w)",
              "Alpha (α): the false-positive rate you accept, usually .05",
              "Power (1 − β): the chance of detecting the effect, usually .80 (.90 for confirmatory studies)",
              "Sample size (N): fix the other three and N follows; smaller effects need much larger samples",
            ],
          },
          {
            heading: "How it is calculated",
            formula: "t-test: δ = d·√(n/2) (independent) or d·√n (paired);   ANOVA: λ = f²·N;   chi-square: λ = w²·N;   correlation: z = atanh(r)·√(N − 3)",
            paragraphs: [
              "Power is the probability that the test statistic exceeds its critical value under the noncentral t, F, or chi-square distribution with the noncentrality above. The calculator searches for the smallest N that reaches the target power. Results match G*Power (Faul et al., 2007): d = 0.5, α = .05, power = .80 gives 64 per group; f = 0.25 with 3 groups gives N = 159; w = 0.3 with df = 1 gives N = 88.",
            ],
          },
          {
            heading: "Effect size benchmarks (Cohen, 1988)",
            list: [
              "Cohen's d (t-tests): 0.2 small, 0.5 medium, 0.8 large",
              "Cohen's f (ANOVA): 0.10 small, 0.25 medium, 0.40 large (f = √(η² ÷ (1 − η²)))",
              "Correlation r: 0.10 small, 0.30 medium, 0.50 large",
              "Cohen's w (chi-square): 0.10 small, 0.30 medium, 0.50 large",
              "Prefer an effect size from previous studies or a pilot; use the Effect Size Calculator to convert reported results",
            ],
          },
          {
            heading: "How to report it in your methodology",
            paragraphs: [
              "“An a priori power analysis was conducted to determine the required sample size. To detect a medium effect (d = 0.50) with 80% power at α = .05 (two-tailed), an independent-samples t-test requires 64 participants per group (N = 128). Allowing for 20% attrition, 160 participants will be recruited.” Always state the test, effect size and where it came from, α, power, and the resulting N.",
            ],
          },
          {
            heading: "References",
            list: [
              "Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum.",
              "Faul, F., Erdfelder, E., Lang, A.-G., & Buchner, A. (2007). G*Power 3: A flexible statistical power analysis program for the social, behavioral, and biomedical sciences. Behavior Research Methods, 39(2), 175–191.",
              "Lakens, D. (2022). Sample size justification. Collabra: Psychology, 8(1), 33267.",
              "Cohen, J. (1992). A power primer. Psychological Bulletin, 112(1), 155–159.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="power-analysis-calculator" />
      <SiteFooter />
    </>
  );
}
