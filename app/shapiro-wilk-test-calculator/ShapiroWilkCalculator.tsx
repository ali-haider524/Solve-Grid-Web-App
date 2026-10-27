"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, normalQuantile, parseNumbers, shapiroWilk, type ShapiroResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = "148, 154, 158, 160, 161, 162, 166, 170, 182, 195, 236";

function Histogram({ values }: { values: number[] }) {
  const n = values.length;
  const bins = Math.max(4, Math.min(12, Math.ceil(Math.log2(n) + 1)));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  values.forEach((v) => {
    counts[Math.min(bins - 1, Math.floor((v - min) / width))] += 1;
  });
  const top = Math.max(...counts);
  const W = 320;
  const H = 150;
  const bw = (W - 20) / bins;
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label="Histogram of the entered values">
      {counts.map((c, i) => {
        const h = (c / top) * H;
        return <rect key={i} x={10 + i * bw + 1} y={H - h + 4} width={bw - 2} height={h} rx="2" fill="#3157e8" opacity="0.75"><title>{`${fixed(min + i * width, 2)}–${fixed(min + (i + 1) * width, 2)}: ${c}`}</title></rect>;
      })}
      <line x1="10" x2={W - 10} y1={H + 4} y2={H + 4} stroke="#9fb0cc" />
      <text x="10" y={H + 20} fontSize="10" fill="#63758f">{fixed(min, 2)}</text>
      <text x={W - 10} y={H + 20} fontSize="10" fill="#63758f" textAnchor="end">{fixed(max, 2)}</text>
    </svg>
  );
}

function QQPlot({ values }: { values: number[] }) {
  const x = [...values].sort((a, b) => a - b);
  const n = x.length;
  const theo = x.map((_, i) => normalQuantile((i + 1 - 0.375) / (n + 0.25)));
  const mean = x.reduce((s, v) => s + v, 0) / n;
  const sd = Math.sqrt(x.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1));
  const W = 320;
  const H = 180;
  const tMin = theo[0];
  const tMax = theo[n - 1];
  const yMin = Math.min(x[0], mean + sd * tMin);
  const yMax = Math.max(x[n - 1], mean + sd * tMax);
  const px = (t: number) => 20 + ((t - tMin) / (tMax - tMin || 1)) * (W - 40);
  const py = (v: number) => H - 10 - ((v - yMin) / (yMax - yMin || 1)) * (H - 20);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Normal Q-Q plot of the entered values">
      <line x1={px(tMin)} y1={py(mean + sd * tMin)} x2={px(tMax)} y2={py(mean + sd * tMax)} stroke="#9fb0cc" strokeDasharray="4 3" />
      {x.map((v, i) => (
        <circle key={i} cx={px(theo[i])} cy={py(v)} r="3" fill="#3157e8"><title>{`value ${v}, expected z ${fixed(theo[i], 2)}`}</title></circle>
      ))}
    </svg>
  );
}

export default function ShapiroWilkCalculator() {
  const [data, setData] = useState(sample);
  const [result, setResult] = useState<ShapiroResult | null>(null);
  const [values, setValues] = useState<number[]>([]);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const parsed = parseNumbers(data, "Your data");
      setResult(shapiroWilk(parsed));
      setValues(parsed);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the values.");
    }
  }

  const normal = result ? result.p >= 0.05 : false;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>SHAPIRO-WILK TEST CALCULATOR</p>
        <h1>Shapiro-Wilk normality test calculator with Q-Q plot.</h1>
        <span>
          Check whether your data are normally distributed before choosing a t-test or ANOVA. You get W, the p value,
          skewness, kurtosis, a histogram, a Q-Q plot, and an APA sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One variable, 3 to 5,000 values</h2>
            </div>
            <span className={styles.status}>ROYSTON 1995</span>
          </div>
          <label className={styles.expressionLabel}>
            <span>VALUES</span>
            <textarea value={data} onChange={(event) => setData(event.target.value)} spellCheck={false} />
          </label>
          <p className={styles.sectionNote}>
            Separate values with commas, spaces, or new lines. Test each group separately if you plan to compare groups.
          </p>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run Shapiro-Wilk test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <div className={styles.fieldGrid}>
              <figure className={styles.chartFrame} style={{ margin: 0 }}>
                <Histogram values={values} />
                <figcaption>Histogram</figcaption>
              </figure>
              <figure className={styles.chartFrame} style={{ margin: 0 }}>
                <QQPlot values={values} />
                <figcaption>Normal Q-Q plot: points near the dashed line suggest normality.</figcaption>
              </figure>
            </div>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>W = {fixed(result.w, 3)}, p = {formatP(result.p)}: {normal ? "no evidence against normality" : "not normal"}</h2>
              <div className={styles.resultRows}>
                <div><span>W statistic</span><strong>{fixed(result.w, 4)}</strong></div>
                <div><span>p value</span><strong>{formatP(result.p)}</strong></div>
                <div><span>n</span><strong>{result.n}</strong></div>
                <div><span>Mean (SD)</span><strong>{fixed(result.mean, 2)} ({fixed(result.sd, 2)})</strong></div>
                <div><span>Skewness</span><strong>{fixed(result.skewness, 3)}</strong></div>
                <div><span>Excess kurtosis</span><strong>{fixed(result.kurtosis, 3)}</strong></div>
              </div>
              <div className={styles.interpretation}>
                A Shapiro-Wilk test indicated that the data {normal ? "did not significantly deviate from" : "significantly deviated from"} a
                normal distribution, W({result.n}) = {fixed(result.w, 2).replace(/^0/, "")}, p = {formatP(result.p)}.
                {normal
                  ? " Parametric tests such as the t-test or ANOVA are reasonable."
                  : " Consider a non-parametric test such as Mann-Whitney U, Wilcoxon, or Kruskal-Wallis, or a transformation."}
              </div>
              <div className={styles.methodNote}>
                <p>READ WITH THE PLOTS</p>
                <span>
                  {result.n > 50
                    ? "With more than 50 values the test flags even tiny departures. Judge mainly by the Q-Q plot and skewness (|skew| < 1 is usually fine)."
                    : result.n < 15
                      ? "With fewer than 15 values the test has little power, so a non-significant result does not prove normality."
                      : "Check that the Q-Q plot points follow the line, especially at the ends."}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>W</span>
                <p>Use the sample values or paste your own, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
