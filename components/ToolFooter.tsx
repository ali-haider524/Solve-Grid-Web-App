import Link from "next/link";
import { getCategoryPath, getToolPath, getToolsByCategory, toolCategories, type ToolCategory } from "../lib/tools";
import styles from "./SiteChrome.module.css";

export default function ToolFooter() {
  const categories = Object.keys(toolCategories) as ToolCategory[];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div>
            <Link className={styles.footerBrand} href="/">
              <span className={styles.footerBrandMark}>∑</span>
              <span>SolveGrid</span>
            </Link>
            <p className={styles.footerIntro}>
              Free browser-based math, graphing, algebra, engineering, and everyday calculation tools.
            </p>
          </div>

          {categories.map((category) => (
            <div className={styles.footerColumn} key={category}>
              <Link href={getCategoryPath(category)}>
                <h2>{toolCategories[category].label.toUpperCase()}</h2>
              </Link>
              <div className={styles.footerLinks}>
                {getToolsByCategory(category).map((tool) => (
                  <Link href={getToolPath(tool)} key={tool.slug}>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} SolveGrid. Independent online calculation tools.</span>
          <Link href="/tools">Browse all live tools</Link>
        </div>
      </div>
    </footer>
  );
}
