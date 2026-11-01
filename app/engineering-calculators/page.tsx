import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Scientific & Engineering Calculators Online – Units, Notation & Formulas",
  "Free scientific and engineering calculators for trigonometry, logarithms, engineering and scientific notation, unit conversion, and formulas.",
  "/engineering-calculators",
);

export default function EngineeringCalculatorsPage() {
  return <ToolCategoryHub category="engineering" />;
}
