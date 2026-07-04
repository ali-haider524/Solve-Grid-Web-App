import Link from "next/link";
import { getCategoryPath, getToolsByCategory, toolCategories, type ToolCategory } from "../lib/tools";
import ToolHeader from "./ToolHeader";
import SiteFooter from "./SiteFooter";
import styles from "./ToolCategoryHub.module.css";

type ToolCategoryHubProps = { category: ToolCategory };

export default function ToolCategoryHub({ category }: ToolCategoryHubProps) {
  const categoryInfo = toolCategories[category];
  const categoryTools = getToolsByCategory(category);

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active={category} />
      <section className={styles.hero}>
        <p>{categoryInfo.label.toUpperCase()}</p>
        <h1>{categoryInfo.label}</h1>
        <span>{categoryInfo.intro}</span>
      </section>
      <section className={styles.content}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>›</span><Link href="/tools">Tools</Link><span>›</span><span aria-current="page">{categoryInfo.label}</span>
        </nav>
        <div className={styles.introCard}>
          <div><p>TOOL COLLECTION</p><h2>Choose a focused tool for the task.</h2></div>
          <span>{categoryInfo.description}</span>
        </div>
        <div className={styles.grid}>
          {categoryTools.map((tool) => (
            <Link className={styles.card} href={`/${tool.slug}`} key={tool.slug}>
              <span className={styles.icon}>{tool.icon}</span>
              <div><h2>{tool.name}</h2><p>{tool.summary}</p></div>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
        <section className={styles.otherCategories}>
          <p>EXPLORE MORE</p>
          <div>
            {(Object.keys(toolCategories) as ToolCategory[]).filter((key) => key !== category).map((key) => (
              <Link href={getCategoryPath(key)} key={key}>{toolCategories[key].label} →</Link>
            ))}
          </div>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
