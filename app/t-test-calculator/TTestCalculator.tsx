"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  dBand,
  fixed,
  formatP,
  independentTTest,
  oneSampleT,
  pairedTTest,
  parseNumbers,
  type TTestResult,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

type Mode = "independent" | "paired" | "one-sample";

export default function TTestCalculator() {
  const [mode, setMode] = useState<Mode>("independent");
  const [nameA, setNameA] = useState("Practice quizzes");
  const [nameB, setNameB] = useState("No quizzes");
  const [a, setA] = useState("82, 85, 79, 90, 88, 76, 84, 91, 87, 80");
  const [b, setB] = useState("75, 78, 72, 80, 70, 77, 74, 79, 73, 85, 71");
  const [mu, setMu] = useState("75");
  const [welch, setWelch] = useState(true);
  const [result, setResult] = useState<TTestResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      if (mode === "independent") setResult(independentTTest(parseNumbers(a, nameA || "Group 1"), parseNumbers(b, nameB || "Group 2"), welch));
      else if (mode === "paired") setResult(pairedTTest(parseNumbers(a, "Before"), parseNumbers(b, "After")));
      else setResult(oneSampleT(parseNumbers(a, "Sample"), Number(mu)));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the values.");
    }
  }

  const dfText = (df: number) => (Number.isInteger(df) ? String(df) : fixed(df, 2));
  const labels = mode === "independent" ? [nameA || "Group 1", nameB || "Group 2"] : mode === "paired" ? ["Before", "After"] : ["Sample"];
  const sig = (p: number) => (p < 0.05 ? "significantly" : "not significantly");

  function sentence(r: TTestResult) {
    const g = r.groups;
    if (r.kind === "independent") {
      const hi = g[0].mean >= g[1].mean ? 0 : 1;
      const lo = 1 - hi;
      return `${r.welch ? "A Welch's" : "An independent-samples"} t-test showed that ${labels[hi]} (M = ${fixed(g[hi].mean, 2)}, SD = ${fixed(g[hi].sd, 2)}) scored ${sig(r.p)} higher than ${labels[lo]} (M = ${fixed(g[lo].mean, 2)}, SD = ${fixed(g[lo].sd, 2)}), t(${dfText(r.df)}) = ${fixed(Math.abs(r.t), 2)}, p = ${formatP(r.p)}, d = ${fixed(Math.abs(r.d), 2)}, 95% CI of the difference [${fixed(Math.min(Math.abs(r.ciLow), Math.abs(r.ciHigh)) * (r.ciLow * r.ciHigh < 0 ? -1 : 1), 2)}, ${fixed(Math.max(Math.abs(r.ciLow), Math.abs(r.ciHigh)), 2)}].`;
    }
    if (r.kind === "paired") {
      return `A paired-samples t-test showed that scores were ${sig(r.p)} ${r.meanDiff >= 0 ? "higher" : "lower"} after (M = ${fixed(g[1].mean, 2)}, SD = ${fixed(g[1].sd, 2)}) than before (M = ${fixed(g[0].mean, 2)}, SD = ${fixed(g[0].sd, 2)}), t(${r.df}) = ${fixed(r.t, 2)}, p = ${formatP(r.p)}, dz = ${fixed(r.d, 2)}, mean difference = ${fixed(r.meanDiff, 2)}, 95% CI [${fixed(r.ciLow, 2)}, ${fixed(r.ciHigh, 2)}].`;
    }
    return `A one-sample t-test showed that the mean (M = ${fixed(g[0].mean, 2)}, SD = ${fixed(g[0].sd, 2)}) was ${sig(r.p)} different from ${mu}, t(${r.df}) = ${fixed(r.t, 2)}, p = ${formatP(r.p)}, d = ${fixed(r.d, 2)}.`;
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>T-TEST CALCULATOR</p>
        <h1>t-test calculator: independent, paired, and one-sample.</h1>
        <span>
          Paste your data and get t, degrees of freedom, the p value, the mean difference with a 95% confidence interval,
          Cohen&apos;s d, a Levene check for equal variances, and an APA-style sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>{mode === "independent" ? "Two independent groups" : mode === "paired" ? "Paired measurements" : "One sample vs a value"}</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <div className={styles.tabRow}>
            {(["independent", "paired", "one-sample"] as Mode[]).map((m) => (
              <button className={mode === m ? styles.activeTab : undefined} key={m} onClick={() => { setMode(m); setResult(null); }} type="button">
                {m === "independent" ? "Independent samples" : m === "paired" ? "Paired samples" : "One sample"}
              </button>
            ))}
          </div>
          {mode === "independent" ? (
            <div className={styles.fieldGrid}>
              <label><span>GROUP 1 NAME</span><input value={nameA} onChange={(event) => setNameA(event.target.value)} /></label>
              <label><span>GROUP 2 NAME</span><input value={nameB} onChange={(event) => setNameB(event.target.value)} /></label>
            </div>
          ) : null}
          <div className={styles.fieldGrid}>
            <label className={styles.expressionLabel}>
              <span>{mode === "independent" ? "GROUP 1 VALUES" : mode === "paired" ? "BEFORE (TIME 1)" : "SAMPLE VALUES"}</span>
              <textarea value={a} onChange={(event) => setA(event.target.value)} spellCheck={false} />
            </label>
            {mode !== "one-sample" ? (
              <label className={styles.expressionLabel}>
                <span>{mode === "independent" ? "GROUP 2 VALUES" : "AFTER (TIME 2)"}</span>
                <textarea value={b} onChange={(event) => setB(event.target.value)} spellCheck={false} />
              </label>
            ) : (
              <label>
                <span>TEST VALUE (μ₀)</span>
                <input inputMode="decimal" value={mu} onChange={(event) => setMu(event.target.value)} />
              </label>
            )}
          </div>
          {mode === "independent" ? (
            <label className={styles.switchRow}>
              <span>Use Welch&apos;s t-test (does not assume equal variances, recommended)</span>
              <input checked={welch} onChange={(event) => setWelch(event.target.checked)} type="checkbox" />
            </label>
          ) : null}
          {mode === "paired" ? <p className={styles.sectionNote}>Keep both columns in the same participant order.</p> : null}
          <button className={styles.runButton} onClick={calculate} type="button">
            Run t-test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>t({dfText(result.df)}) = {fixed(result.t, 2)}, p = {formatP(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>t statistic</span><strong>{fixed(result.t, 3)}</strong></div>
                <div><span>Degrees of freedom</span><strong>{dfText(result.df)}</strong></div>
                <div><span>p value (two-tailed)</span><strong>{formatP(result.p)}</strong></div>
                <div><span>Mean difference</span><strong>{fixed(result.meanDiff, 3)}</strong></div>
                <div><span>95% CI of the difference</span><strong>{fixed(result.ciLow, 3)} to {fixed(result.ciHigh, 3)}</strong></div>
                <div><span>{result.dLabel}</span><strong>{fixed(result.d, 2)} ({dBand(result.d)})</strong></div>
                {result.groups.map((g, i) => (
                  <div key={g.label}><span>{labels[i]}: n, M, SD</span><strong>{g.n}, {fixed(g.mean, 2)}, {fixed(g.sd, 2)}</strong></div>
                ))}
              </div>
              <div className={styles.interpretation}>{sentence(result)}</div>
              {result.levene && result.student ? (
                <div className={styles.methodNote}>
                  <p>EQUAL VARIANCES CHECK</p>
                  <span>
                    Levene&apos;s test (median): F(1, {result.groups[0].n + result.groups[1].n - 2}) = {fixed(result.levene.f, 2)}, p ={" "}
                    {formatP(result.levene.p)}. Student&apos;s t-test (equal variances): t({result.student.df}) = {fixed(result.student.t, 2)}, p ={" "}
                    {formatP(result.student.p)}. Welch&apos;s version is safe either way.
                  </span>
                </div>
              ) : (
                <div className={styles.methodNote}>
                  <p>ASSUMPTION</p>
                  <span>
                    {result.kind === "paired"
                      ? "The differences should be roughly normal. If not, use the Wilcoxon signed-rank test."
                      : "Values should be roughly normal. With small skewed samples, use the one-sample Wilcoxon test."}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>t</span>
                <p>Choose the t-test type, check the sample data, then run it.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
