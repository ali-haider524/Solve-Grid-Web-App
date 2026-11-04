"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, marginOfError, type MarginOfErrorResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

export default function MarginOfErrorCalculator() {
  const [kind, setKind] = useState<"proportion" | "mean">("proportion");
  const [n, setN] = useState("385");
  const [level, setLevel] = useState("95");
  const [proportion, setProportion] = useState("50");
  const [sd, setSd] = useState("12");
  const [population, setPopulation] = useState("");
  const [result, setResult] = useState<MarginOfErrorResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(
        marginOfError(kind, Number(n), Number(level) / 100, {
          proportion: Number(proportion) / 100,
          sd: Number(sd),
          population: population.trim() ? Number(population) : undefined,
        }),
      );
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  const shown = (r: MarginOfErrorResult) => (r.kind === "proportion" ? `±${fixed(r.margin * 100, 2)} percentage points` : `±${fixed(r.margin, 3)}`);

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>MARGIN OF ERROR CALCULATOR</p>
        <h1>Margin of error calculator for surveys and samples.</h1>
        <span>
          Find how precise a survey result is from the sample size and confidence level, for a percentage or a mean, with an
          optional finite population correction when you sample a large share of a known population.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>INPUTS</p>
              <h2>Your sample</h2>
            </div>
            <span className={styles.status}>z × SE</span>
          </div>
          <div className={styles.tabRow}>
            <button className={kind === "proportion" ? styles.activeTab : ""} onClick={() => setKind("proportion")} type="button">Percentage (proportion)</button>
            <button className={kind === "mean" ? styles.activeTab : ""} onClick={() => setKind("mean")} type="button">Mean</button>
          </div>
          <div className={styles.fieldGrid}>
            <label><span>SAMPLE SIZE (n)</span><input inputMode="numeric" value={n} onChange={(e) => setN(e.target.value)} /></label>
            <label>
              <span>CONFIDENCE LEVEL</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="99">99%</option>
              </select>
            </label>
            {kind === "proportion" ? (
              <label><span>EXPECTED PERCENTAGE (%)</span><input inputMode="decimal" value={proportion} onChange={(e) => setProportion(e.target.value)} /></label>
            ) : (
              <label><span>STANDARD DEVIATION</span><input inputMode="decimal" value={sd} onChange={(e) => setSd(e.target.value)} /></label>
            )}
            <label><span>POPULATION SIZE (OPTIONAL)</span><input inputMode="numeric" placeholder="Leave blank if large or unknown" value={population} onChange={(e) => setPopulation(e.target.value)} /></label>
          </div>
          {kind === "proportion" ? <p className={styles.sectionNote}>Use 50% if you do not know the expected percentage: it gives the largest, safest margin of error.</p> : null}
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate margin of error <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>{shown(result)}</h2>
              <div className={styles.resultRows}>
                <div><span>z critical ({level}%)</span><strong>{fixed(result.z, 4)}</strong></div>
                <div><span>Standard error</span><strong>{fixed(result.se, 5)}</strong></div>
                <div><span>Finite population correction</span><strong>{result.fpc === 1 ? "not applied" : fixed(result.fpc, 4)}</strong></div>
                <div><span>Margin of error</span><strong>{result.kind === "proportion" ? `${fixed(result.margin * 100, 2)}%` : fixed(result.margin, 4)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                With n = {n} respondents, the margin of error at {level}% confidence is {shown(result)}
                {result.kind === "proportion" ? ` for a result near ${proportion}%` : ""}
                {result.fpc !== 1 ? `, after the finite population correction for N = ${population}` : ""}.
              </div>
              <div className={styles.methodNote}>
                <p>NEED A SAMPLE SIZE INSTEAD?</p>
                <span>To find how many people you need for a target margin of error, use the Sample Size Calculator (Slovin or Cochran).</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>±</span>
                <p>Enter your sample size and confidence level, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
