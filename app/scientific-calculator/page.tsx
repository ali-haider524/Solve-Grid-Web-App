import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import ScientificCalculator from "./ScientificCalculator";

export const metadata = createToolMetadata("scientific-calculator");

export default function ScientificCalculatorPage() {
  return (
    <>
      <ToolSchema slug="scientific-calculator" />
      <ScientificCalculator />
      <ToolCrossLinks currentSlug="scientific-calculator" />
      <SiteFooter />
    </>
  );
}
