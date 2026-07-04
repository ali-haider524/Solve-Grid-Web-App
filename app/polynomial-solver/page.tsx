import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import PolynomialSolver from "./PolynomialSolver";

export const metadata = createToolMetadata("polynomial-solver");

export default function PolynomialSolverPage() {
  return (
    <>
      <ToolSchema slug="polynomial-solver" />
      <PolynomialSolver />
      <ToolCrossLinks currentSlug="polynomial-solver" />
      <SiteFooter />
    </>
  );
}
