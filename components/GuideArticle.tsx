import Link from "next/link";
import {
  getGuideBySlug,
  getRelatedGuides,
  guideTopics,
} from "../lib/guides";
import { siteName, siteUrl } from "../lib/site";
import SiteFooter from "./SiteFooter";
import ToolHeader from "./ToolHeader";
import styles from "./GuideArticle.module.css";

type GuideLink = {
  label: string;
  href: string;
  description: string;
};

type GuideProps = {
  title: string;
  eyebrow: string;
  description: string;
  slug: string;
  steps: Array<{ title: string; body: string }>;
  formula?: string;
  example?: string;
  toolLinks: GuideLink[];
};

export default function GuideArticle({
  title,
  eyebrow,
  description,
  slug,
  steps,
  formula,
  example,
  toolLinks,
}: GuideProps) {
  const articleUrl = `${siteUrl}/guides/${slug}`;
  const currentGuide = getGuideBySlug(slug);
  const relatedGuides = getRelatedGuides(slug, 3);
  const topic = currentGuide ? guideTopics[currentGuide.topic] : null;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: title,
        description,
        mainEntityOfPage: articleUrl,
        url: articleUrl,
        inLanguage: "en",
        isAccessibleForFree: true,
        author: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
        },
        ...(toolLinks.length
          ? {
              about: toolLinks.map((tool) => ({
                "@type": "Thing",
                name: tool.label,
                url: `${siteUrl}${tool.href}`,
              })),
            }
          : {}),
      },
      {
        "@type": "HowTo",
        "@id": `${articleUrl}#howto`,
        name: title,
        description,
        url: articleUrl,
        inLanguage: "en",
        step: steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
          url: `${articleUrl}#step-${index + 1}`,
        })),
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
          { "@type": "ListItem", position: 3, name: title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <main id="main-content" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <ToolHeader active="guides" />

      <article className={styles.article}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/guides">Guides</Link>
          <span>›</span>
          <span aria-current="page">{title}</span>
        </nav>

        <header className={styles.hero}>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{description}</span>
          {topic ? (
            <Link className={styles.topicLink} href={`/guides#${currentGuide?.topic}`}>
              Explore {topic.label.toLowerCase()} →
            </Link>
          ) : null}
        </header>

        <section className={styles.layout}>
          <div className={styles.content}>
            {formula ? (
              <section className={styles.formula}>
                <p>FORMULA OR CORE IDEA</p>
                <code>{formula}</code>
              </section>
            ) : null}

            {example ? (
              <section className={styles.example}>
                <p>WORKED EXAMPLE</p>
                <span>{example}</span>
              </section>
            ) : null}

            <section className={styles.steps}>
              <p>STEP BY STEP</p>
              {steps.map((step, index) => (
                <article id={`step-${index + 1}`} key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{step.title}</h2>
                    <p>{step.body}</p>
                  </div>
                </article>
              ))}
            </section>
          </div>

          <aside className={styles.toolPanel}>
            <p>TRY THE CALCULATION</p>
            <h2>Continue with a working SolveGrid tool.</h2>
            <div>
              {toolLinks.map((tool) => (
                <Link href={tool.href} key={tool.href}>
                  <strong>{tool.label}</strong>
                  <span>{tool.description}</span>
                  <b>Open tool →</b>
                </Link>
              ))}
            </div>
            <Link className={styles.allToolsLink} href="/tools">
              Browse all calculators →
            </Link>
          </aside>
        </section>

        {relatedGuides.length ? (
          <section className={styles.relatedGuides} aria-labelledby={`${slug}-related-guides`}>
            <header>
              <div>
                <p>KEEP LEARNING</p>
                <h2 id={`${slug}-related-guides`}>Related calculation guides</h2>
              </div>
              <Link href="/guides">Browse all guides →</Link>
            </header>
            <div>
              {relatedGuides.map((guide) => (
                <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                  <span>GUIDE</span>
                  <strong>{guide.title}</strong>
                  <small>{guide.summary}</small>
                  <b>Read →</b>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <SiteFooter />
    </main>
  );
}
