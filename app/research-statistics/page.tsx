import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "All Statistics Calculators for Research, Grouped by Test",
  "The full list of SolveGrid research statistics calculators, grouped by task: sample size, reliability, Likert, group comparisons, relationships, and agreement.",
  "/research-statistics",
);

export default function ResearchStatisticsPage() {
  return <ToolCategoryHub category="statistics" />;
}
