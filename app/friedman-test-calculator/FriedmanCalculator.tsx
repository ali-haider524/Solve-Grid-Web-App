"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, friedmanTest, parseDataTable, type FriedmanResult, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Week1 Week4 Week8
3 4 5
2 3 4
4 4 5
3 5 5
2 2 4
3 4 4
1 3 3
4 5 5
2 4 5
3 3 4`;

const pApa = (p: number) => (p < 0.001 ? "p < .001" : `${pText(p)}`);
const wBand = (w: number) => (w >= 0.5 ? "large" : w >= 0.3 ? "moderate" : w >= 0.1 ? "small" : "negligible");

export default function FriedmanCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<FriedmanResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const { names, rows } = parseDataTable(text);
      setResult(friedmanTest(names.map((n, i) => (/^(Y|X\d+)$/.test(n) ? `Condition ${i + 1}` : n)), rows));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>FRIEDMAN TEST CALCULATOR</p>
        <h1>Friedman test calculator with Kendall&apos;s W and post hoc tests.</h1>
        <span>
          Compare three or more related conditions (the same people measured repeatedly) when data are ordinal or not normal.
          Get χ², df, p, Kendall&apos;s W, medians, mean ranks, Bonferroni pairwise comparisons, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per participant</h2>
            </div>
            <span className={styles.status}>NON-PARAMETRIC</span>
          </div>
          <p className={styles.sectionNote}>
            Put each condition or time point in its own column with a name in the first row, then one row per participant. You can
            paste straight from Excel or SPSS.
          </p>
          <label className={styles.expressionLabel}>
            <span>REPEATED MEASURES</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Friedman test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>χ²({result.df}) = {fixed(result.chiSquare, 2)}, {pApa(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>Friedman χ² (tie-corrected)</span><strong>{fixed(result.chiSquare, 3)}</strong></div>
                <div><span>Degrees of freedom</span><strong>{result.df}</strong></div>
                <div><span>p value</span><strong>{formatP(result.p)}</strong></div>
                <div><span>Kendall&apos;s W (effect size)</span><strong>{fixed(result.kendallW, 3)} ({wBand(result.kendallW)})</strong></div>
                <div><span>N (participants)</span><strong>{result.n}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>CONDITION</th><th>MEDIAN</th><th>MEAN RANK</th></tr></thead>
                  <tbody>
                    {result.conditions.map((c) => (
                      <tr key={c.name}><td style={{ textAlign: "left" }}>{c.name}</td><td>{fixed(c.median, 2)}</td><td>{fixed(c.meanRank, 2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>PAIRWISE</th><th>z</th><th>p</th><th>p (BONF.)</th></tr></thead>
                  <tbody>
                    {result.pairwise.map((d) => (
                      <tr key={d.a + "|" + d.b}><td style={{ textAlign: "left" }}>{d.a} vs {d.b}</td><td>{fixed(d.z, 2)}</td><td>{formatP(d.p)}</td><td>{formatP(d.pAdj)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                A Friedman test showed {result.p < 0.05 ? "a statistically significant" : "no statistically significant"} difference across the{" "}
                {result.k} conditions, χ²({result.df}, N = {result.n}) = {fixed(result.chiSquare, 2)}, {pApa(result.p)}, W ={" "}
                {fixed(result.kendallW, 2).replace(/^0/, "")}.
                {result.p < 0.05
                  ? ` Bonferroni-adjusted pairwise comparisons showed significant differences for ${
                      result.pairwise.filter((d) => d.pAdj < 0.05).map((d) => `${d.a} vs ${d.b} (${pApa(d.pAdj)})`).join(", ") || "no single pair"
                    }. Medians: ${result.conditions.map((c) => `${c.name} = ${fixed(c.median, 1)}`).join(", ")}.`
                  : ""}
              </div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>
                  Pairwise tests compare mean ranks (Nemenyi-type z) with a Bonferroni adjustment for {result.pairwise.length} comparisons. Many
                  researchers instead run Wilcoxon signed-rank tests on each pair with the same correction. Interpret pairs only when the
                  overall test is significant.
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>χ²</span>
                <p>Use the sample data or paste your own repeated measures, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
