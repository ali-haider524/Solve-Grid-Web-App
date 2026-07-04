import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FinancialCalculator from "../../components/FinancialCalculator";

export const metadata = createToolMetadata("simple-interest-calculator");

export default function SimpleInterestCalculatorPage() {
  return <><ToolSchema slug="simple-interest-calculator" /><FinancialCalculator kind="simple-interest" /><ToolCrossLinks currentSlug="simple-interest-calculator" /><SiteFooter /></>;
}
