"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, mcNemarTest, type McNemarResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const pApa = (p: number) => (p < 0.001 ? "p < .001" : `p = ${formatP(p)}`);
const pct = (v: number) => `${fixed(v * 100, 1)}%`;

export default function McNemarCalculator() {
  const [yes, setYes] = useState("Yes");
  const [no, setNo] = useState("No");
  const [cells, setCells] = useState({ a: "30", b: "15", c: "4", d: "51" });
  const [result, setResult] = useState<McNemarResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(mcNemarTest(Number(cells.a), Number(cells.b), Number(cells.c), Number(cells.d)));
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

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>MCNEMAR TEST CALCULATOR</p>
        <h1>McNemar test calculator for paired yes/no data.</h1>
        <span>
          Test whether a proportion changed between two related measurements, such as before and after training on the same
          people. Get McNemar&apos;s χ², the exact binomial p value, the continuity-corrected test, the odds ratio, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>2 × 2 TABLE</p>
              <h2>Before (rows) × after (columns)</h2>
            </div>
            <span className={styles.status}>PAIRED</span>
          </div>
          <div className={styles.fieldGrid}>
            <label><span>CATEGORY 1 NAME</span><input value={yes} onChange={(event) => setYes(event.target.value)} /></label>
            <label><span>CATEGORY 2 NAME</span><input value={no} onChange={(event) => setNo(event.target.value)} /></label>
          </div>
          <p className={styles.sectionNote}>Enter how many participants fall in each before → after combination. Each person is counted once.</p>
          <div className={styles.fieldGrid}>
            {cell("a", `a: ${yes} → ${yes}`)}
            {cell("b", `b: ${yes} → ${no}`)}
            {cell("c", `c: ${no} → ${yes}`)}
            {cell("d", `d: ${no} → ${no}`)}
          </div>
          <p className={styles.sectionNote}>Only the discordant cells b and c (people who changed) affect the test.</p>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run McNemar test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>χ²(1, N = {result.n}) = {fixed(result.chiSquare, 2)}, exact {pApa(result.pExact)}</h2>
              <div className={styles.resultRows}>
                <div><span>McNemar χ² (no correction)</span><strong>{fixed(result.chiSquare, 3)}, p = {formatP(result.pChi)}</strong></div>
                <div><span>χ² with continuity correction</span><strong>{fixed(result.chiSquareCorrected, 3)}, p = {formatP(result.pCorrected)}</strong></div>
                <div><span>Exact binomial p (two-sided)</span><strong>{formatP(result.pExact)}</strong></div>
                <div><span>Discordant pairs (b + c)</span><strong>{result.b + result.c}</strong></div>
                <div><span>Odds ratio (b ÷ c)</span><strong>{Number.isFinite(result.oddsRatio) ? fixed(result.oddsRatio, 2) : "∞"}{Number.isFinite(result.orLow) ? ` [${fixed(result.orLow, 2)}, ${fixed(result.orHigh, 2)}]` : ""}</strong></div>
                <div><span>&quot;{yes}&quot; before</span><strong>{pct(result.pBefore)}</strong></div>
                <div><span>&quot;{yes}&quot; after</span><strong>{pct(result.pAfter)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                A McNemar test {result.b + result.c < 25 ? "(exact binomial)" : ""} showed {(result.b + result.c < 25 ? result.pExact : result.pChi) < 0.05 ? "a statistically significant" : "no statistically significant"} change in the
                proportion answering &quot;{yes}&quot; from before ({pct(result.pBefore)}) to after ({pct(result.pAfter)}), χ²(1, N = {result.n}) ={" "}
                {fixed(result.chiSquare, 2)}, {pApa(result.b + result.c < 25 ? result.pExact : result.pChi)}. {result.b} participants changed from
                &quot;{yes}&quot; to &quot;{no}&quot; and {result.c} changed from &quot;{no}&quot; to &quot;{yes}&quot;.
              </div>
              <div className={styles.methodNote}>
                <p>WHICH P VALUE?</p>
                <span>
                  {result.b + result.c < 25
                    ? "With fewer than 25 discordant pairs, report the exact binomial p value (SPSS does this automatically)."
                    : "With 25 or more discordant pairs, the χ² approximation is fine; the exact p is shown for comparison."}{" "}
                  The continuity correction is conservative and is mainly used in older texts.
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>b/c</span>
                <p>Use the sample counts or enter your own 2 × 2 table, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
