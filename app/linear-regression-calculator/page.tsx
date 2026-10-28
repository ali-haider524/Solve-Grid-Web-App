import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import RegressionCalculator from "./RegressionCalculator";

export const metadata = createToolMetadata("linear-regression-calculator");

export default function LinearRegressionPage() {
  return (
    <>
      <ToolSchema slug="linear-regression-calculator" />
      <RegressionCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Linear regression formulas, assumptions, and APA reporting"
        sections={[
          {
            heading: "Simple vs multiple linear regression",
            paragraphs: [
              "Simple linear regression predicts one numeric outcome (Y) from one predictor (X): Y = b₀ + b₁X. Multiple regression adds more predictors: Y = b₀ + b₁X₁ + b₂X₂ + … Each coefficient is the expected change in Y for a one-unit increase in that predictor, holding the other predictors constant.",
            ],
          },
          {
            heading: "How the coefficients are estimated",
            formula: "b = (XᵀX)⁻¹Xᵀy,   SE(bⱼ) = √[MSE · (XᵀX)⁻¹ⱼⱼ],   t = bⱼ ÷ SE(bⱼ),   df = N − k − 1",
            paragraphs: [
              "Ordinary least squares chooses the coefficients that minimise the sum of squared residuals. The standardised coefficient β = B × SDₓ ÷ SDᵧ lets you compare predictors measured on different scales.",
            ],
          },
          {
            heading: "R², adjusted R², and the F test",
            formula: "R² = SS_regression ÷ SS_total,   adj. R² = 1 − (1 − R²)(N − 1) ÷ (N − k − 1),   F = (SS_reg ÷ k) ÷ MSE",
            paragraphs: [
              "R² is the proportion of variance in the outcome explained by the model. Adjusted R² penalises extra predictors and is better for comparing models. The F test checks whether the model as a whole predicts better than the mean. Cohen's f² = R² ÷ (1 − R²) gives .02 small, .15 medium, and .35 large.",
            ],
          },
          {
            heading: "Assumptions to check",
            list: [
              "Linearity: the residuals-vs-fitted plot shows no curve",
              "Independence of residuals: Durbin-Watson close to 2 (roughly 1.5 to 2.5)",
              "Homoscedasticity: the spread of residuals is similar across fitted values (no funnel shape)",
              "Normality of residuals: check a histogram or Q-Q plot (use the Shapiro-Wilk calculator on the residuals)",
              "No multicollinearity: VIF below 5 (some texts allow up to 10)",
              "No highly influential cases: Cook's distance below 1",
              "Sample size: a common rule is N ≥ 50 + 8k for testing the overall model (Green, 1991)",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A multiple linear regression was run to predict exam score from study hours and sleep. The model was significant, F(2, 12) = 27.22, p < .001, R² = .82, adjusted R² = .79. Study hours (B = 3.26, β = .76, t = 6.19, p < .001) and sleep (B = 4.29, β = .44, t = 3.57, p = .004) were both significant predictors.” In a table, report B, SE, β, t, p, and the 95% CI for each predictor.",
            ],
          },
          {
            heading: "References",
            list: [
              "Cohen, J., Cohen, P., West, S. G., & Aiken, L. S. (2003). Applied multiple regression/correlation analysis for the behavioral sciences (3rd ed.). Lawrence Erlbaum.",
              "Durbin, J., & Watson, G. S. (1951). Testing for serial correlation in least squares regression. Biometrika, 38(1–2), 159–177.",
              "Cook, R. D. (1977). Detection of influential observation in linear regression. Technometrics, 19(1), 15–18.",
              "Green, S. B. (1991). How many subjects does it take to do a regression analysis? Multivariate Behavioral Research, 26(3), 499–510.",
              "Field, A. (2018). Discovering statistics using IBM SPSS Statistics (5th ed.). SAGE.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="linear-regression-calculator" />
      <SiteFooter />
    </>
  );
}
