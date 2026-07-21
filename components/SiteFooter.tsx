import Link from "next/link";
import { contactEmail } from "../lib/site";
import { getCategoryPath, getToolsByCategory, toolCategories } from "../lib/tools";
import styles from "./SiteFooter.module.css";

const trustLinks = [
  { href: "/about", label: "About SolveGrid" },
  { href: "/contact", label: "Contact" },
  { href: "/methodology", label: "Methods & Accuracy" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const guideLinks = [
  { href: "/guides", label: "All calculation guides" },
  {
    href: "/guides/gaussian-elimination-for-linear-systems",
    label: "Gaussian elimination",
  },
  {
    href: "/guides/engineering-notation-and-scientific-notation",
    label: "Engineering notation",
  },
  {
    href: "/guides/unit-conversion-formulas",
    label: "Unit conversion formulas",
  },
  {
    href: "/guides/standard-deviation-formula",
    label: "Standard deviation",
  },
  {
    href: "/guides/euler-method-for-differential-equations",
    label: "Euler method",
  },
];

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
            with clear inputs, connected guides, and method-focused explanations.
          </p>
          <Link className={styles.toolsButton} href="/tools">
            Explore all tools →
          </Link>
          {contactEmail ? (
            <a className={styles.contactLink} href={`mailto:${contactEmail}`}>
              Contact support
            </a>
          ) : null}
        </div>

        <div className={styles.linksGrid}>
          {(Object.keys(toolCategories) as Array<keyof typeof toolCategories>).map(
            (category) => (
              <div key={category}>
                <Link className={styles.categoryLink} href={getCategoryPath(category)}>
                  {toolCategories[category].label}
                </Link>
                {getToolsByCategory(category).map((tool) => (
                  <Link href={`/${tool.slug}`} key={tool.slug}>
                    {tool.name}
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
        <span>© {new Date().getFullYear()} SolveGrid. Independent online calculation tools.</span>
        <span>Results are informational; verify important decisions.</span>
      </div>
    </footer>
  );
}
