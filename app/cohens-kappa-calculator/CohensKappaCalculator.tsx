"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { cohensKappa, fixed, formatP, parseMatrix, type KappaResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

type Weighting = "none" | "linear" | "quadratic";

const sample = `Low, Medium, High
22, 5, 1
4, 30, 6
1, 3, 28`;

export default function CohensKappaCalculator() {
  const [table, setTable] = useState(sample);
  const [weighting, setWeighting] = useState<Weighting>("none");
  const [result, setResult] = useState<KappaResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(cohensKappa(parseMatrix(table), weighting));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the table.");
    }
  }

  const label = weighting === "none" ? "Cohen's kappa" : `Weighted kappa (${weighting})`;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>COHEN&apos;S KAPPA CALCULATOR</p>
        <h1>Cohen&apos;s kappa calculator for inter-rater agreement.</h1>
        <span>
          Measure how well two raters or coders agree beyond chance. Enter the agreement table and get kappa, its 95%
          confidence interval, a p value, the Landis and Koch interpretation, and weighted kappa for ordered categories.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>AGREEMENT TABLE</p>
              <h2>Rows = rater 1, columns = rater 2</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <p className={styles.sectionNote}>
            Each cell is the number of items rater 1 put in the row category and rater 2 put in the column category. The
            diagonal holds the agreements. A header row of category names is optional.
          </p>
          <label className={styles.expressionLabel}>
            <span>COUNTS (SQUARE TABLE)</span>
            <textarea value={table} onChange={(event) => setTable(event.target.value)} spellCheck={false} />
          </label>
          <div className={styles.tabRow} role="radiogroup" aria-label="Weighting">
            {(["none", "linear", "quadratic"] as Weighting[]).map((option) => (
              <button
                aria-checked={weighting === option}
                className={weighting === option ? styles.activeTab : undefined}
                key={option}
                onClick={() => setWeighting(option)}
                role="radio"
                type="button"
              >
                {option === "none" ? "Unweighted (nominal)" : option === "linear" ? "Linear weights" : "Quadratic weights"}
              </button>
            ))}
          </div>
          <p className={styles.sectionNote}>
            Use weights only when categories are ordered (for example Low, Medium, High). Quadratic weighted kappa is often
            reported alongside the intraclass correlation.
          </p>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate kappa <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>κ = {fixed(result.kappa, 3)} ({result.band})</h2>
              <div className={styles.resultRows}>
                <div><span>{label}</span><strong>{fixed(result.kappa, 3)}</strong></div>
                <div><span>95% confidence interval</span><strong>{fixed(result.ciLow, 3)} to {fixed(result.ciHigh, 3)}</strong></div>
                <div><span>Standard error</span><strong>{fixed(result.se, 4)}</strong></div>
                <div><span>z, p</span><strong>{fixed(result.z, 2)}, {formatP(result.p)}</strong></div>
                <div><span>Observed agreement</span><strong>{fixed(result.observedAgreement * 100, 1)}%</strong></div>
                <div><span>Chance agreement</span><strong>{fixed(result.expectedAgreement * 100, 1)}%</strong></div>
                <div><span>Items rated</span><strong>{result.n}</strong></div>
              </div>
              <div className={styles.interpretation}>
                Inter-rater agreement was {result.band.toLowerCase().replace(" (less than chance)", "")},{" "}
                {weighting === "none" ? "κ" : `weighted κ (${weighting})`} = {fixed(result.kappa, 2).replace(/^(-?)0/, "$1")}, 95% CI [
                {fixed(result.ciLow, 2).replace(/^(-?)0/, "$1")}, {fixed(result.ciHigh, 2).replace(/^(-?)0/, "$1")}], p = {formatP(result.p)}.
              </div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>
                  Kappa can be low even when percent agreement is high if one category dominates (the kappa paradox). Report
                  both the percent agreement and kappa.
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>κ</span>
                <p>Use the sample table or paste your own counts, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
