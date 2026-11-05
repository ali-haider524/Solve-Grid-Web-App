"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, manova, type ManovaResult, parseManovaData, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Group Reading Writing Maths
G1 4.88 4.67 7.48
G1 4.88 5.19 6.09
G1 3.92 4.69 7.5
G1 3.84 5.07 7.99
G1 5.37 6.56 6.5
G1 4.78 6.57 6.59
G1 4.73 5.22 6.79
G1 6.2 6.22 6.65
G1 6.02 5.5 6.89
G1 3.31 3.83 7.19
G2 5.15 6.69 6.58
G2 4.71 4.99 7.24
G2 4.11 5.4 7.29
G2 7.78 6.71 7.95
G2 3.36 4.96 6.91
G2 6.45 5.91 5.46
G2 6.69 7.15 7.25
G2 5.97 6.34 7.75
G2 5.62 6.37 6.83
G2 7.27 6.77 8.42
G3 6.55 6.18 9.25
G3 7.17 6.83 5.91
G3 6.74 6.4 9.43
G3 3.9 5.19 6.64
G3 5.53 6.56 7.98
G3 7.36 6.68 8.09
G3 6.74 7.35 7.02
G3 4.54 7.27 8.89
G3 5.89 5.94 7.84
G3 7.12 6.28 6.63`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function ManovaCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<ManovaResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const data = parseManovaData(text);
      setResult(manova(data.factor, data.dvs, data.rows));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  const pillai = result?.stats[0];

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>MANOVA CALCULATOR</p>
        <h1>One-way MANOVA calculator for several dependent variables.</h1>
        <span>
          Test whether groups differ on two or more outcomes at once. Get Pillai&apos;s trace, Wilks&apos; lambda,
          Hotelling&apos;s trace and Roy&apos;s largest root with F approximations, partial eta squared, follow-up ANOVAs and APA text.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>Group column, then the dependent variables</h2>
            </div>
            <span className={styles.status}>MULTIVARIATE</span>
          </div>
          <p className={styles.sectionNote}>The first row must be a header: group name, then one name per dependent variable. One row per participant.</p>
          <label className={styles.expressionLabel}>
            <span>DATA</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run MANOVA <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th style={{ textAlign: "left" }}>Group</th><th>n</th>{result.dvs.map((dv) => <th key={dv}>{dv}</th>)}</tr></thead>
                <tbody>
                  {result.groups.map((g) => (
                    <tr key={g.name}><td style={{ textAlign: "left" }}>{g.name}</td><td>{g.n}</td>{g.means.map((m, i) => <td key={result.dvs[i]}>{fixed(m, 2)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result && pillai ? (
            <>
              <h2>Pillai&apos;s V = {noZero(pillai.value, 3)}, F({fixed(pillai.df1, 0)}, {fixed(pillai.df2, 0)}) = {fixed(pillai.f, 2)}, {pText(pillai.p)}</h2>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Test</th><th>Value</th><th>F</th><th>df</th><th>p</th><th>η²p</th></tr></thead>
                  <tbody>
                    {result.stats.map((s) => (
                      <tr key={s.name}><td style={{ textAlign: "left" }}>{s.name}</td><td>{fixed(s.value, 3)}</td><td>{fixed(s.f, 2)}</td><td>{Number.isInteger(s.df2) ? `${s.df1}, ${s.df2}` : `${s.df1}, ${fixed(s.df2, 1)}`}</td><td>{pText(s.p).replace("p = ", "").replace("p ", "")}</td><td>{noZero(s.partialEta)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Follow-up ANOVA</th><th>F</th><th>p</th><th>η²p</th></tr></thead>
                  <tbody>
                    {result.univariate.map((u) => (
                      <tr key={u.dv}><td style={{ textAlign: "left" }}>{u.dv}</td><td>F({u.df1}, {u.df2}) = {fixed(u.f, 2)}</td><td>{pText(u.p).replace("p = ", "").replace("p ", "")}</td><td>{noZero(u.partialEta)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                A one-way MANOVA showed {pillai.p < 0.05 ? "a statistically significant" : "no statistically significant"} difference between {result.factor.toLowerCase()} groups on the combined dependent variables ({result.dvs.join(", ")}), Pillai&apos;s V = {noZero(pillai.value)}, F({fixed(pillai.df1, 0)}, {fixed(pillai.df2, 0)}) = {fixed(pillai.f, 2)}, {pText(pillai.p)}, partial η² = {noZero(pillai.partialEta)}.
                {pillai.p < 0.05 ? " Follow-up ANOVAs (above) show which outcomes differ; consider a Bonferroni-adjusted α." : " Follow-up ANOVAs should be interpreted with caution because the multivariate test was not significant."}
              </div>
              <div className={styles.methodNote}>
                <p>WHICH STATISTIC?</p>
                <span>Report Pillai&apos;s trace by default: it is the most robust when group sizes differ or assumptions are shaky. Wilks&apos; lambda is the most common in older papers.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to analyse</h2>
              <div className={styles.empty}>
                <span>Λ</span>
                <p>Use the sample data or paste your own, then run the MANOVA.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
