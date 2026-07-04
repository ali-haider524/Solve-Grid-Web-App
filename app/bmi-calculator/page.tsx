import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import BmiCalculator from "./BmiCalculator";

export const metadata = createToolMetadata("bmi-calculator");

export default function BmiCalculatorPage() {
  return (
    <>
      <ToolSchema slug="bmi-calculator" />
      <BmiCalculator />
      <ToolCrossLinks currentSlug="bmi-calculator" />
      <SiteFooter />
    </>
  );
}
