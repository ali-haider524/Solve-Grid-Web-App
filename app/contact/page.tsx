import LegalPage from "../../components/LegalPage";
import { contactEmail } from "../../lib/site";
import { createStaticPageMetadata } from "../../lib/seo";
import styles from "../../components/LegalPage.module.css";

export const metadata = createStaticPageMetadata(
  "Contact SolveGrid Support & Report Calculator Issues",
  "Contact SolveGrid to report a calculator issue, suggest a tool, share website feedback, or ask a privacy or support question.",
  "/contact",
);

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="CONTACT SOLVEGRID"
      title="Contact and feedback"
      description="Report a calculation issue, suggest a tool, or ask a general website question."
      updated="30 July 2026"
      sections={[
        {
          title: "How to report a calculation issue",
          paragraphs: [
            "Include the calculator or guide URL, the exact values or expression you entered, the displayed result, the result you expected, and a screenshot where possible. Clear examples make it easier to reproduce and review a problem.",
            "Do not send passwords, payment details, government ID numbers, medical records, or other sensitive personal information through email.",
          ],
          bullets: [
            "Page URL and calculator name",
            "Exact inputs, units, options, or expression",
            "Displayed result and expected result",
            "Browser or device details when the issue is visual or interactive",
          ],
        },
        {
          title: "Response scope",
          paragraphs: [
            "We can review website feedback, accessibility concerns, unclear explanations, and reproducible calculation bugs. We cannot provide individualized medical, legal, tax, investment, lending, engineering-safety, or other professional advice.",
          ],
        },
      ]}
    >
      {contactEmail ? (
        <div className={styles.contactCard}>
          <p>PUBLIC SUPPORT EMAIL</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <span>
            Use this address for calculation reports, website feedback, privacy
            questions, and general support.
          </span>
        </div>
      ) : (
        <div className={styles.notice}>
          <strong>Support email setup:</strong> configure a working
          <code> NEXT_PUBLIC_CONTACT_EMAIL </code>
          value in the hosting environment before publishing an email address.
          Do not add an unmonitored or invented mailbox.
        </div>
      )}
    </LegalPage>
  );
}
