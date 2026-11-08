import GuideArticle from "../../../components/GuideArticle";
import MethodNotes from "../../../components/MethodNotes";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Which Statistical Test Should I Use? Table & Flowchart",
  "Pick the right test by question and data type: t-test, ANOVA, chi-square, Mann-Whitney, Wilcoxon, Kruskal-Wallis, Pearson, or Spearman, with a decision table.",
  "/guides/choose-a-statistical-test",
);

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
          question: "How do I decide which statistical test to use?",
          answer:
            "Answer four questions in order: (1) Are you comparing groups, looking for a relationship, or testing an association between categories? (2) Is the outcome numeric, ordinal, or categorical? (3) How many groups or time points are there? (4) Are the measurements independent or paired? The decision table above maps each combination to a test, and the Statistical Test Chooser walks through the same questions interactively.",
        },
        {
          question: "Which test should I use for a pre-test and post-test?",
          answer:
            "If the same people take both tests and the score differences are roughly normal, use a paired t-test. If the differences are skewed or the outcome is ordinal, use the Wilcoxon signed-rank test. For a yes/no outcome measured before and after, use McNemar's test. With three or more time points, use repeated-measures ANOVA or the Friedman test.",
        },
        {
          question: "Should I use correlation or regression?",
          answer:
            "Use correlation to describe how strongly two variables move together (Pearson r or Spearman rho). Use regression when you want to predict an outcome from one or more predictors and report how much it changes per unit of each predictor (B, β and R²).",
        },
        {
          question: "What is the difference between parametric and non-parametric tests?",
          answer:
            "Parametric tests (t-test, ANOVA, Pearson) compare means and assume roughly normal data with similar spread. Non-parametric tests (Mann-Whitney, Wilcoxon, Kruskal-Wallis, Spearman) compare ranks, so they suit ordinal data, skewed data and small samples, at the cost of slightly less power when the data really are normal.",
        },
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
          label: "One-Way ANOVA Calculator",
          href: "/one-way-anova-calculator",
          description: "Paste 3+ groups to get the ANOVA table, η², Levene's test, Welch's ANOVA, Tukey HSD, and an APA sentence.",
        },
        {
          label: "Correlation Calculator",
          href: "/correlation-calculator",
          description: "Pearson r, Spearman rho, or Kendall tau with p value, 95% CI, scatter plot, and APA text.",
        },
        {
          label: "Linear Regression Calculator",
          href: "/linear-regression-calculator",
          description: "Simple and multiple regression with R², B, β, t, p, VIF, and an APA sentence.",
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
          label: "Wilcoxon Signed-Rank Calculator",
          href: "/wilcoxon-signed-rank-test-calculator",
          description: "Non-parametric test for paired data, such as pre-test and post-test scores.",
        },
        {
          label: "Kruskal-Wallis Calculator",
          href: "/kruskal-wallis-test-calculator",
          description: "Compare three or more independent groups on ordinal or skewed data, with Dunn post hoc tests.",
        },
        {
          label: "Friedman Test Calculator",
          href: "/friedman-test-calculator",
          description: "Repeated measures on ordinal data: the same people rated under three or more conditions.",
        },
        {
          label: "McNemar Test Calculator",
          href: "/mcnemar-test-calculator",
          description: "Paired yes/no outcomes, such as pass/fail before and after an intervention.",
        },
        {
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check whether your data are normal before choosing a parametric or non-parametric test.",
        },
        {
          label: "Two-Way ANOVA Calculator",
          href: "/two-way-anova-calculator",
          description: "Two grouping factors? Test both main effects and their interaction.",
        },
        {
          label: "Statistics Calculator",
          href: "/statistics-calculator",
          description: "Get descriptive statistics, standard deviation, quartiles, and frequency tables first.",
        },
      ]}
    >
      <MethodNotes
        eyebrow="FROM RESEARCH QUESTION TO TEST"
        title="Thesis research questions mapped to the right test, plus the mistakes panels catch"
        sections={[
          {
            heading: "Typical thesis research questions and the test for each",
            list: [
              "What is the profile of the respondents (sex, age, year level)? → frequency and percentage.",
              "What is the level of the respondents' perception or satisfaction? → weighted mean with a Likert interpretation scale (add the SD).",
              "Is there a significant difference in perception by sex (2 groups)? → independent t-test, or Mann-Whitney U for ordinal or skewed scores.",
              "Is there a significant difference by year level or age group (3+ groups)? → one-way ANOVA, or Kruskal-Wallis H.",
              "Is there a significant relationship between two scale scores (e.g. study habits and grades)? → Pearson r, or Spearman rho.",
              "Is a category (e.g. strand) associated with another category (e.g. preferred course)? → chi-square test of independence (Fisher's exact for small 2×2 tables).",
              "Did scores change from pre-test to post-test? → paired t-test, or Wilcoxon signed-rank.",
              "Which factors predict the outcome? → multiple linear regression (logistic regression for a yes/no outcome).",
            ],
          },
          {
            heading: "Five mistakes thesis panels often catch",
            list: [
              "Running several t-tests instead of one ANOVA for 3+ groups, which inflates the chance of a false positive (three t-tests at α = .05 give about a 14% chance of at least one false result).",
              "Using chi-square on means or on Likert averages. Chi-square needs counts in categories.",
              "Treating pre-test and post-test scores of the same students as two independent groups. The design is paired.",
              "Running Pearson r on a single Likert item. Use Spearman rho for single ordinal items; Pearson is defensible for composite scale scores.",
              "Reporting only p. Panels increasingly expect an effect size (d, η², r or Cramér's V) and the descriptive statistics behind it.",
            ],
          },
          {
            heading: "How many respondents each test needs",
            paragraphs: [
              "These are the minimum totals for 80% power at α = .05 (two-tailed) for a medium effect, the same numbers G*Power gives. Smaller expected effects need far larger samples; run your own numbers in the power analysis calculator.",
            ],
            list: [
              "Independent t-test (d = 0.5): 64 per group, 128 in total.",
              "One-way ANOVA with 3 groups (f = 0.25): about 53 per group, 159 in total.",
              "Pearson correlation (r = .30): 84 participants.",
              "Chi-square test, 2 × 2 table (w = 0.30): 88 participants.",
            ],
          },
          {
            heading: "Where to find each test in SPSS",
            list: [
              "Independent and paired t-tests: Analyze → Compare Means → Independent-Samples / Paired-Samples T Test.",
              "One-way ANOVA: Analyze → Compare Means → One-Way ANOVA (tick Post Hoc → Tukey).",
              "Pearson and Spearman: Analyze → Correlate → Bivariate.",
              "Chi-square: Analyze → Descriptive Statistics → Crosstabs → Statistics → Chi-square.",
              "Mann-Whitney U and Kruskal-Wallis: Analyze → Nonparametric Tests → Legacy Dialogs → 2 / K Independent Samples.",
            ],
          },
      ]}
      />
    </GuideArticle>
  );
}
