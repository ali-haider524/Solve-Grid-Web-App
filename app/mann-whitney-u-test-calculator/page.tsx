import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import MannWhitneyCalculator from "./MannWhitneyCalculator";

export const metadata = createToolMetadata("mann-whitney-u-test-calculator");

export default function MannWhitneyPage() {
  return (
    <>
      <ToolSchema slug="mann-whitney-u-test-calculator" />
      <MannWhitneyCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Mann-Whitney U test: when to use it, formula, and reporting"
        sections={[
          {
            heading: "What is the Mann-Whitney U test?",
            paragraphs: [
              "It compares two independent groups by ranking all values together and checking whether one group tends to have higher ranks. It is the non-parametric alternative to the independent-samples t-test, also called the Wilcoxon rank-sum test.",
            ],
          },
          {
            heading: "Formula",
            formula: "U₁ = R₁ − n₁(n₁ + 1) ÷ 2,   U₂ = n₁n₂ − U₁,   U = min(U₁, U₂)",
            paragraphs: [
              "R₁ is the sum of ranks in group 1. Tied values share the average rank. For larger samples, z = (U₁ − n₁n₂/2) ÷ σ_U, with a tie correction in σ_U.",
            ],
          },
          {
            heading: "Mann-Whitney U vs t-test",
            list: [
              "Use the t-test when the outcome is numeric and roughly normal in each group",
              "Use Mann-Whitney for single Likert items, ranks, or skewed data with outliers",
              "Mann-Whitney compares distributions (often summarised as medians); the t-test compares means",
              "With very small groups (under about 10 each), Mann-Whitney is usually the safer choice",
            ],
          },
          {
            heading: "Mann-Whitney U vs Wilcoxon signed-rank",
            paragraphs: [
              "Mann-Whitney is for two different groups of people. Wilcoxon signed-rank is for the same people measured twice, such as a pre-test and post-test.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A Mann-Whitney U test indicated that satisfaction was significantly higher for in-person students (Mdn = 7.5) than for online students (Mdn = 3.5), U = 2, z = −2.58, p = .013, r = .74.” Report medians, U, z, p, and an effect size.",
            ],
          },
          {
            heading: "References",
            list: [
              "Mann, H. B., & Whitney, D. R. (1947). On a test of whether one of two random variables is stochastically larger than the other. Annals of Mathematical Statistics, 18(1), 50–60.",
              "Fritz, C. O., Morris, P. E., & Richler, J. J. (2012). Effect size estimates: Current use, calculations, and interpretation. Journal of Experimental Psychology: General, 141(1), 2–18.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="mann-whitney-u-test-calculator" />
      <SiteFooter />
    </>
  );
}
