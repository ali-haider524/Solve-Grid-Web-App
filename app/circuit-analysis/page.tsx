import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import CircuitAnalysis from "./CircuitAnalysis";

export const metadata = createToolMetadata("circuit-analysis");

export default function CircuitAnalysisPage() {
  return (
    <>
      <ToolSchema slug="circuit-analysis" />
      <CircuitAnalysis />
      <ToolCrossLinks currentSlug="circuit-analysis" />
      <SiteFooter />
    </>
  );
}
