import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import EquationSolver from "./EquationSolver";

export const metadata = createToolMetadata("equation-solver");

export default function EquationSolverPage() {
  return (
    <>
      <ToolSchema slug="equation-solver" />
      <EquationSolver />
      <ToolCrossLinks currentSlug="equation-solver" />
      <SiteFooter />
    </>
  );
}
