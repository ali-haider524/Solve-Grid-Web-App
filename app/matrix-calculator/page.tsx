import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import MatrixCalculator from "./MatrixCalculator";

export const metadata = createToolMetadata("matrix-calculator");

export default function MatrixCalculatorPage() {
  return (
    <>
      <ToolSchema slug="matrix-calculator" />
      <MatrixCalculator />
      <ToolCrossLinks currentSlug="matrix-calculator" />
      <SiteFooter />
    </>
  );
}
