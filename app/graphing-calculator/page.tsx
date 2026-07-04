import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import GraphingCalculator from "./GraphingCalculator";

export const metadata = createToolMetadata("graphing-calculator");

export default function GraphingCalculatorPage() {
  return (
    <>
      <ToolSchema slug="graphing-calculator" />
      <GraphingCalculator />
      <ToolCrossLinks currentSlug="graphing-calculator" />
      <SiteFooter />
    </>
  );
}
