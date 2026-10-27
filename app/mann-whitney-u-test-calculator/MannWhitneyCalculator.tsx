"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, mannWhitney, parseNumbers, type MannWhitneyResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

export default function MannWhitneyCalculator() {
  const [nameA, setNameA] = useState("Online");
  const [nameB, setNameB] = useState("In-person");
  const [groupA, setGroupA] = useState("3, 4, 2, 6, 2, 5");
  const [groupB, setGroupB] = useState("9, 7, 5, 10, 6, 8");
  const [result, setResult] = useState<MannWhitneyResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(mannWhitney(parseNumbers(groupA, nameA || "Group A"), parseNumbers(groupB, nameB || "Group B")));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the values.");
    }
  }

  const a = nameA || "Group A";
  const b = nameB || "Group B";
  const higher = result ? (result.meanRank1 > result.meanRank2 ? a : b) : "";
  const lower = result ? (higher === a ? b : a) : "";
  const size = (r: number) => (r >= 0.5 ? "large" : r >= 0.3 ? "medium" : r >= 0.1 ? "small" : "negligible");

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>MANN-WHITNEY U TEST CALCULATOR</p>
        <h1>Mann-Whitney U test calculator with exact p values and effect size.</h1>
        <span>
          Compare two independent groups when the data are ordinal (such as Likert items) or not normally
          distributed. You get U, z, the p value (exact for small samples without ties), medians, mean ranks, effect
          size r, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>Two independent groups</h2>
            </div>
            <span className={styles.status}>NON-PARAMETRIC</span>
          </div>
          <div className={styles.fieldGrid}>
            <label>
              <span>GROUP A NAME</span>
              <input value={nameA} onChange={(event) => setNameA(event.target.value)} />
            </label>
            <label>
              <span>GROUP B NAME</span>
              <input value={nameB} onChange={(event) => setNameB(event.target.value)} />
            </label>
          </div>
          <div className={styles.fieldGrid}>
            <label className={styles.expressionLabel}>
              <span>GROUP A VALUES</span>
              <textarea value={groupA} onChange={(event) => setGroupA(event.target.value)} spellCheck={false} />
            </label>
            <label className={styles.expressionLabel}>
              <span>GROUP B VALUES</span>
              <textarea value={groupB} onChange={(event) => setGroupB(event.target.value)} spellCheck={false} />
            </label>
          </div>
          <p className={styles.sectionNote}>Separate values with commas, spaces, or new lines. Paste a column from Excel.</p>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Mann-Whitney U test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>U = {fixed(result.u, 1).replace(/\.0$/, "")}, p = {formatP(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>U (smaller of U₁, U₂)</span><strong>{fixed(result.u, 1).replace(/\.0$/, "")}</strong></div>
                <div><span>z</span><strong>{fixed(result.z, 3)}</strong></div>
                <div><span>p value (two-sided)</span><strong>{formatP(result.p)} {result.exact ? "(exact)" : "(normal approx.)"}</strong></div>
                <div><span>Effect size r</span><strong>{fixed(result.r, 2)} ({size(result.r)})</strong></div>
                <div><span>{a}: n, median, mean rank</span><strong>{result.n1}, {fixed(result.median1, 2)}, {fixed(result.meanRank1, 2)}</strong></div>
                <div><span>{b}: n, median, mean rank</span><strong>{result.n2}, {fixed(result.median2, 2)}, {fixed(result.meanRank2, 2)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                A Mann-Whitney U test indicated that scores were {result.p < 0.05 ? "significantly" : "not significantly"} higher
                for {higher} (Mdn = {fixed(higher === a ? result.median1 : result.median2, 2)}) than for {lower} (Mdn ={" "}
                {fixed(higher === a ? result.median2 : result.median1, 2)}), U = {fixed(result.u, 1).replace(/\.0$/, "")}, z ={" "}
                {fixed(result.z, 2)}, p = {formatP(result.p)}, r = {fixed(result.r, 2).replace(/^0/, "")}.
              </div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>
                  {result.ties
                    ? "Tied values were found, so the p value uses the normal approximation with a tie correction, as SPSS and R do."
                    : result.exact
                      ? "No ties and small groups, so the exact p value is reported."
                      : "Large groups, so the normal approximation with continuity correction is used."}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>U</span>
                <p>Use the sample data or paste your two groups, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
