"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, linearRegression, parseDataTable, type RegressionResult, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Score Hours Sleep
61 2 7
49 3 5
70 5 6
62 4 8
60 6 5
73 8 7
84 7 8
74 9 6
88 10 7
55 1 6
66 5 8
64 6 5
66 7 6
80 6 8
57 3 7`;

const pApa = (p: number) => (p < 0.001 ? "p < .001" : `${pText(p)}`);
const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

function ResidualPlot({ fitted, residuals }: { fitted: number[]; residuals: number[] }) {
  const W = 320;
  const H = 190;
  const xMin = Math.min(...fitted);
  const xMax = Math.max(...fitted);
  const rMax = Math.max(...residuals.map(Math.abs)) || 1;
  const px = (v: number) => 24 + ((v - xMin) / (xMax - xMin || 1)) * (W - 40);
  const py = (v: number) => H / 2 - (v / rMax) * (H / 2 - 14);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Residuals plotted against fitted values">
      <line x1={24} y1={H / 2} x2={W - 16} y2={H / 2} stroke="#9fb0cc" strokeDasharray="4 3" />
      {fitted.map((f, i) => (
        <circle key={i} cx={px(f)} cy={py(residuals[i])} r="3.2" fill="#3157e8">
          <title>{`fitted ${fixed(f, 2)}, residual ${fixed(residuals[i], 2)}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function RegressionCalculator() {
  const [text, setText] = useState(sample);
  const [outcome, setOutcome] = useState(0);
  const [predictors, setPredictors] = useState<number[]>([1, 2]);
  const [result, setResult] = useState<RegressionResult | null>(null);
  const [error, setError] = useState("");

  const parsed = useMemo(() => {
    try {
      return parseDataTable(text);
    } catch {
      return null;
    }
  }, [text]);
  const names = parsed?.names ?? [];

  function updateText(value: string) {
    setText(value);
    setResult(null);
    try {
      const next = parseDataTable(value);
      if (next.names.length !== names.length) {
        setOutcome(0);
        setPredictors(next.names.map((_, i) => i).filter((i) => i !== 0));
      }
    } catch {
      // keep the current selection until the data parse
    }
  }

  function chooseOutcome(index: number) {
    setOutcome(index);
    setPredictors(names.map((_, i) => i).filter((i) => i !== index));
    setResult(null);
  }

  function togglePredictor(index: number) {
    setPredictors((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index].sort((a, b) => a - b)));
    setResult(null);
  }

  function calculate() {
    try {
      setError("");
      const data = parseDataTable(text);
      if (data.names.length < 2) throw new Error("Paste at least two columns: the outcome (Y) and one predictor (X).");
      const out = outcome < data.names.length ? outcome : 0;
      const preds = predictors.filter((i) => i !== out && i < data.names.length);
      setResult(linearRegression(data.names, data.rows, out, preds.length ? preds : data.names.map((_, i) => i).filter((i) => i !== out)));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  function sentence(r: RegressionResult) {
    const preds = r.coefficients.slice(1);
    const kind = r.k > 1 ? "A multiple linear regression" : "A simple linear regression";
    const model = `${kind} was run to predict ${r.outcome} from ${preds.map((c) => c.name).join(preds.length > 2 ? ", " : " and ")}. The model ${
      r.p < 0.05 ? "was statistically significant" : "was not statistically significant"
    }, F(${r.dfModel}, ${r.dfResidual}) = ${fixed(r.f, 2)}, ${pApa(r.p)}, R² = ${noZero(r.rSquared)}, adjusted R² = ${noZero(r.adjRSquared)}.`;
    const each = preds
      .map(
        (c) =>
          `${c.name} ${c.p < 0.05 ? "was a significant predictor" : "was not a significant predictor"} (B = ${fixed(c.b, 2)}, β = ${noZero(c.beta ?? 0)}, t = ${fixed(c.t, 2)}, ${pApa(c.p)})`,
      )
      .join("; ");
    return `${model} ${each}.`;
  }

  const maxVif = result ? Math.max(0, ...result.coefficients.map((c) => c.vif ?? 0)) : 0;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>LINEAR REGRESSION CALCULATOR</p>
        <h1>Linear regression calculator: simple and multiple regression.</h1>
        <span>
          Paste your data with column names, pick the outcome and predictors, and get R², adjusted R², the F test, a full
          coefficients table with B, SE, β, t, p, and 95% CIs, VIF, residual diagnostics, and an APA-style sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per participant</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <p className={styles.sectionNote}>
            Paste columns from Excel, SPSS, or Google Sheets with a header row of variable names. Values can be separated by tabs,
            spaces, or commas.
          </p>
          <label className={styles.expressionLabel}>
            <span>DATA TABLE</span>
            <textarea value={text} onChange={(event) => updateText(event.target.value)} spellCheck={false} />
          </label>
          {names.length >= 2 ? (
            <>
              <div className={styles.fieldGrid}>
                <label>
                  <span>OUTCOME (Y)</span>
                  <select value={outcome < names.length ? outcome : 0} onChange={(event) => chooseOutcome(Number(event.target.value))}>
                    {names.map((name, i) => (
                      <option key={name} value={i}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className={styles.sectionNote}>Predictors (X):</p>
              <div className={styles.chipRow}>
                {names.map((name, i) =>
                  i === outcome ? null : (
                    <button
                      aria-pressed={predictors.includes(i)}
                      key={name}
                      onClick={() => togglePredictor(i)}
                      style={predictors.includes(i) ? { background: "#eaf1ff", borderColor: "#aac1fb" } : { color: "#8091aa" }}
                      type="button"
                    >
                      {predictors.includes(i) ? "✓ " : "+ "}
                      {name}
                    </button>
                  ),
                )}
              </div>
            </>
          ) : null}
          <button className={styles.runButton} onClick={calculate} type="button">
            Run regression <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <figure className={styles.chartFrame} style={{ margin: 0 }}>
              <ResidualPlot fitted={result.fitted} residuals={result.residuals} />
              <figcaption>Residuals vs fitted values: a random cloud around zero supports linearity and equal variance.</figcaption>
            </figure>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>R² = {fixed(result.rSquared, 3)}, F({result.dfModel}, {result.dfResidual}) = {fixed(result.f, 2)}, {pApa(result.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>R</span><strong>{fixed(result.r, 3)}</strong></div>
                <div><span>R²</span><strong>{fixed(result.rSquared, 3)}</strong></div>
                <div><span>Adjusted R²</span><strong>{fixed(result.adjRSquared, 3)}</strong></div>
                <div><span>Std. error of the estimate</span><strong>{fixed(result.see, 3)}</strong></div>
                <div><span>F (model)</span><strong>{fixed(result.f, 3)}, {pText(result.p)}</strong></div>
                <div><span>N</span><strong>{result.n}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr><th style={{ textAlign: "left" }}>COEFFICIENT</th><th>B</th><th>SE</th><th>β</th><th>t</th><th>p</th><th>95% CI</th>{result.k > 1 ? <th>VIF</th> : null}</tr>
                  </thead>
                  <tbody>
                    {result.coefficients.map((c) => (
                      <tr key={c.name}>
                        <td style={{ textAlign: "left" }}>{c.name}</td>
                        <td>{fixed(c.b, 3)}</td>
                        <td>{fixed(c.se, 3)}</td>
                        <td>{c.beta === null ? "" : fixed(c.beta, 3)}</td>
                        <td>{fixed(c.t, 2)}</td>
                        <td>{formatP(c.p)}</td>
                        <td>[{fixed(c.ciLow, 2)}, {fixed(c.ciHigh, 2)}]</td>
                        {result.k > 1 ? <td>{c.vif === null ? "" : fixed(c.vif, 2)}</td> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>ANOVA</th><th>SS</th><th>df</th><th>MS</th><th>F</th></tr></thead>
                  <tbody>
                    <tr><td style={{ textAlign: "left" }}>Regression</td><td>{fixed(result.ssRegression, 2)}</td><td>{result.dfModel}</td><td>{fixed(result.ssRegression / result.dfModel, 2)}</td><td>{fixed(result.f, 2)}</td></tr>
                    <tr><td style={{ textAlign: "left" }}>Residual</td><td>{fixed(result.ssResidual, 2)}</td><td>{result.dfResidual}</td><td>{fixed(result.ssResidual / result.dfResidual, 2)}</td><td></td></tr>
                    <tr><td style={{ textAlign: "left" }}>Total</td><td>{fixed(result.ssTotal, 2)}</td><td>{result.n - 1}</td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                {sentence(result)} Regression equation: {result.outcome} = {fixed(result.coefficients[0].b, 2)}
                {result.coefficients.slice(1).map((c) => ` ${c.b >= 0 ? "+" : "−"} ${fixed(Math.abs(c.b), 2)} × ${c.name}`).join("")}.
              </div>
              <div className={styles.methodNote}>
                <p>ASSUMPTION CHECKS</p>
                <span>
                  Durbin-Watson = {fixed(result.durbinWatson, 2)} ({result.durbinWatson >= 1.5 && result.durbinWatson <= 2.5 ? "no strong autocorrelation" : "check independence of residuals"}).{" "}
                  {result.k > 1 ? `Highest VIF = ${fixed(maxVif, 2)} (${maxVif < 5 ? "multicollinearity is not a concern" : maxVif < 10 ? "moderate multicollinearity" : "serious multicollinearity: consider removing a predictor"}). ` : ""}
                  Largest Cook&apos;s distance = {fixed(result.maxCooksD, 2)} ({result.maxCooksD < 1 ? "no highly influential cases" : "at least one influential case: inspect it"}).
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to run</h2>
              <div className={styles.empty}>
                <span>R²</span>
                <p>Use the sample data or paste your own columns, choose the outcome, then run the regression.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
