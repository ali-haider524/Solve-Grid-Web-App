import Link from "next/link";
import {
  contactEmail,
  githubUrl,
  linkedinUrl,
  youtubeUrl,
} from "../lib/site";
import {
  getCategoryPath,
  getToolsByCategory,
  toolCategories,
} from "../lib/tools";
import styles from "./SiteFooter.module.css";

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
  {
    href: "/guides/gaussian-elimination-for-linear-systems",
    label: "Learn Gaussian elimination",
  },
  {
    href: "/guides/engineering-notation-and-scientific-notation",
    label: "Compare engineering and scientific notation",
  },
  {
    href: "/guides/unit-conversion-formulas",
    label: "Review unit conversion formulas",
  },
  {
    href: "/guides/standard-deviation-formula",
    label: "Understand standard deviation",
  },
  {
    href: "/guides/euler-method-for-differential-equations",
    label: "Learn the Euler method",
  },
];

const socialLinks = [
  { href: githubUrl, label: "SolveGrid on GitHub" },
  { href: linkedinUrl, label: "SolveGrid on LinkedIn" },
  { href: youtubeUrl, label: "SolveGrid on YouTube" },
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
            Free math, engineering, research, finance, and everyday calculators
            with working browser tools, connected guides, and method-focused
            explanations.
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
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.linksGrid}>
          {(Object.keys(toolCategories) as Array<keyof typeof toolCategories>).map(
            (category) => (
              <div key={category}>
                <Link
                  className={styles.categoryLink}
                  href={getCategoryPath(category)}
                >
                  {toolCategories[category].label}
                </Link>
                {getToolsByCategory(category).map((tool) => (
                  <Link href={`/${tool.slug}`} key={tool.slug}>
                    Use {tool.name}
                  </Link>
                ))}
              </div>
            ),
          )}

          <div>
            <p className={styles.categoryLink}>GUIDES &amp; METHODS</p>
            {guideLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <p className={styles.categoryLink}>SITE INFORMATION</p>
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
