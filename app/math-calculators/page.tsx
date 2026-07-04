import type { Metadata } from "next";
import ToolCategoryHub from "../../components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "Math Calculators Online – Graphing, Algebra, Matrices & More",
  description: "Use free online math calculators for graphing functions, solving equations, finding polynomial roots, and working with matrices.",
  alternates: { canonical: "/math-calculators" },
};

export default function MathCalculatorsPage() { return <ToolCategoryHub category="math" />; }
