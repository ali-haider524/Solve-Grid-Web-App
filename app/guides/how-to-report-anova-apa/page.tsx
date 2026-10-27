import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "How to Report ANOVA Results in APA Style (7th ed.)",
  description:
    "Copy-ready APA templates for reporting one-way ANOVA results in text and tables: F, degrees of freedom, p, eta squared, and post hoc tests, with a worked example.",
  alternates: { canonical: "/guides/how-to-report-anova-apa" },
};

export default function ReportAnovaGuide() {
  return (
    <GuideArticle
      eyebrow="APA REPORTING GUIDE"
      title="How to report ANOVA results in APA style"
      slug="how-to-report-anova-apa"
      description="An APA-style ANOVA report gives the F statistic with both degrees of freedom, the exact p value, an effect size, and the group means and standard deviations, followed by post hoc comparisons if the result is significant."
      formula="F(df between, df within) = F value, p = .XXX, η² = .XX"
      example="A one-way ANOVA showed a significant effect of teaching method on exam scores, F(2, 57) = 6.42, p = .003, η² = .18. Tukey post hoc tests indicated that the flipped-classroom group (M = 78.4, SD = 8.1) scored higher than the lecture group (M = 69.2, SD = 9.6), p = .002. The online group (M = 73.5, SD = 8.8) did not differ from either group (ps > .10)."
      steps={[
        {
          title: "Name the test and the variables",
          body: "Say which ANOVA you ran (one-way, two-way, repeated-measures), the independent variable (the groups), and the dependent variable (the outcome).",
        },
        {
          title: "Report F with both degrees of freedom",
          body: "Write F(between, within): between-groups df = k − 1 and within-groups df = N − k. With 3 groups and 60 participants that is F(2, 57).",
        },
        {
          title: "Give the exact p value",
          body: "Use p = .003 rather than p < .05. Only write p < .001 when the value is smaller than .001. Drop the leading zero because p cannot exceed 1.",
        },
        {
          title: "Add an effect size",
          body: "Report η² (eta squared) or partial η² for factorial designs. Rough guide: .01 small, .06 medium, .14 large (Cohen, 1988).",
        },
        {
          title: "Describe the groups",
          body: "Give the mean (M) and standard deviation (SD) for every group, in the text or in a table, so readers can see the direction of the difference.",
        },
        {
          title: "Follow a significant result with post hoc tests",
          body: "Name the post hoc test (Tukey HSD, Bonferroni, Games-Howell if variances are unequal) and report which pairs differ and their p values.",
        },
      ]}
      reference={{
        title: "APA ANOVA templates",
        description: "Replace the bracketed parts with your own values.",
        columns: ["Situation", "Template", "Notes"],
        rows: [
          { first: "Significant one-way ANOVA", second: "F(2, 57) = 6.42, p = .003, η² = .18", third: "Follow with post hoc tests" },
          { first: "Non-significant one-way ANOVA", second: "F(2, 57) = 1.12, p = .334, η² = .04", third: "Still report the effect size" },
          { first: "Welch's ANOVA (unequal variances)", second: "Welch's F(2, 35.6) = 5.10, p = .011", third: "Denominator df is usually non-integer" },
          { first: "Repeated-measures ANOVA", second: "F(2, 58) = 9.84, p < .001, partial η² = .25", third: "Mention a Greenhouse-Geisser correction if sphericity is violated" },
          { first: "Two-way ANOVA interaction", second: "F(1, 76) = 4.37, p = .040, partial η² = .05", third: "Report each main effect and the interaction" },
          { first: "Kruskal-Wallis (non-parametric)", second: "H(2) = 8.21, p = .016", third: "Report medians instead of means" },
        ],
      }}
      faqs={[
        {
          question: "Do I italicise F and p?",
          answer: "Yes. In APA 7, statistical symbols such as F, p, M, SD, and t are italicised. Greek letters such as η are not italicised.",
        },
        {
          question: "How do I report ANOVA results in a table?",
          answer:
            "Use one table with columns for the source (between groups, within groups, total), SS, df, MS, F, p, and η². Put the descriptive statistics (n, M, SD per group) in a separate table or an extra row above.",
        },
        {
          question: "Should I report F as F(2, 57) or F(2,57)?",
          answer: "APA uses a comma followed by a space between the two degrees of freedom: F(2, 57).",
        },
        {
          question: "What if the ANOVA is not significant?",
          answer:
            "Report it the same way with the exact p value and effect size, state that the groups did not differ significantly, and do not run post hoc tests.",
        },
      ]}
      toolLinks={[
        {
          label: "One-Way ANOVA Calculator",
          href: "/one-way-anova-calculator",
          description: "Paste 3+ groups to get the ANOVA table, η², Levene's test, Welch's ANOVA, Tukey HSD, and an APA sentence.",
        },
        {
          label: "Advanced Statistics Lab",
          href: "/advanced-statistics",
          description: "Run a one-way ANOVA and get F, degrees of freedom, and the p value.",
        },
        {
          label: "Effect Size Calculator",
          href: "/effect-size-calculator",
          description: "Get Cohen's d, Hedges' g, or partial eta squared from your means, SDs, t, or F value.",
        },
        {
          label: "Statistical Test Chooser",
          href: "/statistical-test-chooser",
          description: "Check that ANOVA is the right test, or find the non-parametric alternative.",
        },
        {
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check the normality assumption within each group before running the ANOVA.",
        },
      ]}
    />
  );
}
