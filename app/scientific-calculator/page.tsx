import type { Metadata } from "next";
import ScientificCalculator from "./ScientificCalculator";

export const metadata: Metadata = {
  title: "Free Scientific Calculator Online | SolveGrid",
  description:
    "Use SolveGrid's free online scientific calculator for trigonometry, roots, powers, logarithms, and everyday calculations.",
};

export default function ScientificCalculatorPage() {
  return <ScientificCalculator />;
}