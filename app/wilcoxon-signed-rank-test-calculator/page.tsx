import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import WilcoxonCalculator from "./WilcoxonCalculator";

export const metadata = createToolMetadata("wilcoxon-signed-rank-test-calculator");

export default function WilcoxonPage() {
  return (
    <>
      <ToolSchema slug="wilcoxon-signed-rank-test-calculator" />
      <WilcoxonCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="Wilcoxon signed-rank test: when to use it, steps, and reporting"
        sections={[
          {
            heading: "When to use it",
            list: [
              "The same participants are measured twice (pre-test and post-test, two conditions)",
              "The differences are skewed or ordinal, such as single Likert items",
              "It is the non-parametric alternative to the paired-samples t-test",
              "For two different groups of people, use the Mann-Whitney U test instead",
            ],
          },
          {
            heading: "How it works",
            formula: "T = min(W⁺, W⁻),   z = (W⁺ − n(n+1)/4) ÷ √[n(n+1)(2n+1)/24 − Σ(t³−t)/48]",
            paragraphs: [
              "Take each after − before difference, drop zeros, rank the absolute differences (ties share the average rank), then add the ranks of the positive differences (W⁺) and negative differences (W⁻).",
            ],
          },
          {
            heading: "Wilcoxon signed-rank vs paired t-test",
            paragraphs: [
              "Check the differences with a Shapiro-Wilk test. If they look roughly normal, the paired t-test has more power. If they are clearly skewed, have outliers, or come from ordinal ratings, use Wilcoxon.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“A Wilcoxon signed-rank test indicated that post-test scores (Mdn = 16.0) were significantly higher than pre-test scores (Mdn = 14.5), T = 2, z = 2.61, p = .009, r = .83.” Report medians, T, z, p, and r.",
            ],
          },
          {
            heading: "References",
            list: [
              "Wilcoxon, F. (1945). Individual comparisons by ranking methods. Biometrics Bulletin, 1(6), 80–83.",
              "Rosenthal, R. (1991). Meta-Analytic Procedures for Social Research (rev. ed.). SAGE.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="wilcoxon-signed-rank-test-calculator" />
      <SiteFooter />
    </>
  );
}
