import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";
import { siteOperatorName } from "../../lib/site";

export const metadata = createStaticPageMetadata(
  "About SolveGrid Online Calculators",
  "Learn how SolveGrid builds browser-based math, engineering, finance, unit-conversion, research, and everyday calculators with clear methods and limits.",
  "/about",
);

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT SOLVEGRID"
      title="About SolveGrid"
      description="Independent browser-based calculators, method guides, and connected problem-solving tools."
      updated="30 July 2026"
      sections={[
        {
          title: "What SolveGrid does",
          paragraphs: [
            "SolveGrid provides browser-based calculators, graphing workspaces, equation solvers, matrix tools, conversion tools, research labs, finance calculators, and practical calculation guides. The goal is to help users enter their own values, see results clearly, and move between connected tools without installing software.",
            "The current public tools are designed for focused tasks rather than one oversized calculator menu. This makes it easier to choose an appropriate workspace for graphing, algebra, matrices, statistics, scientific calculations, unit conversion, numerical methods, finance, or everyday problems.",
          ],
        },
        {
          title: "How the tools are designed",
          paragraphs: [
            "Each public tool is built around a defined calculation method, such as a formula, matrix operation, numerical approximation, statistical procedure, or unit-conversion relationship. We aim to make the method, inputs, units, assumptions, and important limitations clear in the workspace, a related guide, or the Methods & Accuracy page.",
          ],
          bullets: [
            "Working inputs and results are presented early in each calculator",
            "Method notes and limitations are included where they affect interpretation",
            "Related calculators and guides provide useful next steps",
            "Responsive layouts are tested for phones, tablets, and desktop browsers",
          ],
        },
        {
          title: "Maintenance and corrections",
          paragraphs: [
            `${siteOperatorName} maintains the public SolveGrid website. Tool and guide updates may be made when a calculation issue, usability problem, unclear explanation, or better supporting example is identified.`,
            "Users can report a calculation problem through the Contact page. A useful report includes the page URL, the exact inputs or expression, the displayed result, the expected result, and a screenshot where possible.",
          ],
        },
        {
          title: "Independent service",
          paragraphs: [
            "SolveGrid is an independent online tool platform. It is not affiliated with, endorsed by, or connected to calculator manufacturers or third-party brands mentioned in educational comparisons.",
            "SolveGrid provides calculation support and educational explanations, not individualized medical, legal, tax, investment, engineering-safety, or other professional advice.",
          ],
        },
      ]}
    />
  );
}
