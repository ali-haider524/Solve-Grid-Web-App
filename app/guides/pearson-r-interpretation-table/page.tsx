import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Pearson r Interpretation Table (Strength, Examples, APA)",
  "Interpret a Pearson correlation coefficient with a strength table, direction, significance and r², plus a worked example and an APA write-up for your thesis.",
  "/guides/pearson-r-interpretation-table",
);

export default function PearsonInterpretationGuide() {
  return (
    <GuideArticle
      eyebrow="RESEARCH STATISTICS GUIDE"
      title="Pearson r interpretation table: how strong is your correlation?"
      description="Pearson's r runs from −1 to +1. Its sign gives the direction of the relationship and its size gives the strength. Use the table below to put a verbal label on r, then check the p value before you call the relationship significant."
      slug="pearson-r-interpretation-table"
      formula="r = Σ(x − x̄)(y − ȳ) ÷ √[Σ(x − x̄)² × Σ(y − ȳ)²],   df = n − 2"
      example="15 students' study hours and exam scores give r = .79, p < .001. The relationship is positive, very strong by the table below, and statistically significant; r² = .63 means hours explain about 63% of the variation in scores."
      steps={[
        {
          title: "Read the direction from the sign",
          body: "A positive r means both variables rise together. A negative r means one rises as the other falls. The sign says nothing about strength: r = −.60 is as strong as r = +.60.",
        },
        {
          title: "Read the strength from the size",
          body: "Ignore the sign and match the absolute value of r to the strength table. State which table you used, because thesis panels and fields differ.",
        },
        {
          title: "Check statistical significance",
          body: "Test r with t = r√(n − 2) ÷ √(1 − r²) on n − 2 degrees of freedom. If p < .05 the correlation is statistically significant. A strong r in a tiny sample can still be non-significant.",
        },
        {
          title: "Report shared variance",
          body: "Square r to get r², the share of variation the two variables have in common. r = .50 means only 25% shared variance, which is why moderate correlations are often less impressive than they sound.",
        },
        {
          title: "Avoid causal wording",
          body: "Write “is related to” or “is associated with”, not “causes” or “affects”. Correlation alone does not show which variable influences the other, or whether a third variable drives both.",
        },
        {
          title: "Write it up",
          body: "“There was a very strong, positive, statistically significant correlation between study hours and exam scores, r(13) = .79, p < .001.” Drop the leading zero for r and p in APA style.",
        },
      ]}
      reference={{
        title: "Pearson r interpretation table",
        description: "Use the absolute value of r. SolveGrid's calculators use the labels in the middle column; Cohen's (1988) small / medium / large benchmarks are shown for comparison.",
        columns: ["Absolute value of r", "Strength", "Cohen (1988)"],
        rows: [
          { first: ".00 – .09", second: "Negligible", third: "—" },
          { first: ".10 – .29", second: "Weak", third: "Small (≈ .10)" },
          { first: ".30 – .49", second: "Moderate", third: "Medium (≈ .30)" },
          { first: ".50 – .69", second: "Strong", third: "Large (≥ .50)" },
          { first: ".70 – 1.00", second: "Very strong", third: "Large" },
        ],
      }}
      faqs={[
        {
          question: "Is r = 0.75 a strong correlation?",
          answer: "Yes. An r of .75 is a very strong positive correlation on most tables (.70 and above). It means r² = .56, so the two variables share about 56% of their variance.",
        },
        {
          question: "Is a Pearson correlation of 0.3 significant?",
          answer: "It depends on the sample size, not on r alone. With 30 participants, r = .30 gives p ≈ .11 (not significant); with 100 participants, p ≈ .002 (significant). Always report the p value next to r.",
        },
        {
          question: "What is a strong Pearson correlation?",
          answer: "Values of .50 or more (positive or negative) are usually called strong, and .70 or more very strong. By Cohen's benchmarks, .10 is small, .30 medium and .50 large.",
        },
        {
          question: "Is r = 0.4 a strong correlation?",
          answer: "It is usually described as moderate. It means about 16% shared variance (0.4² = .16). Whether that matters depends on your field: in social science research, .40 can be a meaningful relationship.",
        },
        {
          question: "What does a negative correlation mean?",
          answer: "As one variable increases, the other tends to decrease, for example more absences and lower grades. A negative r of −.65 is just as strong as +.65.",
        },
        {
          question: "Can a correlation be strong but not significant?",
          answer: "Yes. With very few participants, even a large r can have p > .05 because the estimate is uncertain. Report both the size of r and its p value.",
        },
        {
          question: "Should I use Pearson or Spearman?",
          answer: "Use Pearson for two numeric variables with a roughly linear relationship and no extreme outliers. Use Spearman's rho for ranks, single Likert items, or clearly skewed data. The same strength table works for both.",
        },
      ]}
      toolLinks={[
        {
          label: "Correlation Calculator",
          href: "/correlation-calculator",
          description: "Pearson, Spearman or Kendall with p value, 95% CI, r², a scatter plot and an APA sentence.",
        },
        {
          label: "How to Report a Correlation in APA",
          href: "/guides/how-to-report-correlation-apa",
          description: "Formats for single correlations and correlation tables, with examples.",
        },
        {
          label: "Linear Regression Calculator",
          href: "/linear-regression-calculator",
          description: "Go from a relationship to a prediction with simple or multiple regression.",
        },
      ]}
    />
  );
}
