import type { Metadata } from "next";
import EquationSolver from "./EquationSolver";

export const metadata: Metadata = {
  title: "Free Equation Solver – Linear, Quadratic, Cubic & Systems",
  description:
    "Solve linear, quadratic, cubic, two-variable, and three-variable equations online with clear answers and calculation steps.",
  alternates: {
    canonical: "/equation-solver",
  },
};

export default function EquationSolverPage() {
  return <EquationSolver />;
}
