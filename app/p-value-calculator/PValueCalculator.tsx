"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, pValueFromStatistic, type PValueResult, type StatisticKind, type TailKind } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const kinds: Array<{ value: StatisticKind; label: string; df1?: string; df2?: string }> = [
  { value: "t", label: "t statistic", df1: "DEGREES OF FREEDOM (df)" },
  { value: "z", label: "z score" },
  { value: "f", label: "F statistic", df1: "NUMERATOR df (between)", df2: "DENOMINATOR df (within / error)" },
  { value: "chi", label: "Chi-square (χ²)", df1: "DEGREES OF FREEDOM (df)" },
  { value: "r", label: "Correlation r", df1: "SAMPLE SIZE (n)" },
];

const symbol: Record<StatisticKind, string> = { t: "t", z: "z", f: "F", chi: "χ²", r: "r" };

export default function PValueCalculator() {
  const [kind, setKind] = useState<StatisticKind>("t");
  const [stat, setStat] = useState("2.50");
  const [df1, setDf1] = useState("20");
  const [df2, setDf2] = useState("27");
  const [tail, setTail] = useState<TailKind>("two");
  const [alpha, setAlpha] = useState("0.05");
  const [result, setResult] = useState<PValueResult | null>(null);
  const [error, setError] = useState("");
  const info = kinds.find((k) => k.value === kind) ?? kinds[0];
  const oneSidedOnly = kind === "f" || kind === "chi";

  function calculate() {
    try {
      setError("");
      setResult(pValueFromStatistic(kind, Number(stat), oneSidedOnly ? "right" : tail, info.df1 ? Number(df1) : undefined, info.df2 ? Number(df2) : undefined));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  const a = Number(alpha);
  const dfText = (r: PValueResult) =>
    r.kind === "f" ? `(${r.df1}, ${r.df2})` : r.kind === "chi" || r.kind === "t" ? `(${r.df1})` : r.kind === "r" ? `(${(r.df1 ?? 0) - 2})` : "";
  const tailText = (r: PValueResult) => (r.kind === "f" || r.kind === "chi" ? "right-tailed" : r.tail === "two" ? "two-tailed" : `${r.tail}-tailed`);

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>P VALUE CALCULATOR</p>
        <h1>P value calculator from a t, z, F, chi-square or r statistic.</h1>
        <span>
          Enter a test statistic and its degrees of freedom to get the exact p value, one- or two-tailed, with a significance
          decision at your alpha level and APA-style formatting.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>TEST STATISTIC</p>
              <h2>What did your test produce?</h2>
            </div>
            <span className={styles.status}>EXACT</span>
          </div>
          <div className={styles.fieldGrid}>
            <label>
              <span>STATISTIC TYPE</span>
              <select value={kind} onChange={(event) => { setKind(event.target.value as StatisticKind); setResult(null); }}>
                {kinds.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{symbol[kind]} VALUE</span>
              <input inputMode="decimal" value={stat} onChange={(event) => setStat(event.target.value)} />
            </label>
            {info.df1 ? (
              <label>
                <span>{info.df1}</span>
                <input inputMode="decimal" value={df1} onChange={(event) => setDf1(event.target.value)} />
              </label>
            ) : null}
            {info.df2 ? (
              <label>
                <span>{info.df2}</span>
                <input inputMode="decimal" value={df2} onChange={(event) => setDf2(event.target.value)} />
              </label>
            ) : null}
            {!oneSidedOnly ? (
              <label>
                <span>TAILS</span>
                <select value={tail} onChange={(event) => setTail(event.target.value as TailKind)}>
                  <option value="two">Two-tailed</option>
                  <option value="right">One-tailed (right / greater)</option>
                  <option value="left">One-tailed (left / less)</option>
                </select>
              </label>
            ) : null}
            <label>
              <span>SIGNIFICANCE LEVEL (α)</span>
              <select value={alpha} onChange={(event) => setAlpha(event.target.value)}>
                <option value="0.05">.05</option>
                <option value="0.01">.01</option>
                <option value="0.1">.10</option>
                <option value="0.001">.001</option>
              </select>
            </label>
          </div>
          {oneSidedOnly ? <p className={styles.sectionNote}>F and χ² tests use the right tail only, because larger values mean stronger evidence.</p> : null}
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate p value <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>p = {result.p < 0.0001 ? result.p.toExponential(3) : fixed(result.p, 4)}</h2>
              <div className={styles.resultRows}>
                <div><span>Statistic</span><strong>{symbol[result.kind]}{dfText(result)} = {fixed(result.statistic, 3)}</strong></div>
                {result.tFromR !== undefined ? <div><span>Equivalent t</span><strong>{fixed(result.tFromR, 3)}</strong></div> : null}
                <div><span>Tail</span><strong>{tailText(result)}</strong></div>
                <div><span>APA format</span><strong>p {result.p < 0.001 ? "< .001" : `= ${formatP(result.p)}`}</strong></div>
                <div><span>Decision at α = {alpha.replace(/^0/, "")}</span><strong>{result.p < a ? "Reject H₀ (significant)" : "Do not reject H₀"}</strong></div>
              </div>
              <div className={styles.interpretation}>
                The {tailText(result)} p value for {symbol[result.kind]}{dfText(result)} = {fixed(result.statistic, 2)} is {result.p < 0.001 ? "below .001" : formatP(result.p)}.
                {result.p < a
                  ? ` This is below α = ${alpha.replace(/^0/, "")}, so the result is statistically significant.`
                  : ` This is not below α = ${alpha.replace(/^0/, "")}, so the result is not statistically significant.`}
              </div>
              <div className={styles.methodNote}>
                <p>WHAT A P VALUE MEANS</p>
                <span>The p value is the probability of a result at least this extreme if the null hypothesis were true. It is not the probability that the null hypothesis is true, and it says nothing about effect size.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>p</span>
                <p>Pick the statistic, enter its value and degrees of freedom, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
