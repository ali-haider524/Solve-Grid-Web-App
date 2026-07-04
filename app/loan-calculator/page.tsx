import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import FinancialCalculator from "../../components/FinancialCalculator";

export const metadata = createToolMetadata("loan-calculator");

export default function LoanCalculatorPage() {
  return <><ToolSchema slug="loan-calculator" /><FinancialCalculator kind="loan" /><ToolCrossLinks currentSlug="loan-calculator" /><SiteFooter /></>;
}
