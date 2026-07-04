import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import ToolHeader from "../../components/ToolHeader";
import { getToolsByCategory } from "../../lib/tools";
import { createStaticPageMetadata } from "../../lib/seo";
import { siteName, siteUrl } from "../../lib/site";
import styles from "./research-tools.module.css";

export const metadata: Metadata = createStaticPageMetadata(
  "Research Tools & Numerical Analysis Labs",
  "Explore SolveGrid research workspaces for differential equations, symbolic algebra, linear programming, DC circuit analysis, and advanced statistical inference.",
  "/research-tools",
);

const principles = [
  { title: "Inspectable methods", text: "Every lab states its method and limitations instead of presenting a black-box answer." },
  { title: "Focused workspaces", text: "Research tasks need dedicated inputs, results, tables, and charts rather than a crowded one-size-fits-all calculator." },
  { title: "Connected analysis", text: "Move naturally between graphing, matrices, statistics, units, and numerical models when a problem needs more than one view." },
];

export default function ResearchToolsPage() {
  const researchTools = getToolsByCategory("research");
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SolveGrid Research & Simulation Labs",
    description: "Research-focused numerical analysis, symbolic algebra, circuit analysis, optimization, and statistical-inference workspaces.",
    url: `${siteUrl}/research-tools`,
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    hasPart: researchTools.map((tool) => ({ "@type": "WebApplication", name: tool.name, url: `${siteUrl}/${tool.slug}`, applicationCategory: "EducationalApplication" })),
  };

  return (
    <main id="main-content" className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolHeader active="research" />
      <section className={styles.hero}>
        <p>RESEARCH & SIMULATION LABS</p>
        <h1>Advanced calculation workspaces that keep the method visible.</h1>
        <span>Use focused labs for symbolic algebra, numerical differential equations, linear programming, DC circuit analysis, and statistical inference. Each workspace makes scope and assumptions clear.</span>
        <div className={styles.heroActions}><Link href="#labs">Explore research labs</Link><Link href="/guides">Read method guides</Link></div>
      </section>
      <section className={styles.labSection} id="labs">
        <div className={styles.sectionHeading}><p>AVAILABLE LABS</p><h2>Choose a method before choosing more controls.</h2><span>Each workspace is separate so the main result, assumptions, and next step stay easy to find on desktop and mobile.</span></div>
        <div className={styles.toolGrid}>{researchTools.map((tool) => <Link className={styles.toolCard} href={`/${tool.slug}`} key={tool.slug}><span className={styles.icon}>{tool.icon}</span><div><h2>{tool.name}</h2><p>{tool.summary}</p><small>{tool.features?.slice(0, 3).join(" · ")}</small></div><b>Open →</b></Link>)}</div>
      </section>
      <section className={styles.principleGrid}>{principles.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</section>
      <section className={styles.connected}><p>CONNECTED FOUNDATIONS</p><h2>Research results are easier to check when the surrounding tools are one click away.</h2><div><Link href="/graphing-calculator">Graph functions →</Link><Link href="/matrix-calculator">Matrix & systems →</Link><Link href="/statistics-calculator">Descriptive statistics →</Link><Link href="/unit-converter">Units & dimensions →</Link></div></section>
      <SiteFooter />
    </main>
  );
}
