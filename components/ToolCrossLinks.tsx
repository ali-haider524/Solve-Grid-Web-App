import Link from "next/link";
import { getGuidesForTool } from "../lib/guides";
import { getRelatedTools, getToolBySlug } from "../lib/tools";
import styles from "./ToolCrossLinks.module.css";

type ToolCrossLinksProps = { currentSlug: string };

export default function ToolCrossLinks({ currentSlug }: ToolCrossLinksProps) {
  const currentTool = getToolBySlug(currentSlug);
  const relatedTools = getRelatedTools(currentSlug);
  const relatedGuides = getGuidesForTool(currentSlug);
  if (!currentTool) return null;
  return <section className={styles.section} aria-labelledby={`${currentSlug}-related-tools`}><div className={styles.container}>
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/tools">Tools</Link><span>›</span><span aria-current="page">{currentTool.name}</span></nav>
    <div className={styles.copyGrid}><article className={styles.aboutCard}><p className={styles.eyebrow}>ABOUT THIS TOOL</p><h2>{currentTool.name}</h2><p>{currentTool.summary}</p><ul>{currentTool.useCases.map((useCase)=><li key={useCase}>{useCase}</li>)}</ul>{currentTool.features?.length?<div className={styles.featureList}><p>KEY FUNCTIONS</p><div>{currentTool.features.map((feature)=><span key={feature}>{feature}</span>)}</div></div>:null}</article><aside className={styles.faqCard}><p className={styles.eyebrow}>QUICK QUESTIONS</p>{currentTool.faqs.map((faq)=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</aside></div>
    {relatedGuides.length?<section className={styles.guideStrip} aria-label="Related calculation guides"><div><p className={styles.eyebrow}>LEARN THE METHOD</p><h2>Short guides for this workflow</h2></div><div className={styles.guideLinks}>{relatedGuides.map((guide)=><Link href={`/guides/${guide.slug}`} key={guide.slug}><span>GUIDE</span><strong>{guide.title}</strong><small>{guide.summary}</small><b>Read →</b></Link>)}</div></section>:null}
    <div className={styles.relatedHeader}><div><p className={styles.eyebrow}>KEEP SOLVING</p><h2 id={`${currentSlug}-related-tools`}>Related calculators</h2></div><Link className={styles.allToolsLink} href="/tools">Browse all tools →</Link></div>
    <div className={styles.cardGrid}>{relatedTools.map((tool)=><Link className={styles.toolCard} href={`/${tool.slug}`} key={tool.slug}><span className={styles.icon}>{tool.icon}</span><div><h3>{tool.name}</h3><p>{tool.summary}</p></div><span className={styles.arrow}>→</span></Link>)}</div>
  </div></section>;
}
