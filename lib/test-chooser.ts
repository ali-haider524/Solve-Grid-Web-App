// Decision logic for the statistical test chooser. Pure functions so they can be unit tested.

export type Goal = "compare" | "relationship" | "association";
export type Outcome = "normal" | "ordinal" | "categorical";
export type Groups = "one" | "two" | "three-plus";
export type Design = "independent" | "paired";

export type Answers = {
  goal: Goal;
  outcome: Outcome;
  groups: Groups;
  design: Design;
};

export type Recommendation = {
  test: string;
  why: string;
  alternative?: string;
  assumptions: string[];
  report: string;
  toolHref?: string;
  toolLabel?: string;
};

const wil = { toolHref: "/wilcoxon-signed-rank-test-calculator", toolLabel: "Run it in the Wilcoxon Signed-Rank Calculator" };
const kw = { toolHref: "/kruskal-wallis-test-calculator", toolLabel: "Run it in the Kruskal-Wallis Calculator" };
const mw = { toolHref: "/mann-whitney-u-test-calculator", toolLabel: "Run it in the Mann-Whitney U Calculator" };
const chi = { toolHref: "/chi-square-calculator", toolLabel: "Run it in the Chi-Square Calculator" };
const tt = { toolHref: "/t-test-calculator", toolLabel: "Run it in the t-Test Calculator" };
const anova = { toolHref: "/one-way-anova-calculator", toolLabel: "Run it in the One-Way ANOVA Calculator" };
const corr = { toolHref: "/correlation-calculator", toolLabel: "Run it in the Correlation Calculator" };
const fr = { toolHref: "/friedman-test-calculator", toolLabel: "Run it in the Friedman Test Calculator" };
const mcn = { toolHref: "/mcnemar-test-calculator", toolLabel: "Run it in the McNemar Test Calculator" };
const advanced = { toolHref: "/advanced-statistics", toolLabel: "Run it in the Advanced Statistics Lab" };

export function chooseTest(a: Answers): Recommendation {
  if (a.goal === "association" || (a.goal === "compare" && a.outcome === "categorical")) {
    if (a.design === "paired") {
      return {
        test: "McNemar's test",
        why: "Both measurements are categorical (yes/no) and come from the same people, such as before and after.",
        assumptions: ["Two categories measured twice on the same participants", "Counts of discordant pairs are not tiny"],
        report: "A McNemar's test showed [a / no] significant change in [outcome] from [time 1] to [time 2], χ²(1) = X.XX, p = .XXX.",
        ...mcn,
      };
    }
    if (a.groups === "one") {
      return {
        test: "Chi-square goodness-of-fit test",
        why: "You are checking whether the counts in one categorical variable match expected proportions.",
        alternative: "Exact binomial test when there are only two categories and a small sample.",
        assumptions: ["Independent observations", "Expected count of at least 5 in each category"],
        report: "A chi-square goodness-of-fit test indicated that [variable] [did / did not] differ from the expected distribution, χ²(df, N = n) = X.XX, p = .XXX.",
        ...chi,
      };
    }
    return {
      test: "Chi-square test of independence",
      why: "You want to know whether two categorical variables are related, for example gender and preferred option.",
      alternative: "Fisher's exact test when any expected cell count is below 5 (common in small 2×2 tables).",
      assumptions: ["Independent observations: each person counted once", "Expected count of at least 5 in at least 80% of cells"],
      report: "A chi-square test of independence showed [a / no] significant association between [variable A] and [variable B], χ²(df, N = n) = X.XX, p = .XXX, Cramér's V = .XX.",
      ...chi,
    };
  }

  if (a.goal === "relationship") {
    if (a.outcome === "normal") {
      return {
        test: "Pearson correlation",
        why: "Both variables are numeric and roughly normally distributed, and you want the strength of a straight-line relationship.",
        alternative: "Spearman's rank correlation if either variable is skewed, ordinal, or has outliers. To predict Y from one or more variables, use linear regression.",
        assumptions: ["Both variables continuous", "Linear relationship (check a scatter plot)", "No extreme outliers", "Roughly normal distributions"],
        report: "There was a [positive / negative], [weak / moderate / strong] correlation between [X] and [Y], r(df) = .XX, p = .XXX.",
        ...corr,
      };
    }
    return {
      test: "Spearman's rank correlation",
      why: "At least one variable is ordinal (such as a Likert item) or not normally distributed.",
      alternative: "Kendall's tau for small samples or many tied ranks.",
      assumptions: ["Variables at least ordinal", "Monotonic relationship (consistently rising or falling)"],
      report: "A Spearman's rank correlation showed a [positive / negative] relationship between [X] and [Y], rₛ(df) = .XX, p = .XXX.",
      ...corr,
    };
  }

  // goal === "compare" with numeric or ordinal outcome
  if (a.groups === "one") {
    return a.outcome === "normal"
      ? {
          test: "One-sample t-test",
          why: "You are comparing one group's mean with a known or hypothesised value.",
          alternative: "One-sample Wilcoxon signed-rank test if the data are skewed or ordinal.",
          assumptions: ["Continuous outcome", "Independent observations", "Roughly normal distribution"],
          report: "A one-sample t-test showed that the mean [outcome] (M = X.XX, SD = X.XX) was [significantly / not significantly] different from [value], t(df) = X.XX, p = .XXX.",
          ...tt,
        }
      : {
          test: "One-sample Wilcoxon signed-rank test",
          why: "You are comparing one group with a reference value, but the outcome is ordinal or not normal.",
          assumptions: ["Outcome at least ordinal", "Independent observations", "Roughly symmetric differences from the reference value"],
          report: "A one-sample Wilcoxon signed-rank test indicated that the median [outcome] was [significantly / not significantly] different from [value], z = X.XX, p = .XXX.",
        };
  }

  if (a.groups === "two") {
    if (a.design === "paired") {
      return a.outcome === "normal"
        ? {
            test: "Paired-samples t-test",
            why: "The same participants were measured twice (for example pre-test and post-test) on a numeric outcome.",
            alternative: "Wilcoxon signed-rank test if the differences are clearly non-normal.",
            assumptions: ["Paired measurements on the same participants", "Differences roughly normal", "No extreme outliers in the differences"],
            report: "A paired-samples t-test showed that [outcome] was [significantly / not significantly] higher at [time 2] (M = X.XX, SD = X.XX) than at [time 1] (M = X.XX, SD = X.XX), t(df) = X.XX, p = .XXX, d = X.XX.",
            ...tt,
          }
        : {
            test: "Wilcoxon signed-rank test",
            why: "The same participants were measured twice, and the outcome is ordinal or not normal.",
            assumptions: ["Paired measurements", "Outcome at least ordinal", "Differences roughly symmetric"],
            report: "A Wilcoxon signed-rank test indicated that [outcome] was [significantly / not significantly] higher at [time 2] (Mdn = X) than at [time 1] (Mdn = X), z = X.XX, p = .XXX.",
            ...wil,
          };
    }
    return a.outcome === "normal"
      ? {
          test: "Independent-samples t-test (Welch)",
          why: "You are comparing the means of two separate groups on a numeric outcome. Welch's version does not assume equal variances, which makes it the safer default.",
          alternative: "Mann-Whitney U test if the outcome is skewed, ordinal, or the groups are very small.",
          assumptions: ["Two independent groups", "Continuous outcome", "Roughly normal within each group"],
          report: "A Welch's t-test showed that [group A] (M = X.XX, SD = X.XX) scored [significantly / not significantly] higher than [group B] (M = X.XX, SD = X.XX), t(df) = X.XX, p = .XXX, d = X.XX.",
          ...tt,
        }
      : {
          test: "Mann-Whitney U test",
          why: "You are comparing two separate groups, but the outcome is ordinal (such as a Likert item) or not normally distributed.",
          assumptions: ["Two independent groups", "Outcome at least ordinal", "Similar distribution shapes if you want to compare medians"],
          report: "A Mann-Whitney U test indicated that [outcome] was [significantly / not significantly] higher for [group A] (Mdn = X) than for [group B] (Mdn = X), U = X, p = .XXX.",
          ...mw,
        };
  }

  // three or more groups
  if (a.design === "paired") {
    return a.outcome === "normal"
      ? {
          test: "Repeated-measures ANOVA",
          why: "The same participants were measured three or more times on a numeric outcome.",
          alternative: "Friedman test if the data are ordinal or clearly non-normal.",
          assumptions: ["Same participants in every condition", "Roughly normal residuals", "Sphericity (check Mauchly's test; use Greenhouse-Geisser if violated)"],
          report: "A repeated-measures ANOVA showed a [significant / non-significant] effect of [time / condition] on [outcome], F(df1, df2) = X.XX, p = .XXX, partial η² = .XX.",
        }
      : {
          test: "Friedman test",
          why: "The same participants were measured three or more times, and the outcome is ordinal or not normal.",
          assumptions: ["Same participants in every condition", "Outcome at least ordinal"],
          report: "A Friedman test indicated a [significant / non-significant] difference in [outcome] across [conditions], χ²(df) = X.XX, p = .XXX.",
          ...fr,
        };
  }
  return a.outcome === "normal"
    ? {
        test: "One-way ANOVA",
        why: "You are comparing the means of three or more separate groups on a numeric outcome.",
        alternative: "Kruskal-Wallis test if the outcome is ordinal or not normal; Welch's ANOVA if group variances differ a lot.",
        assumptions: ["Independent groups", "Roughly normal within each group", "Similar variances (Levene's test)"],
        report: "A one-way ANOVA showed a [significant / non-significant] difference in [outcome] between groups, F(df1, df2) = X.XX, p = .XXX, η² = .XX. [Follow with Tukey post-hoc comparisons if significant.]",
        ...anova,
      }
    : {
        test: "Kruskal-Wallis H test",
        why: "You are comparing three or more separate groups, and the outcome is ordinal or not normal.",
        assumptions: ["Independent groups", "Outcome at least ordinal", "Similar distribution shapes if you want to compare medians"],
        report: "A Kruskal-Wallis H test showed a [significant / non-significant] difference in [outcome] between groups, H(df) = X.XX, p = .XXX. [Follow with Dunn's pairwise tests if significant.]",
        ...kw,
      };
}
