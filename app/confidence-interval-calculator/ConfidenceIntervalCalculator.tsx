"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  confidenceIntervalMean,
  confidenceIntervalProportion,
  fixed,
  type MeanCiResult,
  type ProportionCiResult,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const pct = (v: number, d = 1) => `${fixed(v * 100, d)}%`;

export default function ConfidenceIntervalCalculator() {
  const [mode, setMode] = useState<"mean" | "proportion">("mean");
  const [mean, setMean] = useState("50");
  const [sd, setSd] = useState("10");
  const [n, setN] = useState("25");
  const [successes, setSuccesses] = useState("45");
  const [total, setTotal] = useState("120");
  const [level, setLevel] = useState("95");
  const [meanResult, setMeanResult] = useState<MeanCiResult | null>(null);
  const [propResult, setPropResult] = useState<ProportionCiResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const c = Number(level) / 100;
      if (mode === "mean") {
        setMeanResult(confidenceIntervalMean(Number(mean), Number(sd), Number(n), c));
        setPropResult(null);
      } else {
        setPropResult(confidenceIntervalProportion(Number(successes), Number(total), c));
        setMeanResult(null);
      }
    } catch (caught) {
      setMeanResult(null);
      setPropResult(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>CONFIDENCE INTERVAL CALCULATOR</p>
        <h1>Confidence interval calculator for a mean or a proportion.</h1>
        <span>
          Get a 90%, 95% or 99% confidence interval from summary statistics, with the standard error, critical value, margin of
          error and a sentence you can use in your results chapter.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>INPUTS</p>
              <h2>What are you estimating?</h2>
            </div>
            <span className={styles.status}>{mode === "mean" ? "t INTERVAL" : "WILSON"}</span>
          </div>
          <div className={styles.tabRow}>
            <button className={mode === "mean" ? styles.activeTab : ""} onClick={() => setMode("mean")} type="button">Mean</button>
            <button className={mode === "proportion" ? styles.activeTab : ""} onClick={() => setMode("proportion")} type="button">Proportion / percentage</button>
          </div>
          <div className={styles.fieldGrid}>
            {mode === "mean" ? (
              <>
                <label><span>SAMPLE MEAN (M)</span><input inputMode="decimal" value={mean} onChange={(e) => setMean(e.target.value)} /></label>
                <label><span>STANDARD DEVIATION (SD)</span><input inputMode="decimal" value={sd} onChange={(e) => setSd(e.target.value)} /></label>
                <label><span>SAMPLE SIZE (n)</span><input inputMode="numeric" value={n} onChange={(e) => setN(e.target.value)} /></label>
              </>
            ) : (
              <>
                <label><span>NUMBER WITH THE OUTCOME (x)</span><input inputMode="numeric" value={successes} onChange={(e) => setSuccesses(e.target.value)} /></label>
                <label><span>SAMPLE SIZE (n)</span><input inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} /></label>
              </>
            )}
            <label>
              <span>CONFIDENCE LEVEL (%)</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="99">99%</option>
              </select>
            </label>
          </div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate confidence interval <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {meanResult ? (
            <>
              <h2>{level}% CI [{fixed(meanResult.low, 2)}, {fixed(meanResult.high, 2)}]</h2>
              <div className={styles.resultRows}>
                <div><span>Mean</span><strong>{fixed(meanResult.mean, 2)}</strong></div>
                <div><span>Standard error (SD ÷ √n)</span><strong>{fixed(meanResult.se, 4)}</strong></div>
                <div><span>t critical (df = {meanResult.df})</span><strong>{fixed(meanResult.critical, 4)}</strong></div>
                <div><span>Margin of error (t × SE)</span><strong>±{fixed(meanResult.margin, 3)}</strong></div>
                <div><span>Lower limit</span><strong>{fixed(meanResult.low, 3)}</strong></div>
                <div><span>Upper limit</span><strong>{fixed(meanResult.high, 3)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                The mean was {fixed(meanResult.mean, 2)} (SD = {fixed(meanResult.sd, 2)}, n = {meanResult.n}), {level}% CI [{fixed(meanResult.low, 2)}, {fixed(meanResult.high, 2)}].
              </div>
            </>
          ) : propResult ? (
            <>
              <h2>{pct(propResult.p)}, {level}% CI [{pct(propResult.wilsonLow)}, {pct(propResult.wilsonHigh)}]</h2>
              <div className={styles.resultRows}>
                <div><span>Sample proportion (x ÷ n)</span><strong>{fixed(propResult.p, 4)}</strong></div>
                <div><span>z critical</span><strong>{fixed(propResult.z, 4)}</strong></div>
                <div><span>Wilson score interval (recommended)</span><strong>[{fixed(propResult.wilsonLow, 4)}, {fixed(propResult.wilsonHigh, 4)}]</strong></div>
                <div><span>Wald interval (p ± z√(p(1−p)/n))</span><strong>[{fixed(propResult.waldLow, 4)}, {fixed(propResult.waldHigh, 4)}]</strong></div>
                <div><span>Wald margin of error</span><strong>±{pct(propResult.margin, 2)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                {propResult.successes} of {propResult.n} respondents ({pct(propResult.p)}) had the outcome, {level}% CI [{pct(propResult.wilsonLow)}, {pct(propResult.wilsonHigh)}] (Wilson score interval).
              </div>
              <div className={styles.methodNote}>
                <p>WHY WILSON?</p>
                <span>The Wald interval can fall below 0% or above 100% and is too narrow for small samples. The Wilson interval keeps close to the stated confidence level.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>[ ]</span>
                <p>Choose mean or proportion, enter your numbers and calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
