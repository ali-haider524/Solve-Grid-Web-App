"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, parseNumbers, wilcoxonSignedRank, type WilcoxonResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

export default function WilcoxonCalculator() {
  const [before, setBefore] = useState("12, 15, 11, 18, 14, 13, 16, 17, 19, 10");
  const [after, setAfter] = useState("14, 18, 13, 21, 15, 17, 15, 22, 20, 12");
  const [result, setResult] = useState<WilcoxonResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(wilcoxonSignedRank(parseNumbers(before, "Before"), parseNumbers(after, "After")));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the values.");
    }
  }

  const size = (r: number) => (r >= 0.5 ? "large" : r >= 0.3 ? "medium" : r >= 0.1 ? "small" : "negligible");
  const t = (v: number) => fixed(v, 1).replace(/\.0$/, "");

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>WILCOXON SIGNED-RANK TEST CALCULATOR</p>
        <h1>Wilcoxon signed-rank test calculator for paired data.</h1>
        <span>
          Compare two related measurements, such as pre-test and post-test scores from the same people, when the
          differences are not normally distributed. You get T, z, the p value, medians, effect size r, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>PAIRED DATA</p>
              <h2>Same participants, two measurements</h2>
            </div>
            <span className={styles.status}>NON-PARAMETRIC</span>
          </div>
          <div className={styles.fieldGrid}>
            <label className={styles.expressionLabel}>
              <span>BEFORE (TIME 1)</span>
              <textarea value={before} onChange={(event) => setBefore(event.target.value)} spellCheck={false} />
            </label>
            <label className={styles.expressionLabel}>
              <span>AFTER (TIME 2)</span>
              <textarea value={after} onChange={(event) => setAfter(event.target.value)} spellCheck={false} />
            </label>
          </div>
          <p className={styles.sectionNote}>
            Keep the same order in both columns: the first value in each column must belong to the same participant.
          </p>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Wilcoxon signed-rank test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>T = {t(result.t)}, z = {fixed(result.z, 2)}, p = {formatP(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>T (smaller rank sum)</span><strong>{t(result.t)}</strong></div>
                <div><span>W⁺ / W⁻</span><strong>{t(result.wPlus)} / {t(result.wMinus)}</strong></div>
                <div><span>z</span><strong>{fixed(result.z, 3)}</strong></div>
                <div><span>p value (two-sided)</span><strong>{formatP(result.p)} {result.exact ? "(exact)" : "(normal approx.)"}</strong></div>
                <div><span>Effect size r</span><strong>{fixed(result.r, 2)} ({size(result.r)})</strong></div>
                <div><span>Median before → after</span><strong>{fixed(result.medianBefore, 2)} → {fixed(result.medianAfter, 2)}</strong></div>
                <div><span>Pairs used (zero differences dropped)</span><strong>{result.nUsed} of {result.nPairs}</strong></div>
              </div>
              <div className={styles.interpretation}>
                A Wilcoxon signed-rank test indicated that scores were {result.p < 0.05 ? "significantly" : "not significantly"}{" "}
                {result.medianAfter >= result.medianBefore ? "higher" : "lower"} after (Mdn = {fixed(result.medianAfter, 2)}) than before
                (Mdn = {fixed(result.medianBefore, 2)}), T = {t(result.t)}, z = {fixed(result.z, 2)}, p = {formatP(result.p)}, r ={" "}
                {fixed(result.r, 2).replace(/^0/, "")}.
              </div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>
                  {result.exact
                    ? "No ties or zero differences, so the exact p value is reported."
                    : "Ties or zero differences were present, so the tie-corrected normal approximation is used (as in SPSS)."}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>T</span>
                <p>Use the sample before/after scores or paste your own, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
