import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import StatisticsCalculator from "./StatisticsCalculator";

export const metadata = createToolMetadata("statistics-calculator");

export default function StatisticsCalculatorPage() {
  return (
    <>
      <ToolSchema slug="statistics-calculator" />
      <StatisticsCalculator />
      <ToolCrossLinks currentSlug="statistics-calculator" />
      <SiteFooter />
    </>
  );
}
