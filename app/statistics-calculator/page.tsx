import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import StatisticsCalculator from "./StatisticsCalculator";
import MethodNotes from "../../components/MethodNotes";

export const metadata = createToolMetadata("statistics-calculator");

export default function StatisticsCalculatorPage() {
  return (
    <>
      <ToolSchema slug="statistics-calculator" />
      <StatisticsCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Standard deviation calculator: worked examples and what to report"
        sections={[
          {
            heading: "What does this standard deviation calculator give you?",
            paragraphs: [
              "Choose Sample (n − 1) or Population (n) and it returns that standard deviation, together with the mean, variance, median, quartiles, IQR, coefficient of variation and an outlier check. Use the sample SD for survey and thesis data unless you measured every member of the group.",
            ],
          },
          {
            heading: "Worked example: raw scores",
            steps: [
              "Enter 58, 64, 72, 72, 78, 84, 91 in raw data mode.",
              "Mean = 519 ÷ 7 = 74.14.",
              "Sum of squared deviations = 768.86.",
              "Sample SD s = √(768.86 ÷ 6) = 11.32; population SD σ = √(768.86 ÷ 7) = 10.48.",
              "Report it as M = 74.14, SD = 11.32.",
            ],
          },
          {
            heading: "Worked example: Likert responses entered as a frequency table",
            steps: [
              "Choose frequency table mode and enter values 1–5 with counts 2, 3, 8, 5, 2 (N = 20).",
              "Mean = Σfx ÷ N = 62 ÷ 20 = 3.10.",
              "Σf(x − x̄)² = 23.80, so s = √(23.80 ÷ 19) = 1.12.",
              "Report it as M = 3.10, SD = 1.12 (N = 20).",
            ],
          },
          {
            heading: "Worked example: grouped data with class intervals",
            steps: [
              "Choose grouped data mode and enter 10–19, 20–29, 30–39, 40–49 with frequencies 4, 7, 6, 3.",
              "The calculator uses the class midpoints 14.5, 24.5, 34.5 and 44.5.",
              "Mean = 570 ÷ 20 = 28.5 and Σf(m − x̄)² = 1,880.",
              "Estimated sample SD = √(1,880 ÷ 19) = 9.95.",
            ],
          },
          {
            heading: "Is my standard deviation high or low?",
            paragraphs: [
              "Judge it against the scale. On a 5-point Likert item, an SD under about 1.0 means respondents mostly agreed with each other, while an SD above about 1.5 means opinions were split. For other data, the coefficient of variation (SD ÷ mean) lets you compare spread between variables with different units.",
            ],
          },
      ]}
      />
      <ToolCrossLinks currentSlug="statistics-calculator" />
      <SiteFooter />
    </>
  );
}
