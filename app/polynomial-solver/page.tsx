import type { Metadata } from "next";
import PolynomialSolver from "./PolynomialSolver";

export const metadata: Metadata = {
  title: "Polynomial Solver Online – Find Roots of Degree 1 to 10 | SolveGrid",
  description:
    "Solve polynomial equations online from degree 1 to 10. Find real and complex roots from coefficients with a clear numerical-result workspace.",
  alternates: {
    canonical: "/polynomial-solver",
  },
};

export default function PolynomialSolverPage() {
  return <PolynomialSolver />;
}
