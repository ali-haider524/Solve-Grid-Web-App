import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import CorrelationCalculator from "./CorrelationCalculator";

export const metadata = createToolMetadata("correlation-calculator");

export default function CorrelationPage() {
  return (
    <>
      <ToolSchema slug="correlation-calculator" />
      <CorrelationCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Correlation coefficient formulas, interpretation, and APA reporting"
        sections={[
          {
            heading: "Pearson, Spearman, or Kendall?",
            list: [
              "Pearson r: both variables numeric, a straight-line relationship, no extreme outliers (e.g. study hours and exam score)",
              "Spearman rho (rₛ): ordinal data such as Likert items or ranks, skewed variables, or a curved but consistently rising or falling relationship",
              "Kendall tau-b (τb): small samples or many tied ranks; it is more conservative than Spearman and has a cleaner interpretation",
              "Two categorical variables? Use a chi-square test and Cramér's V instead of a correlation",
            ],
          },
          {
            heading: "Pearson correlation formula",
            formula: "r = Σ(x − x̄)(y − ȳ) ÷ √[Σ(x − x̄)² · Σ(y − ȳ)²],   t = r·√(n − 2) ÷ √(1 − r²),   df = n − 2",
            paragraphs: [
              "The p value comes from the t distribution with n − 2 degrees of freedom. The 95% confidence interval uses Fisher's z transformation: z = atanh(r), SE = 1 ÷ √(n − 3), then back-transformed with tanh.",
            ],
          },
          {
            heading: "Spearman and Kendall",
            formula: "rₛ = Pearson r computed on the ranks of X and Y (ties get average ranks)",
            paragraphs: [
              "Spearman's p value uses the same t approximation as Pearson, which is what SPSS reports. Kendall's tau-b counts concordant and discordant pairs, corrects for ties in both variables, and is tested with a normal (z) approximation.",
            ],
          },
          {
            heading: "How to interpret the correlation coefficient",
            list: [
              "|r| < .10: negligible",
              ".10 to .29: weak (small)",
              ".30 to .49: moderate (medium)",
              ".50 to .69: strong (large)",
              ".70 and above: very strong",
              "The sign gives the direction: positive means both rise together; negative means one rises as the other falls. r² is the proportion of variance the two variables share.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A Pearson correlation showed a strong positive relationship between study hours and exam score, r(10) = .97, p < .001, 95% CI [.89, .99].” Report the coefficient without a leading zero, the degrees of freedom (N − 2) in brackets, the exact p value, and ideally the confidence interval. For Spearman write rₛ(10) = .97; for Kendall write τb = .89.",
            ],
          },
          {
            heading: "References",
            list: [
              "Pearson, K. (1895). Notes on regression and inheritance in the case of two parents. Proceedings of the Royal Society of London, 58, 240–242.",
              "Spearman, C. (1904). The proof and measurement of association between two things. American Journal of Psychology, 15(1), 72–101.",
              "Kendall, M. G. (1938). A new measure of rank correlation. Biometrika, 30(1–2), 81–93.",
              "Bonett, D. G., & Wright, T. A. (2000). Sample size requirements for estimating Pearson, Kendall and Spearman correlations. Psychometrika, 65(1), 23–28.",
              "Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="correlation-calculator" />
      <SiteFooter />
    </>
  );
}
