import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import AncovaCalculator from "./AncovaCalculator";

export const metadata = createToolMetadata("ancova-calculator");

export default function AncovaPage() {
  return (
    <>
      <ToolSchema slug="ancova-calculator" />
      <main id="main-content">
        <AncovaCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="ANCOVA: formula, adjusted means, assumptions, and APA reporting"
          sections={[
            {
              heading: "What is an ANCOVA?",
              paragraphs: [
                "An analysis of covariance (ANCOVA) compares group means on an outcome while statistically controlling for a covariate, a continuous variable that also affects the outcome, such as a pre-test score. It removes the covariate's influence from the error term and adjusts the group means, giving a fairer and usually more powerful comparison."
              ]
            },
            {
              heading: "Model",
              formula: "Y = μ + group effect + b(X − X̄) + error",
              paragraphs: [
                "The group effect is tested by comparing the full model with a model that contains only the covariate (Type III). Adjusted means are the model's predictions for each group at the overall mean of the covariate."
              ]
            },
            {
              heading: "Worked example: three teaching methods",
              paragraphs: [
                "24 students in three methods (A, B, C) with a pre-test as the covariate and a post-test as the outcome."
              ],
              steps: [
                "Check homogeneity of slopes: F(2, 18) = 0.17, p = .846, so the assumption holds.",
                "Covariate: F(1, 20) = 32.10, p < .001, partial η² = .62.",
                "Method, adjusted for pre-test: F(2, 20) = 12.60, p < .001, partial η² = .56.",
                "Raw means were 38.59, 44.91 and 44.76; adjusted means are 37.65, 44.60 and 46.01.",
                "After adjustment, method C has the highest post-test score."
              ]
            },
            {
              heading: "Assumptions to check",
              list: [
                "Independent observations",
                "Linear relationship between covariate and outcome in each group",
                "Homogeneity of regression slopes (no group × covariate interaction)",
                "Roughly normal residuals with similar variances across groups",
                "The covariate was measured before the treatment, so it is not affected by it"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“After controlling for pre-test scores, there was a significant effect of teaching method on post-test scores, F(2, 20) = 12.60, p < .001, partial η² = .56. Adjusted means were 37.65 (A), 44.60 (B) and 46.01 (C).”"
              ]
            },
            {
              heading: "References",
              list: [
                "Field, A. (2018). Discovering statistics using IBM SPSS Statistics (5th ed.). SAGE.",
                "Huitema, B. E. (2011). The analysis of covariance and alternatives (2nd ed.). Wiley.",
                "Maxwell, S. E., Delaney, H. D., & Kelley, K. (2018). Designing experiments and analyzing data (3rd ed.). Routledge."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="ancova-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
