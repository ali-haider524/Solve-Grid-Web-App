import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Which Statistical Test Should I Use? (With Table)",
  description:
    "Pick the right test by question and data type: t-test, ANOVA, chi-square, Mann-Whitney, Wilcoxon, Kruskal-Wallis, Pearson, or Spearman, with a decision table.",
  alternates: { canonical: "/guides/choose-a-statistical-test" },
};

export default function ChooseStatisticalTestGuide() {
  return (
    <GuideArticle
      eyebrow="RESEARCH STATISTICS GUIDE"
      title="Which statistical test should I use?"
      slug="choose-a-statistical-test"
      description="The right test depends on three things: what you want to find out, what type of outcome variable you have, and whether your groups contain different people or the same people measured more than once."
      formula="Question type + outcome type + number of groups + paired or independent → test"
      example="A student compares exam scores (numeric, roughly normal) between two separate classes. That is two independent groups with a numeric outcome, so the test is an independent-samples t-test. If the scores were heavily skewed, the Mann-Whitney U test would be used instead."
      steps={[
        {
          title: "Write your research question as a comparison or a relationship",
          body: "\"Do online and in-person students score differently?\" is a comparison of groups. \"Is study time related to exam score?\" is a relationship between two variables. \"Is gender associated with preferred learning mode?\" is an association between two categorical variables.",
        },
        {
          title: "Identify the type of your outcome variable",
          body: "Numeric and roughly normal (test scores, heights, summed scale totals); ordinal or skewed (single Likert items, ranks, income); or categorical (yes/no, chosen option). This decides between parametric tests, non-parametric tests, and chi-square tests.",
        },
        {
          title: "Count the groups or time points",
          body: "One group compared with a reference value, two groups, or three or more. Two groups lead to t-tests or Mann-Whitney; three or more lead to ANOVA or Kruskal-Wallis.",
        },
        {
          title: "Decide whether the measurements are paired",
          body: "If the same participants are measured twice (pre-test and post-test), the data are paired and need a paired t-test, Wilcoxon signed-rank test, or McNemar's test. Different people in each group are independent.",
        },
        {
          title: "Check the assumptions before you run it",
          body: "Look at a histogram or run a Shapiro-Wilk test for normality, check for outliers, and confirm expected counts of at least 5 for chi-square. If an assumption fails, switch to the non-parametric alternative.",
        },
        {
          title: "Report the test, statistic, degrees of freedom, p value, and effect size",
          body: "For example: t(48) = 2.31, p = .025, d = 0.65. APA style also expects means and standard deviations (or medians for non-parametric tests).",
        },
      ]}
      reference={{
        title: "Statistical test decision table",
        description: "Parametric test first; the non-parametric alternative is used when the outcome is ordinal or not normally distributed.",
        columns: ["Research situation", "Parametric test", "Non-parametric / categorical alternative"],
        rows: [
          { first: "Two independent groups", second: "Independent t-test (Welch)", third: "Mann-Whitney U" },
          { first: "Same people measured twice", second: "Paired t-test", third: "Wilcoxon signed-rank" },
          { first: "Three or more independent groups", second: "One-way ANOVA", third: "Kruskal-Wallis H" },
          { first: "Same people, three or more times", second: "Repeated-measures ANOVA", third: "Friedman test" },
          { first: "Relationship between two variables", second: "Pearson correlation", third: "Spearman's rank correlation" },
          { first: "Two categorical variables", second: "—", third: "Chi-square test of independence (Fisher's exact if small)" },
          { first: "Yes/no measured twice", second: "—", third: "McNemar's test" },
          { first: "One sample vs a known value", second: "One-sample t-test", third: "One-sample Wilcoxon signed-rank" },
        ],
      }}
      faqs={[
        {
          question: "Should I use an ANOVA or a t-test?",
          answer:
            "Use a t-test for exactly two groups and a one-way ANOVA for three or more. Running several t-tests instead of one ANOVA raises the chance of a false positive: with three groups, three t-tests at α = .05 give about a 14% familywise error rate.",
        },
        {
          question: "Should I use ANOVA or chi-square?",
          answer:
            "Use ANOVA when the outcome is a number, such as a score or time. Use chi-square when the outcome is a category, such as pass/fail or which option was chosen.",
        },
        {
          question: "Which statistical test is used for Likert scale data?",
          answer:
            "For single Likert items, use non-parametric tests: Mann-Whitney U for two groups or Kruskal-Wallis for three or more. For scale scores made by summing or averaging several items, t-tests and ANOVA are widely accepted if the scores are roughly normal.",
        },
        {
          question: "What are the 5 basic statistical analyses?",
          answer:
            "Most theses use descriptive statistics (mean, SD, frequencies), comparison of groups (t-test or ANOVA), relationships (correlation), association between categories (chi-square), and prediction (regression).",
        },
        {
          question: "What if my data are not normally distributed?",
          answer:
            "Use the non-parametric alternative in the table above. With large samples (roughly 30+ per group), t-tests and ANOVA are fairly robust to mild non-normality, but strong skew or outliers still call for a non-parametric test.",
        },
      ]}
      toolLinks={[
        {
          label: "Statistical Test Chooser",
          href: "/statistical-test-chooser",
          description: "Answer four questions and get the recommended test, assumptions, and an APA report sentence.",
        },
        {
          label: "t-Test Calculator",
          href: "/t-test-calculator",
          description: "Independent, paired, and one-sample t-tests with confidence intervals, Cohen's d, and APA text.",
        },
        {
          label: "Chi-Square Calculator",
          href: "/chi-square-calculator",
          description: "Run a chi-square test of independence or goodness of fit with Cramér's V and Fisher's exact test.",
        },
        {
          label: "Mann-Whitney U Calculator",
          href: "/mann-whitney-u-test-calculator",
          description: "Compare two independent groups on ordinal or skewed data with exact p values and effect size.",
        },
        {
          label: "Wilcoxon & Kruskal-Wallis Calculators",
          href: "/kruskal-wallis-test-calculator",
          description: "Non-parametric tests for paired data (Wilcoxon) and three or more groups (Kruskal-Wallis, with Dunn post hoc).",
        },
        {
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check whether your data are normal before choosing a parametric or non-parametric test.",
        },
        {
          label: "Advanced Statistics Lab",
          href: "/advanced-statistics",
          description: "Run Welch t-tests, one-way ANOVA, and Pearson correlation with p values.",
        },
        {
          label: "Statistics Calculator",
          href: "/statistics-calculator",
          description: "Get descriptive statistics, standard deviation, quartiles, and frequency tables first.",
        },
      ]}
    />
  );
}
