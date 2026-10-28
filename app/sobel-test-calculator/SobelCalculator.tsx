"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, sobelTest, type SobelResult, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

export default function SobelCalculator() {
  const [v, setV] = useState({ a: "0.50", sa: "0.10", b: "0.40", sb: "0.12", c: "0.60" });
  const [result, setResult] = useState<SobelResult | null>(null);
  const [error, setError] = useState("");
  const field = (key: keyof typeof v, label: string) => (
    <label key={key}>
      <span>{label}</span>
      <input inputMode="decimal" value={v[key]} onChange={(event) => setV((c) => ({ ...c, [key]: event.target.value }))} />
    </label>
  );

  function calculate() {
    try {
      setError("");
      const c = v.c.trim() === "" ? undefined : Number(v.c);
      setResult(sobelTest(Number(v.a), Number(v.sa), Number(v.b), Number(v.sb), c));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>SOBEL TEST CALCULATOR</p>
        <h1>Sobel test calculator for mediation analysis.</h1>
        <span>
          Test whether a mediator M carries the effect of X on Y. Enter the a and b path coefficients with their standard
          errors to get the indirect effect, Sobel, Aroian, and Goodman z tests, a 95% CI, and the proportion mediated.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>PATH COEFFICIENTS</p>
              <h2>From your two regressions</h2>
            </div>
            <span className={styles.status}>X → M → Y</span>
          </div>
          <p className={styles.sectionNote}>
            a: regress M on X. b: regress Y on M and X together (use the coefficient of M). Use unstandardised coefficients
            and their standard errors from the same output.
          </p>
          <div className={styles.fieldGrid}>{[field("a", "a (X → M)"), field("sa", "SE OF a")]}</div>
          <div className={styles.fieldGrid}>{[field("b", "b (M → Y, CONTROLLING X)"), field("sb", "SE OF b")]}</div>
          <div className={styles.fieldGrid}>{[field("c", "c TOTAL EFFECT X → Y (OPTIONAL)")]}</div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Sobel test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>Indirect effect ab = {fixed(result.indirect, 3)}, z = {fixed(result.sobel.z, 2)}, {pText(result.sobel.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>Indirect effect (a × b)</span><strong>{fixed(result.indirect, 4)}</strong></div>
                <div><span>Sobel z, p</span><strong>{fixed(result.sobel.z, 3)}, {formatP(result.sobel.p)}</strong></div>
                <div><span>Aroian z, p</span><strong>{fixed(result.aroian.z, 3)}, {formatP(result.aroian.p)}</strong></div>
                <div><span>Goodman z, p</span><strong>{result.goodman ? `${fixed(result.goodman.z, 3)}, ${formatP(result.goodman.p)}` : "not defined"}</strong></div>
                <div><span>Sobel standard error</span><strong>{fixed(result.sobel.se, 4)}</strong></div>
                <div><span>95% CI (normal theory)</span><strong>{fixed(result.ciLow, 3)} to {fixed(result.ciHigh, 3)}</strong></div>
                {result.proportionMediated !== null ? (
                  <div><span>Proportion mediated (ab ÷ c)</span><strong>{fixed(result.proportionMediated * 100, 1)}%</strong></div>
                ) : null}
              </div>
              <div className={styles.interpretation}>
                A Sobel test indicated {result.sobel.p < 0.05 ? "a significant" : "no significant"} indirect effect of X on Y through M, ab ={" "}
                {fixed(result.indirect, 2)}, z = {fixed(result.sobel.z, 2)}, {pText(result.sobel.p)}.
              </div>
              <div className={styles.methodNote}>
                <p>IMPORTANT</p>
                <span>
                  The Sobel test assumes ab is normally distributed, which is rarely true in small samples. Many reviewers now
                  expect a bootstrap confidence interval (for example PROCESS in SPSS, or lavaan in R). Report Sobel as a
                  supporting result.
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>ab</span>
                <p>Use the sample coefficients or enter your own, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
