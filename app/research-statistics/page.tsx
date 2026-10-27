import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Statistics Calculators for Thesis & Survey Research",
  "Free statistics calculators for student research: sample size, Cronbach's alpha, Likert weighted mean, chi-square, t-tests, ANOVA, and a test chooser.",
  "/research-statistics",
);

export default function ResearchStatisticsPage() {
  return <ToolCategoryHub category="statistics" />;
}
