"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, kruskalWallis, parseNumbers, type KruskalResult, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Lecture: 1, 2, 2, 3, 4, 4, 5
Blended: 3, 4, 5, 5, 6, 7, 7
Flipped: 6, 7, 8, 8, 9, 9, 10`;

export default function KruskalWallisCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<KruskalResult | null>(null);
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
      setResult(kruskalWallis(groups));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the groups.");
    }
  }

  const eps = (e: number) => (e >= 0.26 ? "large" : e >= 0.08 ? "medium" : e >= 0.01 ? "small" : "negligible");

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>KRUSKAL-WALLIS TEST CALCULATOR</p>
        <h1>Kruskal-Wallis H test calculator with Dunn post hoc tests.</h1>
        <span>
          Compare three or more independent groups when the data are ordinal or not normal. You get H, df, the p value,
          epsilon squared, medians, mean ranks, Bonferroni-adjusted Dunn comparisons, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>GROUPS</p>
              <h2>One group per line</h2>
            </div>
            <span className={styles.status}>NON-PARAMETRIC</span>
          </div>
          <p className={styles.sectionNote}>Write each group as &quot;Name: value, value, …&quot;. The name is optional.</p>
          <label className={styles.expressionLabel}>
            <span>GROUP VALUES</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Kruskal-Wallis test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>H({result.df}) = {fixed(result.h, 2)}, {pText(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>H statistic (tie-corrected)</span><strong>{fixed(result.h, 3)}</strong></div>
                <div><span>Degrees of freedom</span><strong>{result.df}</strong></div>
                <div><span>p value</span><strong>{formatP(result.p)}</strong></div>
                <div><span>Epsilon squared (ε²)</span><strong>{fixed(result.epsilonSquared, 3)} ({eps(result.epsilonSquared)})</strong></div>
                <div><span>Total N</span><strong>{result.n}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>GROUP</th><th>n</th><th>MEDIAN</th><th>MEAN RANK</th></tr></thead>
                  <tbody>
                    {result.groups.map((g) => (
                      <tr key={g.name}><td style={{ textAlign: "left" }}>{g.name}</td><td>{g.n}</td><td>{fixed(g.median, 2)}</td><td>{fixed(g.meanRank, 2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>DUNN COMPARISON</th><th>z</th><th>p (ADJ.)</th></tr></thead>
                  <tbody>
                    {result.dunn.map((d) => (
                      <tr key={d.a + d.b}><td style={{ textAlign: "left" }}>{d.a} vs {d.b}</td><td>{fixed(d.z, 2)}</td><td>{formatP(d.pAdj)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                A Kruskal-Wallis H test showed {result.p < 0.05 ? "a statistically significant" : "no statistically significant"} difference
                between groups, H({result.df}) = {fixed(result.h, 2)}, {pText(result.p)}, ε² = {fixed(result.epsilonSquared, 2).replace(/^0/, "")}.
                {result.p < 0.05
                  ? ` Dunn's post hoc tests with Bonferroni correction showed significant differences for ${
                      result.dunn.filter((d) => d.pAdj < 0.05).map((d) => `${d.a} vs ${d.b}`).join(", ") || "no single pair"
                    }.`
                  : ""}
              </div>
              <div className={styles.methodNote}>
                <p>NOTE</p>
                <span>Run post hoc comparisons only when H is significant. p values are Bonferroni-adjusted for {result.dunn.length} comparisons.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>H</span>
                <p>Use the sample groups or paste your own, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
