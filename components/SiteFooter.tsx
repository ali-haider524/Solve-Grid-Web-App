import Link from "next/link";
import {
  contactEmail,
  facebookUrl,
  githubUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
} from "../lib/site";
import { getCategoryPath, getToolsByCategory, toolCategories } from "../lib/tools";
import styles from "./SiteFooter.module.css";

// Keep the footer short: the most-used statistics tools, the category hubs
// (which list every tool), guides, and site information.
const popularToolLinks = [
  { href: "/t-test-calculator", label: "t-test calculator" },
  { href: "/one-way-anova-calculator", label: "One-way ANOVA" },
  { href: "/chi-square-calculator", label: "Chi-square test" },
  { href: "/correlation-calculator", label: "Correlation calculator" },
  { href: "/linear-regression-calculator", label: "Linear regression" },
  { href: "/power-analysis-calculator", label: "Power analysis" },
  { href: "/sample-size-calculator", label: "Sample size calculator" },
  { href: "/cronbach-alpha-calculator", label: "Cronbach's alpha" },
];

const trustLinks = [
  { href: "/about", label: "About SolveGrid" },
  { href: "/contact", label: "Contact and feedback" },
  { href: "/methodology", label: "Calculation methods and accuracy" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/disclaimer", label: "Calculator disclaimer" },
];

const guideLinks = [
  { href: "/guides", label: "Browse all calculation guides" },
  { href: "/guides/choose-a-statistical-test", label: "Which statistical test should I use?" },
  { href: "/guides/how-to-report-t-test-apa", label: "How to report a t-test in APA style" },
  { href: "/guides/how-to-report-regression-apa", label: "How to report regression in APA style" },
  { href: "/guides/likert-scale-interpretation", label: "Likert scale interpretation" },
  { href: "/guides/slovin-formula-sample-size", label: "Slovin's formula for sample size" },
];

const socialLinks = [
  { href: facebookUrl, label: "SolveGrid on Facebook" },
  { href: instagramUrl, label: "SolveGrid on Instagram" },
  { href: youtubeUrl, label: "SolveGrid on YouTube" },
  { href: githubUrl, label: "SolveGrid on GitHub" },
  { href: linkedinUrl, label: "SolveGrid on LinkedIn" },
].filter((link) => Boolean(link.href));

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <Link className={styles.brand} href="/">
            <span>∑</span>
            SolveGrid
          </Link>
          <p>
            Free research statistics calculators for theses and surveys, with
            supporting math tools, connected guides, and step-by-step working.
          </p>
          <Link className={styles.toolsButton} href="/tools">
            Browse all online calculators →
          </Link>
          {contactEmail ? (
            <a className={styles.contactLink} href={`mailto:${contactEmail}`}>
              Email SolveGrid support
            </a>
          ) : (
            <Link className={styles.contactLink} href="/contact">
              Report a calculation issue
            </Link>
          )}
          {socialLinks.length ? (
            <div className={styles.socialLinks} aria-label="SolveGrid profiles">
              {socialLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.href}
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.linksGrid}>
          <div>
            <Link className={styles.categoryLink} href={getCategoryPath("statistics")}>
              Popular statistics tools
            </Link>
            {popularToolLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <Link className={styles.moreLink} href={getCategoryPath("statistics")}>
              All {getToolsByCategory("statistics").length} statistics calculators →
            </Link>
          </div>

          <div>
            <p className={styles.categoryLink}>Tool categories</p>
            {(Object.keys(toolCategories) as Array<keyof typeof toolCategories>).map((category) => (
              <Link href={getCategoryPath(category)} key={category}>
                {toolCategories[category].label}
              </Link>
            ))}
            <Link href="/tools">All tools</Link>
          </div>

          <div>
            <p className={styles.categoryLink}>Guides</p>
            {guideLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <p className={styles.categoryLink}>Site information</p>
            {trustLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} SolveGrid. Independent online calculation
          tools.
        </span>
        <span>Results are informational; verify important decisions.</span>
      </div>
    </footer>
  );
}
