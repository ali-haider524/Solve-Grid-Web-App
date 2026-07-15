import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Online Calculation Tools & Methods",
  "Learn how SolveGrid provides browser-based tools for math, engineering, finance, unit conversion, and everyday calculations with clear methods and limitations.",
  "/about",
);

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT SOLVEGRID"
      title="About SolveGrid"
      description="Clear online tools for real calculations."
      updated="6 July 2026"
      sections={[
        {
          title: "What SolveGrid does",
          paragraphs: [
            "SolveGrid provides browser-based calculators, graphing workspaces, equation solvers, conversion tools, guides to learn step by step use and everyday calculation tools. The goal is to help users enter their own values, see results clearly, and move between connected tools without installing software.",
          ],
        },
        {
          title: "How the tools are designed",
          paragraphs: [
            "Each public tool is built around a defined calculation method, such as a formula, matrix operation, numerical approximation, statistical procedure, or unit-conversion relationship. We aim to make the method, inputs, units, and important limitations clear in the workspace, a related guide, or our Methods & Accuracy page.",
            "Tools are separated by task rather than copied from one large calculator menu. This makes it easier to select a workspace for graphing, algebra, matrices, statistics, scientific calculations, finance, or everyday problems.",
          ],
          bullets: [
            "Tool-first interfaces with inputs and results visible early",
            "Calculation methods, assumptions, and limitations explained where relevant",
            "Related-tool and guide links for sensible next steps",
            "Responsive layouts for phones, tablets, and desktop browsers",
          ],
        },
        {
          title: "Independent service",
          paragraphs: [
            "SolveGrid is an independent tool platform. It is not affiliated with, endorsed by, or connected to calculator manufacturers or third-party brands mentioned in educational comparisons.",
          ],
        },
      ]}
    />
  );
}
