"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  defaultLikertLabels,
  fixed,
  likertAnalysis,
  likertRanges,
  parseLikertRows,
  type LikertResult,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const samples: Record<number, string> = {
  4: "The lessons are easy to follow, 3, 8, 40, 49\nI receive feedback on time, 10, 22, 45, 23\nThe workload is manageable, 15, 30, 38, 17",
  5: "The lessons are easy to follow, 2, 5, 12, 41, 40\nI receive feedback on time, 6, 14, 25, 35, 20\nThe workload is manageable, 10, 18, 30, 27, 15",
  7: "The lessons are easy to follow, 1, 2, 4, 8, 20, 35, 30\nI receive feedback on time, 3, 6, 10, 15, 25, 26, 15\nThe workload is manageable, 6, 9, 14, 21, 20, 18, 12",
};

export default function LikertScaleCalculator() {
  const [points, setPoints] = useState(5);
  const [labels, setLabels] = useState<string[]>(defaultLikertLabels[5]);
  const [rows, setRows] = useState(samples[5]);
  const [result, setResult] = useState<LikertResult | null>(null);
  const [error, setError] = useState("");

  function changePoints(next: number) {
    setPoints(next);
    setLabels(defaultLikertLabels[next]);
    setRows(samples[next]);
    setResult(null);
  }

  function calculate() {
    try {
      setError("");
      setResult(likertAnalysis(parseLikertRows(rows, points), points, labels));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the response counts.");
    }
  }

  const ranges = likertRanges(points, labels);

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>LIKERT SCALE CALCULATOR</p>
        <h1>Likert scale weighted mean calculator with verbal interpretation.</h1>
        <span>
          Enter how many respondents chose each option for every statement. Get the weighted mean, standard
          deviation, rank, and interpretation table for your results chapter.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>RESPONSE COUNTS</p>
              <h2>{points}-point scale</h2>
            </div>
            <span className={styles.status}>WEIGHTED MEAN</span>
          </div>
          <div className={styles.tabRow}>
            {[4, 5, 7].map((option) => (
              <button className={points === option ? styles.activeTab : undefined} key={option} onClick={() => changePoints(option)} type="button">
                {option}-point
              </button>
            ))}
          </div>
          <p className={styles.sectionNote}>
            One statement per line: the statement, then the count for each option from {labels[0]} (1) to{" "}
            {labels[points - 1]} ({points}).
          </p>
          <label className={styles.expressionLabel}>
            <span>STATEMENT, COUNT 1, …, COUNT {points}</span>
            <textarea value={rows} onChange={(event) => setRows(event.target.value)} spellCheck={false} />
          </label>
          <div className={styles.fieldGrid}>
            {labels.map((label, index) => (
              <label key={index}>
                <span>LABEL FOR {index + 1}</span>
                <input
                  value={label}
                  onChange={(event) =>
                    setLabels((current) => current.map((value, i) => (i === index ? event.target.value : value)))
                  }
                />
              </label>
            ))}
          </div>
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate weighted means <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULTS</p>
          <h2>
            {result
              ? `Overall mean ${fixed(result.overallMean, 2)} — ${result.overallInterpretation}`
              : "Ready to calculate"}
          </h2>
          {result ? (
            <>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr><th style={{ textAlign: "left" }}>STATEMENT</th><th>MEAN</th><th>SD</th><th>INTERPRETATION</th><th>RANK</th></tr>
                  </thead>
                  <tbody>
                    {result.items.map((item) => (
                      <tr key={item.statement}>
                        <td style={{ textAlign: "left" }}>{item.statement}</td>
                        <td>{fixed(item.weightedMean, 2)}</td>
                        <td>{fixed(item.sd, 2)}</td>
                        <td>{item.interpretation}</td>
                        <td>{item.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                Across {result.items.length} statements the grand weighted mean was {fixed(result.overallMean, 2)},
                interpreted as “{result.overallInterpretation}”.
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <span>x̄w</span>
              <p>Use the sample rows or paste your own counts, then calculate.</p>
            </div>
          )}
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr><th style={{ textAlign: "left" }}>SCALE</th><th>MEAN RANGE</th><th>INTERPRETATION</th></tr>
              </thead>
              <tbody>
                {ranges.map((range) => (
                  <tr key={range.level}>
                    <td style={{ textAlign: "left" }}>{range.level}</td>
                    <td>{range.low.toFixed(2)} – {range.high.toFixed(2)}</td>
                    <td>{range.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </section>
    </main>
  );
}
