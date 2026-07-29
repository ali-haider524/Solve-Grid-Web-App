import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Calculation Methods, Accuracy & Limitations",
  "Learn how SolveGrid calculators use formulas, numerical methods, browser processing, assumptions, rounding, review, and accuracy limitations.",
  "/methodology",
);

export default function MethodologyPage() {
  return (
    <LegalPage
      eyebrow="METHODS & ACCURACY"
      title="Calculation Methods, Accuracy & Limitations"
      description="How SolveGrid tools use formulas, numerical methods, clear assumptions, and browser-based processing to produce results."
      updated="30 July 2026"
      sections={[
        {
          title: "Calculation methods used in SolveGrid",
          paragraphs: [
            "SolveGrid tools are designed around a defined calculation method. Depending on the workspace, this may be a formula, algebraic operation, matrix method, statistical procedure, numerical approximation, or unit-conversion relationship.",
            "The purpose of each tool is to help users work with their own values in a focused workspace. Where a method has important assumptions, supported ranges, or limitations, the relevant tool page or guide is intended to explain them in plain language.",
          ],
          bullets: [
            "Formula-based calculations for percentages, interest, distance, age, discounts, and similar everyday tasks",
            "Algebraic and matrix methods for equations, row reduction, inverses, determinants, rank, and supported linear systems",
            "Numerical methods for selected differential-equation and simulation workspaces",
            "Statistical calculations for descriptive statistics, regression, t-tests, correlation, and one-way ANOVA",
            "Defined conversion relationships for supported scientific, engineering, and everyday units",
          ],
        },
        {
          title: "Inputs, units, and assumptions",
          paragraphs: [
            "A result is only as meaningful as the values, units, and options entered. Check that measurements use the intended unit, equations are entered correctly, and the selected method matches the problem being solved.",
            "Some tools require assumptions. Numerical models depend on initial conditions and step size, financial projections depend on entered rates and contribution timing, and statistical outputs depend on the data and assumptions of the chosen test.",
          ],
        },
        {
          title: "Accuracy, rounding, and approximations",
          paragraphs: [
            "Some calculations produce exact results within the supported arithmetic model, while others produce numerical approximations. Rounding, floating-point arithmetic, step size, model assumptions, and the precision of entered values can change the displayed result.",
            "For numerical tools, compare settings or methods when accuracy matters. Reducing a numerical step size or checking a graph against an algebraic solution can help identify input or modelling mistakes.",
          ],
        },
        {
          title: "Browser-based calculations and privacy",
          paragraphs: [
            "Most current calculations run in the browser. This keeps common tasks fast and does not require creating an account. Clearing a form or reloading a page may remove values currently held in that workspace.",
            "A browser-based calculation does not remove the need to protect sensitive information. Avoid entering confidential personal, medical, financial, or regulated data into a general-purpose online calculator.",
          ],
        },
        {
          title: "Review and correction process",
          paragraphs: [
            "Tools and guides may be reviewed when a calculation issue, usability problem, unclear method, or stronger supporting example is identified. Changes should preserve the defined method and clearly distinguish exact results from approximations.",
            "To report a reproducible problem, use the Contact page and include the page URL, exact inputs, units or settings, displayed result, expected result, and a screenshot where possible.",
          ],
        },
        {
          title: "Checking important results",
          paragraphs: [
            "Use results together with the displayed inputs, units, method, and assumptions. Verify high-stakes engineering, medical, financial, legal, safety, academic, or research work using appropriate standards, original source data, and qualified review.",
          ],
        },
      ]}
    />
  );
}
