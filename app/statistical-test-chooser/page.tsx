import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import StatisticalTestChooser from "./StatisticalTestChooser";

export const metadata = createToolMetadata("statistical-test-chooser");

export default function StatisticalTestChooserPage() {
  return (
    <>
      <ToolSchema slug="statistical-test-chooser" />
      <StatisticalTestChooser />
      <MethodNotes
        eyebrow="QUICK REFERENCE"
        title="Statistical test flowchart in words"
        sections={[
          {
            heading: "Comparing groups (numeric outcome)",
            list: [
              "2 different groups → independent t-test (Welch) · skewed/ordinal → Mann-Whitney U",
              "Same people twice → paired t-test · skewed/ordinal → Wilcoxon signed-rank",
              "3+ different groups → one-way ANOVA · skewed/ordinal → Kruskal-Wallis",
              "Same people 3+ times → repeated-measures ANOVA · skewed/ordinal → Friedman",
            ],
          },
          {
            heading: "Relationships and categories",
            list: [
              "Two numeric variables → Pearson correlation · skewed/ordinal → Spearman",
              "Two categorical variables → chi-square test of independence · small counts → Fisher's exact",
              "One categorical variable vs expected proportions → chi-square goodness-of-fit",
              "Yes/no measured twice on the same people → McNemar's test",
            ],
          },
          {
            heading: "Should I use ANOVA or a t-test?",
            paragraphs: [
              "Use a t-test for exactly two groups and ANOVA for three or more. Running several t-tests instead of one ANOVA inflates the chance of a false positive: with three groups and three t-tests at α = .05, the familywise error rate rises to about 14%.",
            ],
          },
          {
            heading: "Should I use ANOVA or chi-square?",
            paragraphs: [
              "It depends on the outcome. If the outcome is a number (a score, time, or scale total), use ANOVA. If the outcome is a category (passed/failed, chose A/B/C), use chi-square.",
            ],
          },
          {
            heading: "References",
            list: [
              "Field, A. (2018). Discovering Statistics Using IBM SPSS Statistics (5th ed.). SAGE.",
              "American Psychological Association. (2020). Publication Manual of the American Psychological Association (7th ed.).",
              "Delacre, M., Lakens, D., & Leys, C. (2017). Why psychologists should by default use Welch's t-test instead of Student's t-test. International Review of Social Psychology, 30(1), 92–101.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="statistical-test-chooser" />
      <SiteFooter />
    </>
  );
}
