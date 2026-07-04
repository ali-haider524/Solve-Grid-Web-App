"use client";

import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { runSymbolicRequest, type SymbolicAction, type SymbolicResult } from "../../lib/symbolic-algebra";
import styles from "../../components/ResearchLab.module.css";

const actions: Array<{ id: SymbolicAction; label: string; helper: string }> = [
  { id: "simplify", label: "Simplify", helper: "Rewrite an algebraic expression into a cleaner form." },
  { id: "differentiate", label: "Differentiate", helper: "Find a symbolic derivative with respect to one variable." },
  { id: "evaluate", label: "Evaluate", helper: "Calculate a numeric result after assigning a value." },
  { id: "equivalent", label: "Compare", helper: "Simplify the difference between two expressions." },
];

export default function SymbolicAlgebra() {
  const [action, setAction] = useState<SymbolicAction>("simplify");
  const [expression, setExpression] = useState("x^2 + 2*x + 1");
  const [comparison, setComparison] = useState("(x + 1)^2");
  const [variable, setVariable] = useState("x");
  const [value, setValue] = useState("2");
  const [result, setResult] = useState<SymbolicResult | null>(null);
  const [error, setError] = useState("");
  const active = actions.find((item) => item.id === action) ?? actions[0];

  async function run() {
    try {
      setError("");
      setResult(await runSymbolicRequest({ action, expression, comparison, variable, value: Number(value) }));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the expression and try again.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="research" />
      <section className={styles.hero}>
        <p>SYMBOLIC ALGEBRA LAB</p>
        <h1>Inspect an expression before turning it into a number.</h1>
        <span>Simplify expressions, differentiate with respect to a chosen variable, evaluate a model, or compare two forms. Results are algebra-engine outputs, not formal theorem proofs.</span>
      </section>
      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}><div><p className={styles.eyebrow}>EXPRESSION WORKSPACE</p><h2>{active.label}</h2></div><span className={styles.status}>BROWSER-ONLY</span></div>
          <div className={styles.tabRow}>{actions.map((item) => <button className={action === item.id ? styles.activeTab : undefined} key={item.id} onClick={() => setAction(item.id)} type="button">{item.label}</button>)}</div>
          <p className={styles.sectionNote}>{active.helper}</p>
          <label className={styles.expressionLabel}><span>Expression</span><textarea value={expression} onChange={(event) => setExpression(event.target.value)} spellCheck={false} placeholder="Example: sin(x)^2 + cos(x)^2" /></label>
          {action === "equivalent" ? <label className={styles.expressionLabel}><span>Compare with</span><textarea value={comparison} onChange={(event) => setComparison(event.target.value)} spellCheck={false} placeholder="Example: 1" /></label> : null}
          {action === "differentiate" || action === "evaluate" ? <div className={`${styles.fieldGrid} ${styles.twoMobile}`}><label><span>Variable</span><select value={variable} onChange={(event) => setVariable(event.target.value)}>{["x", "y", "z", "a", "b", "c"].map((item) => <option key={item}>{item}</option>)}</select></label>{action === "evaluate" ? <label><span>Assigned value</span><input value={value} inputMode="decimal" onChange={(event) => setValue(event.target.value)} /></label> : null}</div> : null}
          <div className={styles.chipRow}><button onClick={() => setExpression("sin(x)^2 + cos(x)^2")} type="button">Trig identity</button><button onClick={() => setExpression("x^3 - 3*x^2 + 2*x")} type="button">Polynomial</button><button onClick={() => setExpression("exp(x) * sin(x)")} type="button">Product rule</button></div>
          <button className={styles.runButton} onClick={run} type="button">Run {active.label.toLowerCase()} <span>→</span></button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>
        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p><h2>{result?.title ?? "Ready for an expression"}</h2>
          {result ? <><strong className={styles.resultValue}>{result.result}</strong><div className={styles.interpretation}><b>Method:</b> {result.method}<br />{result.note}</div></> : <div className={styles.empty}><span>f(x)</span><p>Select an operation, enter an expression, then run the algebra workspace.</p></div>}
          <div className={styles.methodNote}><p>SCOPE</p><span>Supported operations are simplification, differentiation, numeric evaluation, and a simplifier-based equivalence check. Domain restrictions and formal proof obligations remain your responsibility.</span></div>
        </aside>
      </section>
    </main>
  );
}
