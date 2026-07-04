import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  'Disclaimer',
  'Understand the limitations of SolveGrid calculator results and when to seek qualified professional advice.',
  "/disclaimer",
);

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow='CALCULATION DISCLAIMER'
      title='Disclaimer'
      description='Use results as a helpful calculation aid, not a substitute for professional judgment.'
      updated='4 July 2026'
      sections={[
      {
        title: 'General calculation disclaimer',
        paragraphs: [
          'SolveGrid provides automated calculations based on the values and settings you enter. We work to make the tools useful and clear, but we do not guarantee that every result is complete, error-free, appropriate for every situation, or suitable for high-stakes decisions.',
        ],
      },
      {
        title: 'Professional decisions',
        paragraphs: [
          'Do not rely solely on SolveGrid for medical, legal, financial, engineering, safety, tax, lending, or other professional decisions. Confirm important work with a qualified professional and the applicable standards, regulations, or official sources.',
        ],
      },
      {
        title: 'Health and finance tools',
        paragraphs: [
          'BMI, interest, loan, profit, and similar tools are educational estimators. They are not diagnoses, lending offers, investment advice, tax advice, or individualized recommendations.',
        ],
      },
      {
        title: 'External links and future services',
        paragraphs: [
          'If SolveGrid links to another website or later includes third-party services, those services have their own content and policies. Review them before using or sharing information through them.',
        ],
      }
      ]}
    />
  );
}
