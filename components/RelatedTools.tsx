import Link from "next/link";
import { getRelatedTools, getToolBySlug, getToolPath, type ToolSlug } from "../lib/tools";
import styles from "./SiteChrome.module.css";

type RelatedToolsProps = {
  currentTool: ToolSlug;
};

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const tool = getToolBySlug(currentTool);
  const relatedTools = getRelatedTools(currentTool);

  if (!tool) {
    return null;
  }

  const primaryUseCase = tool.useCases[0]?.toLowerCase() ?? "clear calculations";

  return (
    <section className={styles.relatedSection} aria-labelledby={`${tool.slug}-related-tools`}>
      <div className={styles.relatedHeading}>
        <p className={styles.eyebrow}>KEEP SOLVING</p>
        <h2 id={`${tool.slug}-related-tools`}>Continue with related SolveGrid tools.</h2>
        <p>
          {tool.name} supports {primaryUseCase}. These connected tools help you calculate,
          visualise, and verify the next part of the problem.
        </p>
      </div>

      <div className={styles.relatedGrid}>
        {relatedTools.map((relatedTool) => (
          <Link className={styles.relatedCard} href={getToolPath(relatedTool)} key={relatedTool.slug}>
            <span className={styles.toolIcon}>{relatedTool.icon}</span>
            <h3>{relatedTool.name}</h3>
            <p>{relatedTool.summary}</p>
            <span className={styles.cardLink}>Open tool →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
