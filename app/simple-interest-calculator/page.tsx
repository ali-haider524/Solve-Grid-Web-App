import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import SimpleInterestCalculator from "./SimpleInterestCalculator";

export const metadata = createToolMetadata("simple-interest-calculator");

export default function SimpleInterestCalculatorPage() {
  return (
    <>
      <ToolSchema slug="simple-interest-calculator" />
      <SimpleInterestCalculator />
      <ToolCrossLinks currentSlug="simple-interest-calculator" />
      <SiteFooter />
    </>
  );
}
