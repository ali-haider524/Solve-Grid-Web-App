import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Math Calculators Online – Equations, Graphs & Matrices",
  "Free online math calculators to graph functions, solve linear, quadratic and cubic equations, find polynomial roots, and reduce matrices.",
  "/math-calculators",
);

export default function MathCalculatorsPage() {
  return <ToolCategoryHub category="math" />;
}
