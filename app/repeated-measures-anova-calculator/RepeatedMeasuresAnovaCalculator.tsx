"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { fixed, formatP, parseDataTable, pText, repeatedMeasuresAnova, type RmAnovaResult } from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

const sample = `Pretest Posttest FollowUp
5 6 8
4 5 7
6 6 9
3 5 6
5 7 8
4 4 7
6 7 9
5 6 6
3 4 7
4 6 8`;

const noZero = (v: number, d = 2) => fixed(v, d).replace(/^(-?)0\./, "$1.");

export default function RepeatedMeasuresAnovaCalculator() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<RmAnovaResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      const data = parseDataTable(text);
      setResult(repeatedMeasuresAnova(data.names, data.rows));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the data.");
    }
  }

  const sphericityOk = (r: RmAnovaResult) => !Number.isFinite(r.mauchlyP) || r.mauchlyP >= 0.05;
  const reported = (r: RmAnovaResult) => {
    if (sphericityOk(r)) return `F(${r.dfConditions}, ${r.dfError}) = ${fixed(r.f, 2)}, ${pText(r.p)}`;
    const e = r.ggEpsilon;
    return `F(${fixed(r.dfConditions * e, 2)}, ${fixed(r.dfError * e, 2)}) = ${fixed(r.f, 2)}, ${pText(r.pGG)}`;
  };

  return (
    <section className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>REPEATED MEASURES ANOVA CALCULATOR</p>
        <h1>Repeated measures ANOVA calculator with sphericity checks.</h1>
        <span>
          Compare three or more measurements on the same participants. Get the F test, Mauchly&apos;s test of sphericity,
          Greenhouse-Geisser and Huynh-Feldt corrections, partial eta squared, Bonferroni post hoc tests and APA text.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>DATA (WIDE FORMAT)</p>
              <h2>One row per participant, one column per condition</h2>
            </div>
            <span className={styles.status}>WITHIN-SUBJECTS</span>
          </div>
          <p className={styles.sectionNote}>Add a header row with the condition names. Participants with missing values should be removed first.</p>
          <label className={styles.expressionLabel}>
            <span>DATA</span>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} spellCheck={false} />
          </label>
          <button className={styles.runButton} onClick={calculate} type="button">
            Run repeated measures ANOVA <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? (
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th style={{ textAlign: "left" }}>Condition</th><th>Mean</th><th>SD</th></tr></thead>
                <tbody>
                  {result.names.map((name, i) => (
                    <tr key={name}><td style={{ textAlign: "left" }}>{name}</td><td>{fixed(result.means[i], 2)}</td><td>{fixed(result.sds[i], 2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {result ? (
            <>
              <h2>{reported(result)}, partial η² = {noZero(result.partialEta)}</h2>
              <div className={styles.resultRows}>
                <div><span>F (sphericity assumed)</span><strong>F({result.dfConditions}, {result.dfError}) = {fixed(result.f, 3)}, {pText(result.p)}</strong></div>
                <div><span>Mauchly&apos;s W</span><strong>{Number.isFinite(result.mauchlyW) ? `${fixed(result.mauchlyW, 3)}, χ²(${result.mauchlyDf}) = ${fixed(result.mauchlyChi, 2)}, ${pText(result.mauchlyP)}` : "needs more participants"}</strong></div>
                <div><span>Greenhouse-Geisser ε</span><strong>{fixed(result.ggEpsilon, 3)}, {pText(result.pGG)}</strong></div>
                <div><span>Huynh-Feldt ε</span><strong>{fixed(result.hfEpsilon, 3)}, {pText(result.pHF)}</strong></div>
                <div><span>Partial η²</span><strong>{fixed(result.partialEta, 3)}</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Pair</th><th>Mean diff.</th><th>t</th><th>p (Bonferroni)</th></tr></thead>
                  <tbody>
                    {result.pairwise.map((c) => (
                      <tr key={`${c.a}-${c.b}`}><td style={{ textAlign: "left" }}>{c.a} − {c.b}</td><td>{fixed(c.meanDiff, 2)}</td><td>{fixed(c.t, 2)}</td><td>{formatP(c.pAdj)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.interpretation}>
                {sphericityOk(result)
                  ? `Mauchly's test indicated that the assumption of sphericity was met${Number.isFinite(result.mauchlyP) ? `, χ²(${result.mauchlyDf}) = ${fixed(result.mauchlyChi, 2)}, ${pText(result.mauchlyP)}` : ""}.`
                  : `Mauchly's test indicated that sphericity was violated, χ²(${result.mauchlyDf}) = ${fixed(result.mauchlyChi, 2)}, ${pText(result.mauchlyP)}, so Greenhouse-Geisser corrected degrees of freedom are reported (ε = ${noZero(result.ggEpsilon)}).`}{" "}
                A one-way repeated measures ANOVA showed {(sphericityOk(result) ? result.p : result.pGG) < 0.05 ? "a statistically significant" : "no statistically significant"} difference across the {result.k} conditions, {reported(result)}, partial η² = {noZero(result.partialEta)}.
              </div>
            </>
          ) : (
            <>
              <h2>Ready to analyse</h2>
              <div className={styles.empty}>
                <span>RM</span>
                <p>Use the sample data or paste your own wide-format table, then run the ANOVA.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
