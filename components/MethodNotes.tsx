import styles from "./MethodNotes.module.css";

type MethodSection = {
  heading: string;
  paragraphs?: string[];
  formula?: string;
  list?: string[];
  steps?: string[];
};

type MethodNotesProps = { eyebrow: string; title: string; sections: MethodSection[] };

// Stable, readable anchor IDs so every method heading can be deep-linked and cited.
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

// Long-form, crawlable method notes rendered under a calculator.
export default function MethodNotes({ eyebrow, title, sections }: MethodNotesProps) {
  const titleId = `method-${headingId(title)}`;
  // Worked examples with numbered steps are also described as HowTo structured data.
  const howTos = sections
    .filter((section) => section.steps?.length)
    .map((section) => ({
      "@type": "HowTo",
      name: section.heading,
      description: section.paragraphs?.join(" ") || title,
      step: (section.steps ?? []).map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: `Step ${index + 1}`,
        text: step,
        url: `#${headingId(section.heading)}`,
      })),
    }));
  return (
    <section className={styles.wrap} aria-labelledby={titleId}>
      {howTos.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": howTos }) }}
        />
      ) : null}
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title} id={titleId}>
        {title}
      </h2>
      <div className={styles.grid}>
        {sections.map((section) => (
          <article className={styles.card} key={section.heading}>
            <h3 id={headingId(section.heading)}>{section.heading}</h3>
            {section.formula ? <code className={styles.formula}>{section.formula}</code> : null}
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.steps ? (
              <ol>
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}
            {section.list ? (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
