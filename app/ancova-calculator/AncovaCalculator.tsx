"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { ancova, type AncovaResult, fixed, parseAncovaData, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Method Pretest Posttest
A 50 32.3
A 61 43.3
A 60 44.1
A 46 32.8
A 48 32.8
A 46 37.7
A 55 46.6
A 50 39.1
B 56 44.6
B 35 36.5
B 63 54.7
B 49 42.2
B 55 49.2
B 49 47.6
B 47 41.4
B 54 43.1
C 57 52.6
C 48 46.8
C 49 50.8
C 55 44.9
C 43 40.2
C 38 36.4
C 53 41.9
C 45 44.5`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function AncovaCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<AncovaResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const data = parseAncovaData(text);
      setResult(ancova(data.rows, data.names[0], data.names[1]));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  const line = (r: AncovaResult, i: number) => `F(${r.terms[i].df}, ${r.error.df}) = ${fixed(r.terms[i].f, 2)}, ${pText(r.terms[i].p)}, partial η² = ${noZero(r.terms[i].partialEta)}`;

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>ANCOVA CALCULATOR</p>
        <h1>ANCOVA calculator: compare groups while controlling for a covariate.</h1>
        <span>
          Compare group means on an outcome after adjusting for a covariate such as a pre-test score. Get the adjusted F test,
          adjusted (estimated marginal) means, the homogeneity of regression slopes check, partial eta squared and APA text.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>Group, covariate, outcome</h2>
            </div>
            <span className={styles.status}>TYPE III</span>
          </div>
          <p className={styles.sectionNote}>One row per participant. An optional header row names the three columns.</p>
          <label className={styles.expressionLabel}>
            <span>DATA</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run ANCOVA <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th style={{ textAlign: "left" }}>{result.factor}</th><th>n</th><th>Mean</th><th>Adjusted mean</th><th>SE</th></tr></thead>
                <tbody>
                  {result.groups.map((g) => (
                    <tr key={g.name}><td style={{ textAlign: "left" }}>{g.name}</td><td>{g.n}</td><td>{fixed(g.mean, 2)}</td><td>{fixed(g.adjustedMean, 2)}</td><td>{fixed(g.se, 2)}</td></tr>
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
              <h2>{result.factor}: {line(result, 1)}</h2>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Source</th><th>SS</th><th>df</th><th>F</th><th>p</th><th>η²p</th></tr></thead>
                  <tbody>
                    {result.terms.map((t) => (
                      <tr key={t.name}><td style={{ textAlign: "left" }}>{t.name}</td><td>{fixed(t.ss, 2)}</td><td>{t.df}</td><td>{fixed(t.f, 2)}</td><td>{pText(t.p).replace("p = ", "").replace("p ", "")}</td><td>{noZero(t.partialEta)}</td></tr>
                    ))}
                    <tr><td style={{ textAlign: "left" }}>Error</td><td>{fixed(result.error.ss, 2)}</td><td>{result.error.df}</td><td /><td /><td /></tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.resultRows}>
                <div><span>Covariate slope (b)</span><strong>{fixed(result.slope, 3)}</strong></div>
                <div><span>Homogeneity of slopes</span><strong>F({result.slopes.df1}, {result.slopes.df2}) = {fixed(result.slopes.f, 2)}, {pText(result.slopes.p)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                After controlling for {result.covariate}, there was {result.terms[1].p < 0.05 ? "a statistically significant" : "no statistically significant"} difference in the outcome between {result.factor.toLowerCase()} groups, {line(result, 1)}. The covariate was {result.terms[0].p < 0.05 ? "significantly" : "not significantly"} related to the outcome, {line(result, 0)}.
              </div>
              <div className={styles.methodNote}>
                <p>ASSUMPTION CHECK</p>
                <span>
                  {result.slopes.p >= 0.05
                    ? "The group × covariate interaction is not significant, so the regression slopes can be treated as equal and the ANCOVA is appropriate."
                    : "The group × covariate interaction is significant: the covariate's effect differs between groups, so a standard ANCOVA may be misleading."}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to analyse</h2>
              <div className={styles.empty}>
                <span>F</span>
                <p>Use the sample data or paste your own, then run the ANCOVA.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
