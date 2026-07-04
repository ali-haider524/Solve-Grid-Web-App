import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  'Privacy Policy',
  'Read how SolveGrid handles calculator inputs, optional share links, hosting logs, and future service updates.',
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow='PRIVACY POLICY'
      title='Privacy Policy'
      description='How calculation data and site information are handled.'
      updated='4 July 2026'
      sections={[
      {
        title: 'Calculator inputs',
        paragraphs: [
          'Most SolveGrid calculations run in the browser. We do not provide user accounts or a database for saving calculator inputs in the current version of the site.',
        ],
      },
      {
        title: 'Shareable links',
        paragraphs: [
          'Some tools can create a pre-filled link. Dates, values, or settings are placed in that link only after you choose the share or copy-link action. Anyone who receives that link may be able to view the values inside it, so do not share a link containing information you consider private.',
        ],
      },
      {
        title: 'Technical information',
        paragraphs: [
          'Like most websites, our hosting provider may process limited technical information such as IP address, browser type, device information, requested pages, and timestamps to operate, secure, and improve the service.',
        ],
      },
      {
        title: 'Cookies, analytics, and advertising',
        paragraphs: [
          'SolveGrid does not currently require an account. If analytics, advertising, embedded services, or additional cookies are added later, this policy will be updated before those changes are made.',
        ],
      },
      {
        title: 'Your choices',
        paragraphs: [
          'You can clear a tool form, avoid creating share links, and contact us with privacy questions. If you later provide information through a future contact form or account feature, the applicable privacy notice will explain how that information is handled.',
        ],
      }
      ]}
    />
  );
}
