import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import MarginOfErrorCalculator from "./MarginOfErrorCalculator";

export const metadata = createToolMetadata("margin-of-error-calculator");

export default function MarginOfErrorPage() {
  return (
    <>
      <ToolSchema slug="margin-of-error-calculator" />
      <main id="main-content">
        <MarginOfErrorCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Margin of error formula, worked example, and how to report it"
          sections={[
            {
              heading: "What is the margin of error?",
              paragraphs: [
                "The margin of error is how far a survey result could be from the true population value at a chosen confidence level. If 60% of respondents agree with a ±5% margin at 95% confidence, the true figure is probably between 55% and 65%. Larger samples give smaller margins of error."
              ]
            },
            {
              heading: "Formula",
              formula: "MOE = z × √(p(1 − p) ÷ n) × √((N − n) ÷ (N − 1))",
              paragraphs: [
                "z is 1.645 for 90%, 1.960 for 95% and 2.576 for 99% confidence. The last part is the finite population correction; leave it out when the population is large or unknown. For a mean, replace √(p(1 − p) ÷ n) with SD ÷ √n."
              ]
            },
            {
              heading: "Worked example: survey of 385 people",
              paragraphs: [
                "n = 385, 95% confidence, p = 0.5 (unknown proportion)."
              ],
              steps: [
                "Multiply p by (1 − p): 0.5 × 0.5 = 0.25.",
                "Divide by n: 0.25 ÷ 385 = 0.000649.",
                "Take the square root: standard error = 0.0255.",
                "Multiply by z = 1.96: margin of error = 0.0499.",
                "Report: ±5.0 percentage points at 95% confidence."
              ]
            },
            {
              heading: "How sample size changes the margin of error",
              list: [
                "n = 100: ±9.8%",
                "n = 200: ±6.9%",
                "n = 385: ±5.0%",
                "n = 1,000: ±3.1%",
                "(95% confidence, p = 0.5, large population)"
              ]
            },
            {
              heading: "How to write it in your methodology",
              paragraphs: [
                "“With 385 respondents, the survey has a margin of error of ±5.0 percentage points at the 95% confidence level, assuming maximum variability (p = 0.5).”"
              ]
            },
            {
              heading: "References",
              list: [
                "Cochran, W. G. (1977). Sampling techniques (3rd ed.). Wiley.",
                "Lohr, S. L. (2021). Sampling: Design and analysis (3rd ed.). CRC Press."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="margin-of-error-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
