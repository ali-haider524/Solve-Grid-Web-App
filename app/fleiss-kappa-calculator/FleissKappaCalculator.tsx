"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, fleissKappa, type FleissResult, formatP, pText, ratingsToCounts } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sampleCounts = `0 0 0 0 14
0 2 6 4 2
0 0 3 5 6
0 3 9 2 0
2 2 8 1 1
7 7 0 0 0
3 2 6 3 0
2 5 3 2 2
6 5 2 1 0
0 2 2 3 7`;

const sampleRatings = `A A B A
B B B B
A C C C
C C C B
A A A A
B C B B`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

function parseGrid(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[\t,;]+|\s+/).filter(Boolean));
}

export default function FleissKappaCalculator() {
  const [mode, setMode] = useState<"counts" | "ratings">("counts");
  const [text, setText] = useState(sampleCounts);
  const [result, setResult] = useState<FleissResult | null>(null);
  const [error, setError] = useState("");

  function switchMode(next: "counts" | "ratings") {
    setMode(next);
    setText(next === "counts" ? sampleCounts : sampleRatings);
    setResult(null);
  }

  function calculate() {
    try {
      setError("");
      const grid = parseGrid(text);
      if (!grid.length) throw new Error("Paste one row per subject.");
      if (mode === "ratings") {
        const width = grid[0].length;
        if (grid.some((row) => row.length !== width)) throw new Error("Every subject must be rated by the same number of raters.");
        const { categories, counts } = ratingsToCounts(grid);
        setResult(fleissKappa(categories, counts));
      } else {
        const counts = grid.map((row) => row.map(Number));
        setResult(fleissKappa(counts[0].map((_, j) => `Category ${j + 1}`), counts));
      }
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>FLEISS&apos; KAPPA CALCULATOR</p>
        <h1>Fleiss&apos; kappa calculator for three or more raters.</h1>
        <span>
          Measure agreement when several raters sort the same subjects into categories. Get Fleiss&apos; kappa, its standard
          error, z test, 95% CI, kappa for each category and the Landis &amp; Koch interpretation.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per subject</h2>
            </div>
            <span className={styles.status}>MULTI-RATER</span>
          </div>
          <div className={styles.tabRow}>
            <button className={mode === "counts" ? styles.activeTab : ""} onClick={() => switchMode("counts")} type="button">Counts per category</button>
            <button className={mode === "ratings" ? styles.activeTab : ""} onClick={() => switchMode("ratings")} type="button">Raw ratings (one column per rater)</button>
          </div>
          <p className={styles.sectionNote}>
            {mode === "counts"
              ? "Each column is a category; each cell is how many raters chose that category for the subject. Rows must add up to the same number of raters."
              : "Each column is a rater; each cell is the category that rater chose (any label such as A, B, Yes, 1)."}
          </p>
          <label className={styles.expressionLabel}>
            <span>{mode === "counts" ? "COUNTS" : "RATINGS"}</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate Fleiss&apos; kappa <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>κ = {noZero(result.kappa, 3)} ({result.band}), {pText(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>Fleiss&apos; kappa</span><strong>{fixed(result.kappa, 3)}</strong></div>
                <div><span>95% CI</span><strong>[{fixed(result.ciLow, 3)}, {fixed(result.ciHigh, 3)}]</strong></div>
                <div><span>z (H₀: κ = 0)</span><strong>{fixed(result.z, 2)}, {pText(result.p)}</strong></div>
                <div><span>Observed agreement P̄</span><strong>{fixed(result.pBar, 3)}</strong></div>
                <div><span>Chance agreement P̄e</span><strong>{fixed(result.peBar, 3)}</strong></div>
                <div><span>Subjects × raters</span><strong>{result.subjects} × {result.raters}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Category</th><th>Share</th><th>κ</th><th>p</th></tr></thead>
                  <tbody>
                    {result.perCategory.map((c) => (
                      <tr key={c.name}><td style={{ textAlign: "left" }}>{c.name}</td><td>{fixed(c.proportion * 100, 1)}%</td><td>{fixed(c.kappa, 3)}</td><td>{formatP(c.p)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                Fleiss&apos; kappa showed {result.band.toLowerCase()} agreement among the {result.raters} raters across {result.subjects} subjects, κ = {noZero(result.kappa, 3)}, 95% CI [{noZero(result.ciLow, 3)}, {noZero(result.ciHigh, 3)}], {pText(result.p)}.
              </div>
              <div className={styles.methodNote}>
                <p>TWO RATERS?</p>
                <span>For exactly two raters use Cohen&apos;s kappa. For numeric ratings, the intraclass correlation (ICC) is usually better.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>κ</span>
                <p>Use the sample table or paste your own, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
