import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "How to Report a Correlation in APA Style",
  description:
    "APA templates for Pearson r, Spearman rho, and Kendall tau: degrees of freedom, p value, 95% CI, strength and direction, plus a correlation matrix table layout.",
  alternates: { canonical: "/guides/how-to-report-correlation-apa" },
};

export default function ReportCorrelationGuide() {
  return (
    <GuideArticle
      eyebrow="APA REPORTING GUIDE"
      title="How to report a correlation in APA style"
      slug="how-to-report-correlation-apa"
      description="An APA-style correlation report names the coefficient (Pearson r, Spearman rₛ, or Kendall τ), gives the degrees of freedom (N − 2) in brackets, the coefficient without a leading zero, the exact p value, and ideally a 95% confidence interval, along with the direction and strength of the relationship."
      formula="r(N − 2) = .XX, p = .XXX, 95% CI [.XX, .XX]"
      example="A Pearson correlation showed a strong positive relationship between weekly study hours and exam score, r(10) = .97, p < .001, 95% CI [.89, .99]. Students who studied more tended to score higher."
      steps={[
        {
          title: "Name the correlation you used",
          body: "Pearson's r for two numeric, roughly normal variables with a linear relationship; Spearman's rank-order correlation (rₛ) for ordinal or skewed data; Kendall's tau-b (τb) for small samples or many ties.",
        },
        {
          title: "Give the degrees of freedom",
          body: "For Pearson and Spearman, df = N − 2 and goes in brackets: r(48) for 50 participants. Some journals give N instead: r(N = 50). Kendall's tau is usually reported without df.",
        },
        {
          title: "Write the coefficient without a leading zero",
          body: "Because a correlation cannot be larger than 1, APA drops the zero: r = .45, not r = 0.45. Keep the minus sign for negative correlations: r = −.32.",
        },
        {
          title: "Report the exact p value and the confidence interval",
          body: "Use p = .012 rather than p < .05 (write p < .001 only when it is smaller than .001). Adding the 95% CI shows how precisely r was estimated.",
        },
        {
          title: "Describe direction and strength in words",
          body: "Say whether the relationship was positive or negative and weak, moderate, or strong. A common guide: .10 weak, .30 moderate, .50 strong (Cohen, 1988).",
        },
        {
          title: "Use a correlation matrix for several variables",
          body: "Put the variables in rows and numbered columns, show r values in the lower triangle, add means and SDs, and mark significance with asterisks explained in a table note.",
        },
      ]}
      reference={{
        title: "APA correlation templates",
        description: "Italicise r, p, N, and rₛ in your final document; Greek letters such as τ are not italicised.",
        columns: ["Situation", "Template", "Notes"],
        rows: [
          { first: "Pearson, significant", second: "r(48) = .45, p = .001, 95% CI [.20, .65]", third: "df = N − 2" },
          { first: "Pearson, negative", second: "r(48) = −.32, p = .023", third: "Keep the minus sign" },
          { first: "Pearson, non-significant", second: "r(48) = .12, p = .406", third: "Report the exact p" },
          { first: "Spearman", second: "rₛ(28) = .58, p < .001", third: "Use for Likert items or skewed data" },
          { first: "Kendall tau-b", second: "τb = .41, p = .002, N = 30", third: "Give N instead of df" },
          { first: "Several correlations", second: "rs ranged from .21 to .64, all ps < .05", third: "Point to the correlation matrix table" },
        ],
      }}
      faqs={[
        {
          question: "How do you write a Pearson correlation in APA format?",
          answer: "Write r(df) = .XX, p = .XXX, where df = N − 2. For example: r(28) = .52, p = .003, 95% CI [.20, .74].",
        },
        {
          question: "How do I report Spearman's correlation in APA?",
          answer:
            "Use rₛ (r with a subscript s) or ρ: \"There was a moderate positive correlation between satisfaction and loyalty, rₛ(58) = .41, p = .001.\"",
        },
        {
          question: "Is a correlation of .3 strong?",
          answer:
            "By Cohen's (1988) benchmarks, .30 is a moderate (medium) correlation. Around .10 is weak (small) and .50 or more is strong (large). In practice, interpret strength relative to similar studies in your field.",
        },
        {
          question: "Should I report r squared for a correlation?",
          answer:
            "It is optional but helpful. r² is the proportion of variance the two variables share: r = .50 means r² = .25, or 25% shared variance.",
        },
        {
          question: "Can I say one variable caused the other?",
          answer:
            "No. A correlation only shows that two variables are related. Use wording such as \"was associated with\" or \"was related to\", not \"caused\" or \"led to\".",
        },
      ]}
      toolLinks={[
        {
          label: "Correlation Calculator",
          href: "/correlation-calculator",
          description: "Get Pearson r, Spearman rho, or Kendall tau with df, p, 95% CI, a scatter plot, and this APA sentence.",
        },
        {
          label: "Linear Regression Calculator",
          href: "/linear-regression-calculator",
          description: "Go beyond correlation and predict one variable from one or more others.",
        },
        {
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check normality to decide between Pearson and Spearman.",
        },
        {
          label: "Statistical Test Chooser",
          href: "/statistical-test-chooser",
          description: "Confirm that a correlation is the right analysis for your research question.",
        },
      ]}
    />
  );
}
