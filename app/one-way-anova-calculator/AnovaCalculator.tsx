"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { etaBand, fixed, formatP, oneWayAnova, parseNumbers, type AnovaResult, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Lecture: 68, 72, 75, 70, 65, 74, 71, 69
Blended: 74, 78, 80, 76, 73, 79, 77
Flipped: 82, 79, 85, 88, 80, 84, 86, 83, 81`;

const num = (v: number) => (Math.abs(v) >= 1000 ? fixed(v, 1) : fixed(v, 2));
const dfText = (df: number) => (Number.isInteger(df) ? String(df) : fixed(df, 2));
const pApa = (p: number) => (p < 0.001 ? "p < .001" : `${pText(p)}`);

export default function AnovaCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<AnovaResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const groups = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, i) => {
          const colon = line.indexOf(":");
          const name = colon > 0 ? line.slice(0, colon).trim() : `Group ${i + 1}`;
          return { name, values: parseNumbers(colon > 0 ? line.slice(colon + 1) : line, name) };
        });
      const names = new Set(groups.map((g) => g.name));
      if (names.size !== groups.length) throw new Error("Give each group a different name.");
      setResult(oneWayAnova(groups));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the groups.");
    }
  }

  function sentence(r: AnovaResult) {
    const sig = r.p < 0.05;
    const base = `A one-way ANOVA showed ${sig ? "a statistically significant" : "no statistically significant"} difference in scores between the ${r.k} groups, F(${r.dfBetween}, ${r.dfWithin}) = ${fixed(r.f, 2)}, ${pApa(r.p)}, η² = ${fixed(r.etaSquared, 2).replace(/^0/, "")}.`;
    if (!sig) return base;
    const pairs = r.tukey.filter((t) => t.p < 0.05);
    const desc = r.groups.map((g) => `${g.name} (M = ${fixed(g.mean, 2)}, SD = ${fixed(g.sd, 2)})`).join(", ");
    return `${base} Tukey HSD post hoc tests showed significant differences for ${
      pairs.length ? pairs.map((t) => `${t.a} vs ${t.b} (${pApa(t.p)})`).join(", ") : "no single pair"
    }. Group means: ${desc}.`;
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>ONE-WAY ANOVA CALCULATOR</p>
        <h1>One-way ANOVA calculator with Tukey HSD post hoc tests.</h1>
        <span>
          Compare the means of three or more independent groups. Paste raw scores to get the full ANOVA table, F, p, eta
          squared, omega squared, Levene&apos;s test, Welch&apos;s ANOVA, Tukey pairwise comparisons, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>GROUPS</p>
              <h2>One group per line</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <p className={styles.sectionNote}>
            Write each group as &quot;Name: value, value, …&quot;. Values can be separated by commas, spaces, or tabs, so you can paste a
            column from Excel or SPSS after the name.
          </p>
          <label className={styles.expressionLabel}>
            <span>GROUP VALUES</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run one-way ANOVA <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>F({result.dfBetween}, {result.dfWithin}) = {fixed(result.f, 2)}, {pApa(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>F statistic</span><strong>{fixed(result.f, 3)}</strong></div>
                <div><span>p value</span><strong>{formatP(result.p)}</strong></div>
                <div><span>Eta squared (η²)</span><strong>{fixed(result.etaSquared, 3)} ({etaBand(result.etaSquared)})</strong></div>
                <div><span>Omega squared (ω²)</span><strong>{fixed(result.omegaSquared, 3)}</strong></div>
                <div><span>Total N</span><strong>{result.n}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>SOURCE</th><th>SS</th><th>df</th><th>MS</th><th>F</th><th>p</th></tr></thead>
                  <tbody>
                    <tr><td style={{ textAlign: "left" }}>Between groups</td><td>{num(result.ssBetween)}</td><td>{result.dfBetween}</td><td>{num(result.msBetween)}</td><td>{fixed(result.f, 2)}</td><td>{formatP(result.p)}</td></tr>
                    <tr><td style={{ textAlign: "left" }}>Within groups</td><td>{num(result.ssWithin)}</td><td>{result.dfWithin}</td><td>{num(result.msWithin)}</td><td></td><td></td></tr>
                    <tr><td style={{ textAlign: "left" }}>Total</td><td>{num(result.ssTotal)}</td><td>{result.n - 1}</td><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>GROUP</th><th>n</th><th>MEAN</th><th>SD</th></tr></thead>
                  <tbody>
                    {result.groups.map((g) => (
                      <tr key={g.name}><td style={{ textAlign: "left" }}>{g.name}</td><td>{g.n}</td><td>{fixed(g.mean, 2)}</td><td>{fixed(g.sd, 2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>TUKEY HSD</th><th>DIFF.</th><th>95% CI</th><th>p (ADJ.)</th></tr></thead>
                  <tbody>
                    {result.tukey.map((t) => (
                      <tr key={t.a + "|" + t.b}>
                        <td style={{ textAlign: "left" }}>{t.b} − {t.a}</td>
                        <td>{fixed(t.diff, 2)}</td>
                        <td>[{fixed(t.ciLow, 2)}, {fixed(t.ciHigh, 2)}]</td>
                        <td>{formatP(t.p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>{sentence(result)}</div>
              <div className={styles.methodNote}>
                <p>EQUAL VARIANCES CHECK</p>
                <span>
                  Levene&apos;s test (median): F({result.levene.df1}, {result.levene.df2}) = {fixed(result.levene.f, 2)}, {pApa(result.levene.p)}.{" "}
                  {result.levene.p < 0.05
                    ? `Variances differ, so report Welch's ANOVA instead: F(${result.welch.df1}, ${dfText(result.welch.df2)}) = ${fixed(result.welch.f, 2)}, ${pApa(result.welch.p)}, and use Games-Howell post hoc tests.`
                    : `Equal variances look reasonable. Welch's ANOVA for comparison: F(${result.welch.df1}, ${dfText(result.welch.df2)}) = ${fixed(result.welch.f, 2)}, ${pApa(result.welch.p)}.`}
                </span>
              </div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>
                  Interpret Tukey comparisons only when the overall F is significant. Tukey-Kramer adjustment is used for unequal group
                  sizes. For ordinal or clearly non-normal data, use the Kruskal-Wallis test.
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>F</span>
                <p>Use the sample groups or paste your own, then run the ANOVA.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
