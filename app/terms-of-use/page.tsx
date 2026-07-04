import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  'Terms of Use',
  'Read the terms for using SolveGrid free browser-based calculator and learning tools.',
  "/terms-of-use",
);

export default function TermsOfUsePage() {
  return (
    <LegalPage
      eyebrow='TERMS OF USE'
      title='Terms of Use'
      description='Terms for using SolveGrid tools and learning content.'
      updated='4 July 2026'
      sections={[
      {
        title: 'Using the service',
        paragraphs: [
          'You may use SolveGrid for lawful personal, educational, and professional calculation tasks. You are responsible for entering values correctly and checking outputs where accuracy matters.',
        ],
      },
      {
        title: 'No guarantee of suitability',
        paragraphs: [
          'Tools and guides are provided for general informational and educational use. Results can be affected by input choices, assumptions, rounding, browser behavior, and the limits of a given calculation method.',
        ],
      },
      {
        title: 'Intellectual property',
        paragraphs: [
          'The SolveGrid name, interface, original code, written content, and visual design are protected by applicable law. You may link to public tools and share generated results, but you may not copy the site in a misleading way or present it as your own service.',
        ],
      },
      {
        title: 'Changes to the service',
        paragraphs: [
          'We may update, add, remove, or improve tools and content. Material changes to these terms will be reflected by an updated date on this page.',
        ],
      }
      ]}
    />
  );
}
