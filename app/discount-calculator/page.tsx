import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FinancialCalculator from "../../components/FinancialCalculator";

export const metadata = createToolMetadata("discount-calculator");

export default function DiscountCalculatorPage() {
  return <><ToolSchema slug="discount-calculator" /><FinancialCalculator kind="discount" /><ToolCrossLinks currentSlug="discount-calculator" /><SiteFooter /></>;
}
