"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, iccBand, intraclassCorrelation, parseMatrix, type IccResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Rater1, Rater2, Rater3, Rater4
9, 2, 5, 8
6, 1, 3, 2
8, 4, 6, 8
7, 1, 2, 6
10, 5, 6, 9
6, 2, 4, 7`;

type Model = "ICC(1,1)" | "ICC(2,1)" | "ICC(3,1)" | "ICC(1,k)" | "ICC(2,k)" | "ICC(3,k)";

export default function IccCalculator() {
  const [data, setData] = useState(sample);
  const [result, setResult] = useState<IccResult | null>(null);
  const [error, setError] = useState("");
  const [raters, setRaters] = useState<"random" | "fixed" | "different">("random");
  const [agreement, setAgreement] = useState<"absolute" | "consistency">("absolute");
  const [unit, setUnit] = useState<"single" | "average">("single");

  function calculate() {
    try {
      setError("");
      setResult(intraclassCorrelation(parseMatrix(data)));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  // McGraw & Wong (1996): absolute agreement uses the ICC(2,·) formula for both random and mixed raters;
  // consistency uses ICC(3,·). Different raters per subject need the one-way ICC(1,·).
  const base = raters === "different" ? "1" : agreement === "absolute" ? "2" : "3";
  const chosen = `ICC(${base},${unit === "single" ? "1" : "k"})` as Model;
  const row = result?.rows.find((r) => r.type === chosen);
  const modelName =
    base === "1"
      ? "one-way random-effects"
      : `${raters === "random" ? "two-way random-effects" : "two-way mixed-effects"}, ${agreement === "absolute" ? "absolute-agreement" : "consistency"}`;
  const strip = (s: string) => s.replace(/^(-?)0\./, "$1.");

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>INTRACLASS CORRELATION CALCULATOR</p>
        <h1>Intraclass correlation (ICC) calculator with 95% confidence intervals.</h1>
        <span>
          Measure inter-rater or test-retest reliability for numeric ratings. You get all six Shrout and Fleiss ICC
          forms with confidence intervals and F tests, help choosing the right one, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>RATINGS</p>
              <h2>Rows = subjects, columns = raters</h2>
            </div>
            <span className={styles.status}>SHROUT &amp; FLEISS</span>
          </div>
          <label className={styles.expressionLabel}>
            <span>SCORES (HEADER ROW OPTIONAL)</span>
            <textarea value={data} onChange={(event) => setData(event.target.value)} spellCheck={false} />
          </label>
          <p className={styles.sectionNote}>For test-retest reliability, put each occasion (time 1, time 2) in its own column.</p>
          <span className={styles.compactLabel}>WHO ARE THE RATERS?</span>
          <div className={styles.tabRow}>
            <button className={raters === "random" ? styles.activeTab : undefined} onClick={() => setRaters("random")} type="button">A sample of possible raters</button>
            <button className={raters === "fixed" ? styles.activeTab : undefined} onClick={() => setRaters("fixed")} type="button">The only raters of interest</button>
            <button className={raters === "different" ? styles.activeTab : undefined} onClick={() => setRaters("different")} type="button">Different raters per subject</button>
          </div>
          {raters !== "different" ? (
            <>
              <span className={styles.compactLabel}>WHAT COUNTS AS AGREEMENT?</span>
              <div className={styles.tabRow}>
                <button className={agreement === "absolute" ? styles.activeTab : undefined} onClick={() => setAgreement("absolute")} type="button">Same scores (absolute)</button>
                <button className={agreement === "consistency" ? styles.activeTab : undefined} onClick={() => setAgreement("consistency")} type="button">Same ranking (consistency)</button>
              </div>
            </>
          ) : null}
          <span className={styles.compactLabel}>WILL YOU USE ONE RATER OR THE AVERAGE?</span>
          <div className={styles.tabRow}>
            <button className={unit === "single" ? styles.activeTab : undefined} onClick={() => setUnit("single")} type="button">A single rater</button>
            <button className={unit === "average" ? styles.activeTab : undefined} onClick={() => setUnit("average")} type="button">The mean of all raters</button>
          </div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate ICC <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result && row ? (
            <>
              <h2>{row.type} = {fixed(row.value, 3)} ({iccBand(row.value)})</h2>
              <div className={styles.resultRows}>
                <div><span>Recommended model</span><strong>{row.type}</strong></div>
                <div><span>95% confidence interval</span><strong>{fixed(row.ciLow, 3)} to {fixed(row.ciHigh, 3)}</strong></div>
                <div><span>F test</span><strong>F({row.df1}, {row.df2}) = {fixed(row.f, 2)}, p = {formatP(row.p)}</strong></div>
                <div><span>Subjects × raters</span><strong>{result.subjects} × {result.raters}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>FORM</th><th>ICC</th><th>95% CI</th></tr></thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.type} style={r.type === chosen ? { background: "#eef4ff", fontWeight: 700 } : undefined}>
                        <td style={{ textAlign: "left" }} title={r.label}>{r.type}</td>
                        <td>{fixed(r.value, 3)}</td>
                        <td>{fixed(r.ciLow, 2)} to {fixed(r.ciHigh, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                Inter-rater reliability was {iccBand(row.value).toLowerCase()}: a {modelName} ICC based on{" "}
                {unit === "single" ? "a single rater" : `the mean of ${result.raters} raters`} was {strip(fixed(row.value, 2))}, 95% CI [
                {strip(fixed(row.ciLow, 2))}, {strip(fixed(row.ciHigh, 2))}], F({row.df1}, {row.df2}) = {fixed(row.f, 2)}, p = {formatP(row.p)}.
              </div>
              <div className={styles.methodNote}>
                <p>INTERPRETATION (KOO &amp; LI, 2016)</p>
                <span>Below .50 poor · .50–.75 moderate · .75–.90 good · above .90 excellent. Judge by the confidence interval, not only the point value.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>ICC</span>
                <p>Use the sample ratings or paste your own, answer the three questions, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
