import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "How to Report Regression Results in APA Style",
  description:
    "APA templates for simple and multiple linear regression: F, df, R², adjusted R², B, β, t, p, and 95% CIs, with a worked example and a coefficients table layout.",
  alternates: { canonical: "/guides/how-to-report-regression-apa" },
};

export default function ReportRegressionGuide() {
  return (
    <GuideArticle
      eyebrow="APA REPORTING GUIDE"
      title="How to report regression results in APA style"
      slug="how-to-report-regression-apa"
      description="An APA-style regression report has two parts: the overall model (F test with both degrees of freedom, p, R², and adjusted R²) and each predictor (B, standard error or 95% CI, β, t, and p). Multiple regression results usually also go in a coefficients table."
      formula="F(k, N − k − 1) = F value, p = .XXX, R² = .XX;   predictor: B = X.XX, β = .XX, t(df) = X.XX, p = .XXX"
      example="A multiple linear regression was run to predict exam score from weekly study hours and hours of sleep. The model was statistically significant, F(2, 12) = 27.22, p < .001, R² = .82, adjusted R² = .79. Study hours significantly predicted exam score, B = 3.26, 95% CI [2.11, 4.41], β = .76, t(12) = 6.19, p < .001, as did sleep, B = 4.29, 95% CI [1.67, 6.91], β = .44, t(12) = 3.57, p = .004."
      steps={[
        {
          title: "State the type of regression and the variables",
          body: "Say whether it was a simple or multiple linear regression (or hierarchical, logistic, etc.), name the outcome (dependent variable), and list the predictors.",
        },
        {
          title: "Report the overall model F test",
          body: "Write F(df regression, df residual). The regression df equals the number of predictors k, and the residual df equals N − k − 1. With 2 predictors and 15 participants that is F(2, 12).",
        },
        {
          title: "Give R² and adjusted R²",
          body: "R² is the proportion of variance in the outcome explained by the model. Adjusted R² corrects for the number of predictors and is the better figure when you compare models. Drop the leading zero (R² = .82).",
        },
        {
          title: "Report each predictor",
          body: "For every predictor give the unstandardised coefficient B (with its SE or 95% CI), the standardised coefficient β, t with the residual df, and the exact p value. Say whether the relationship is positive or negative.",
        },
        {
          title: "Mention the assumption checks",
          body: "Briefly state that linearity, independence of residuals (Durbin-Watson), homoscedasticity, normality of residuals, and multicollinearity (VIF) were checked, and note anything you had to address.",
        },
        {
          title: "Put the coefficients in a table for multiple regression",
          body: "APA tables list each predictor in a row with columns for B, SE, β, t, p, and the 95% CI, and a note under the table giving N, R², adjusted R², and the F test.",
        },
      ]}
      reference={{
        title: "APA regression templates",
        description: "Replace the numbers with your own output. Italicise statistical symbols such as F, p, R², B, t, and SE in your final document.",
        columns: ["What you report", "Template", "Notes"],
        rows: [
          { first: "Overall model", second: "F(2, 12) = 27.22, p < .001, R² = .82, adjusted R² = .79", third: "df = (k, N − k − 1)" },
          { first: "Significant predictor", second: "B = 3.26, 95% CI [2.11, 4.41], β = .76, t(12) = 6.19, p < .001", third: "SE can replace the CI: B = 3.26, SE = 0.53" },
          { first: "Non-significant predictor", second: "B = 0.76, β = .09, t(11) = 1.25, p = .237", third: "Still report it; do not just say \"ns\"" },
          { first: "Simple regression", second: "R² = .45, F(1, 48) = 39.27, p < .001; B = 2.10, t(48) = 6.27, p < .001", third: "For one predictor, t² = F" },
          { first: "Hierarchical step", second: "ΔR² = .08, ΔF(2, 95) = 6.11, p = .003", third: "Report the change for each added block" },
          { first: "Regression equation", second: "Score = 21.14 + 3.26 × Hours + 4.29 × Sleep", third: "Optional; useful for prediction" },
        ],
      }}
      faqs={[
        {
          question: "Should I report B or beta (β) in APA style?",
          answer:
            "Report both when you can. B (unstandardised) gives the effect in the original units, and β (standardised) lets readers compare predictors measured on different scales. In a table, include columns for B, SE, and β.",
        },
        {
          question: "What degrees of freedom do I use for the t test of a coefficient?",
          answer: "Use the residual degrees of freedom, N − k − 1, the same as the second df of the overall F test.",
        },
        {
          question: "How do I report a regression in one sentence?",
          answer:
            "\"Study hours significantly predicted exam score, B = 3.26, t(12) = 6.19, p < .001, and the model explained 82% of the variance, R² = .82, F(2, 12) = 27.22, p < .001.\"",
        },
        {
          question: "Do I report the constant (intercept)?",
          answer:
            "Include it in the coefficients table and the regression equation, but you usually do not need to interpret or discuss it in the text unless zero is a meaningful value for all predictors.",
        },
        {
          question: "How do I report a non-significant regression model?",
          answer:
            "Report it the same way with the exact p value, for example F(3, 46) = 1.42, p = .249, R² = .08, and state that the predictors did not significantly predict the outcome.",
        },
      ]}
      toolLinks={[
        {
          label: "Linear Regression Calculator",
          href: "/linear-regression-calculator",
          description: "Paste your data to get R², F, B, SE, β, t, p, 95% CIs, VIF, Durbin-Watson, and this APA sentence.",
        },
        {
          label: "Correlation Calculator",
          href: "/correlation-calculator",
          description: "Check the bivariate correlations between your outcome and predictors first.",
        },
        {
          label: "Sobel Test Calculator",
          href: "/sobel-test-calculator",
          description: "Test a mediation (indirect) effect using coefficients from two regressions.",
        },
        {
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check whether the regression residuals are normally distributed.",
        },
      ]}
    />
  );
}
