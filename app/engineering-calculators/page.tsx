import type { Metadata } from "next";
import ToolCategoryHub from "../../components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "Scientific & Engineering Calculators Online",
  description: "Use free scientific and engineering calculators for trigonometry, logarithms, powers, roots, variables, and technical unit conversions.",
  alternates: { canonical: "/engineering-calculators" },
};

export default function EngineeringCalculatorsPage() { return <ToolCategoryHub category="engineering" />; }
