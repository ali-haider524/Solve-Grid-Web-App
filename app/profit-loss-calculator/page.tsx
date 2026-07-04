import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FinancialCalculator from "../../components/FinancialCalculator";

export const metadata = createToolMetadata("profit-loss-calculator");

export default function ProfitLossCalculatorPage() {
  return <><ToolSchema slug="profit-loss-calculator" /><FinancialCalculator kind="profit-loss" /><ToolCrossLinks currentSlug="profit-loss-calculator" /><SiteFooter /></>;
}
