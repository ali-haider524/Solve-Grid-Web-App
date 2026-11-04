"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, parseTwoWayData, pText, twoWayAnova, type TwoWayResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Method Gender Score
Lecture Female 72
Lecture Female 75
Lecture Female 70
Lecture Male 68
Lecture Male 71
Lecture Male 66
Blended Female 82
Blended Female 85
Blended Female 80
Blended Male 78
Blended Male 74
Blended Male 77
Online Female 76
Online Female 73
Online Female 79
Online Male 70
Online Male 72
Online Male 69`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function TwoWayAnovaCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<TwoWayResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const data = parseTwoWayData(text);
      setResult(twoWayAnova(data.rows, data.names[0], data.names[1]));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  const line = (r: TwoWayResult, i: number) => {
    const t = r.terms[i];
    return `F(${t.df}, ${r.error.df}) = ${fixed(t.f, 2)}, ${pText(t.p)}, partial η² = ${noZero(t.partialEta)}`;
  };

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>TWO-WAY ANOVA CALCULATOR</p>
        <h1>Two-way ANOVA calculator with interaction effects.</h1>
        <span>
          Paste one row per participant with two factors and a score. Get both main effects and the interaction with Type III
          sums of squares (the SPSS default), partial eta squared, cell means and an APA-style write-up.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA (LONG FORMAT)</p>
              <h2>Factor A, factor B, score</h2>
            </div>
            <span className={styles.status}>TYPE III</span>
          </div>
          <p className={styles.sectionNote}>One row per participant. An optional first row can hold the variable names. Separate values with spaces, tabs or commas.</p>
          <label className={styles.expressionLabel}>
            <span>DATA</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run two-way ANOVA <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <div className={styles.tableWrap}>
              <table>
                <caption className={styles.sectionNote} style={{ textAlign: "left", padding: "8px 10px" }}>Cell means</caption>
                <thead>
                  <tr><th style={{ textAlign: "left" }}>{result.factorA}</th><th style={{ textAlign: "left" }}>{result.factorB}</th><th>n</th><th>Mean</th><th>SD</th></tr>
                </thead>
                <tbody>
                  {result.cells.map((c) => (
                    <tr key={`${c.a}-${c.b}`}><td style={{ textAlign: "left" }}>{c.a}</td><td style={{ textAlign: "left" }}>{c.b}</td><td>{c.n}</td><td>{fixed(c.mean, 2)}</td><td>{fixed(c.sd, 2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>Interaction: {line(result, 2)}</h2>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr><th style={{ textAlign: "left" }}>Source</th><th>SS</th><th>df</th><th>MS</th><th>F</th><th>p</th><th>η²p</th></tr>
                  </thead>
                  <tbody>
                    {result.terms.map((t) => (
                      <tr key={t.name}><td style={{ textAlign: "left" }}>{t.name}</td><td>{fixed(t.ss, 2)}</td><td>{t.df}</td><td>{fixed(t.ms, 2)}</td><td>{fixed(t.f, 2)}</td><td>{pText(t.p).replace("p = ", "").replace("p ", "")}</td><td>{noZero(t.partialEta)}</td></tr>
                    ))}
                    <tr><td style={{ textAlign: "left" }}>Error</td><td>{fixed(result.error.ss, 2)}</td><td>{result.error.df}</td><td>{fixed(result.error.ms, 2)}</td><td /><td /><td /></tr>
                    <tr><td style={{ textAlign: "left" }}>Total (corrected)</td><td>{fixed(result.total.ss, 2)}</td><td>{result.total.df}</td><td /><td /><td /><td /></tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                A {result.levelsA.length} × {result.levelsB.length} two-way ANOVA examined the effects of {result.factorA} and {result.factorB} on the outcome. The interaction was{" "}
                {result.terms[2].p < 0.05 ? "statistically significant" : "not statistically significant"}, {line(result, 2)}. There was{" "}
                {result.terms[0].p < 0.05 ? "a significant" : "no significant"} main effect of {result.factorA}, {line(result, 0)}, and{" "}
                {result.terms[1].p < 0.05 ? "a significant" : "no significant"} main effect of {result.factorB}, {line(result, 1)}.
              </div>
              <div className={styles.methodNote}>
                <p>{result.balanced ? "BALANCED DESIGN" : "UNBALANCED DESIGN"}</p>
                <span>
                  {result.terms[2].p < 0.05
                    ? "The interaction is significant, so describe the cell means (or simple effects) before interpreting main effects."
                    : "The interaction is not significant, so the main effects can be interpreted on their own."}{" "}
                  {result.balanced ? "All cells have the same n, so Type I, II and III sums of squares agree." : "Cell sizes differ, so Type III sums of squares are used, matching SPSS."}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to analyse</h2>
              <div className={styles.empty}>
                <span>A×B</span>
                <p>Use the sample data or paste your own, then run the ANOVA.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
