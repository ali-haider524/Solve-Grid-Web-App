import LegalPage from "../../components/LegalPage";
import { contactEmail } from "../../lib/site";
import { createStaticPageMetadata } from "../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Privacy Policy",
  "Read how SolveGrid handles calculator inputs, support messages, cookies, Google Analytics, technical logs, and shareable links.",
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY POLICY"
      title="Privacy Policy"
      description="How SolveGrid handles calculator inputs, website information, and support messages."
      updated="6 July 2026"
      sections={[
        {
          title: "Scope of this policy",
          paragraphs: [
            "This Privacy Policy explains how SolveGrid handles information when you visit solvegrid.online, use a calculator or guide, create a shareable link, or contact us by email.",
            "SolveGrid currently provides public browser-based tools. You do not need to create an account to use the website.",
          ],
        },
        {
          title: "Calculator inputs",
          paragraphs: [
            "Most SolveGrid calculations run in your browser. We do not provide user accounts or a server-side history for saving ordinary calculator inputs.",
            "Please do not enter passwords, payment information, government ID numbers, medical records, or other sensitive personal information into any calculator field.",
          ],
        },
        {
          title: "Shareable links",
          paragraphs: [
            "Some tools let you create a pre-filled share link. When you choose the copy-link or share option, selected values or settings may be placed in the web address for that link.",
            "Anyone who receives the link may be able to view those values. The link may also appear in browser history, technical logs, or analytics records when it is opened. Do not create or share a link containing information you consider private or sensitive.",
          ],
        },
        {
          title: "Support emails",
          paragraphs: [
            "If you email SolveGrid, we may receive your email address, name if included, message content, attachments, and any other information you choose to send.",
            "We use support messages to reply to you, investigate calculator issues, improve the website, and keep reasonable records of correspondence. Do not send sensitive personal information by email.",
          ],
        },
        {
          title: "Technical information and hosting",
          paragraphs: [
            "Like most websites, our hosting and infrastructure providers may process limited technical information needed to deliver, secure, and troubleshoot the site. This can include IP address, browser type, device information, requested pages, referring page, timestamps, and error information.",
            "We use this information to operate the website, prevent abuse, maintain security, and improve reliability.",
          ],
        },
        {
          title: "Cookies and Google Analytics",
          paragraphs: [
            "SolveGrid uses Google Analytics to understand how visitors use the website. This may include information such as pages viewed, interactions with site content, browser and device categories, referring source, and approximate location information.",
            "Google Analytics may use cookies or similar identifiers to measure website interactions. We use this information to understand site performance, improve tools and guides, and identify usability issues.",
            "SolveGrid does not currently display third-party advertising or run remarketing campaigns. If we add advertising, additional analytics features, or other services in the future, we will update this policy and add any consent controls required by applicable law.",
          ],
        },
        {
          title: "How information is shared",
          paragraphs: [
            "We do not sell calculator inputs or support messages. Information may be processed by service providers that help us host the website, provide analytics, or operate email communications.",
            "We may also disclose information where reasonably necessary to comply with applicable law, protect the website, respond to legal requests, or protect the rights and safety of users and others.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            "You can clear calculator fields, avoid creating share links, control or delete cookies through your browser settings, and choose not to contact us by email.",
            `For privacy questions or requests about information you have provided directly to SolveGrid, contact us at ${contactEmail || "solvegridsupport@gmail.com"}.`,
        ],
       },
        {
          title: "Changes to this policy",
          paragraphs: [
            "We may update this Privacy Policy when the website, its tools, or its data practices change. The latest version will always show its update date at the top of this page.",
          ],
        },
      ]}
    />
  );
}