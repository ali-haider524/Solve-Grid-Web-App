"use client";

import Link from "next/link";
import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { chooseTest, type Answers, type Design, type Goal, type Groups, type Outcome } from "../../lib/test-chooser";
import styles from "../../components/ResearchLab.module.css";

type Option<T> = { value: T; label: string };

const goals: Option<Goal>[] = [
  { value: "compare", label: "Compare groups or times" },
  { value: "relationship", label: "Relationship between two variables" },
  { value: "association", label: "Counts in categories" },
];
const outcomes: Option<Outcome>[] = [
  { value: "normal", label: "Numeric, roughly normal" },
  { value: "ordinal", label: "Ordinal / Likert / skewed" },
  { value: "categorical", label: "Categories (yes/no, groups)" },
];
const groupOptions: Option<Groups>[] = [
  { value: "one", label: "One group vs a value" },
  { value: "two", label: "Two groups" },
  { value: "three-plus", label: "Three or more" },
];
const designs: Option<Design>[] = [
  { value: "independent", label: "Different people" },
  { value: "paired", label: "Same people (before/after)" },
];

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <span className={styles.compactLabel}>{label}</span>
      <div className={styles.tabRow} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            aria-checked={value === option.value}
            className={value === option.value ? styles.activeTab : undefined}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StatisticalTestChooser() {
  const [answers, setAnswers] = useState<Answers>({ goal: "compare", outcome: "normal", groups: "two", design: "independent" });
  const [copied, setCopied] = useState(false);
  const result = chooseTest(answers);
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setCopied(false);
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(result.report);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>STATISTICAL TEST CHOOSER</p>
        <h1>Which statistical test should I use?</h1>
        <span>
          Answer four questions about your research question and data. You get the recommended test, a
          safer alternative, the assumptions to check, and an APA-style sentence to report it.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>YOUR STUDY</p>
              <h2>Describe your question and data</h2>
            </div>
            <span className={styles.status}>4 QUESTIONS</span>
          </div>
          <Choice label="1. WHAT DO YOU WANT TO FIND OUT?" options={goals} value={answers.goal} onChange={(v) => set("goal", v)} />
          {answers.goal !== "association" ? (
            <Choice label="2. WHAT TYPE IS YOUR OUTCOME VARIABLE?" options={answers.goal === "relationship" ? outcomes.slice(0, 2) : outcomes} value={answers.goal === "relationship" && answers.outcome === "categorical" ? "normal" : answers.outcome} onChange={(v) => set("outcome", v)} />
          ) : null}
          {answers.goal !== "relationship" ? (
            <Choice label="3. HOW MANY GROUPS OR TIME POINTS?" options={answers.goal === "association" ? groupOptions.slice(0, 2) : groupOptions} value={answers.groups} onChange={(v) => set("groups", v)} />
          ) : null}
          {answers.goal !== "relationship" && answers.groups !== "one" ? (
            <Choice label="4. ARE THE GROUPS THE SAME PEOPLE OR DIFFERENT PEOPLE?" options={designs} value={answers.design} onChange={(v) => set("design", v)} />
          ) : null}
          <p className={styles.sectionNote}>
            Not sure if your data are normal? <Link href="/shapiro-wilk-test-calculator">Check with the Shapiro-Wilk test</Link>.
            Likert items, ranks, and small skewed samples count as &quot;ordinal / skewed&quot;. Summed scale scores
            from many items are often treated as numeric.
          </p>
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RECOMMENDED TEST</p>
          <h2>{result.test}</h2>
          <div className={styles.interpretation}>{result.why}</div>
          {result.alternative ? (
            <div className={styles.resultRows}>
              <div>
                <span>Alternative</span>
                <strong style={{ fontFamily: "inherit" }}>{result.alternative}</strong>
              </div>
            </div>
          ) : null}
          <div className={styles.methodNote}>
            <p>CHECK THESE ASSUMPTIONS</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.interpretation}>
            <strong>How to report it (APA style):</strong> {result.report}
          </div>
          <button className={styles.smallButton} onClick={copyReport} type="button">
            {copied ? "Copied ✓" : "Copy report sentence"}
          </button>
          {result.toolHref ? (
            <p className={styles.sectionNote}>
              <Link href={result.toolHref}>{result.toolLabel} →</Link>
            </p>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
