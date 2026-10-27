import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import TTestCalculator from "./TTestCalculator";

export const metadata = createToolMetadata("t-test-calculator");

export default function TTestPage() {
  return (
    <>
      <ToolSchema slug="t-test-calculator" />
      <TTestCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="t-test formulas, which version to use, and how to report it"
        sections={[
          {
            heading: "Which t-test should I use?",
            list: [
              "Independent-samples t-test: two separate groups of people (e.g. online vs in-person students)",
              "Paired-samples t-test: the same people measured twice (pre-test and post-test, before and after)",
              "One-sample t-test: one group's mean compared with a known or hypothesised value (e.g. a scale midpoint of 3)",
              "Outcome ordinal or clearly skewed? Use Mann-Whitney U (independent) or Wilcoxon signed-rank (paired) instead",
            ],
          },
          {
            heading: "Welch's t-test (default for two independent groups)",
            formula: "t = (M₁ − M₂) ÷ √(s₁²/n₁ + s₂²/n₂),   df = (s₁²/n₁ + s₂²/n₂)² ÷ [ (s₁²/n₁)²/(n₁−1) + (s₂²/n₂)²/(n₂−1) ]",
            paragraphs: [
              "Welch's version does not assume equal variances. Delacre, Lakens and Leys (2017) recommend it as the default because it performs as well as Student's t-test when variances are equal and much better when they are not. That is why the df is often a decimal, such as t(18.30).",
            ],
          },
          {
            heading: "Student's t-test (pooled variance)",
            formula: "sp = √{ [(n₁−1)s₁² + (n₂−1)s₂²] ÷ (n₁+n₂−2) },   t = (M₁ − M₂) ÷ (sp·√(1/n₁ + 1/n₂)),   df = n₁+n₂−2",
            paragraphs: [
              "This is the classic version SPSS shows in the \"Equal variances assumed\" row. Switch off Welch above to use it. The calculator also runs Levene's test (Brown-Forsythe, median-centred) so you can see whether the equal-variance assumption looks reasonable.",
            ],
          },
          {
            heading: "Paired and one-sample t-tests",
            formula: "t = M_d ÷ (s_d ÷ √n),   df = n − 1",
            paragraphs: [
              "For a paired test, M_d and s_d are the mean and SD of the differences (after − before). For a one-sample test, M_d is the sample mean minus the test value μ₀. Cohen's d is M_d ÷ s_d (often written d_z for paired data).",
            ],
          },
          {
            heading: "Assumptions to check",
            list: [
              "Continuous outcome (scores, times, summed scale totals)",
              "Independent observations (each person counted once per group)",
              "Roughly normal data in each group, or normal differences for paired data: check with the Shapiro-Wilk test or a Q-Q plot",
              "No extreme outliers; with about 30+ per group the t-test is fairly robust to mild non-normality",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“Students who used practice quizzes (M = 84.20, SD = 4.94) scored higher than students who did not (M = 75.82, SD = 4.49), t(18.30) = 4.05, p < .001, 95% CI [4.04, 12.72], d = 1.78.” Report means and SDs, t with df, the exact p value (p < .001 when very small), the confidence interval, and an effect size.",
            ],
          },
          {
            heading: "References",
            list: [
              "Student. (1908). The probable error of a mean. Biometrika, 6(1), 1–25.",
              "Welch, B. L. (1947). The generalization of 'Student's' problem when several different population variances are involved. Biometrika, 34(1–2), 28–35.",
              "Brown, M. B., & Forsythe, A. B. (1974). Robust tests for the equality of variances. Journal of the American Statistical Association, 69(346), 364–367.",
              "Delacre, M., Lakens, D., & Leys, C. (2017). Why psychologists should by default use Welch's t-test instead of Student's t-test. International Review of Social Psychology, 30(1), 92–101.",
              "Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="t-test-calculator" />
      <SiteFooter />
    </>
  );
}
