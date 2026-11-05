import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FactorAnalysisCalculator from "./FactorAnalysisCalculator";

export const metadata = createToolMetadata("factor-analysis-calculator");

export default function FactorAnalysisPage() {
  return (
    <>
      <ToolSchema slug="factor-analysis-calculator" />
      <main id="main-content">
        <FactorAnalysisCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Exploratory factor analysis: KMO, extraction, rotation, and reporting"
          sections={[
            {
              heading: "What is exploratory factor analysis?",
              paragraphs: [
                "Exploratory factor analysis (EFA) looks for a small number of underlying factors that explain the correlations between many questionnaire items. Items that load on the same factor are taken to measure the same construct. Researchers use it to check a new scale's structure before computing Cronbach's alpha for each factor."
              ]
            },
            {
              heading: "Step 1: check the data are suitable",
              list: [
                "KMO (Kaiser-Meyer-Olkin) of .60 or more; .80 or more is good",
                "Bartlett's test of sphericity significant (p < .05)",
                "Item-level KMO above .50; consider dropping items below that",
                "About 5–10 respondents per item, and ideally at least 100–200 in total"
              ]
            },
            {
              heading: "Step 2: extract and rotate",
              formula: "R − Ψ ≈ ΛΛᵀ   (principal axis factoring, iterated communalities)",
              paragraphs: [
                "Principal axis factoring finds loadings Λ that reproduce the item correlations R after removing each item's unique variance Ψ. Varimax rotation then simplifies the loadings so each item loads mainly on one factor, while keeping the factors uncorrelated."
              ]
            },
            {
              heading: "Worked example: six questionnaire items",
              paragraphs: [
                "50 respondents answered six 5-point items (the sample data)."
              ],
              steps: [
                "KMO = .64 (mediocre but acceptable); Bartlett's χ²(15) = 63.18, p < .001.",
                "Two eigenvalues exceed 1 (2.19 and 1.65), so two factors are retained.",
                "After varimax rotation, Q1–Q3 load on factor 1 (.71 to .79) and Q4–Q5 on factor 2 (.55 to .91).",
                "Q6 loads only .37 on factor 2, below the .40 cut-off, so it is a candidate for removal.",
                "The two factors explain 49.4% of the variance."
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“An exploratory factor analysis using principal axis factoring with varimax rotation was conducted on the six items (N = 50). The KMO measure was .64 and Bartlett's test was significant, χ²(15) = 63.18, p < .001. Two factors with eigenvalues above 1 were retained, explaining 49.4% of the variance.” Include the rotated loading table in your appendix or results."
              ]
            },
            {
              heading: "References",
              list: [
                "Costello, A. B., & Osborne, J. (2005). Best practices in exploratory factor analysis. Practical Assessment, Research, and Evaluation, 10, Article 7.",
                "Kaiser, H. F. (1974). An index of factorial simplicity. Psychometrika, 39(1), 31–36.",
                "Kaiser, H. F. (1958). The varimax criterion for analytic rotation in factor analysis. Psychometrika, 23(3), 187–200.",
                "Bartlett, M. S. (1950). Tests of significance in factor analysis. British Journal of Statistical Psychology, 3(2), 77–85."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="factor-analysis-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
