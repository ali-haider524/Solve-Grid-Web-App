import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Calculation Methods, Accuracy & Limitations",
  "Learn how SolveGrid calculators use formulas, numerical methods, browser-based processing, assumptions, rounding, and accuracy limitations.",
  "/methodology",
);

export default function MethodologyPage() {
  return (
    <LegalPage
      eyebrow="METHODS & ACCURACY"
      title="Calculation Methods, Accuracy & Limitations"
      description="How SolveGrid tools use formulas, numerical methods, clear assumptions, and browser-based processing to produce results."
      updated="6 July 2026"
      sections={[
        {
          title: "Calculation methods used in SolveGrid",
          paragraphs: [
            "SolveGrid tools are designed around a defined calculation method. Depending on the workspace, this may be a formula, algebraic operation, matrix method, statistical procedure, numerical approximation, or unit-conversion relationship.",
            "The purpose of each tool is to help users work with their own values in a focused workspace. Where a method has important assumptions, supported ranges, or limitations, the relevant tool page or guide is intended to explain them in plain language.",
          ],
          bullets: [
            "Formula-based calculations for percentages, interest, distance, age, discounts, and similar everyday tasks",
            "Algebraic and matrix methods for equations, row reduction, inverses, determinants, and supported linear systems",
            "Numerical methods for selected differential-equation and simulation workspaces",
            "Statistical calculations for descriptive statistics, regression, t-tests, correlation, and one-way ANOVA",
            "Defined unit-conversion relationships for supported scientific, engineering, and everyday units",
          ],
        },
        {
          title: "Inputs, units, and assumptions",
          paragraphs: [
            "A result is only as meaningful as the values, units, and options entered. Check that measurements use the intended unit, equations are entered correctly, and any selected method matches the problem you are solving.",
            "Some tools require assumptions. For example, numerical models depend on initial conditions and step size, financial projections depend on entered rates and contribution timing, and statistical outputs depend on the data and the assumptions of the chosen test.",
          ],
        },
        {
          title: "Accuracy, rounding, and approximations",
          paragraphs: [
            "Some calculations produce exact results within the supported arithmetic model, while others produce numerical approximations. Rounding, floating-point arithmetic, step size, model assumptions, and the precision of the values entered can change the displayed result.",
            "For numerical tools, compare settings or methods when accuracy matters. For example, reducing a numerical step size or checking a graph against an algebraic solution can help identify input or modelling mistakes.",
          ],
        },
        {
          title: "Browser-based calculations",
          paragraphs: [
            "Most current calculations run in your browser. This keeps common tasks fast and does not require creating an account. Clearing a form or reloading a page may remove values currently held in that workspace.",
          ],
        },
        {
          title: "Checking important results",
          paragraphs: [
            "Use results together with the displayed inputs, units, calculation method, and assumptions. Verify high-stakes engineering, medical, financial, legal, safety, academic, or research work using appropriate standards, source data, and qualified review.",
          ],
        },
        {
          title: "Updates and feedback",
          paragraphs: [
            "Tools and guides may be updated when a calculation issue, usability problem, or clearer explanation is identified. To report a problem, use the contact page and include the page URL, input values, expected outcome, and a screenshot where possible.",
          ],
        },
      ]}
    />
  );
}
