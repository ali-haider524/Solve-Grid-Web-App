import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Scientific & Engineering Calculators Online – Units, Notation & Formulas",
  "Use free scientific and engineering calculators for trigonometry, logarithms, roots, powers, engineering notation, scientific notation, unit conversion, and technical formulas.",
  "/engineering-calculators",
);

export default function EngineeringCalculatorsPage() {
  return <ToolCategoryHub category="engineering" />;
}
