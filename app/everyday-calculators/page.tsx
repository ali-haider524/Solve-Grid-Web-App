import type { Metadata } from "next";
import ToolCategoryHub from "../../components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "Everyday Calculators Online – Units, Percentages & Distance",
  description: "Use free online calculators for unit conversion, percentages, coordinate distance, travel distance, and adult BMI screening context.",
  alternates: { canonical: "/everyday-calculators" },
};

export default function EverydayCalculatorsPage() { return <ToolCategoryHub category="everyday" />; }
