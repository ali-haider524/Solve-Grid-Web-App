import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import IccCalculator from "./IccCalculator";

export const metadata = createToolMetadata("intraclass-correlation-calculator");

export default function IccPage() {
  return (
    <>
      <ToolSchema slug="intraclass-correlation-calculator" />
      <IccCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Intraclass correlation: which ICC to use, interpretation, and reporting"
        sections={[
          {
            heading: "Which ICC should I report?",
            list: [
              "Different raters rate each subject → ICC(1)",
              "Raters are a random sample and you need the same scores → ICC(2), absolute agreement",
              "These are the only raters you care about → ICC(3); choose consistency if only the ranking matters",
              "Use the ',1' single-rater form if one rater will be used in practice, the ',k' form if you will use the average",
              "Test-retest reliability → usually ICC(2,1) absolute agreement",
            ],
          },
          {
            heading: "Formulas (two-way ANOVA mean squares)",
            formula: "ICC(2,1) = (MSR − MSE) ÷ [MSR + (k−1)MSE + k(MSC − MSE)/n]   ICC(3,1) = (MSR − MSE) ÷ [MSR + (k−1)MSE]",
            paragraphs: [
              "MSR is the between-subjects mean square, MSC the between-raters mean square, MSE the residual, n the number of subjects and k the number of raters.",
            ],
          },
          {
            heading: "Worked example (Shrout & Fleiss, 1979)",
            paragraphs: [
              "Four judges rated six targets. ICC(3,1) = .71 (moderate) but ICC(2,1) = .29 (poor): the judges ranked targets similarly but used very different parts of the scale. That is why the choice between consistency and absolute agreement matters.",
            ],
          },
          {
            heading: "ICC, Cohen's kappa, or Cronbach's alpha?",
            list: [
              "Numeric ratings from two or more raters → ICC",
              "Category ratings from two raters → Cohen's kappa",
              "Internal consistency of questionnaire items → Cronbach's alpha (equivalent to ICC(3,k) consistency)",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“Inter-rater reliability was assessed with a two-way random-effects, absolute-agreement, single-rater ICC. Reliability was poor, ICC(2,1) = .29, 95% CI [.02, .76].” Koo and Li (2016) recommend naming the model, type, and unit, and reporting the 95% CI.",
            ],
          },
          {
            heading: "References",
            list: [
              "Shrout, P. E., & Fleiss, J. L. (1979). Intraclass correlations: Uses in assessing rater reliability. Psychological Bulletin, 86(2), 420–428.",
              "McGraw, K. O., & Wong, S. P. (1996). Forming inferences about some intraclass correlation coefficients. Psychological Methods, 1(1), 30–46.",
              "Koo, T. K., & Li, M. Y. (2016). A guideline of selecting and reporting intraclass correlation coefficients for reliability research. Journal of Chiropractic Medicine, 15(2), 155–163.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="intraclass-correlation-calculator" />
      <SiteFooter />
    </>
  );
}
