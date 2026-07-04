import Link from "next/link";
import SiteFooter from "./SiteFooter";
import ToolHeader from "./ToolHeader";
import styles from "./LegalPage.module.css";

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
  children?: React.ReactNode;
};

export default function LegalPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
  children,
}: LegalPageProps) {
  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader />
      <article className={styles.article}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span aria-current="page">{title}</span>
        </nav>
        <header className={styles.hero}>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{description}</span>
          <small>Last updated: {updated}</small>
        </header>
        <div className={styles.content}>
          {children}
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
