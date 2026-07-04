import LegalPage from "../../components/LegalPage";
import { contactEmail } from "../../lib/site";
import { createStaticPageMetadata } from "../../lib/seo";
import styles from "../../components/LegalPage.module.css";

export const metadata = createStaticPageMetadata(
  "Contact SolveGrid",
  "Contact SolveGrid for website feedback, calculator issues, privacy questions, or general support.",
  "/contact",
);

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="CONTACT SOLVEGRID"
      title="Contact and feedback"
      description="Report a calculation issue, suggest a tool, or ask a general website question."
      updated="4 July 2026"
      sections={[
        {
          title: "How to contact us",
          paragraphs: [
            "For calculator issues, include the page URL, the values or expression you entered, the result you expected, and a screenshot where possible.",
            "Do not send passwords, payment details, government ID numbers, medical records, or other sensitive personal information through email.",
          ],
        },
        {
          title: "Response scope",
          paragraphs: [
            "We can review website feedback and calculation bugs, but we cannot provide individualized medical, legal, tax, investment, lending, or safety advice.",
          ],
        },
      ]}
    >
      {contactEmail ? (
        <div className={styles.contactCard}>
          <p>SUPPORT EMAIL</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <span>Use this address for feedback, privacy questions, and website support.</span>
        </div>
      ) : (
        <div className={styles.notice}>
          <strong>Launch setup required:</strong> configure <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in your hosting environment before publishing this page publicly.
        </div>
      )}
    </LegalPage>
  );
}
