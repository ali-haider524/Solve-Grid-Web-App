"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, logisticRegression, parseDataTable, pText, type LogisticResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Passed Hours Attendance
0 1 3
0 2 1
0 2 4
0 3 2
1 3 5
0 4 3
0 4 1
1 5 4
0 5 2
1 6 5
0 6 3
1 7 1
1 7 4
0 8 2
1 8 5
1 9 3
1 9 1
1 10 4
0 10 2
1 11 5`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function LogisticRegressionCalculator() {
  const [text, setText] = useState(sample);
  const [outcome, setOutcome] = useState(0);
  const [predictors, setPredictors] = useState<number[]>([1, 2]);
  const [result, setResult] = useState<LogisticResult | null>(null);
  const [error, setError] = useState("");

  const names = useMemo(() => {
    try {
      return parseDataTable(text).names;
    } catch {
      return [] as string[];
    }
  }, [text]);

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
      if (data.names.length < 2) throw new Error("Paste at least two columns: the 0/1 outcome and one predictor.");
      const out = outcome < data.names.length ? outcome : 0;
      const preds = predictors.filter((i) => i !== out && i < data.names.length);
      setResult(logisticRegression(data.names, data.rows, out, preds.length ? preds : data.names.map((_, i) => i).filter((i) => i !== out)));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  function sentence(r: LogisticResult) {
    const preds = r.coefficients.slice(1);
    const model = `A binary logistic regression was performed to predict ${r.outcome} from ${preds.map((c) => c.name).join(preds.length > 2 ? ", " : " and ")}. The model ${
      r.modelP < 0.05 ? "was statistically significant" : "was not statistically significant"
    }, χ²(${r.modelDf}, N = ${r.n}) = ${fixed(r.modelChi, 2)}, ${pText(r.modelP)}, Nagelkerke R² = ${noZero(r.nagelkerke)}, and correctly classified ${fixed(r.accuracy * 100, 1)}% of cases.`;
    const each = preds
      .map((c) => `${c.name} ${c.p < 0.05 ? "was a significant predictor" : "was not a significant predictor"} (B = ${fixed(c.b, 2)}, Wald = ${fixed(c.wald, 2)}, ${pText(c.p)}, OR = ${fixed(c.oddsRatio, 2)}, 95% CI [${fixed(c.orLow, 2)}, ${fixed(c.orHigh, 2)}])`)
      .join("; ");
    return `${model} ${each}.`;
  }

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>LOGISTIC REGRESSION CALCULATOR</p>
        <h1>Binary logistic regression calculator with odds ratios.</h1>
        <span>
          Paste a 0/1 outcome and one or more predictors. Get B, SE, Wald χ², p values, odds ratios with 95% CIs, the model
          chi-square test, Cox &amp; Snell and Nagelkerke R², classification accuracy and an APA-style sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per participant</h2>
            </div>
            <span className={styles.status}>MAX. LIKELIHOOD</span>
          </div>
          <p className={styles.sectionNote}>The outcome must be coded 0 and 1. Predictors can be numeric scores or 0/1 dummy variables.</p>
          <label className={styles.expressionLabel}>
            <span>DATA TABLE</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          {names.length >= 2 ? (
            <>
              <div className={styles.fieldGrid}>
                <label>
                  <span>OUTCOME (0/1)</span>
                  <select value={outcome < names.length ? outcome : 0} onChange={(e) => chooseOutcome(Number(e.target.value))}>
                    {names.map((name, i) => (
                      <option key={name} value={i}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className={styles.sectionNote}>Predictors:</p>
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
            Run logistic regression <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>χ²({result.modelDf}) = {fixed(result.modelChi, 2)}, {pText(result.modelP)}, Nagelkerke R² = {noZero(result.nagelkerke)}</h2>
              <div className={styles.resultRows}>
                <div><span>N (events)</span><strong>{result.n} ({result.events})</strong></div>
                <div><span>−2 log likelihood</span><strong>{fixed(result.minus2LL, 3)}</strong></div>
                <div><span>Cox &amp; Snell R²</span><strong>{fixed(result.coxSnell, 3)}</strong></div>
                <div><span>Nagelkerke R²</span><strong>{fixed(result.nagelkerke, 3)}</strong></div>
                <div><span>McFadden R²</span><strong>{fixed(result.mcFadden, 3)}</strong></div>
                <div><span>Correctly classified (cut-off .5)</span><strong>{fixed(result.accuracy * 100, 1)}%</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Variable</th><th>B</th><th>SE</th><th>Wald</th><th>p</th><th>OR</th><th>95% CI (OR)</th></tr></thead>
                  <tbody>
                    {result.coefficients.map((c) => (
                      <tr key={c.name}><td style={{ textAlign: "left" }}>{c.name}</td><td>{fixed(c.b, 3)}</td><td>{fixed(c.se, 3)}</td><td>{fixed(c.wald, 2)}</td><td>{formatP(c.p)}</td><td>{fixed(c.oddsRatio, 3)}</td><td>[{fixed(c.orLow, 2)}, {fixed(c.orHigh, 2)}]</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>{sentence(result)}</div>
              <div className={styles.methodNote}>
                <p>SAMPLE SIZE NOTE</p>
                <span>A common rule of thumb is at least 10 events (the less frequent outcome) per predictor. With fewer, coefficients and p values can be unstable.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to analyse</h2>
              <div className={styles.empty}>
                <span>0|1</span>
                <p>Use the sample data or paste your own, choose the outcome, then run the model.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
