import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import UnitConverter from "./UnitConverter";

export const metadata = createToolMetadata("unit-converter");

export default function UnitConverterPage() {
  return (
    <>
      <ToolSchema slug="unit-converter" />
      <UnitConverter />
      <ToolCrossLinks currentSlug="unit-converter" />
      <SiteFooter />
    </>
  );
}
