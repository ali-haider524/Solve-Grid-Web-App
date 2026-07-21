import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Everyday Calculators Online – Percentage, Finance, Age & Distance",
  "Use free online calculators for percentages, profit and loss, interest, loan payments, discounts, age, distance, unit conversion, and adult BMI screening context.",
  "/everyday-calculators",
);

export default function EverydayCalculatorsPage() {
  return <ToolCategoryHub category="everyday" />;
}
