import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import SymbolicAlgebra from "./SymbolicAlgebra";

export const metadata = createToolMetadata("symbolic-algebra");

export default function SymbolicAlgebraPage() {
  return <><ToolSchema slug="symbolic-algebra" /><SymbolicAlgebra /><ToolCrossLinks currentSlug="symbolic-algebra" /><SiteFooter /></>;
}
