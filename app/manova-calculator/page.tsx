import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import ManovaCalculator from "./ManovaCalculator";

export const metadata = createToolMetadata("manova-calculator");

export default function ManovaPage() {
  return (
    <>
      <ToolSchema slug="manova-calculator" />
      <main id="main-content">
        <ManovaCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="One-way MANOVA: statistics, assumptions, and APA reporting"
          sections={[
            {
              heading: "What is a MANOVA?",
              paragraphs: [
                "A multivariate analysis of variance (MANOVA) tests whether groups differ on two or more related dependent variables considered together. Instead of running a separate ANOVA for each outcome, it uses the correlations between the outcomes, which controls the overall Type I error rate and can detect differences that no single outcome shows."
              ]
            },
            {
              heading: "The four test statistics",
              formula: "Pillai V = Σ λᵢ/(1+λᵢ),  Wilks Λ = Π 1/(1+λᵢ),  Hotelling T = Σ λᵢ,  Roy θ = λ₁",
              paragraphs: [
                "λᵢ are the eigenvalues of E⁻¹H, where H is the between-groups and E the within-groups sums-of-squares-and-cross-products matrix. Each statistic is converted to an approximate F; Roy's F is an upper bound."
              ]
            },
            {
              heading: "Worked example: three groups, three scores",
              paragraphs: [
                "30 students in three groups with reading, writing and maths scores (the sample data)."
              ],
              steps: [
                "Pillai's V = .386, F(6, 52) = 2.07, p = .072, partial η² = .19.",
                "Wilks' Λ = .624, F(6, 50) = 2.22, p = .056.",
                "Roy's largest root is significant (p = .008), but it is the least conservative statistic.",
                "Reporting Pillai's trace, the groups do not differ significantly on the combined outcomes at α = .05.",
                "Follow-up ANOVAs should therefore be treated as exploratory."
              ]
            },
            {
              heading: "Assumptions to check",
              list: [
                "Independent observations",
                "At least as many participants per group as dependent variables",
                "Multivariate normality (check each outcome for outliers)",
                "Homogeneity of covariance matrices (Box's M; Pillai's trace is robust when group sizes are equal)",
                "Moderate, not extreme, correlations between the dependent variables"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“A one-way MANOVA showed no statistically significant difference between groups on the combined dependent variables, Pillai's V = .39, F(6, 52) = 2.07, p = .072, partial η² = .19.”"
              ]
            },
            {
              heading: "References",
              list: [
                "Tabachnick, B. G., & Fidell, L. S. (2019). Using multivariate statistics (7th ed.). Pearson.",
                "Olson, C. L. (1976). On choosing a test statistic in multivariate analysis of variance. Psychological Bulletin, 83(4), 579–586.",
                "Rao, C. R. (1951). An asymptotic expansion of the distribution of Wilks' criterion. Bulletin of the International Statistical Institute, 33(2), 177–180."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="manova-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
