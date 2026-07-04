import Link from "next/link";
import { getToolBySlug, type ToolSlug } from "../lib/tools";
import styles from "./SiteChrome.module.css";

type BreadcrumbsProps = {
  currentTool: ToolSlug;
};

export default function Breadcrumbs({ currentTool }: BreadcrumbsProps) {
  const tool = getToolBySlug(currentTool);

  if (!tool) {
    return null;
  }

  return (
    <div className={styles.breadcrumbWrap}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.separator}>/</span>
        <Link href="/tools">Tools</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.currentCrumb}>{tool.name}</span>
      </nav>
    </div>
  );
}
