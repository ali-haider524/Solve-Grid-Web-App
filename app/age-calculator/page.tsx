import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import AgeCalculator from "./AgeCalculator";

export const metadata = createToolMetadata("age-calculator");

export default function AgeCalculatorPage() {
  return (
    <>
      <ToolSchema slug="age-calculator" />
      <AgeCalculator />
      <ToolCrossLinks currentSlug="age-calculator" />
      <SiteFooter />
    </>
  );
}
