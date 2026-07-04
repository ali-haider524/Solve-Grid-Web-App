import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  'About SolveGrid',
  'Learn about SolveGrid, a browser-based platform for free math, engineering, finance, and everyday calculation tools.',
  "/about",
);

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow='ABOUT SOLVEGRID'
      title='About SolveGrid'
      description='Clear online tools for real calculations.'
      updated='4 July 2026'
      sections={[
      {
        title: 'What SolveGrid does',
        paragraphs: [
          'SolveGrid provides browser-based calculators, graphing workspaces, equation solvers, conversion tools, and everyday calculation tools. The goal is to help users enter their own values, understand outputs, and move between connected tools without installing software.',
        ],
      },
      {
        title: 'How the tools are designed',
        paragraphs: [
          'Each public tool is built around a specific task and is connected to relevant calculators, guides, and category pages. We aim to keep core calculations available without an account while making the working area easy to use on desktop and mobile screens.',
        ],
        bullets: ['Tool-first interfaces with inputs and results visible early', 'Related-tool and guide links for next steps', 'Responsive layouts for phones, tablets, and desktop browsers'],
      },
      {
        title: 'Independent service',
        paragraphs: [
          'SolveGrid is an independent tool platform. It is not affiliated with, endorsed by, or connected to calculator manufacturers or third-party brands mentioned in educational comparisons.',
        ],
      }
      ]}
    />
  );
}
