import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import ChiSquareCalculator from "./ChiSquareCalculator";

export const metadata = createToolMetadata("chi-square-calculator");

export default function ChiSquareCalculatorPage() {
  return (
    <>
      <ToolSchema slug="chi-square-calculator" />
      <ChiSquareCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Chi-square test: formula, solved example, and reporting"
        sections={[
          {
            heading: "Formula",
            formula: "χ² = Σ (O − E)² ÷ E,   E = (row total × column total) ÷ N,   df = (r − 1)(c − 1)",
            paragraphs: [
              "O is each observed count and E the count expected if the two variables were unrelated. A large χ² means the observed table is far from what independence predicts.",
            ],
          },
          {
            heading: "Solved example",
            paragraphs: [
              "100 students: 50 online and 50 in-person. 20 online and 30 in-person students passed. Every expected count is 25, so χ² = 4 × (5² ÷ 25) = 4.00 with df = 1, giving p = .046 and Cramér's V = .20: a small but significant association between study mode and passing.",
            ],
          },
          {
            heading: "What type of data is the chi-square test used for?",
            list: [
              "Two categorical variables (nominal or ordinal categories) counted per person",
              "Each participant appears in exactly one cell",
              "Counts, not percentages or means",
              "Expected count of at least 5 in at least 80% of cells; otherwise use Fisher's exact test (2 × 2) or merge categories",
            ],
          },
          {
            heading: "Interpreting Cramér's V",
            list: [
              "≈ .10 small association",
              "≈ .30 medium association",
              "≈ .50 or more large association",
              "For tables larger than 2 × 2, these thresholds shrink as the smaller dimension grows (Cohen, 1988).",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A chi-square test of independence showed a significant association between study mode and exam outcome, χ²(1, N = 100) = 4.00, p = .046, Cramér's V = .20.” Include N in the brackets and report the effect size.",
            ],
          },
          {
            heading: "References",
            list: [
              "Pearson, K. (1900). On the criterion that a given system of deviations from the probable… Philosophical Magazine, 50(302), 157–175.",
              "Cochran, W. G. (1954). Some methods for strengthening the common χ² tests. Biometrics, 10(4), 417–451.",
              "Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences (2nd ed.). Lawrence Erlbaum.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="chi-square-calculator" />
      <SiteFooter />
    </>
  );
}
