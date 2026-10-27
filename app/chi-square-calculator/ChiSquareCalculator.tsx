"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  chiSquareGoodness,
  chiSquareIndependence,
  fixed,
  formatP,
  parseMatrix,
  type ChiSquareResult,
  type GoodnessResult,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

type Mode = "independence" | "goodness";

const sampleTable = `Online, In-person, Hybrid
20, 30, 15
30, 20, 25`;

export default function ChiSquareCalculator() {
  const [mode, setMode] = useState<Mode>("independence");
  const [table, setTable] = useState(sampleTable);
  const [observed, setObserved] = useState("30, 20, 50");
  const [proportions, setProportions] = useState("");
  const [indep, setIndep] = useState<ChiSquareResult | null>(null);
  const [good, setGood] = useState<GoodnessResult | null>(null);
  const [error, setError] = useState("");

  const nums = (text: string) =>
    text
      .split(/[\s,;\t]+/)
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number);

  function calculate() {
    try {
      setError("");
      if (mode === "independence") {
        setGood(null);
        setIndep(chiSquareIndependence(parseMatrix(table)));
      } else {
        setIndep(null);
        const props = nums(proportions);
        setGood(chiSquareGoodness(nums(observed), props.length ? props : undefined));
      }
    } catch (caught) {
      setIndep(null);
      setGood(null);
      setError(caught instanceof Error ? caught.message : "Check the counts.");
    }
  }

  const significant = (p: number) => (p < 0.05 ? "a significant" : "no significant");

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>CHI-SQUARE CALCULATOR</p>
        <h1>Chi-square test calculator with expected counts and effect size.</h1>
        <span>
          Test whether two categorical variables are related, or whether counts match expected proportions.
          You get χ², degrees of freedom, the p value, Cramér&apos;s V, an expected-count check, and Fisher&apos;s
          exact test for small 2 × 2 tables.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>COUNTS</p>
              <h2>{mode === "independence" ? "Test of independence" : "Goodness of fit"}</h2>
            </div>
            <span className={styles.status}>BROWSER-ONLY</span>
          </div>
          <div className={styles.tabRow}>
            <button className={mode === "independence" ? styles.activeTab : undefined} onClick={() => setMode("independence")} type="button">
              Independence (table)
            </button>
            <button className={mode === "goodness" ? styles.activeTab : undefined} onClick={() => setMode("goodness")} type="button">
              Goodness of fit
            </button>
          </div>
          {mode === "independence" ? (
            <>
              <p className={styles.sectionNote}>
                One row per group, one column per category. A header row of column names is optional.
                Paste straight from Excel or SPSS crosstabs.
              </p>
              <label className={styles.expressionLabel}>
                <span>CONTINGENCY TABLE (COUNTS)</span>
                <textarea value={table} onChange={(event) => setTable(event.target.value)} spellCheck={false} />
              </label>
            </>
          ) : (
            <>
              <p className={styles.sectionNote}>
                Enter the observed count for each category. Leave expected proportions blank to test against equal
                proportions.
              </p>
              <div className={styles.fieldGrid}>
                <label>
                  <span>OBSERVED COUNTS</span>
                  <input value={observed} onChange={(event) => setObserved(event.target.value)} />
                </label>
                <label>
                  <span>EXPECTED PROPORTIONS (OPTIONAL)</span>
                  <input value={proportions} onChange={(event) => setProportions(event.target.value)} placeholder="e.g. 25, 25, 50" />
                </label>
              </div>
            </>
          )}
          <button className={styles.runButton} onClick={calculate} type="button">
            Run chi-square test <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {indep ? (
            <>
              <h2>χ²({indep.df}) = {fixed(indep.statistic, 2)}, p = {formatP(indep.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>Chi-square (χ²)</span><strong>{fixed(indep.statistic, 3)}</strong></div>
                <div><span>Degrees of freedom</span><strong>{indep.df}</strong></div>
                <div><span>p value</span><strong>{formatP(indep.p)}</strong></div>
                <div><span>Cramér&apos;s V</span><strong>{fixed(indep.cramersV, 3)}</strong></div>
                <div><span>Total N</span><strong>{indep.n}</strong></div>
                {indep.fisherP !== null ? (
                  <div><span>Fisher&apos;s exact p (2 × 2)</span><strong>{formatP(indep.fisherP)}</strong></div>
                ) : null}
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr><th style={{ textAlign: "left" }}>EXPECTED COUNTS</th>{indep.expected[0].map((_, j) => <th key={j}>COL {j + 1}</th>)}</tr>
                  </thead>
                  <tbody>
                    {indep.expected.map((row, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: "left" }}>Row {i + 1}</td>
                        {row.map((value, j) => <td key={j}>{fixed(value, 2)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                A chi-square test of independence showed {significant(indep.p)} association, χ²({indep.df}, N = {indep.n}) ={" "}
                {fixed(indep.statistic, 2)}, p = {formatP(indep.p)}, Cramér&apos;s V = {fixed(indep.cramersV, 2).replace(/^0/, "")}.
              </div>
              <div className={styles.methodNote}>
                <p>EXPECTED-COUNT CHECK</p>
                <span>
                  {indep.minExpected < 5
                    ? `${Math.round(indep.lowExpectedShare * 100)}% of cells have an expected count below 5 (smallest ${fixed(indep.minExpected, 2)}). ${
                        indep.fisherP !== null
                          ? "Report Fisher's exact test instead."
                          : indep.lowExpectedShare > 0.2
                            ? "More than 20% of cells are below 5: combine categories or collect more data."
                            : "Under 20% of cells, so the chi-square result is usually acceptable."
                      }`
                    : "All expected counts are 5 or more, so the chi-square approximation is reliable."}
                </span>
              </div>
            </>
          ) : good ? (
            <>
              <h2>χ²({good.df}) = {fixed(good.statistic, 2)}, p = {formatP(good.p)}</h2>
              <div className={styles.resultRows}>
                <div><span>Chi-square (χ²)</span><strong>{fixed(good.statistic, 3)}</strong></div>
                <div><span>Degrees of freedom</span><strong>{good.df}</strong></div>
                <div><span>p value</span><strong>{formatP(good.p)}</strong></div>
                <div><span>Expected counts</span><strong>{good.expected.map((v) => fixed(v, 1)).join(", ")}</strong></div>
              </div>
              <div className={styles.interpretation}>
                A chi-square goodness-of-fit test showed {significant(good.p)} difference from the expected distribution,
                χ²({good.df}, N = {good.n}) = {fixed(good.statistic, 2)}, p = {formatP(good.p)}.
              </div>
              {good.minExpected < 5 ? (
                <div className={styles.methodNote}><p>CHECK</p><span>At least one expected count is below 5, so treat the p value with caution.</span></div>
              ) : null}
            </>
          ) : (
            <>
              <h2>Ready to test</h2>
              <div className={styles.empty}>
                <span>χ²</span>
                <p>Use the sample table or paste your own counts, then run the test.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
