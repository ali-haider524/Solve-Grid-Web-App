import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FinancialCalculator from "../../components/FinancialCalculator";

export const metadata = createToolMetadata("compound-interest-calculator");

export default function CompoundInterestCalculatorPage() {
  return <><ToolSchema slug="compound-interest-calculator" /><FinancialCalculator kind="compound-interest" /><ToolCrossLinks currentSlug="compound-interest-calculator" /><SiteFooter /></>;
}
