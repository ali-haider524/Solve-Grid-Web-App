import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import ToolHeader from "../../components/ToolHeader";
import { getToolsByCategory, toolCategories, tools } from "../../lib/tools";
import styles from "./tools.module.css";
import { createStaticPageMetadata } from "../../lib/seo";
import { siteUrl } from "../../lib/site";

export const metadata = createStaticPageMetadata(
  "All SolveGrid Calculators: Statistics, Math & Engineering Index",
  "Index of every SolveGrid calculator by section: research statistics, math and algebra, scientific and engineering tools, and numerical research labs.",
  "/tools",
);

export default function ToolsPage() {
  return (
    <main id="main-content" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
            ],
          }),
        }}
      />
      <ToolHeader active="tools" />
      <section className={styles.hero}>
        <p>FREE ONLINE CALCULATOR DIRECTORY</p>
        <h1>Find the right calculator for the problem.</h1>
        <span>Browse research statistics calculators and supporting math and engineering tools. Every tool works directly in the browser and links to useful next steps.</span>
      </section>
      <section className={styles.directory}>
        {(Object.keys(toolCategories) as Array<keyof typeof toolCategories>).map((category) => (
          <section className={styles.category} key={category}>
            <div className={styles.categoryHeader}>
              <div><p>{toolCategories[category].label.toUpperCase()}</p><h2>{toolCategories[category].label}</h2></div>
              <span>{toolCategories[category].description}</span>
            </div>
            <div className={styles.grid}>
              {getToolsByCategory(category).map((tool) => (
                <Link className={styles.card} href={`/${tool.slug}`} key={tool.slug}>
                  <span className={styles.icon}>{tool.icon}</span>
                  <div><h3>{tool.name}</h3><p>{tool.summary}</p></div>
                  <span className={styles.arrow}>→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
      <p className={styles.directoryCount}>{tools.length} live calculators and growing.</p><section className={styles.keywordNote}>
        <p>BUILT FOR CLEAR SEARCH INTENT</p>
        <h2>Tools, explanations, related calculators, and practical next steps.</h2>
        <span>SolveGrid creates a connected learning path instead of sending visitors to isolated pages.</span>
      </section>
      <SiteFooter />
    </main>
  );
}
