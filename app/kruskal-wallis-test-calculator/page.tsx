import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import KruskalWallisCalculator from "./KruskalWallisCalculator";

export const metadata = createToolMetadata("kruskal-wallis-test-calculator");

export default function KruskalWallisPage() {
  return (
    <>
      <ToolSchema slug="kruskal-wallis-test-calculator" />
      <KruskalWallisCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Kruskal-Wallis test: formula, post hoc tests, and reporting"
        sections={[
          {
            heading: "When to use it",
            list: [
              "Three or more independent groups (different people in each)",
              "Ordinal outcome (such as a Likert item) or skewed numeric data",
              "It is the non-parametric alternative to one-way ANOVA",
              "For the same people measured 3+ times, use the Friedman test",
            ],
          },
          {
            heading: "Formula",
            formula: "H = [12 ÷ (N(N+1))] × Σ (Rᵢ² ÷ nᵢ) − 3(N+1),   df = k − 1",
            paragraphs: [
              "Rᵢ is the rank sum of group i after ranking all values together. With ties, H is divided by 1 − Σ(t³ − t) ÷ (N³ − N). H is compared with a chi-square distribution.",
            ],
          },
          {
            heading: "Post hoc: Dunn's test",
            paragraphs: [
              "A significant H says at least one group differs, not which. Dunn's test compares every pair of mean ranks; with three groups there are three comparisons, so Bonferroni multiplies each p by 3.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A Kruskal-Wallis H test showed a statistically significant difference in engagement between teaching methods, H(2) = 14.58, p < .001, ε² = .73. Dunn's post hoc tests with Bonferroni correction showed that the flipped group scored higher than the lecture group (p < .001).” Report medians for each group.",
            ],
          },
          {
            heading: "References",
            list: [
              "Kruskal, W. H., & Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis. Journal of the American Statistical Association, 47(260), 583–621.",
              "Dunn, O. J. (1964). Multiple comparisons using rank sums. Technometrics, 6(3), 241–252.",
              "Tomczak, M., & Tomczak, E. (2014). The need to report effect size estimates revisited. Trends in Sport Sciences, 1(21), 19–25.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="kruskal-wallis-test-calculator" />
      <SiteFooter />
    </>
  );
}
