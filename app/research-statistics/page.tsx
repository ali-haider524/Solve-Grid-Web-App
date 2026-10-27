import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Research Statistics Calculators for Thesis & Survey Analysis",
  "Free statistics calculators for student researchers: Slovin and Cochran sample size, Cronbach's alpha, Likert weighted mean, standard deviation, t-tests, ANOVA, and correlation.",
  "/research-statistics",
);

export default function ResearchStatisticsPage() {
  return <ToolCategoryHub category="statistics" />;
}
