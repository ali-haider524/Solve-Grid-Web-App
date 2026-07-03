import type { Metadata } from "next";
import GraphingCalculator from "./GraphingCalculator";

export const metadata: Metadata = {
  title: "Free Online Graphing Calculator | SolveGrid",
  description:
    "Plot equations, inspect tables, trace values, and explore functions with SolveGrid's free online graphing calculator.",
};

export default function GraphingCalculatorPage() {
  return <GraphingCalculator />;
}
