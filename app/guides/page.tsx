import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import ToolHeader from "../../components/ToolHeader";
import {
  guideTopics,
  guides,
  getGuidesByTopic,
  type GuideTopic,
} from "../../lib/guides";
import { siteName, siteUrl } from "../../lib/site";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: "Calculator Guides – Formulas, Methods & Worked Examples",
  description:
    "Learn equation solving, graphing, matrices, statistics, engineering notation, unit conversion, finance formulas, numerical methods, and calculator workflows with practical SolveGrid guides.",
  alternates: { canonical: "/guides" },
  openGraph: {
    type: "website",
    title: "Calculator Guides – Formulas, Methods & Worked Examples",
    description:
      "Browse practical guides for algebra, graphing, engineering calculations, statistics, finance, and numerical methods.",
    url: "/guides",
  },
};

const topicOrder: GuideTopic[] = [
  "algebra",
  "graphing",
  "engineering",
  "statistics",
  "research",
  "finance",
  "everyday",
];

export default function GuidesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "SolveGrid Calculator Guides",
        description:
          "Formula, method, and worked-example guides connected to SolveGrid calculation tools.",
        url: `${siteUrl}/guides`,
        publisher: { "@type": "Organization", name: siteName, url: siteUrl },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: guides.length,
          itemListElement: guides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: `${siteUrl}/guides/${guide.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: `${siteUrl}/guides`,
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
      <ToolHeader active="guides" />

      <section className={styles.hero}>
        <p>CALCULATION GUIDES</p>
        <h1>Learn the method, then use the right tool.</h1>
        <span>
          Browse practical explanations, formulas, worked examples, and step-by-step
          workflows for algebra, graphing, engineering, statistics, finance, and
          numerical analysis.
        </span>
        <div className={styles.heroLinks}>
          <Link href="/tools">Browse all calculators</Link>
          <Link href="/methodology">Methods &amp; accuracy</Link>
        </div>
      </section>

      <div className={styles.content}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span aria-current="page">Guides</span>
        </nav>

        <nav className={styles.topicNav} aria-label="Guide topics">
          {topicOrder.map((topic) => (
            <a href={`#${topic}`} key={topic}>
              {guideTopics[topic].label}
            </a>
          ))}
        </nav>

        {topicOrder.map((topic) => {
          const topicGuides = getGuidesByTopic(topic);
          if (!topicGuides.length) return null;

          return (
            <section className={styles.topicSection} id={topic} key={topic}>
              <header className={styles.topicHeader}>
                <div>
                  <p>GUIDE TOPIC</p>
                  <h2>{guideTopics[topic].label}</h2>
                </div>
                <span>{guideTopics[topic].description}</span>
              </header>

              <div className={styles.grid}>
                {topicGuides.map((guide) => (
                  <Link
                    className={styles.card}
                    href={`/guides/${guide.slug}`}
                    key={guide.slug}
                  >
                    <span>GUIDE</span>
                    <h3>{guide.title}</h3>
                    <p>{guide.summary}</p>
                    <b>Read guide →</b>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <SiteFooter />
    </main>
  );
}
