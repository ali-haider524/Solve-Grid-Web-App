"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  adjustForResponseRate,
  cochranSampleSize,
  slovinSampleSize,
  type ResultRow,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

type Method = "slovin" | "cochran";

type Output = { title: string; rows: ResultRow[]; sentence: string; n: number };

export default function SampleSizeCalculator() {
  const [method, setMethod] = useState<Method>("slovin");
  const [population, setPopulation] = useState("1200");
  const [margin, setMargin] = useState("5");
  const [confidence, setConfidence] = useState("95");
  const [proportion, setProportion] = useState("50");
  const [responseRate, setResponseRate] = useState("100");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const e = Number(margin) / 100;
      const rate = Number(responseRate) / 100;
      const N = population.trim() === "" ? undefined : Number(population);
      let rows: ResultRow[];
      let n: number;
      let sentence: string;

      if (method === "slovin") {
        if (N === undefined) throw new Error("Slovin's formula needs a known population size N.");
        const result = slovinSampleSize(N, e);
        n = result.n;
        rows = [
          { label: "Formula", value: "n = N ÷ (1 + N·e²)" },
          { label: "Substitution", value: `${N} ÷ (1 + ${N} × ${e}²)` },
          { label: "Unrounded n", value: result.raw.toFixed(2) },
          { label: "Minimum sample (rounded up)", value: String(n) },
        ];
        sentence = `Using Slovin's formula (Yamane, 1967) with a population of ${N} and a ${margin}% margin of error, the minimum sample size was ${n} respondents.`;
      } else {
        const p = Number(proportion) / 100;
        const result = cochranSampleSize(confidence, e, p, N);
        n = result.n;
        rows = [
          { label: "z for " + confidence + "% confidence", value: result.z.toFixed(4) },
          { label: "n₀ = z²·p(1 − p) ÷ e²", value: result.n0.toFixed(2) },
          ...(result.corrected !== null
            ? [{ label: "Finite correction n₀ ÷ (1 + (n₀ − 1)/N)", value: result.corrected.toFixed(2) }]
            : [{ label: "Finite correction", value: "Not applied (N unknown)" }]),
          { label: "Minimum sample (rounded up)", value: String(n) },
        ];
        sentence = `Using Cochran's formula at ${confidence}% confidence, a ${margin}% margin of error, and p = ${p}${
          result.corrected !== null ? `, with finite population correction for N = ${N}` : ""
        }, the minimum sample size was ${n} respondents.`;
      }

      if (rate < 1) {
        const inflated = adjustForResponseRate(n, rate);
        rows.push({ label: `Invite for ${responseRate}% response rate`, value: String(inflated) });
        sentence += ` Allowing for an expected ${responseRate}% response rate, ${inflated} participants were invited.`;
      }

      setOutput({ title: method === "slovin" ? "Slovin / Yamane result" : "Cochran result", rows, sentence, n });
    } catch (caught) {
      setOutput(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>SAMPLE SIZE CALCULATOR</p>
        <h1>Sample size calculator with Slovin, Yamane, and Cochran formulas.</h1>
        <span>
          Find the minimum number of respondents for a survey or thesis. Every step is shown so you can copy the
          working into your methodology chapter.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>INPUTS</p>
              <h2>{method === "slovin" ? "Slovin's formula" : "Cochran's formula"}</h2>
            </div>
            <span className={styles.status}>STEP-BY-STEP</span>
          </div>
          <div className={styles.tabRow}>
            <button className={method === "slovin" ? styles.activeTab : undefined} onClick={() => setMethod("slovin")} type="button">
              Slovin / Yamane
            </button>
            <button className={method === "cochran" ? styles.activeTab : undefined} onClick={() => setMethod("cochran")} type="button">
              Cochran + finite correction
            </button>
          </div>
          <p className={styles.sectionNote}>
            {method === "slovin"
              ? "Use when the population size is known and you only need to set the margin of error."
              : "Use when you want to state the confidence level and expected proportion. Leave population blank for a very large or unknown population."}
          </p>
          <div className={styles.fieldGrid}>
            <label>
              <span>POPULATION SIZE (N)</span>
              <input inputMode="numeric" value={population} onChange={(event) => setPopulation(event.target.value)} placeholder={method === "cochran" ? "Optional" : "e.g. 1200"} />
            </label>
            <label>
              <span>MARGIN OF ERROR (%)</span>
              <input inputMode="decimal" value={margin} onChange={(event) => setMargin(event.target.value)} />
            </label>
            {method === "cochran" ? (
              <>
                <label>
                  <span>CONFIDENCE LEVEL</span>
                  <select value={confidence} onChange={(event) => setConfidence(event.target.value)}>
                    <option value="90">90%</option>
                    <option value="95">95%</option>
                    <option value="99">99%</option>
                  </select>
                </label>
                <label>
                  <span>EXPECTED PROPORTION p (%)</span>
                  <input inputMode="decimal" value={proportion} onChange={(event) => setProportion(event.target.value)} />
                </label>
              </>
            ) : null}
            <label>
              <span>EXPECTED RESPONSE RATE (%)</span>
              <input inputMode="decimal" value={responseRate} onChange={(event) => setResponseRate(event.target.value)} />
            </label>
          </div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate sample size <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          <h2>{output ? `n = ${output.n}` : "Ready to calculate"}</h2>
          {output ? (
            <>
              <div className={styles.resultRows}>
                {output.rows.map((row) => (
                  <div key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.interpretation}>{output.sentence}</div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>
                  These formulas give a minimum for estimating a proportion. Studies that compare groups or test
                  effects may need a power analysis instead.
                </span>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <span>n</span>
              <p>Enter your population and margin of error, then calculate.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
