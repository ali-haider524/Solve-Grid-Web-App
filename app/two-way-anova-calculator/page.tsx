import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import TwoWayAnovaCalculator from "./TwoWayAnovaCalculator";

export const metadata = createToolMetadata("two-way-anova-calculator");

export default function TwoWayAnovaPage() {
  return (
    <>
      <ToolSchema slug="two-way-anova-calculator" />
      <main id="main-content">
        <TwoWayAnovaCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Two-way ANOVA: main effects, interaction, assumptions, and APA reporting"
          sections={[
            {
              heading: "What is a two-way ANOVA?",
              paragraphs: [
                "A two-way ANOVA tests how two categorical factors, such as teaching method and gender, affect one numeric outcome. It gives three results: a main effect for each factor and an interaction effect, which shows whether the effect of one factor depends on the level of the other."
              ]
            },
            {
              heading: "Formula",
              formula: "F = MS(effect) ÷ MS(error),   partial η² = SS(effect) ÷ (SS(effect) + SS(error))",
              paragraphs: [
                "Each effect's sum of squares is found by comparing the full model with a model that leaves that effect out (Type III, sum-to-zero coding). Degrees of freedom are (a − 1), (b − 1) and (a − 1)(b − 1), with N − ab for the error term."
              ]
            },
            {
              heading: "Worked example: method × gender",
              paragraphs: [
                "The sample data has 3 teaching methods × 2 genders with 3 students per cell (N = 18)."
              ],
              steps: [
                "Interaction: F(2, 12) = 0.30, p = .748, partial η² = .047, so not significant.",
                "Main effect of method: F(2, 12) = 21.99, p < .001, partial η² = .786.",
                "Main effect of gender: F(1, 12) = 21.24, p < .001, partial η² = .639.",
                "Because the interaction is not significant, interpret the two main effects directly and follow up method with post hoc tests."
              ]
            },
            {
              heading: "Assumptions to check",
              list: [
                "Outcome is numeric and observations are independent",
                "Residuals are roughly normal in each cell (check with Shapiro-Wilk)",
                "Similar variances across cells (Levene's test)",
                "Every combination of factor levels has data"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "Start with the interaction, then the main effects: “There was no significant interaction between method and gender, F(2, 12) = 0.30, p = .748, partial η² = .05. There was a significant main effect of method, F(2, 12) = 21.99, p < .001, partial η² = .79, and of gender, F(1, 12) = 21.24, p < .001, partial η² = .64.”"
              ]
            },
            {
              heading: "References",
              list: [
                "Maxwell, S. E., Delaney, H. D., & Kelley, K. (2018). Designing experiments and analyzing data (3rd ed.). Routledge.",
                "Field, A. (2018). Discovering statistics using IBM SPSS Statistics (5th ed.). SAGE."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="two-way-anova-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
