import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import RepeatedMeasuresAnovaCalculator from "./RepeatedMeasuresAnovaCalculator";

export const metadata = createToolMetadata("repeated-measures-anova-calculator");

export default function RepeatedMeasuresAnovaPage() {
  return (
    <>
      <ToolSchema slug="repeated-measures-anova-calculator" />
      <main id="main-content">
        <RepeatedMeasuresAnovaCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Repeated measures ANOVA: formula, sphericity, and APA reporting"
          sections={[
            {
              heading: "What is a repeated measures ANOVA?",
              paragraphs: [
                "A repeated measures ANOVA tests whether the mean of a numeric outcome changes across three or more measurements on the same people, such as a pre-test, post-test and follow-up. Because each person acts as their own control, differences between people are removed from the error term, which makes the test more powerful."
              ]
            },
            {
              heading: "Formula",
              formula: "F = (SS conditions ÷ (k − 1)) ÷ (SS error ÷ ((k − 1)(n − 1)))",
              paragraphs: [
                "SS error is what remains after removing the variation between conditions and between participants. Partial η² = SS conditions ÷ (SS conditions + SS error)."
              ]
            },
            {
              heading: "Sphericity and corrections",
              paragraphs: [
                "Sphericity means the variances of the differences between all pairs of conditions are equal. Mauchly's test checks it. If p < .05, multiply both degrees of freedom by the Greenhouse-Geisser ε (or Huynh-Feldt ε when ε is above about .75) and report the corrected p value."
              ]
            },
            {
              heading: "Worked example: three time points",
              paragraphs: [
                "Ten participants were measured at pre-test (M = 4.50), post-test (M = 5.60) and follow-up (M = 7.50)."
              ],
              steps: [
                "Mauchly's test: W = .869, χ²(2) = 1.12, p = .571, so sphericity holds.",
                "F(2, 18) = 62.82, p < .001.",
                "Partial η² = .87, a very large effect.",
                "Bonferroni post hoc tests then show which time points differ."
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“Mauchly's test indicated that the assumption of sphericity was met, χ²(2) = 1.12, p = .571. A one-way repeated measures ANOVA showed that scores differed significantly across time, F(2, 18) = 62.82, p < .001, partial η² = .87.”"
              ]
            },
            {
              heading: "References",
              list: [
                "Greenhouse, S. W., & Geisser, S. (1959). On methods in the analysis of profile data. Psychometrika, 24(2), 95–112.",
                "Huynh, H., & Feldt, L. S. (1976). Estimation of the Box correction for degrees of freedom from sample data in randomized block and split-plot designs. Journal of Educational Statistics, 1(1), 69–82.",
                "Mauchly, J. W. (1940). Significance test for sphericity of a normal n-variate distribution. Annals of Mathematical Statistics, 11(2), 204–209."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="repeated-measures-anova-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
