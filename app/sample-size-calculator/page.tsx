import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import SampleSizeCalculator from "./SampleSizeCalculator";

export const metadata = createToolMetadata("sample-size-calculator");

export default function SampleSizeCalculatorPage() {
  return (
    <>
      <ToolSchema slug="sample-size-calculator" />
      <SampleSizeCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="How to calculate sample size for a thesis or survey"
        sections={[
          {
            heading: "Slovin's formula (Taro Yamane)",
            formula: "n = N ÷ (1 + N·e²)",
            paragraphs: [
              "N is the population size and e is the margin of error as a decimal. For N = 1,200 and e = 0.05: n = 1,200 ÷ (1 + 1,200 × 0.0025) = 1,200 ÷ 4 = 300 respondents.",
              "The formula is short and easy to defend in a methods chapter, which is why it is common in undergraduate and master's research. It quietly assumes maximum variability (p = 0.5).",
            ],
          },
          {
            heading: "Cochran's formula with finite population correction",
            formula: "n₀ = z²·p(1 − p) ÷ e²   →   n = n₀ ÷ (1 + (n₀ − 1) ÷ N)",
            paragraphs: [
              "At 95% confidence (z = 1.96), p = 0.5, and e = 0.05, n₀ = 384.16. For a population of 1,000 the correction gives 277.7, so you need 278 respondents.",
              "Use Cochran when a reviewer may ask about the confidence level, or when a pilot study suggests p is far from 0.5.",
            ],
          },
          {
            heading: "Choosing the margin of error",
            list: [
              "5% — the default for most survey and thesis research",
              "3% — national or high-stakes surveys; needs a much larger sample",
              "10% — sometimes accepted for pilot or exploratory studies",
            ],
          },
          {
            heading: "How to write it in your methodology",
            paragraphs: [
              "State the population, the formula, the margin of error (and confidence level for Cochran), and the final rounded sample. The calculator generates this sentence for you; cite Yamane (1967) or Cochran (1977) as your department prefers.",
              "Always round up. If you expect non-response, divide by the expected response rate to decide how many people to invite.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="sample-size-calculator" />
      <SiteFooter />
    </>
  );
}
