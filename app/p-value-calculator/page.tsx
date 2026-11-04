import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import PValueCalculator from "./PValueCalculator";

export const metadata = createToolMetadata("p-value-calculator");

export default function PValueCalculatorPage() {
  return (
    <>
      <ToolSchema slug="p-value-calculator" />
      <main id="main-content">
        <PValueCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="p value formulas for z, t, F, chi-square and r"
          sections={[
            {
              heading: "What is a p value?",
              paragraphs: [
                "A p value is the probability of getting a test result at least as extreme as yours if the null hypothesis were true. Small p values, usually below .05, suggest the result is unlikely to be due to chance alone. A p value does not tell you how large or important the effect is."
              ]
            },
            {
              heading: "How the p value is calculated",
              list: [
                "z: two-tailed p = 2 × P(Z > |z|) from the standard normal distribution",
                "t: two-tailed p = 2 × P(T > |t|) from the t distribution with df degrees of freedom",
                "F: right-tailed p = P(F > F observed) with (df₁, df₂)",
                "χ²: right-tailed p = P(χ² > χ² observed) with df",
                "r: converted to t = r√(n − 2) ÷ √(1 − r²) with df = n − 2"
              ]
            },
            {
              heading: "Worked example: p value from a t statistic",
              paragraphs: [
                "A t-test gives t = 2.50 with 20 degrees of freedom."
              ],
              steps: [
                "Find the upper-tail area: P(T > 2.50) with df = 20 is 0.0106.",
                "Double it for a two-tailed test: p = 0.0212.",
                "Compare with α = .05: 0.021 is smaller, so the result is significant.",
                "Write it as t(20) = 2.50, p = .021."
              ]
            },
            {
              heading: "One-tailed or two-tailed?",
              paragraphs: [
                "Use a two-tailed p value unless you stated a direction before you saw the data. A one-tailed test only counts evidence in one direction, so it halves the p value when the result goes the predicted way and gives a large p when it goes the other way."
              ]
            },
            {
              heading: "How to report a p value (APA style)",
              paragraphs: [
                "Report exact p values to two or three decimals without a leading zero (p = .021), and write p < .001 for anything smaller. Always give the test statistic and degrees of freedom next to it, plus an effect size."
              ]
            },
            {
              heading: "References",
              list: [
                "American Psychological Association. (2020). Publication manual of the American Psychological Association (7th ed.).",
                "Wasserstein, R. L., & Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. The American Statistician, 70(2), 129–133."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="p-value-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
