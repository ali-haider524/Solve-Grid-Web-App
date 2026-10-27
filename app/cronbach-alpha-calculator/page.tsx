import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import CronbachAlphaCalculator from "./CronbachAlphaCalculator";

export const metadata = createToolMetadata("cronbach-alpha-calculator");

export default function CronbachAlphaCalculatorPage() {
  return (
    <>
      <ToolSchema slug="cronbach-alpha-calculator" />
      <CronbachAlphaCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Cronbach's alpha formula, interpretation, and reporting"
        sections={[
          {
            heading: "Formula",
            formula: "α = (k ÷ (k − 1)) × (1 − Σσ²ᵢ ÷ σ²ₜ)",
            paragraphs: [
              "k is the number of items, σ²ᵢ is the variance of each item, and σ²ₜ is the variance of respondents' total scores. Sample variances (n − 1) are used, matching SPSS, jamovi, and R's psych package.",
            ],
          },
          {
            heading: "Interpretation (George & Mallery)",
            list: [
              "α ≥ 0.90 — Excellent",
              "0.80 ≤ α < 0.90 — Good",
              "0.70 ≤ α < 0.80 — Acceptable",
              "0.60 ≤ α < 0.70 — Questionable",
              "0.50 ≤ α < 0.60 — Poor",
              "α < 0.50 — Unacceptable",
            ],
          },
          {
            heading: "Reverse-coded items",
            paragraphs: [
              "Negatively worded statements must be flipped before computing alpha. On a 1–5 scale the reversed score is 6 − x; in general it is (min + max) − x.",
              "If alpha is unexpectedly low or negative, look for an item with a negative item-total correlation: it is almost always an item that still needs reverse coding.",
            ],
          },
          {
            heading: "How to report Cronbach's alpha (APA style)",
            paragraphs: [
              "Example: “The 10-item engagement scale showed good internal consistency (Cronbach's α = .84, N = 212).” APA style drops the leading zero for values that cannot exceed 1.",
              "Report alpha separately for each subscale, not only for the full questionnaire, and mention any items removed and why.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="cronbach-alpha-calculator" />
      <SiteFooter />
    </>
  );
}
