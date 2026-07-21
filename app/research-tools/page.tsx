import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import ToolHeader from "../../components/ToolHeader";
import { getGuidesForTools } from "../../lib/guides";
import { createStaticPageMetadata } from "../../lib/seo";
import { siteName, siteUrl } from "../../lib/site";
import { getToolsByCategory } from "../../lib/tools";
import styles from "./research-tools.module.css";

export const metadata: Metadata = createStaticPageMetadata(
  "Research Tools & Numerical Analysis Labs",
  "Explore SolveGrid research workspaces for differential equations, symbolic algebra, linear programming, DC circuit analysis, and advanced statistical inference.",
  "/research-tools",
);

const principles = [
  {
    title: "Inspectable methods",
    text: "Every lab states its method and limitations instead of presenting a black-box answer.",
  },
  {
    title: "Focused workspaces",
    text: "Research tasks need dedicated inputs, results, tables, and charts rather than a crowded one-size-fits-all calculator.",
  },
  {
    title: "Connected analysis",
    text: "Move naturally between graphing, matrices, statistics, units, and numerical models when a problem needs more than one view.",
  },
];

const faqs = [
  {
    question: "Are the research-lab results exact?",
    answer:
      "Some symbolic operations return algebra-engine results, while differential equations, optimization, circuit models, and statistical procedures may be numerical or assumption-dependent. Each lab explains its scope.",
  },
  {
    question: "Which differential-equation methods are available?",
    answer:
      "The Differential Equations Lab includes Euler, Improved Euler (Heun), and classical Runge–Kutta 4 for fixed-step first-order problems and small two-state systems.",
  },
  {
    question: "Can these tools replace specialist research software?",
    answer:
      "No. They are focused educational and exploratory workspaces. Validate important results with theory, data checks, domain review, and appropriate specialist software.",
  },
];

export default function ResearchToolsPage() {
  const researchTools = getToolsByCategory("research");
  const researchGuides = getGuidesForTools(
    researchTools.map((tool) => tool.slug),
    6,
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "SolveGrid Research & Simulation Labs",
        description:
          "Research-focused numerical analysis, symbolic algebra, circuit analysis, optimization, and statistical-inference workspaces.",
        url: `${siteUrl}/research-tools`,
        inLanguage: "en",
        publisher: { "@type": "Organization", name: siteName, url: siteUrl },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: researchTools.length,
          itemListElement: researchTools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.name,
            url: `${siteUrl}/${tool.slug}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
          {
            "@type": "ListItem",
            position: 3,
            name: "Research tools",
            item: `${siteUrl}/research-tools`,
          },
        ],
      },
    ],
  };

  return (
    <main id="main-content" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ToolHeader active="research" />

      <section className={styles.hero}>
        <p>RESEARCH &amp; SIMULATION LABS</p>
        <h1>Advanced calculation workspaces that keep the method visible.</h1>
        <span>
          Use focused labs for symbolic algebra, numerical differential equations,
          linear programming, DC circuit analysis, and statistical inference. Each
          workspace makes scope, assumptions, and numerical limitations clear.
        </span>
        <div className={styles.heroActions}>
          <Link href="#labs">Explore research labs</Link>
          <Link href="#research-guides">Read method guides</Link>
        </div>
      </section>

      <div className={styles.content}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/tools">Tools</Link>
          <span>›</span>
          <span aria-current="page">Research tools</span>
        </nav>
      </div>

      <section className={styles.labSection} id="labs">
        <div className={styles.sectionHeading}>
          <p>AVAILABLE LABS</p>
          <h2>Choose a method before choosing more controls.</h2>
          <span>
            Each workspace is separate so the main result, assumptions, and next
            step stay easy to find on desktop and mobile.
          </span>
        </div>
        <div className={styles.toolGrid}>
          {researchTools.map((tool) => (
            <Link className={styles.toolCard} href={`/${tool.slug}`} key={tool.slug}>
              <span className={styles.icon}>{tool.icon}</span>
              <div>
                <h2>{tool.name}</h2>
                <p>{tool.summary}</p>
                <small>{tool.features?.slice(0, 3).join(" · ")}</small>
              </div>
              <b>Open →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.principleGrid}>
        {principles.map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.guideSection} id="research-guides">
        <header>
          <div>
            <p>METHOD GUIDES</p>
            <h2>Read the method before interpreting the output.</h2>
          </div>
          <Link href="/guides">Browse all guides →</Link>
        </header>
        <div>
          {researchGuides.map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <span>GUIDE</span>
              <strong>{guide.title}</strong>
              <small>{guide.summary}</small>
              <b>Read →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div>
          <p>COMMON QUESTIONS</p>
          <h2>Using numerical and research calculators</h2>
        </div>
        <div>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.connected}>
        <p>CONNECTED FOUNDATIONS</p>
        <h2>
          Research results are easier to check when the surrounding tools are one
          click away.
        </h2>
        <div>
          <Link href="/graphing-calculator">Graph functions →</Link>
          <Link href="/matrix-calculator">Matrix &amp; systems →</Link>
          <Link href="/statistics-calculator">Descriptive statistics →</Link>
          <Link href="/unit-converter">Units &amp; dimensions →</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
