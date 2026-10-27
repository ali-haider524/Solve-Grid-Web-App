import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import SobelCalculator from "./SobelCalculator";

export const metadata = createToolMetadata("sobel-test-calculator");

export default function SobelPage() {
  return (
    <>
      <ToolSchema slug="sobel-test-calculator" />
      <SobelCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Sobel test for mediation: formula, steps, and limitations"
        sections={[
          {
            heading: "Formula",
            formula: "z = ab ÷ √(b²·SEa² + a²·SEb²)   (Aroian adds + SEa²·SEb²; Goodman subtracts it)",
            paragraphs: [
              "Example: a = 0.50 (SE 0.10), b = 0.40 (SE 0.12). ab = 0.20 and SE = √(0.16 × 0.01 + 0.25 × 0.0144) = 0.072, so z = 2.77, p = .006: a significant indirect effect.",
            ],
          },
          {
            heading: "Where a and b come from",
            list: [
              "Regression 1: M = i₁ + a·X → take a and its SE",
              "Regression 2: Y = i₂ + c′·X + b·M → take b and its SE",
              "Optional total-effect regression: Y = i₃ + c·X → c, for the proportion mediated",
              "Use unstandardised (B) coefficients, not standardised betas",
            ],
          },
          {
            heading: "Full vs partial mediation",
            paragraphs: [
              "If the indirect effect is significant and the direct effect c′ is not, the result is often called full mediation; if both are significant, partial mediation. Current guidance (Zhao, Lynch & Chen, 2010) focuses on whether the indirect effect is significant rather than on these labels.",
            ],
          },
          {
            heading: "Sobel test vs bootstrapping",
            paragraphs: [
              "The Sobel test is easy to compute and widely cited, but it has low power and assumes a normal sampling distribution for ab. Preacher and Hayes (2008) recommend bootstrap confidence intervals; if a supervisor or reviewer asks for one, use PROCESS (SPSS) or lavaan (R) and report Sobel alongside it.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“The indirect effect of study time on exam score through self-efficacy was significant, ab = 0.20, SE = 0.07, z = 2.77, p = .006, accounting for 33% of the total effect.” Report a, b, their SEs, and the method used.",
            ],
          },
          {
            heading: "References",
            list: [
              "Sobel, M. E. (1982). Asymptotic confidence intervals for indirect effects in structural equation models. Sociological Methodology, 13, 290–312.",
              "Baron, R. M., & Kenny, D. A. (1986). The moderator–mediator variable distinction in social psychological research. Journal of Personality and Social Psychology, 51(6), 1173–1182.",
              "Preacher, K. J., & Hayes, A. F. (2008). Asymptotic and resampling strategies for assessing and comparing indirect effects in multiple mediator models. Behavior Research Methods, 40(3), 879–891.",
              "Zhao, X., Lynch, J. G., & Chen, Q. (2010). Reconsidering Baron and Kenny: Myths and truths about mediation analysis. Journal of Consumer Research, 37(2), 197–206.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="sobel-test-calculator" />
      <SiteFooter />
    </>
  );
}
