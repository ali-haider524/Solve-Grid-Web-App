"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, powerAt, requiredSampleSize, type PowerDesign, type PowerInput, type PowerResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const designs: Record<PowerDesign, { tab: string; test: string; symbol: string; presets: [number, number, number]; effectName: string }> = {
  "independent-t": { tab: "Independent t-test", test: "independent-samples t-test", symbol: "d", presets: [0.2, 0.5, 0.8], effectName: "Cohen's d" },
  "paired-t": { tab: "Paired / one-sample t", test: "paired-samples t-test", symbol: "dz", presets: [0.2, 0.5, 0.8], effectName: "Cohen's dz" },
  anova: { tab: "One-way ANOVA", test: "one-way ANOVA", symbol: "f", presets: [0.1, 0.25, 0.4], effectName: "Cohen's f" },
  correlation: { tab: "Correlation", test: "Pearson correlation", symbol: "r", presets: [0.1, 0.3, 0.5], effectName: "correlation r" },
  "chi-square": { tab: "Chi-square", test: "chi-square test", symbol: "w", presets: [0.1, 0.3, 0.5], effectName: "Cohen's w" },
};

const sizeWords = ["small", "medium", "large"];

function PowerCurve({ input, target, n }: { input: PowerInput; target: number; n: number }) {
  const W = 320;
  const H = 180;
  const maxN = Math.max(8, Math.ceil(n * 2));
  const minN = input.design === "anova" ? (input.groups ?? 3) + 1 : input.design === "correlation" ? 4 : 2;
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= 40; i += 1) {
    const x = Math.round(minN + ((maxN - minN) * i) / 40);
    points.push([x, powerAt(input, x)]);
  }
  const px = (x: number) => 28 + ((x - minN) / (maxN - minN || 1)) * (W - 44);
  const py = (p: number) => H - 20 - p * (H - 34);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Power curve: statistical power by sample size">
      <line x1={28} y1={H - 20} x2={W - 16} y2={H - 20} stroke="#cfd8e8" />
      <line x1={28} y1={14} x2={28} y2={H - 20} stroke="#cfd8e8" />
      <line x1={28} y1={py(target)} x2={W - 16} y2={py(target)} stroke="#9fb0cc" strokeDasharray="4 3" />
      <line x1={px(n)} y1={14} x2={px(n)} y2={H - 20} stroke="#9fb0cc" strokeDasharray="4 3" />
      <polyline fill="none" stroke="#3157e8" strokeWidth="2.2" points={points.map(([x, p]) => `${px(x)},${py(p)}`).join(" ")} />
      <text x={4} y={py(target) + 3} fontSize="9" fill="#6a7b94">{fixed(target, 2)}</text>
      <text x={px(n) + 3} y={H - 6} fontSize="9" fill="#6a7b94">n = {n}</text>
    </svg>
  );
}

export default function PowerAnalysisCalculator() {
  const [design, setDesign] = useState<PowerDesign>("independent-t");
  const [effect, setEffect] = useState("0.5");
  const [alpha, setAlpha] = useState("0.05");
  const [power, setPower] = useState("0.8");
  const [tails, setTails] = useState<1 | 2>(2);
  const [groups, setGroups] = useState("3");
  const [df, setDf] = useState("1");
  const [checkN, setCheckN] = useState("");
  const [result, setResult] = useState<{ r: PowerResult; input: PowerInput; target: number } | null>(null);
  const [error, setError] = useState("");

  const info = designs[design];
  const hasTails = design === "independent-t" || design === "paired-t" || design === "correlation";

  function changeDesign(next: PowerDesign) {
    setDesign(next);
    setEffect(String(designs[next].presets[1]));
    setResult(null);
  }

  function calculate() {
    try {
      setError("");
      const k = Number(groups);
      const d = Number(df);
      if (design === "anova" && !(Number.isInteger(k) && k >= 2)) throw new Error("Enter the number of groups (2 or more).");
      if (design === "chi-square" && !(Number.isInteger(d) && d >= 1)) throw new Error("Enter the chi-square degrees of freedom (1 or more).");
      const input: PowerInput = { design, effect: Number(effect), alpha: Number(alpha), tails: hasTails ? tails : 2, groups: k, df: d };
      const target = Number(power);
      setResult({ r: requiredSampleSize(input, target), input, target });
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  function sentence(r: PowerResult, input: PowerInput, target: number) {
    const es = Math.abs(input.effect);
    const idx = info.presets.findIndex((p) => Math.abs(p - es) < 1e-9);
    const word = idx >= 0 ? `a ${sizeWords[idx]} effect` : "an effect";
    const tailText = hasTails ? `, ${input.tails === 2 ? "two" : "one"}-tailed` : "";
    const sampleText =
      design === "independent-t"
        ? `N = ${r.total} (${r.perGroup} per group)`
        : design === "anova"
          ? `N = ${r.total} (${r.perGroup} per group across ${input.groups} groups)`
          : design === "paired-t"
            ? `N = ${r.total} participants (pairs)`
            : `N = ${r.total}`;
    return `An a priori power analysis for ${/^[aeiou]/i.test(info.test) ? "an" : "a"} ${info.test}${design === "chi-square" ? ` (df = ${input.df})` : ""} indicated that a sample of ${sampleText} is required to detect ${word} (${info.symbol} = ${fixed(es, 2)}) with ${fixed(target * 100, 0)}% power at α = ${String(input.alpha).replace(/^0/, "")}${tailText}.`;
  }

  const checkValue = Number(checkN);
  const checkPower = result && Number.isFinite(checkValue) && checkValue > 0 ? powerAt(result.input, Math.floor(checkValue)) : null;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>POWER ANALYSIS CALCULATOR</p>
        <h1>Power analysis calculator: sample size for t-tests, ANOVA, correlation, and chi-square.</h1>
        <span>
          Find the minimum sample size for your study from the effect size, alpha, and desired power, the same a priori analysis
          G*Power runs, with a power curve and a sentence for your methodology chapter.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>A PRIORI POWER ANALYSIS</p>
              <h2>{info.tab}</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <div className={styles.tabRow}>
            {(Object.keys(designs) as PowerDesign[]).map((d) => (
              <button className={design === d ? styles.activeTab : undefined} key={d} onClick={() => changeDesign(d)} type="button">
                {designs[d].tab}
              </button>
            ))}
          </div>
          <div className={styles.fieldGrid}>
            <label>
              <span>EFFECT SIZE ({info.effectName.toUpperCase()})</span>
              <input inputMode="decimal" value={effect} onChange={(event) => setEffect(event.target.value)} />
            </label>
            <label>
              <span>ALPHA (α)</span>
              <select value={alpha} onChange={(event) => setAlpha(event.target.value)}>
                <option value="0.1">.10</option>
                <option value="0.05">.05</option>
                <option value="0.01">.01</option>
                <option value="0.001">.001</option>
              </select>
            </label>
            <label>
              <span>POWER (1 − β)</span>
              <select value={power} onChange={(event) => setPower(event.target.value)}>
                <option value="0.7">.70</option>
                <option value="0.8">.80</option>
                <option value="0.85">.85</option>
                <option value="0.9">.90</option>
                <option value="0.95">.95</option>
              </select>
            </label>
            {hasTails ? (
              <label>
                <span>TAILS</span>
                <select value={tails} onChange={(event) => setTails(Number(event.target.value) as 1 | 2)}>
                  <option value={2}>Two-tailed</option>
                  <option value={1}>One-tailed</option>
                </select>
              </label>
            ) : design === "anova" ? (
              <label>
                <span>NUMBER OF GROUPS (k)</span>
                <input inputMode="numeric" value={groups} onChange={(event) => setGroups(event.target.value)} />
              </label>
            ) : (
              <label>
                <span>DEGREES OF FREEDOM</span>
                <input inputMode="numeric" value={df} onChange={(event) => setDf(event.target.value)} />
              </label>
            )}
          </div>
          <p className={styles.sectionNote}>Cohen&apos;s (1988) benchmarks for {info.effectName}:</p>
          <div className={styles.chipRow}>
            {info.presets.map((p, i) => (
              <button key={p} onClick={() => setEffect(String(p))} type="button">
                {sizeWords[i]} = {p}
              </button>
            ))}
          </div>
          {design === "chi-square" ? (
            <p className={styles.sectionNote}>df = (rows − 1) × (columns − 1) for a test of independence, or categories − 1 for goodness of fit.</p>
          ) : null}
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate sample size <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <figure className={styles.chartFrame} style={{ margin: 0 }}>
              <PowerCurve input={result.input} n={result.r.n} target={result.target} />
              <figcaption>Power curve: power rises with sample size ({design === "independent-t" ? "per group" : design === "paired-t" ? "pairs" : "total N"}).</figcaption>
            </figure>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>Required sample: N = {result.r.total}</h2>
              <div className={styles.resultRows}>
                <div><span>Total sample size</span><strong>{result.r.total}</strong></div>
                {result.r.perGroup !== null ? <div><span>Per group</span><strong>{result.r.perGroup}</strong></div> : null}
                <div><span>Actual power at this N</span><strong>{fixed(result.r.achievedPower, 4)}</strong></div>
                <div><span>Effect size ({info.symbol})</span><strong>{fixed(Math.abs(result.input.effect), 3)}</strong></div>
                <div><span>α {hasTails ? `(${result.input.tails === 2 ? "two" : "one"}-tailed)` : ""}</span><strong>{result.input.alpha}</strong></div>
                <div><span>Target power</span><strong>{fixed(result.target, 2)}</strong></div>
              </div>
              <div className={styles.interpretation}>{sentence(result.r, result.input, result.target)}</div>
              <div className={styles.fieldGrid}>
                <label>
                  <span>CHECK POWER FOR {design === "independent-t" ? "n PER GROUP" : design === "paired-t" ? "n PAIRS" : "TOTAL N"}</span>
                  <input inputMode="numeric" placeholder="e.g. 40" value={checkN} onChange={(event) => setCheckN(event.target.value)} />
                </label>
                <label>
                  <span>POWER AT THAT N</span>
                  <input readOnly value={checkPower === null ? "" : fixed(checkPower, 3)} />
                </label>
              </div>
              <div className={styles.methodNote}>
                <p>PLAN FOR DROPOUT</p>
                <span>
                  Increase the sample for expected non-response: with a 20% dropout rate, recruit {Math.ceil(result.r.total / 0.8)} participants
                  ({result.r.total} ÷ 0.80). Base the effect size on previous studies or a pilot when possible, not only on Cohen&apos;s benchmarks.
                  {design === "correlation" ? " Correlation uses the Fisher z approximation, which can be 1 higher than G*Power's exact method." : ""}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>1−β</span>
                <p>Choose your test, set the expected effect size, then calculate the sample size you need.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
