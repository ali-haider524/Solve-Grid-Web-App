import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import LikertScaleCalculator from "./LikertScaleCalculator";

export const metadata = createToolMetadata("likert-scale-calculator");

export default function LikertScaleCalculatorPage() {
  return (
    <>
      <ToolSchema slug="likert-scale-calculator" />
      <LikertScaleCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="How to compute and interpret a Likert scale weighted mean"
        sections={[
          {
            heading: "Weighted mean formula",
            formula: "x̄w = Σ(f × w) ÷ Σf",
            paragraphs: [
              "f is the number of respondents who chose an option and w is that option's score (1 to 5 on a 5-point scale). Example: counts 2, 5, 12, 41, 40 give (2·1 + 5·2 + 12·3 + 41·4 + 40·5) ÷ 100 = 4.12, interpreted as Agree.",
            ],
          },
          {
            heading: "5-point Likert scale interpretation range",
            formula: "Interval width = (5 − 1) ÷ 5 = 0.80",
            list: [
              "4.21 – 5.00 Strongly Agree",
              "3.41 – 4.20 Agree",
              "2.61 – 3.40 Neutral",
              "1.81 – 2.60 Disagree",
              "1.00 – 1.80 Strongly Disagree",
            ],
          },
          {
            heading: "4-point scale interpretation range",
            formula: "Interval width = (4 − 1) ÷ 4 = 0.75",
            list: [
              "3.26 – 4.00 Strongly Agree",
              "2.51 – 3.25 Agree",
              "1.76 – 2.50 Disagree",
              "1.00 – 1.75 Strongly Disagree",
            ],
          },
          {
            heading: "Good practice for your results chapter",
            paragraphs: [
              "Report the weighted mean, standard deviation, and verbal interpretation for each statement, then the grand mean for the dimension. Check scale reliability with Cronbach's alpha before interpreting a composite score.",
              "Single Likert items are ordinal, so many reviewers also expect medians or frequency percentages. For group comparisons on summed scale scores, use a t-test or ANOVA; for single items, a Mann-Whitney or Kruskal-Wallis test is often safer.",
            ],
          },
          {
            heading: "References",
            list: ["Likert, R. (1932). A technique for the measurement of attitudes. Archives of Psychology, 140, 1–55.", "Joshi, A., Kale, S., Chandel, S., & Pal, D. K. (2015). Likert scale: Explored and explained. British Journal of Applied Science & Technology, 7(4), 396–403.", "Sullivan, G. M., & Artino, A. R. (2013). Analyzing and interpreting data from Likert-type scales. Journal of Graduate Medical Education, 5(4), 541–542."],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="likert-scale-calculator" />
      <SiteFooter />
    </>
  );
}
