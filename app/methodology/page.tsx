import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Methods, Accuracy and Limitations",
  "Learn how SolveGrid calculation methods, assumptions, browser-based processing, updates, and accuracy limitations are handled.",
  "/methodology",
);

export default function MethodologyPage() {
  return (
    <LegalPage
      eyebrow="METHODS & ACCURACY"
      title="How SolveGrid methods and results work"
      description="Clear calculation methods, visible assumptions, and sensible limits for browser-based tools."
      updated="5 July 2026"
      sections={[
        {
          title: "Method-first tools",
          paragraphs: [
            "SolveGrid tools are designed around a defined method: for example, a formula, numerical approximation, matrix operation, statistical test, or unit-conversion relationship. Where a method has assumptions or limitations, the relevant workspace and guide are intended to show them clearly.",
            "Some research workspaces provide numerical approximations rather than exact symbolic answers. Input choices, rounding, step size, and model assumptions can change a result.",
          ],
        },
        {
          title: "Browser-based calculations",
          paragraphs: [
            "Most current calculations run in the browser. This helps keep common calculations fast and does not require creating an account. Clearing a form or reloading a page may remove the values currently held in that workspace.",
          ],
        },
        {
          title: "Checking important results",
          paragraphs: [
            "Use the result together with the displayed inputs, units, method, and assumptions. Verify high-stakes engineering, medical, financial, legal, safety, academic, or research work using appropriate standards, source data, and qualified review.",
          ],
        },
        {
          title: "Updates and feedback",
          paragraphs: [
            "Tools and guides may be updated when a calculation issue, usability problem, or clearer method is identified. To report a problem, use the contact page and include the page URL, input values, expected outcome, and a screenshot where possible.",
          ],
        },
      ]}
    />
  );
}
