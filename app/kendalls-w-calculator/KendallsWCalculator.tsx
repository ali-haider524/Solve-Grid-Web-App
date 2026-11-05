"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, kendallsW, type KendallWResult, parseDataTable, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Essay1 Essay2 Essay3 Essay4 Essay5 Essay6
1 2 3 4 5 6
2 1 3 5 4 6
1 3 2 4 6 5
2 1 4 3 5 6
1 2 3 4 5 5`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function KendallsWCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<KendallWResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const data = parseDataTable(text);
      setResult(kendallsW(data.names, data.rows));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>KENDALL&apos;S W CALCULATOR</p>
        <h1>Kendall&apos;s W calculator for agreement between raters.</h1>
        <span>
          Measure how much several judges agree when they rank or score the same items. Get Kendall&apos;s coefficient of
          concordance W with tie correction, the chi-square significance test, mean ranks and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per rater, one column per item</h2>
            </div>
            <span className={styles.status}>TIE-CORRECTED</span>
          </div>
          <p className={styles.sectionNote}>Enter ranks or scores. Scores are converted to ranks within each rater, with ties given the average rank.</p>
          <label className={styles.expressionLabel}>
            <span>RATINGS</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate Kendall&apos;s W <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>W = {noZero(result.w, 3)}, χ²({result.df}) = {fixed(result.chiSquare, 2)}, {pText(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>Kendall&apos;s W</span><strong>{fixed(result.w, 3)}</strong></div>
                <div><span>Interpretation</span><strong>{result.band}</strong></div>
                <div><span>Chi-square (df = {result.df})</span><strong>{fixed(result.chiSquare, 3)}</strong></div>
                <div><span>p value</span><strong>{pText(result.p)}</strong></div>
                <div><span>Raters × items</span><strong>{result.raters} × {result.objects}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Item</th><th>Mean rank</th></tr></thead>
                  <tbody>
                    {[...result.meanRanks].sort((a, b) => a.meanRank - b.meanRank).map((m) => (
                      <tr key={m.name}><td style={{ textAlign: "left" }}>{m.name}</td><td>{fixed(m.meanRank, 2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                Kendall&apos;s coefficient of concordance showed {result.band.toLowerCase()} among the {result.raters} raters, W = {noZero(result.w)}, χ²({result.df}, N = {result.raters}) = {fixed(result.chiSquare, 2)}, {pText(result.p)}.
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>W</span>
                <p>Use the sample rankings or paste your own, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
