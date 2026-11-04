import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import ConfidenceIntervalCalculator from "./ConfidenceIntervalCalculator";

export const metadata = createToolMetadata("confidence-interval-calculator");

export default function ConfidenceIntervalPage() {
  return (
    <>
      <ToolSchema slug="confidence-interval-calculator" />
      <main id="main-content">
        <ConfidenceIntervalCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Confidence interval formulas, worked examples, and reporting"
          sections={[
            {
              heading: "What is a confidence interval?",
              paragraphs: [
                "A confidence interval is a range of values that is likely to contain the true population value, such as a population mean. A 95% interval means that if you repeated the study many times, about 95% of the intervals would contain the true value. Narrow intervals mean a more precise estimate."
              ]
            },
            {
              heading: "Formula for a mean",
              formula: "CI = M ± t(α/2, n − 1) × SD ÷ √n",
              paragraphs: [
                "Use the t distribution because the population standard deviation is estimated from the sample."
              ]
            },
            {
              heading: "Worked example: 95% CI for a mean",
              paragraphs: [
                "M = 50, SD = 10, n = 25."
              ],
              steps: [
                "Standard error: 10 ÷ √25 = 2.00.",
                "t critical for df = 24 at 95%: 2.064.",
                "Margin of error: 2.064 × 2.00 = 4.13.",
                "Interval: 50 − 4.13 = 45.87 to 50 + 4.13 = 54.13.",
                "Report: M = 50.00, 95% CI [45.87, 54.13]."
              ]
            },
            {
              heading: "Formula for a proportion (Wilson score)",
              formula: "(p̂ + z²/2n ± z√(p̂(1 − p̂)/n + z²/4n²)) ÷ (1 + z²/n)",
              paragraphs: [
                "For 45 of 120 respondents (37.5%), the 95% Wilson interval is 29.4% to 46.4%. The simpler Wald interval, p̂ ± z√(p̂(1 − p̂)/n), gives 28.8% to 46.2% but is less accurate for small samples."
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "Put the interval in square brackets after the estimate with the same number of decimals: M = 50.00, 95% CI [45.87, 54.13], or 37.5%, 95% CI [29.4%, 46.4%]."
              ]
            },
            {
              heading: "References",
              list: [
                "Cumming, G. (2014). The new statistics: Why and how. Psychological Science, 25(1), 7–29.",
                "Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. Journal of the American Statistical Association, 22(158), 209–212.",
                "Brown, L. D., Cai, T. T., & DasGupta, A. (2001). Interval estimation for a binomial proportion. Statistical Science, 16(2), 101–133."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="confidence-interval-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
