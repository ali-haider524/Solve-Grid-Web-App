import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import LogisticRegressionCalculator from "./LogisticRegressionCalculator";

export const metadata = createToolMetadata("logistic-regression-calculator");

export default function LogisticRegressionPage() {
  return (
    <>
      <ToolSchema slug="logistic-regression-calculator" />
      <main id="main-content">
        <LogisticRegressionCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Binary logistic regression: formula, odds ratios, and APA reporting"
          sections={[
            {
              heading: "What is logistic regression?",
              paragraphs: [
                "Binary logistic regression predicts the probability of a yes/no outcome, such as pass or fail, from one or more predictors. Instead of predicting the outcome directly, it models the log odds of the outcome, and each coefficient can be turned into an odds ratio that is easy to explain in a thesis."
              ]
            },
            {
              heading: "Formula",
              formula: "ln(p ÷ (1 − p)) = B₀ + B₁X₁ + B₂X₂ + …,   OR = e^B",
              paragraphs: [
                "Coefficients are estimated by maximum likelihood (Newton-Raphson). Each Wald statistic is (B ÷ SE)². The model χ² compares the −2 log likelihood of the null model with that of the fitted model."
              ]
            },
            {
              heading: "Worked example: predicting a pass",
              paragraphs: [
                "The sample data has 20 students with Passed (0/1), study Hours and Attendance."
              ],
              steps: [
                "Model test: χ²(2, N = 20) = 11.80, p = .003, Nagelkerke R² = .59.",
                "Hours: B = 0.58, Wald = 3.98, p = .046, OR = 1.79, 95% CI [1.01, 3.17].",
                "Attendance: B = 1.12, Wald = 3.89, p = .049, OR = 3.07, 95% CI [1.01, 9.36].",
                "Each extra study hour raised the odds of passing by about 79%; the model classified 75% of students correctly."
              ]
            },
            {
              heading: "Assumptions and checks",
              list: [
                "Outcome coded 0 and 1",
                "Independent observations",
                "Roughly linear relationship between each numeric predictor and the log odds",
                "No strong multicollinearity between predictors",
                "Enough events: about 10 of the less common outcome per predictor"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“A binary logistic regression showed that the model was statistically significant, χ²(2, N = 20) = 11.80, p = .003, Nagelkerke R² = .59. Study hours (OR = 1.79, 95% CI [1.01, 3.17], p = .046) and attendance (OR = 3.07, 95% CI [1.01, 9.36], p = .049) both predicted passing.”"
              ]
            },
            {
              heading: "References",
              list: [
                "Hosmer, D. W., Lemeshow, S., & Sturdivant, R. X. (2013). Applied logistic regression (3rd ed.). Wiley.",
                "Nagelkerke, N. J. D. (1991). A note on a general definition of the coefficient of determination. Biometrika, 78(3), 691–692.",
                "Peduzzi, P., et al. (1996). A simulation study of the number of events per variable in logistic regression analysis. Journal of Clinical Epidemiology, 49(12), 1373–1379."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="logistic-regression-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
