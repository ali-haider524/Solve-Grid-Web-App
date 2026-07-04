import Link from "next/link";
import { getToolPath, tools, type ToolSlug } from "../lib/tools";
import styles from "./SiteChrome.module.css";

type SiteHeaderProps = {
  currentTool?: ToolSlug;
};

export default function SiteHeader({ currentTool }: SiteHeaderProps) {
  const quickLinks = tools.filter((tool) =>
    ["graphing-calculator", "equation-solver", "unit-converter"].includes(tool.slug),
  );

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="SolveGrid home">
          <span className={styles.brandMark}>∑</span>
          <span>SolveGrid</span>
        </Link>

        <nav className={styles.primaryNav} aria-label="SolveGrid navigation">
          <Link
            className={currentTool ? styles.navLink : `${styles.navLink} ${styles.navLinkActive}`}
            href="/tools"
          >
            All tools
          </Link>
          {quickLinks.map((tool) => (
            <Link
              className={
                currentTool === tool.slug
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
              href={getToolPath(tool)}
              key={tool.slug}
            >
              {tool.shortName}
            </Link>
          ))}
        </nav>

        <Link className={styles.headerCta} href="/tools">
          Explore tools
        </Link>
      </div>
    </header>
  );
}
