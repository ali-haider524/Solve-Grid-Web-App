"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { type EfaResult, exploratoryFactorAnalysis, fixed, kmoBand, parseDataTable, pText } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Q1 Q2 Q3 Q4 Q5 Q6
2 2 3 2 2 3
3 2 4 4 3 4
4 3 3 2 3 4
2 3 4 2 3 2
3 3 4 5 4 4
4 3 4 2 2 3
3 2 3 4 4 5
4 4 3 1 3 2
2 4 3 1 2 2
3 2 2 2 2 2
3 3 3 3 3 4
2 2 2 4 3 2
4 4 1 3 3 4
1 1 2 4 4 2
2 4 1 2 3 3
3 2 1 3 3 4
3 2 2 4 2 1
2 2 3 2 3 3
2 2 4 3 3 2
4 3 3 1 2 2
5 4 5 5 3 4
1 1 2 2 2 4
2 1 2 3 4 3
3 3 3 2 2 2
3 2 2 3 3 2
3 4 3 2 2 2
4 4 4 3 3 2
3 3 3 3 3 2
3 5 4 4 2 5
5 5 5 4 3 3
3 5 4 4 4 2
3 2 2 3 2 4
4 3 3 3 3 2
2 4 2 4 3 2
3 4 4 3 3 4
3 2 2 2 3 3
2 3 1 1 4 3
4 4 5 2 2 1
2 1 2 1 2 2
4 3 4 4 3 4
3 3 3 1 2 2
2 3 2 1 2 2
1 1 2 3 3 3
2 2 2 3 2 2
3 3 3 1 1 3
3 4 4 4 4 3
3 2 3 2 2 3
1 1 1 3 4 3
3 3 3 4 2 3
4 2 3 2 3 2`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function FactorAnalysisCalculator() {
  const [text, setText] = useState(sample);
  const [factors, setFactors] = useState("kaiser");
  const [rotation, setRotation] = useState<"varimax" | "none">("varimax");
  const [cutoff, setCutoff] = useState("0.40");
  const [result, setResult] = useState<EfaResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const data = parseDataTable(text);
      setResult(exploratoryFactorAnalysis(data.names, data.rows, factors === "kaiser" ? "kaiser" : Number(factors), rotation));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  const cut = Number(cutoff);
  const maxBar = result ? Math.max(...result.eigenvalues) : 1;

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>FACTOR ANALYSIS CALCULATOR</p>
        <h1>Exploratory factor analysis (EFA) calculator with varimax rotation.</h1>
        <span>
          Find the factors behind your questionnaire items. Get KMO and Bartlett&apos;s test, eigenvalues with a scree plot,
          principal axis factor loadings with varimax rotation, communalities, variance explained and a write-up.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA</p>
              <h2>One row per respondent, one column per item</h2>
            </div>
            <span className={styles.status}>PRINCIPAL AXIS</span>
          </div>
          <p className={styles.sectionNote}>Include a header row with item names. Remove respondents with missing answers first. Aim for at least 5–10 respondents per item.</p>
          <label className={styles.expressionLabel}>
            <span>ITEM SCORES</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <div className={styles.fieldGrid}>
            <label>
              <span>NUMBER OF FACTORS</span>
              <select value={factors} onChange={(e) => setFactors(e.target.value)}>
                <option value="kaiser">Automatic (eigenvalue &gt; 1)</option>
                {[1, 2, 3, 4, 5, 6].map((k) => <option key={k} value={String(k)}>{k}</option>)}
              </select>
            </label>
            <label>
              <span>ROTATION</span>
              <select value={rotation} onChange={(e) => setRotation(e.target.value as "varimax" | "none")}>
                <option value="varimax">Varimax (orthogonal)</option>
                <option value="none">None (unrotated)</option>
              </select>
            </label>
            <label>
              <span>HIDE LOADINGS BELOW</span>
              <select value={cutoff} onChange={(e) => setCutoff(e.target.value)}>
                <option value="0">Show all</option>
                <option value="0.30">.30</option>
                <option value="0.40">.40</option>
                <option value="0.50">.50</option>
              </select>
            </label>
          </div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run factor analysis <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <figure className={styles.chartFrame} style={{ margin: "16px 0 0" }}>
              <svg viewBox="0 0 320 170" role="img" aria-label="Scree plot of eigenvalues">
                <line x1="30" y1={150 - (1 / maxBar) * 130} x2="310" y2={150 - (1 / maxBar) * 130} stroke="#e3a3ae" strokeDasharray="4 3" />
                <polyline fill="none" stroke="#3157e8" strokeWidth="2" points={result.eigenvalues.map((v, i) => `${30 + (i * 280) / Math.max(1, result.eigenvalues.length - 1)},${150 - (v / maxBar) * 130}`).join(" ")} />
                {result.eigenvalues.map((v, i) => (
                  <circle key={i} cx={30 + (i * 280) / Math.max(1, result.eigenvalues.length - 1)} cy={150 - (v / maxBar) * 130} r="3.5" fill="#3157e8"><title>{`Factor ${i + 1}: ${fixed(v, 2)}`}</title></circle>
                ))}
                <line x1="30" y1="150" x2="310" y2="150" stroke="#9fb0cc" />
              </svg>
              <figcaption>Scree plot: eigenvalues by factor number. The dashed line marks an eigenvalue of 1.</figcaption>
            </figure>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>{result.nFactors} factor{result.nFactors > 1 ? "s" : ""}, {fixed(result.propVariance.reduce((s, v) => s + v, 0) * 100, 1)}% of variance explained</h2>
              <div className={styles.resultRows}>
                <div><span>KMO</span><strong>{fixed(result.kmo, 3)} ({kmoBand(result.kmo)})</strong></div>
                <div><span>Bartlett&apos;s test</span><strong>χ²({result.bartlettDf}) = {fixed(result.bartlettChi, 2)}, {pText(result.bartlettP)}</strong></div>
                <div><span>Rotation</span><strong>{result.rotation === "varimax" ? "Varimax" : "None"}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Item</th>{result.ssLoadings.map((_, f) => <th key={f}>F{f + 1}</th>)}<th>h²</th><th>KMO</th></tr></thead>
                  <tbody>
                    {result.names.map((name, i) => (
                      <tr key={name}>
                        <td style={{ textAlign: "left" }}>{name}</td>
                        {result.loadings[i].map((v, f) => (
                          <td key={f} style={Math.abs(v) >= Math.max(cut, 0.3) ? { fontWeight: 850, color: "#1d4ddd" } : undefined}>{Math.abs(v) < cut ? "" : noZero(v)}</td>
                        ))}
                        <td>{noZero(result.communalities[i])}</td>
                        <td>{noZero(result.kmoItems[i])}</td>
                      </tr>
                    ))}
                    <tr><td style={{ textAlign: "left" }}>% variance</td>{result.propVariance.map((v, f) => <td key={f}>{fixed(v * 100, 1)}</td>)}<td /><td /></tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                An exploratory factor analysis using principal axis factoring{result.rotation === "varimax" ? " with varimax rotation" : ""} was run on {result.names.length} items (N = {result.n}). The KMO measure was {noZero(result.kmo)} and Bartlett&apos;s test of sphericity was {result.bartlettP < 0.05 ? "significant" : "not significant"}, χ²({result.bartlettDf}) = {fixed(result.bartlettChi, 2)}, {pText(result.bartlettP)}. {result.nFactors} factor{result.nFactors > 1 ? "s were" : " was"} retained, explaining {fixed(result.propVariance.reduce((s, v) => s + v, 0) * 100, 1)}% of the variance.
              </div>
              <div className={styles.methodNote}>
                <p>{result.kmo < 0.6 ? "LOW KMO" : result.heywood ? "HEYWOOD CASE" : "READING THE TABLE"}</p>
                <span>
                  {result.kmo < 0.6
                    ? "KMO is below .60, so the items may not share enough common variance for factor analysis. Consider a larger sample or removing items with low item KMO."
                    : result.heywood
                      ? "An item's communality reached 1, which usually means too many factors or too few respondents. Try fewer factors."
                      : "Each item should load strongly (|λ| ≥ .40) on one factor and weakly on the others. Items that cross-load or load on nothing are candidates for removal."}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to analyse</h2>
              <div className={styles.empty}>
                <span>EFA</span>
                <p>Use the sample questionnaire data or paste your own, then run the analysis.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
