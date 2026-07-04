import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import AdvancedStatistics from "./AdvancedStatistics";
export const metadata = createToolMetadata("advanced-statistics");
export default function AdvancedStatisticsPage(){return <><ToolSchema slug="advanced-statistics" /><AdvancedStatistics /><ToolCrossLinks currentSlug="advanced-statistics" /><SiteFooter /></>;}
