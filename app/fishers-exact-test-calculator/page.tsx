import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FishersExactCalculator from "./FishersExactCalculator";

export const metadata = createToolMetadata("fishers-exact-test-calculator");

export default function FishersExactPage() {
  return (
    <>
      <ToolSchema slug="fishers-exact-test-calculator" />
      <main id="main-content">
        <FishersExactCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Fisher's exact test: when to use it, formula, and reporting"
          sections={[
            {
              heading: "What is Fisher's exact test?",
              paragraphs: [
                "Fisher's exact test checks whether two yes/no variables are related in a 2 × 2 table. Unlike the chi-square test, it calculates the exact probability of the observed table and anything more extreme, so it stays accurate when the sample is small or some expected counts are below 5."
              ]
            },
            {
              heading: "Formula",
              formula: "P(table) = (a+b)! (c+d)! (a+c)! (b+d)! ÷ (n! a! b! c! d!)",
              paragraphs: [
                "The probability of every table with the same row and column totals is computed from the hypergeometric distribution. The two-sided p value adds the probabilities of all tables that are no more likely than the one you observed."
              ]
            },
            {
              heading: "Worked example",
              paragraphs: [
                "Treatment: 8 improved, 2 did not. Control: 1 improved, 5 did not (n = 16)."
              ],
              steps: [
                "Row totals are 10 and 6; column totals are 9 and 7.",
                "Sum the probabilities of all tables as unlikely as this one: two-sided p = .035.",
                "The odds ratio is (8 × 5) ÷ (2 × 1) = 20.00.",
                "Report: Fisher's exact test, p = .035, OR = 20.00, 95% CI [1.42, 282.45]."
              ]
            },
            {
              heading: "Fisher's exact test or chi-square?",
              list: [
                "Any expected count below 5 in a 2 × 2 table: use Fisher's exact test",
                "Large sample, all expected counts 5 or more: chi-square is fine and gives almost the same p",
                "Same people measured twice (before and after): use McNemar's test instead"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "Give the percentages in each group, then the test: “80.0% of the treatment group improved compared with 16.7% of the control group, Fisher's exact test, p = .035, OR = 20.00, 95% CI [1.42, 282.45].” The wide CI reflects the small sample."
              ]
            },
            {
              heading: "References",
              list: [
                "Fisher, R. A. (1922). On the interpretation of χ² from contingency tables, and the calculation of P. Journal of the Royal Statistical Society, 85(1), 87–94.",
                "Agresti, A. (2013). Categorical data analysis (3rd ed.). Wiley."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="fishers-exact-test-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
