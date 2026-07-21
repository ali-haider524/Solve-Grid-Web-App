import ToolCategoryHub from "../../components/ToolCategoryHub";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Math Calculators Online – Equations, Graphs, Matrices & Statistics",
  "Use free online math calculators for graphing functions, solving linear, quadratic and cubic equations, finding polynomial roots, reducing matrices, calculating rank, and analysing statistics.",
  "/math-calculators",
);

export default function MathCalculatorsPage() {
  return <ToolCategoryHub category="math" />;
}
