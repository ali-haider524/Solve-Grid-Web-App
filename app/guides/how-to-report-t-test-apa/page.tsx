import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "How to Report a t-Test in APA Style (7th ed.)",
  description:
    "APA templates for independent, paired, and one-sample t-test results: t, df, p, Cohen's d, means and SDs, with worked examples and common mistakes.",
  alternates: { canonical: "/guides/how-to-report-t-test-apa" },
};

export default function ReportTTestGuide() {
  return (
    <GuideArticle
      eyebrow="APA REPORTING GUIDE"
      title="How to report a t-test in APA style"
      slug="how-to-report-t-test-apa"
      description="An APA t-test report states which t-test you ran, the means and standard deviations, t with its degrees of freedom, the exact p value, and an effect size such as Cohen's d."
      formula="t(df) = t value, p = .XXX, d = X.XX"
      example="An independent-samples t-test showed that students who used practice quizzes (M = 82.3, SD = 7.4) scored significantly higher than those who did not (M = 76.1, SD = 8.9), t(58) = 2.94, p = .005, d = 0.76."
      steps={[
        {
          title: "Say which t-test you used",
          body: "Independent-samples (two separate groups), paired-samples (same people twice), or one-sample (one group against a fixed value). For unequal variances, say Welch's t-test.",
        },
        {
          title: "Report the means and standard deviations",
          body: "Give M and SD for each group or time point so the direction of the difference is clear.",
        },
        {
          title: "Give t with its degrees of freedom",
          body: "Independent t-test: df = n₁ + n₂ − 2. Paired or one-sample: df = n − 1. Welch's t-test has a decimal df, such as t(41.7) = 2.35.",
        },
        {
          title: "Add the exact p value",
          body: "Write p = .005, not p < .05. Use p < .001 only for very small values, and drop the leading zero.",
        },
        {
          title: "Report an effect size",
          body: "Cohen's d: about 0.2 small, 0.5 medium, 0.8 large. A 95% confidence interval for the mean difference is also recommended by APA.",
        },
        {
          title: "Interpret in plain words",
          body: "Finish with a sentence that states what the result means for your research question, without overstating causation.",
        },
      ]}
      reference={{
        title: "APA t-test templates",
        description: "Replace the numbers with your own results.",
        columns: ["Test", "Template", "df rule"],
        rows: [
          { first: "Independent-samples t-test", second: "t(58) = 2.94, p = .005, d = 0.76", third: "n₁ + n₂ − 2" },
          { first: "Welch's t-test", second: "t(41.7) = 2.35, p = .024, d = 0.62", third: "Welch-Satterthwaite (decimal)" },
          { first: "Paired-samples t-test", second: "t(29) = 4.12, p < .001, d = 0.75", third: "n − 1 (pairs)" },
          { first: "One-sample t-test", second: "t(24) = −2.18, p = .039, d = 0.44", third: "n − 1" },
          { first: "Mann-Whitney U (non-parametric)", second: "U = 312, z = −2.41, p = .016, r = .31", third: "Report medians" },
          { first: "Wilcoxon signed-rank (non-parametric)", second: "z = −3.02, p = .003, r = .55", third: "Report medians" },
        ],
      }}
      faqs={[
        {
          question: "Do I report a negative t value?",
          answer:
            "Yes, report the sign your software gives, but make the direction clear in words. Many authors order the groups so the larger mean comes first and t is positive.",
        },
        {
          question: "Should I report a one-tailed or two-tailed p value?",
          answer:
            "Report two-tailed p values unless you pre-registered a directional hypothesis. If you use a one-tailed test, say so explicitly.",
        },
        {
          question: "How many decimal places should I use?",
          answer:
            "APA recommends two decimal places for t, d, M, and SD, and two or three for p values (three is common, for example p = .005).",
        },
        {
          question: "What if my data are not normal?",
          answer:
            "Check with a Shapiro-Wilk test. If normality is clearly violated in small samples, use the Mann-Whitney U test (independent) or the Wilcoxon signed-rank test (paired) and report medians.",
        },
      ]}
      toolLinks={[
        {
          label: "t-Test Calculator",
          href: "/t-test-calculator",
          description: "Run independent (Welch or Student), paired, and one-sample t-tests and copy the APA sentence.",
        },
        {
          label: "Advanced Statistics Lab",
          href: "/advanced-statistics",
          description: "Run one-sample and Welch t-tests with p values and confidence intervals.",
        },
        {
          label: "Effect Size Calculator",
          href: "/effect-size-calculator",
          description: "Get Cohen's d, Hedges' g, or partial eta squared from your means, SDs, t, or F value.",
        },
        {
          label: "Mann-Whitney U Calculator",
          href: "/mann-whitney-u-test-calculator",
          description: "The non-parametric alternative for two independent groups, with an APA sentence.",
        },
        {
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check normality before choosing between the t-test and Mann-Whitney.",
        },
      ]}
    />
  );
}
