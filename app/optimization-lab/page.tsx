import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import OptimizationLab from "./OptimizationLab";

export const metadata = createToolMetadata("optimization-lab");
export default function OptimizationLabPage() { return <><ToolSchema slug="optimization-lab" /><OptimizationLab /><ToolCrossLinks currentSlug="optimization-lab" /><SiteFooter /></>; }
