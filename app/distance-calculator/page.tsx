import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import DistanceCalculator from "./DistanceCalculator";

export const metadata = createToolMetadata("distance-calculator");

export default function DistanceCalculatorPage() {
  return (
    <>
      <ToolSchema slug="distance-calculator" />
      <DistanceCalculator />
      <ToolCrossLinks currentSlug="distance-calculator" />
      <SiteFooter />
    </>
  );
}
