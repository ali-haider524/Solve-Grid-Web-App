import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import ToolHeader from "../../components/ToolHeader";
import { getToolsByCategory, toolCategories, tools } from "../../lib/tools";
import styles from "./tools.module.css";

export const metadata: Metadata = {
  title: "Free Online Calculators, Math Tools & Engineering Tools",
  description: "Browse SolveGrid's free online math, engineering, research, percentage, profit, interest, loan, discount, matrix, graphing, and everyday calculators.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="tools" />
      <section className={styles.hero}>
        <p>FREE ONLINE CALCULATOR DIRECTORY</p>
        <h1>Find the right calculator for the problem.</h1>
        <span>Browse connected math, engineering, finance, and everyday calculators. Every tool works directly in the browser and links to useful next steps.</span>
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
