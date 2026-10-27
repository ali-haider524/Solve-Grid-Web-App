import styles from "./MethodNotes.module.css";

type MethodSection = { heading: string; paragraphs?: string[]; formula?: string; list?: string[] };

type MethodNotesProps = { eyebrow: string; title: string; sections: MethodSection[] };

// Long-form, crawlable method notes rendered under a calculator.
export default function MethodNotes({ eyebrow, title, sections }: MethodNotesProps) {
  return (
    <section className={styles.wrap} aria-label={title}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {sections.map((section) => (
          <article className={styles.card} key={section.heading}>
            <h3>{section.heading}</h3>
            {section.formula ? <code className={styles.formula}>{section.formula}</code> : null}
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
