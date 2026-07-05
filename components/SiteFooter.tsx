import Link from "next/link";
import { getCategoryPath, getToolsByCategory, toolCategories } from "../lib/tools";
import { contactEmail } from "../lib/site";
import styles from "./SiteFooter.module.css";

const trustLinks = [
  { href: "/about", label: "About SolveGrid" },
  { href: "/contact", label: "Contact" },
  { href: "/methodology", label: "Methods & Accuracy" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <Link className={styles.brand} href="/"><span>∑</span>SolveGrid</Link>
          <p>Free math, engineering, finance, and everyday calculators built to be clear, useful, and easy to access in the browser.</p>
          <Link className={styles.toolsButton} href="/tools">Explore all tools →</Link>
          {contactEmail ? <a className={styles.contactLink} href={`mailto:${contactEmail}`}>Contact support</a> : null}
        </div>
        <div className={styles.linksGrid}>
          {(Object.keys(toolCategories) as Array<keyof typeof toolCategories>).map((category) => (
            <div key={category}>
              <Link className={styles.categoryLink} href={getCategoryPath(category)}>{toolCategories[category].label}</Link>
              {getToolsByCategory(category).map((tool) => <Link href={`/${tool.slug}`} key={tool.slug}>{tool.name}</Link>)}
            </div>
          ))}
          <div>
            <p className={styles.categoryLink}>SITE INFORMATION</p>
            {trustLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
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
