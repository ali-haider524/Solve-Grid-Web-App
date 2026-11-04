"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fisherExactTest, fixed, formatP, type FisherResult, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const pct = (v: number) => `${fixed(v * 100, 1)}%`;

export default function FishersExactCalculator() {
  const [rowNames, setRowNames] = useState({ r1: "Treatment", r2: "Control" });
  const [colNames, setColNames] = useState({ c1: "Improved", c2: "Not improved" });
  const [cells, setCells] = useState({ a: "8", b: "2", c: "1", d: "5" });
  const [result, setResult] = useState<FisherResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(fisherExactTest(Number(cells.a), Number(cells.b), Number(cells.c), Number(cells.d)));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the counts.");
    }
  }

  const cell = (key: keyof typeof cells, label: string) => (
    <label>
      <span>{label}</span>
      <input inputMode="numeric" value={cells[key]} onChange={(event) => setCells({ ...cells, [key]: event.target.value })} />
    </label>
  );

  const or = (r: FisherResult) => (Number.isFinite(r.oddsRatio) ? fixed(r.oddsRatio, 2) : "∞");

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>FISHER&apos;S EXACT TEST CALCULATOR</p>
        <h1>Fisher&apos;s exact test calculator for a 2 × 2 table.</h1>
        <span>
          Test whether two yes/no variables are related when your sample is small or expected counts are below 5. Get the exact
          two-sided and one-sided p values, the odds ratio with a 95% CI, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>2 × 2 TABLE</p>
              <h2>Groups (rows) × outcome (columns)</h2>
            </div>
            <span className={styles.status}>EXACT</span>
          </div>
          <div className={styles.fieldGrid}>
            <label><span>ROW 1 NAME</span><input value={rowNames.r1} onChange={(e) => setRowNames({ ...rowNames, r1: e.target.value })} /></label>
            <label><span>ROW 2 NAME</span><input value={rowNames.r2} onChange={(e) => setRowNames({ ...rowNames, r2: e.target.value })} /></label>
            <label><span>COLUMN 1 NAME</span><input value={colNames.c1} onChange={(e) => setColNames({ ...colNames, c1: e.target.value })} /></label>
            <label><span>COLUMN 2 NAME</span><input value={colNames.c2} onChange={(e) => setColNames({ ...colNames, c2: e.target.value })} /></label>
          </div>
          <div className={styles.fieldGrid}>
            {cell("a", `a: ${rowNames.r1} · ${colNames.c1}`)}
            {cell("b", `b: ${rowNames.r1} · ${colNames.c2}`)}
            {cell("c", `c: ${rowNames.r2} · ${colNames.c1}`)}
            {cell("d", `d: ${rowNames.r2} · ${colNames.c2}`)}
          </div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Fisher&apos;s exact test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>Fisher&apos;s exact test, {pText(result.pTwoSided)}</h2>
              <div className={styles.resultRows}>
                <div><span>Two-sided exact p</span><strong>{formatP(result.pTwoSided)}</strong></div>
                <div><span>One-sided p (a smaller than expected)</span><strong>{formatP(result.pLess)}</strong></div>
                <div><span>One-sided p (a larger than expected)</span><strong>{formatP(result.pGreater)}</strong></div>
                <div><span>Odds ratio (ad ÷ bc)</span><strong>{or(result)}</strong></div>
                <div><span>95% CI for the odds ratio</span><strong>{Number.isFinite(result.orLow) ? `[${fixed(result.orLow, 2)}, ${fixed(result.orHigh, 2)}]` : "not available (a zero cell)"}</strong></div>
                <div><span>{colNames.c1} in {rowNames.r1}</span><strong>{pct(result.a / (result.a + result.b || 1))}</strong></div>
                <div><span>{colNames.c1} in {rowNames.r2}</span><strong>{pct(result.c / (result.c + result.d || 1))}</strong></div>
              </div>
              <div className={styles.interpretation}>
                {pct(result.a / (result.a + result.b || 1))} of the {rowNames.r1} group ({result.a}/{result.a + result.b}) and {pct(result.c / (result.c + result.d || 1))} of the{" "}
                {rowNames.r2} group ({result.c}/{result.c + result.d}) were &quot;{colNames.c1}&quot;. Fisher&apos;s exact test showed{" "}
                {result.pTwoSided < 0.05 ? "a statistically significant" : "no statistically significant"} association, {pText(result.pTwoSided)}, OR = {or(result)}
                {Number.isFinite(result.orLow) ? `, 95% CI [${fixed(result.orLow, 2)}, ${fixed(result.orHigh, 2)}]` : ""}.
              </div>
              <div className={styles.methodNote}>
                <p>WHEN TO USE IT</p>
                <span>Use Fisher&apos;s exact test instead of chi-square when any expected count is below 5. For larger tables or larger samples, the chi-square test is fine.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>2×2</span>
                <p>Use the sample counts or enter your own table, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
