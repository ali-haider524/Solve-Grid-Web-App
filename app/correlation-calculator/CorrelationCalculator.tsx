"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  correlation,
  correlationBand,
  type CorrelationResult,
  fixed,
  formatP,
  parsePairs,
  pText,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

type Method = "pearson" | "spearman" | "kendall";

const sample = `2 55
3 60
5 62
4 58
6 70
8 75
7 72
9 80
10 78
1 50
5 66
6 64`;

const symbol: Record<Method, string> = { pearson: "r", spearman: "rₛ", kendall: "τ" };
const methodName: Record<Method, string> = {
  pearson: "Pearson correlation",
  spearman: "Spearman's rank-order correlation",
  kendall: "Kendall's tau-b correlation",
};
const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

function Scatter({ x, y, slope, intercept }: { x: number[]; y: number[]; slope: number; intercept: number }) {
  const W = 320;
  const H = 200;
  const xMin = Math.min(...x);
  const xMax = Math.max(...x);
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);
  const px = (v: number) => 24 + ((v - xMin) / (xMax - xMin || 1)) * (W - 40);
  const py = (v: number) => H - 16 - ((v - yMin) / (yMax - yMin || 1)) * (H - 32);
  const clampY = (v: number) => Math.max(yMin, Math.min(yMax, v));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Scatter plot of X and Y with the least-squares line">
      <line x1={24} y1={H - 16} x2={W - 16} y2={H - 16} stroke="#cfd8e8" />
      <line x1={24} y1={16} x2={24} y2={H - 16} stroke="#cfd8e8" />
      <line
        x1={px(xMin)}
        y1={py(clampY(intercept + slope * xMin))}
        x2={px(xMax)}
        y2={py(clampY(intercept + slope * xMax))}
        stroke="#9fb0cc"
        strokeDasharray="4 3"
      />
      {x.map((v, i) => (
        <circle key={i} cx={px(v)} cy={py(y[i])} r="3.2" fill="#3157e8">
          <title>{`(${v}, ${y[i]})`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function CorrelationCalculator() {
  const [nameX, setNameX] = useState("Study hours");
  const [nameY, setNameY] = useState("Exam score");
  const [text, setText] = useState(sample);
  const [method, setMethod] = useState<Method>("pearson");
  const [result, setResult] = useState<CorrelationResult | null>(null);
  const [data, setData] = useState<{ x: number[]; y: number[] } | null>(null);
  const [error, setError] = useState("");

  function calculate(m: Method = method) {
    try {
      setError("");
      const pairs = parsePairs(text);
      setData(pairs);
      setResult(correlation(pairs.x, pairs.y, m));
    } catch (caught) {
      setResult(null);
      setData(null);
      setError(caught instanceof Error ? caught.message : "Check the values.");
    }
  }

  function sentence(r: CorrelationResult) {
    const dir = r.r >= 0 ? "positive" : "negative";
    const sig = r.p < 0.05 ? "statistically significant" : "non-significant";
    const p = r.p < 0.001 ? "p < .001" : `${pText(r.p)}`;
    const stat = r.method === "kendall" ? `τb = ${noZero(r.r)}` : `${symbol[r.method]}(${r.df}) = ${noZero(r.r)}`;
    const ci = Number.isFinite(r.ciLow) ? `, 95% CI [${noZero(r.ciLow)}, ${noZero(r.ciHigh)}]` : "";
    return `A ${methodName[r.method]} showed a ${sig}, ${correlationBand(r.r)} ${dir} relationship between ${nameX.toLowerCase() || "X"} and ${
      nameY.toLowerCase() || "Y"
    }, ${stat}, ${p}${ci}, N = ${r.n}.`;
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>CORRELATION COEFFICIENT CALCULATOR</p>
        <h1>Correlation calculator: Pearson, Spearman, and Kendall.</h1>
        <span>
          Paste paired X and Y values to get the correlation coefficient, p value, 95% confidence interval, r², the regression
          line, a scatter plot, and an APA-style sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One X Y pair per line</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <div className={styles.tabRow}>
            {(["pearson", "spearman", "kendall"] as Method[]).map((m) => (
              <button
                className={method === m ? styles.activeTab : undefined}
                key={m}
                onClick={() => {
                  setMethod(m);
                  if (result) calculate(m);
                }}
                type="button"
              >
                {m === "pearson" ? "Pearson r" : m === "spearman" ? "Spearman rho" : "Kendall tau"}
              </button>
            ))}
          </div>
          <div className={styles.fieldGrid}>
            <label><span>X VARIABLE NAME</span><input value={nameX} onChange={(event) => setNameX(event.target.value)} /></label>
            <label><span>Y VARIABLE NAME</span><input value={nameY} onChange={(event) => setNameY(event.target.value)} /></label>
          </div>
          <p className={styles.sectionNote}>
            Paste two columns from Excel, SPSS, or Google Sheets: X then Y on each line, separated by a space, comma, or tab. A header
            row is skipped automatically.
          </p>
          <label className={styles.expressionLabel}>
            <span>X Y PAIRS</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={() => calculate()} type="button">
            Calculate correlation <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result && data ? (
            <figure className={styles.chartFrame} style={{ margin: 0 }}>
              <Scatter x={data.x} y={data.y} slope={result.slope} intercept={result.intercept} />
              <figcaption>
                Scatter plot with the least-squares line: {nameY || "Y"} = {fixed(result.intercept, 2)} {result.slope >= 0 ? "+" : "−"}{" "}
                {fixed(Math.abs(result.slope), 3)} × {nameX || "X"}
              </figcaption>
            </figure>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>
                {symbol[result.method]} = {fixed(result.r, 3)}, {pText(result.p)}
              </h2>
              <div className={styles.resultRows}>
                <div><span>{methodName[result.method]}</span><strong>{fixed(result.r, 3)} ({correlationBand(result.r)})</strong></div>
                <div><span>p value (two-tailed)</span><strong>{formatP(result.p)}</strong></div>
                <div><span>{result.statLabel} statistic</span><strong>{fixed(result.stat, 3)}</strong></div>
                {result.method !== "kendall" ? <div><span>Degrees of freedom</span><strong>{result.df}</strong></div> : null}
                <div><span>95% confidence interval</span><strong>{Number.isFinite(result.ciLow) ? `${fixed(result.ciLow, 3)} to ${fixed(result.ciHigh, 3)}` : "needs n > 3"}</strong></div>
                <div><span>{result.method === "pearson" ? "r² (variance shared)" : "Coefficient squared"}</span><strong>{fixed(result.rSquared, 3)}</strong></div>
                <div><span>N (pairs)</span><strong>{result.n}</strong></div>
                <div><span>{nameX || "X"}: M, SD</span><strong>{fixed(result.meanX, 2)}, {fixed(result.sdX, 2)}</strong></div>
                <div><span>{nameY || "Y"}: M, SD</span><strong>{fixed(result.meanY, 2)}, {fixed(result.sdY, 2)}</strong></div>
              </div>
              <div className={styles.interpretation}>{sentence(result)}</div>
              <div className={styles.methodNote}>
                <p>{result.method === "pearson" ? "ASSUMPTIONS" : "NOTE"}</p>
                <span>
                  {result.method === "pearson"
                    ? "Pearson's r assumes a straight-line relationship, no extreme outliers, and roughly normal variables. If the scatter plot curves or the data are ordinal (such as Likert items), switch to Spearman."
                    : result.method === "spearman"
                      ? "Spearman's rho correlates the ranks, so it works for ordinal data and any monotonic relationship. p uses the t approximation; the CI uses the Bonett-Wright (2000) standard error."
                      : "Kendall's tau-b handles ties and is preferred for small samples with many tied ranks. p uses the normal approximation with a tie correction."}{" "}
                  Correlation does not show causation.
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>r</span>
                <p>Use the sample data or paste your own X and Y columns, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
