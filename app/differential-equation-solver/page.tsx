import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import DifferentialEquationSolver from "./DifferentialEquationSolver";

export const metadata = createToolMetadata("differential-equation-solver");

export default function DifferentialEquationSolverPage() {
  return (
    <>
      <ToolSchema slug="differential-equation-solver" />
      <DifferentialEquationSolver />
      <ToolCrossLinks currentSlug="differential-equation-solver" />
      <SiteFooter />
    </>
  );
}
