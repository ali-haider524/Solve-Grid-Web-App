import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import KendallsWCalculator from "./KendallsWCalculator";

export const metadata = createToolMetadata("kendalls-w-calculator");

export default function KendallsWPage() {
  return (
    <>
      <ToolSchema slug="kendalls-w-calculator" />
      <main id="main-content">
        <KendallsWCalculator />
        <MethodNotes
          eyebrow="METHOD"
          title="Kendall's W formula, interpretation, and reporting"
          sections={[
            {
              heading: "What is Kendall's W?",
              paragraphs: [
                "Kendall's W, the coefficient of concordance, measures how closely several raters agree when they rank or score the same set of items. It runs from 0, meaning no agreement, to 1, meaning every rater produced the same ranking. It is widely used for judging panels and for checking consensus in Delphi studies."
              ]
            },
            {
              heading: "Formula",
              formula: "W = 12S ÷ (m²(n³ − n) − mΣT),   χ² = m(n − 1)W,   df = n − 1",
              paragraphs: [
                "m is the number of raters, n the number of items, S the sum of squared deviations of each item's rank total from the mean rank total, and ΣT the tie correction. The chi-square tests whether agreement is greater than chance."
              ]
            },
            {
              heading: "Worked example: five judges, six essays",
              paragraphs: [
                "Five judges ranked six essays (the sample data)."
              ],
              steps: [
                "Rank each judge's scores, giving tied scores the average rank.",
                "Add the ranks for each essay and find S, the spread of the rank totals.",
                "Apply the tie-corrected formula: W = .874.",
                "Test it: χ²(5) = 21.84, p < .001.",
                "Conclusion: very strong agreement between the judges."
              ]
            },
            {
              heading: "How to interpret W",
              list: [
                "Below .10: very weak agreement",
                ".10 – .29: weak agreement",
                ".30 – .49: moderate agreement",
                ".50 – .69: strong agreement",
                ".70 and above: very strong agreement (often used as the consensus threshold in Delphi studies)"
              ]
            },
            {
              heading: "How to report it (APA style)",
              paragraphs: [
                "“Kendall's coefficient of concordance showed very strong agreement among the five judges, W = .87, χ²(5, N = 5) = 21.84, p < .001.”"
              ]
            },
            {
              heading: "References",
              list: [
                "Kendall, M. G., & Babington Smith, B. (1939). The problem of m rankings. Annals of Mathematical Statistics, 10(3), 275–287.",
                "Schmidt, R. C. (1997). Managing Delphi surveys using nonparametric statistical techniques. Decision Sciences, 28(3), 763–774.",
                "Siegel, S., & Castellan, N. J. (1988). Nonparametric statistics for the behavioral sciences (2nd ed.). McGraw-Hill."
              ]
            },
          ]}
        />
        <ToolCrossLinks currentSlug="kendalls-w-calculator" />
      </main>
      <SiteFooter />
    </>
  );
}
