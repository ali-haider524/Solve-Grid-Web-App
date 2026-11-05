import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FleissKappaCalculator from "./FleissKappaCalculator";

export const metadata = createToolMetadata("fleiss-kappa-calculator");

export default function FleissKappaPage() {
  return (
    <>
      <ToolSchema slug="fleiss-kappa-calculator" />
      <main id="main-content">
        <FleissKappaCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Fleiss' kappa formula, worked example, and interpretation"
          sections={[
            {
              heading: "What is Fleiss' kappa?",
              paragraphs: [
                "Fleiss' kappa measures how much three or more raters agree when each classifies the same subjects into categories, after removing the agreement expected by chance. A value of 1 means perfect agreement and 0 means no more agreement than chance. It extends Cohen's kappa, which is limited to two raters."
              ]
            },
            {
              heading: "Formula",
              formula: "κ = (P̄ − P̄e) ÷ (1 − P̄e)",
              paragraphs: [
                "P̄ is the mean proportion of agreeing rater pairs per subject, and P̄e = Σpⱼ² is the agreement expected by chance from the overall category proportions pⱼ. The standard error under H₀ follows Fleiss, Nee and Landis (1979)."
              ]
            },
            {
              heading: "Worked example: 14 raters, 10 subjects",
              paragraphs: [
                "The sample data is the classic 10-subject, 14-rater, 5-category example used to illustrate Fleiss' kappa."
              ],
              steps: [
                "Mean observed agreement: P̄ = .378.",
                "Chance agreement from the category proportions: P̄e = .213.",
                "κ = (.378 − .213) ÷ (1 − .213) = .210.",
                "95% CI [.177, .243], z = 12.37, p < .001.",
                "Interpretation: fair agreement (Landis & Koch)."
              ]
            },
            {
              heading: "How to interpret kappa (Landis & Koch, 1977)",
              list: [
                "Below 0: poor (less than chance)",
                ".01 – .20: slight",
                ".21 – .40: fair",
                ".41 – .60: moderate",
                ".61 – .80: substantial",
                ".81 – 1.00: almost perfect"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“Agreement among the 14 raters was fair, Fleiss' κ = .21, 95% CI [.18, .24], p < .001.” Also report the number of subjects and categories, and kappa for any category with notably low agreement."
              ]
            },
            {
              heading: "References",
              list: [
                "Fleiss, J. L. (1971). Measuring nominal scale agreement among many raters. Psychological Bulletin, 76(5), 378–382.",
                "Fleiss, J. L., Nee, J. C. M., & Landis, J. R. (1979). Large sample variance of kappa in the case of different sets of raters. Psychological Bulletin, 86(5), 974–977.",
                "Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. Biometrics, 33(1), 159–174."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="fleiss-kappa-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
