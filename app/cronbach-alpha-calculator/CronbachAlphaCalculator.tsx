"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { cronbachAlpha, fixed, parseMatrix, type CronbachResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Q1	Q2	Q3	Q4	Q5
4	5	4	2	4
3	4	3	3	3
5	5	4	1	5
2	3	2	4	2
4	4	5	2	4
3	3	3	3	4
5	4	5	1	5
2	2	3	5	2`;

export default function CronbachAlphaCalculator() {
  const [data, setData] = useState(sample);
  const [reversed, setReversed] = useState("4");
  const [scaleMin, setScaleMin] = useState("1");
  const [scaleMax, setScaleMax] = useState("5");
  const [result, setResult] = useState<CronbachResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const reversedItems = reversed
        .split(/[,\s]+/)
        .map((value) => value.trim().replace(/^q/i, ""))
        .filter(Boolean)
        .map(Number);
      if (reversedItems.some((value) => !Number.isInteger(value) || value < 1)) {
        throw new Error("List reverse-coded items by column number, for example: 4, 7");
      }
      setResult(cronbachAlpha(parseMatrix(data), reversedItems, Number(scaleMin), Number(scaleMax)));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  const weakest = result
    ? [...result.itemStats].sort((a, b) => b.alphaIfDeleted - a.alphaIfDeleted)[0]
    : null;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>CRONBACH&apos;S ALPHA CALCULATOR</p>
        <h1>Cronbach&apos;s alpha calculator for questionnaire reliability.</h1>
        <span>
          Paste item scores straight from Excel, Google Sheets, or SPSS. Get alpha, corrected item-total
          correlations, and alpha if item deleted, with reverse-coded items handled for you.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per respondent, one column per item</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <label className={styles.expressionLabel}>
            <span>ITEM SCORES (HEADER ROW OPTIONAL)</span>
            <textarea value={data} onChange={(event) => setData(event.target.value)} spellCheck={false} />
          </label>
          <div className={styles.fieldGrid}>
            <label>
              <span>REVERSE-CODED ITEMS</span>
              <input value={reversed} onChange={(event) => setReversed(event.target.value)} placeholder="e.g. 4, 7" />
            </label>
            <label>
              <span>SCALE MIN – MAX</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input inputMode="numeric" value={scaleMin} onChange={(event) => setScaleMin(event.target.value)} aria-label="Scale minimum" />
                <input inputMode="numeric" value={scaleMax} onChange={(event) => setScaleMax(event.target.value)} aria-label="Scale maximum" />
              </div>
            </label>
          </div>
          <p className={styles.sectionNote}>
            Your data stays in your browser. Nothing is uploaded.
          </p>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate Cronbach&apos;s alpha <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RELIABILITY</p>
          <h2>{result ? `α = ${fixed(result.alpha)} (${result.band})` : "Ready to calculate"}</h2>
          {result ? (
            <>
              <div className={styles.resultRows}>
                <div><span>Respondents</span><strong>{result.respondents}</strong></div>
                <div><span>Items</span><strong>{result.items}</strong></div>
                <div><span>Cronbach&apos;s alpha</span><strong>{fixed(result.alpha)}</strong></div>
                <div><span>Standardized alpha</span><strong>{fixed(result.standardizedAlpha)}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr><th>ITEM</th><th>MEAN</th><th>SD</th><th>ITEM-TOTAL r</th><th>α IF DELETED</th></tr>
                  </thead>
                  <tbody>
                    {result.itemStats.map((item) => (
                      <tr key={item.item}>
                        <td>{item.item}{item.reversed ? " (R)" : ""}</td>
                        <td>{fixed(item.mean, 2)}</td>
                        <td>{fixed(item.sd, 2)}</td>
                        <td>{fixed(item.correctedItemTotal)}</td>
                        <td>{fixed(item.alphaIfDeleted)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                The scale showed {result.band.toLowerCase()} internal consistency, Cronbach&apos;s α = {fixed(result.alpha, 2)}
                {" "}({result.items} items, N = {result.respondents}).
                {weakest && weakest.alphaIfDeleted > result.alpha
                  ? ` Removing item ${weakest.item} would raise alpha to ${fixed(weakest.alphaIfDeleted, 2)}; check its wording before deleting it.`
                  : " No single item deletion would raise alpha."}
              </div>
              <div className={styles.methodNote}>
                <p>CHECK</p>
                <span>
                  Items with a corrected item-total correlation below 0.30 often deserve review. A negative value
                  usually means the item needs reverse coding.
                </span>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <span>α</span>
              <p>Paste your item scores or use the sample data, then calculate.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
