import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "All Research Statistics Calculators, Grouped by Analysis",
  "The full list of SolveGrid research statistics calculators, grouped by task: sample size, reliability, Likert, group comparisons, relationships, and agreement.",
  "/research-statistics",
);

export default function ResearchStatisticsPage() {
  return <ToolCategoryHub category="statistics" />;
}
