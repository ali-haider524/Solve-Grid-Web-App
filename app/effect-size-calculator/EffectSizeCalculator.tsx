"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  dBand,
  effectFromF,
  effectFromMeans,
  effectFromR,
  effectFromT,
  effectFromZ,
  etaBand,
  fixed,
  rBand,
  type ResultRow,
} from "../../lib/research-statistics";
import styles from "../../components/ResearchLab.module.css";

type Mode = "means" | "t" | "f" | "z" | "r";

const modes: Array<{ id: Mode; label: string; note: string }> = [
  { id: "means", label: "Means & SDs", note: "Two independent groups: Cohen's d, Hedges' g, and Glass's Δ with a 95% CI." },
  { id: "t", label: "From t-test", note: "Convert an independent or paired t statistic into d (or dz) and r." },
  { id: "f", label: "From ANOVA F", note: "Partial eta squared and Cohen's f from F and its degrees of freedom." },
  { id: "z", label: "From z (non-parametric)", note: "Effect size r for Mann-Whitney U or Wilcoxon tests: r = z ÷ √N." },
  { id: "r", label: "Convert r → d", note: "Convert a correlation coefficient into Cohen's d and r²." },
];

type Output = { headline: string; rows: ResultRow[]; sentence: string };

export default function EffectSizeCalculator() {
  const [mode, setMode] = useState<Mode>("means");
  const [v, setV] = useState<Record<string, string>>({
    m1: "82.3", sd1: "7.4", n1: "30", m2: "76.1", sd2: "8.9", n2: "30",
    t: "2.94", tn1: "30", tn2: "30", paired: "no",
    f: "6.42", df1: "2", df2: "57",
    z: "-2.58", zn: "12",
    r: "0.30",
  });
  const [out, setOut] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const num = (key: string) => Number(v[key]);
  const field = (key: string, label: string) => (
    <label key={key}>
      <span>{label}</span>
      <input inputMode="decimal" value={v[key]} onChange={(event) => setV((c) => ({ ...c, [key]: event.target.value }))} />
    </label>
  );
  const strip = (s: string) => s.replace(/^(-?)0\./, "$1.");

  function calculate() {
    try {
      setError("");
      if (mode === "means") {
        const e = effectFromMeans(num("m1"), num("sd1"), num("n1"), num("m2"), num("sd2"), num("n2"));
        setOut({
          headline: `d = ${fixed(e.d, 2)} (${dBand(e.d)})`,
          rows: [
            { label: "Cohen's d", value: fixed(e.d, 3) },
            { label: "95% CI for d", value: `${fixed(e.ciLow, 2)} to ${fixed(e.ciHigh, 2)}` },
            { label: "Hedges' g (small-sample corrected)", value: fixed(e.g, 3) },
            { label: "Glass's Δ (control SD)", value: fixed(e.glassDelta, 3) },
            { label: "Pooled SD", value: fixed(e.pooledSd, 3) },
            { label: "Equivalent r", value: fixed(e.r, 3) },
          ],
          sentence: `The difference between groups was ${dBand(e.d)}, d = ${fixed(e.d, 2)}, 95% CI [${fixed(e.ciLow, 2)}, ${fixed(e.ciHigh, 2)}].`,
        });
      } else if (mode === "t") {
        const paired = v.paired === "yes";
        const e = paired ? effectFromT(num("t"), num("tn1")) : effectFromT(num("t"), num("tn1"), num("tn2"));
        const name = paired ? "dz" : "d";
        setOut({
          headline: `${name} = ${fixed(e.d, 2)} (${dBand(e.d)})`,
          rows: [
            { label: paired ? "Cohen's dz (paired)" : "Cohen's d", value: fixed(e.d, 3) },
            { label: "Effect size r", value: fixed(e.r, 3) },
          ],
          sentence: `The effect was ${dBand(e.d)}, ${name} = ${fixed(e.d, 2)}.`,
        });
      } else if (mode === "f") {
        const e = effectFromF(num("f"), num("df1"), num("df2"));
        setOut({
          headline: `partial η² = ${strip(fixed(e.etaSquared, 2))} (${etaBand(e.etaSquared)})`,
          rows: [
            { label: "Partial eta squared (η²p)", value: fixed(e.etaSquared, 3) },
            { label: "Cohen's f", value: fixed(e.cohensF, 3) },
            { label: "Variance explained", value: `${fixed(e.etaSquared * 100, 1)}%` },
          ],
          sentence: `The effect was ${etaBand(e.etaSquared)}, F(${v.df1}, ${v.df2}) = ${fixed(num("f"), 2)}, partial η² = ${strip(fixed(e.etaSquared, 2))}.`,
        });
      } else if (mode === "z") {
        const e = effectFromZ(num("z"), num("zn"));
        setOut({
          headline: `r = ${strip(fixed(Math.abs(e.r), 2))} (${rBand(e.r)})`,
          rows: [
            { label: "Effect size r = |z| ÷ √N", value: fixed(Math.abs(e.r), 3) },
            { label: "r²", value: fixed(e.r * e.r, 3) },
          ],
          sentence: `The effect was ${rBand(e.r)}, r = ${strip(fixed(Math.abs(e.r), 2))}.`,
        });
      } else {
        const e = effectFromR(num("r"));
        setOut({
          headline: `d = ${fixed(e.d, 2)} (${dBand(e.d)})`,
          rows: [
            { label: "Cohen's d", value: fixed(e.d, 3) },
            { label: "r² (variance shared)", value: fixed(e.rSquared, 3) },
            { label: "Size of r", value: rBand(num("r")) },
          ],
          sentence: `r = ${strip(fixed(num("r"), 2))} corresponds to d = ${fixed(e.d, 2)}, a ${dBand(e.d)} effect.`,
        });
      }
    } catch (caught) {
      setOut(null);
      setError(caught instanceof Error ? caught.message : "Check the inputs.");
    }
  }

  const active = modes.find((m) => m.id === mode) ?? modes[0];

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="statistics" />
      <section className={styles.hero}>
        <p>EFFECT SIZE CALCULATOR</p>
        <h1>Effect size calculator: Cohen&apos;s d, Hedges&apos; g, eta squared, and r.</h1>
        <span>
          Calculate the effect size your results chapter needs, from means and SDs or straight from a t, F, or z value,
          with confidence intervals, benchmarks, and an APA-style sentence.
        </span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>INPUT</p>
              <h2>{active.label}</h2>
            </div>
            <span className={styles.status}>5 METHODS</span>
          </div>
          <div className={styles.tabRow}>
            {modes.map((m) => (
              <button className={mode === m.id ? styles.activeTab : undefined} key={m.id} onClick={() => { setMode(m.id); setOut(null); }} type="button">
                {m.label}
              </button>
            ))}
          </div>
          <p className={styles.sectionNote}>{active.note}</p>
          {mode === "means" ? (
            <>
              <div className={styles.fieldGrid}>{[field("m1", "GROUP 1 MEAN"), field("m2", "GROUP 2 MEAN")]}</div>
              <div className={styles.fieldGrid}>{[field("sd1", "GROUP 1 SD"), field("sd2", "GROUP 2 SD (CONTROL)")]}</div>
              <div className={styles.fieldGrid}>{[field("n1", "GROUP 1 n"), field("n2", "GROUP 2 n")]}</div>
            </>
          ) : null}
          {mode === "t" ? (
            <>
              <div className={styles.tabRow}>
                <button className={v.paired === "no" ? styles.activeTab : undefined} onClick={() => setV((c) => ({ ...c, paired: "no" }))} type="button">Independent groups</button>
                <button className={v.paired === "yes" ? styles.activeTab : undefined} onClick={() => setV((c) => ({ ...c, paired: "yes" }))} type="button">Paired / one-sample</button>
              </div>
              <div className={styles.fieldGrid}>
                {[field("t", "t VALUE"), field("tn1", v.paired === "yes" ? "n (PAIRS)" : "GROUP 1 n")]}
                {v.paired === "no" ? field("tn2", "GROUP 2 n") : null}
              </div>
            </>
          ) : null}
          {mode === "f" ? <div className={styles.fieldGrid}>{[field("f", "F VALUE"), field("df1", "df BETWEEN (EFFECT)"), field("df2", "df WITHIN (ERROR)")]}</div> : null}
          {mode === "z" ? <div className={styles.fieldGrid}>{[field("z", "z VALUE"), field("zn", "TOTAL N")]}</div> : null}
          {mode === "r" ? <div className={styles.fieldGrid}>{[field("r", "CORRELATION r")]}</div> : null}
          <button className={styles.runButton} onClick={calculate} type="button">
            Calculate effect size <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          {out ? (
            <>
              <h2>{out.headline}</h2>
              <div className={styles.resultRows}>
                {out.rows.map((row) => (
                  <div key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>
                ))}
              </div>
              <div className={styles.interpretation}>{out.sentence}</div>
              <div className={styles.methodNote}>
                <p>BENCHMARKS (COHEN, 1988)</p>
                <span>d: .2 small, .5 medium, .8 large · η²: .01, .06, .14 · r: .1, .3, .5. Compare with effects in your own field too.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to calculate</h2>
              <div className={styles.empty}>
                <span>d</span>
                <p>Choose an input type, check the sample values, then calculate.</p>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
