import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import PercentageCalculator from "./PercentageCalculator";

export const metadata = createToolMetadata("percentage-calculator");

export default function PercentageCalculatorPage() {
  return (
    <>
      <ToolSchema slug="percentage-calculator" />
      <PercentageCalculator />
      <ToolCrossLinks currentSlug="percentage-calculator" />
      <SiteFooter />
    </>
  );
}
