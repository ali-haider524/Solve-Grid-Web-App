import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import CohensKappaCalculator from "./CohensKappaCalculator";

export const metadata = createToolMetadata("cohens-kappa-calculator");

export default function CohensKappaPage() {
  return (
    <>
      <ToolSchema slug="cohens-kappa-calculator" />
      <CohensKappaCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Cohen's kappa: formula, interpretation, and reporting"
        sections={[
          {
            heading: "Formula",
            formula: "κ = (pₒ − pₑ) ÷ (1 − pₑ)",
            paragraphs: [
              "pₒ is the proportion of items the raters agreed on (the diagonal) and pₑ is the agreement expected by chance from each rater's category totals. κ = 1 is perfect agreement; κ = 0 is no better than chance.",
            ],
          },
          {
            heading: "Worked example",
            paragraphs: [
              "Two coders rate 50 interview excerpts as relevant or not. They agree on 35 (pₒ = .70). Coder 1 marks 25 as relevant and coder 2 marks 30, so pₑ = .5 × .6 + .5 × .4 = .50. κ = (.70 − .50) ÷ (1 − .50) = .40: fair agreement.",
            ],
          },
          {
            heading: "Cohen's kappa interpretation (Landis & Koch, 1977)",
            list: [
              "< 0 — Poor (less than chance)",
              "0.01–0.20 — Slight",
              "0.21–0.40 — Fair",
              "0.41–0.60 — Moderate",
              "0.61–0.80 — Substantial",
              "0.81–1.00 — Almost perfect",
            ],
          },
          {
            heading: "Kappa, weighted kappa, or ICC?",
            list: [
              "Two raters, unordered categories → Cohen's kappa",
              "Two raters, ordered categories → weighted kappa (linear or quadratic)",
              "More than two raters, categories → Fleiss' kappa",
              "Numeric ratings or scores → intraclass correlation (ICC)",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“Two coders independently rated all 50 excerpts. Agreement was 70%, and Cohen's kappa indicated fair agreement, κ = .40, 95% CI [.15, .65], p = .004.” Report percent agreement, κ, the confidence interval, and the number of items.",
            ],
          },
          {
            heading: "References",
            list: [
              "Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37–46.",
              "Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. Biometrics, 33(1), 159–174.",
              "Fleiss, J. L., Cohen, J., & Everitt, B. S. (1969). Large sample standard errors of kappa and weighted kappa. Psychological Bulletin, 72(5), 323–327.",
              "McHugh, M. L. (2012). Interrater reliability: The kappa statistic. Biochemia Medica, 22(3), 276–282.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="cohens-kappa-calculator" />
      <SiteFooter />
    </>
  );
}
