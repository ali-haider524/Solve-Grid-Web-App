"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { solveLinearSystem, type LinearMethod } from "../../lib/linear-algebra";
import styles from "./EquationSolver.module.css";

type Mode = "linear" | "quadratic" | "cubic" | "system";
type Step = { title: string; detail: string };
type SolverResult = { title: string; summary: string; answers: string[]; steps: Step[] };

const EPSILON = 1e-10;
const variableNames = ["x", "y", "z", "w", "v", "u", "t", "s"];

const modeLabels: Record<Mode, string> = {
  linear: "Linear",
  quadratic: "Quadratic",
  cubic: "Cubic",
  system: "Linear system",
};

function blankGrid(size: number) {
  return Array.from({ length: size }, () => Array.from({ length: size + 1 }, () => ""));
}

function parse(value: string, label: string) {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) throw new Error(`Enter a valid number for ${label}.`);
  return parsed;
}

function format(value: number) {
  if (Math.abs(value) < EPSILON) return "0";
  const rounded = Number(value.toPrecision(10));
  return Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001) ? rounded.toExponential(5) : String(rounded);
}

function complex(real: number, imaginary: number) {
  return `${format(real)} ${imaginary < 0 ? "−" : "+"} ${format(Math.abs(imaginary))}i`;
}

function solveLinear(a: number, b: number): SolverResult {
  if (Math.abs(a) < EPSILON && Math.abs(b) < EPSILON) return { title: "Infinitely many solutions", summary: "The equation simplifies to 0 = 0.", answers: ["Every real x is a solution"], steps: [{ title: "Check coefficients", detail: "Both a and b are zero, so the statement is always true." }] };
  if (Math.abs(a) < EPSILON) return { title: "No solution", summary: "There is no variable term and the remaining statement is false.", answers: ["No real x satisfies the equation"], steps: [{ title: "Check coefficients", detail: `${format(b)} = 0 is false.` }] };
  const x = -b / a;
  return { title: "One solution", summary: "A non-zero coefficient of x gives one real solution.", answers: [`x = ${format(x)}`], steps: [{ title: "Move the constant", detail: `${format(a)}x = ${format(-b)}.` }, { title: "Divide by a", detail: `x = ${format(-b)} ÷ ${format(a)} = ${format(x)}.` }] };
}

function solveQuadratic(a: number, b: number, c: number): SolverResult {
  if (Math.abs(a) < EPSILON) return solveLinear(b, c);
  const discriminant = b ** 2 - 4 * a * c;
  const steps: Step[] = [{ title: "Calculate the discriminant", detail: `Δ = b² − 4ac = ${format(discriminant)}.` }];
  if (discriminant > EPSILON) {
    const root = Math.sqrt(discriminant);
    const x1 = (-b + root) / (2 * a);
    const x2 = (-b - root) / (2 * a);
    return { title: "Two real roots", summary: "The discriminant is positive.", answers: [`x₁ = ${format(x1)}`, `x₂ = ${format(x2)}`], steps: [...steps, { title: "Apply the quadratic formula", detail: "x = (−b ± √Δ) ÷ 2a." }] };
  }
  if (Math.abs(discriminant) < EPSILON) {
    const x = -b / (2 * a);
    return { title: "Repeated real root", summary: "The discriminant is zero.", answers: [`x = ${format(x)}`], steps: [...steps, { title: "Apply the repeated-root formula", detail: `x = −b ÷ 2a = ${format(x)}.` }] };
  }
  const real = -b / (2 * a);
  const imaginary = Math.sqrt(-discriminant) / Math.abs(2 * a);
  return { title: "Two complex roots", summary: "The discriminant is negative, so there are no real roots.", answers: [`x₁ = ${complex(real, imaginary)}`, `x₂ = ${complex(real, -imaginary)}`], steps: [...steps, { title: "Use the complex form", detail: "A negative discriminant produces an imaginary component." }] };
}

function solveCubic(a: number, b: number, c: number, d: number): SolverResult {
  if (Math.abs(a) < EPSILON) return solveQuadratic(b, c, d);
  const A = b / a;
  const B = c / a;
  const C = d / a;
  const p = B - (A ** 2) / 3;
  const q = (2 * A ** 3) / 27 - (A * B) / 3 + C;
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;
  const steps: Step[] = [{ title: "Normalize the cubic", detail: `Divide each term by a = ${format(a)}.` }, { title: "Calculate the cubic discriminant", detail: `Δ = ${format(discriminant)}.` }];
  if (discriminant > EPSILON) {
    const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
    const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
    const realRoot = u + v - A / 3;
    const complexReal = -(u + v) / 2 - A / 3;
    const complexImaginary = (Math.sqrt(3) / 2) * (u - v);
    return { title: "One real root and two complex roots", summary: "The cubic discriminant is positive.", answers: [`x₁ = ${format(realRoot)}`, `x₂ = ${complex(complexReal, complexImaginary)}`, `x₃ = ${complex(complexReal, -complexImaginary)}`], steps: [...steps, { title: "Apply the cubic formula", detail: "The normalized p and q values produce one real root." }] };
  }
  if (Math.abs(discriminant) < EPSILON) {
    const u = Math.cbrt(-q / 2);
    const root1 = 2 * u - A / 3;
    const root2 = -u - A / 3;
    const roots = [...new Set([format(root1), format(root2)])];
    return { title: "Repeated real roots", summary: "The cubic discriminant is zero, so at least two roots are equal.", answers: roots.map((root, index) => `x${index + 1} = ${root}`), steps: [...steps, { title: "Use repeated-root form", detail: "Δ = 0 indicates repeated real roots." }] };
  }
  const radius = 2 * Math.sqrt(-p / 3);
  const angle = Math.acos((-q / 2) / Math.sqrt(-((p / 3) ** 3)));
  const roots = [0, 1, 2].map((index) => radius * Math.cos((angle + 2 * Math.PI * index) / 3) - A / 3).sort((first, second) => first - second);
  return { title: "Three real roots", summary: "The cubic discriminant is negative.", answers: roots.map((root, index) => `x${index + 1} = ${format(root)}`), steps: [...steps, { title: "Use trigonometric cubic form", detail: "A negative discriminant gives three distinct real roots." }] };
}

export default function EquationSolver() {
  const [mode, setMode] = useState<Mode>("quadratic");
  const [linear, setLinear] = useState({ a: "", b: "" });
  const [quadratic, setQuadratic] = useState({ a: "", b: "", c: "" });
  const [cubic, setCubic] = useState({ a: "", b: "", c: "", d: "" });
  const [systemSize, setSystemSize] = useState(3);
  const [system, setSystem] = useState<string[][]>(() => blankGrid(3));
  const [method, setMethod] = useState<LinearMethod>("auto");
  const [result, setResult] = useState<SolverResult | null>(null);
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    if (mode === "linear") return "ax + b = 0";
    if (mode === "quadratic") return "ax² + bx + c = 0";
    if (mode === "cubic") return "ax³ + bx² + cx + d = 0";
    return `${systemSize} equations in ${systemSize} variables`;
  }, [mode, systemSize]);

  function changeMode(next: Mode) {
    setMode(next);
    setResult(null);
    setError("");
  }

  function resizeSystem(size: number) {
    setSystemSize(size);
    setSystem((current) => Array.from({ length: size }, (_, row) => Array.from({ length: size + 1 }, (_, column) => current[row]?.[column] ?? "")));
    setResult(null);
  }

  function updateSystem(row: number, column: number, value: string) {
    setSystem((current) => current.map((line, rowIndex) => line.map((cell, columnIndex) => rowIndex === row && columnIndex === column ? value : cell)));
  }

  function loadExample() {
    if (mode === "linear") setLinear({ a: "2", b: "8" });
    if (mode === "quadratic") setQuadratic({ a: "1", b: "-5", c: "6" });
    if (mode === "cubic") setCubic({ a: "1", b: "-6", c: "11", d: "-6" });
    if (mode === "system") {
      resizeSystem(3);
      setSystem([["2", "1", "-1", "8"], ["-3", "-1", "2", "-11"], ["-2", "1", "2", "-3"]]);
    }
    setError("");
  }

  function solve() {
    try {
      let solved: SolverResult;
      if (mode === "linear") solved = solveLinear(parse(linear.a, "a"), parse(linear.b, "b"));
      else if (mode === "quadratic") solved = solveQuadratic(parse(quadratic.a, "a"), parse(quadratic.b, "b"), parse(quadratic.c, "c"));
      else if (mode === "cubic") solved = solveCubic(parse(cubic.a, "a"), parse(cubic.b, "b"), parse(cubic.c, "c"), parse(cubic.d, "d"));
      else {
        const coefficientMatrix = system.map((row, rowIndex) => row.slice(0, systemSize).map((value, columnIndex) => parse(value, `row ${rowIndex + 1}, ${variableNames[columnIndex]}`)));
        const vector = system.map((row, rowIndex) => parse(row[systemSize], `row ${rowIndex + 1} right side`));
        const response = solveLinearSystem(coefficientMatrix, vector, method);
        if (response.status === "none") solved = { title: "No solution", summary: "The augmented system is inconsistent.", answers: ["No common solution exists"], steps: [{ title: response.method, detail: "Row reduction produced a contradiction." }] };
        else if (response.status === "infinite") solved = { title: "Infinitely many solutions", summary: "At least one variable is free after row reduction.", answers: ["The system is dependent"], steps: [{ title: response.method, detail: "The coefficient matrix does not have a pivot in every variable column." }] };
        else if (response.status === "unsupported") throw new Error(response.message);
        else solved = { title: "Unique system solution", summary: `${response.method} found one solution for the selected linear system.`, answers: response.solution.map((value, index) => `${variableNames[index]} = ${format(value)}`), steps: [{ title: "Create A·x = b", detail: `The coefficient matrix contains ${systemSize} equations and ${systemSize} unknowns.` }, { title: response.method, detail: "The system was reduced using the selected matrix method." }] };
      }
      setResult(solved);
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "Check the values and try again.");
    }
  }

  return <main id="main-content" className={styles.page}>
    <ToolHeader active="math" />
    <section className={styles.hero}><p>FREE ADVANCED EQUATION SOLVER</p><h1>Choose a polynomial or build a flexible linear system.</h1><span>Solve linear, quadratic, cubic, and 2–8 variable systems with Gaussian elimination, Gauss-Jordan / RREF, matrix inverse, or Cramer’s rule where applicable.</span></section>
    <section className={styles.workspace}>
      <article className={styles.solverCard}>
        <div className={styles.cardHeading}><div><p>SELECT A WORKFLOW</p><h2>{modeLabels[mode]}</h2></div><span>{preview}</span></div>
        <div className={styles.modeTabs}>{(Object.keys(modeLabels) as Mode[]).map((item) => <button className={mode === item ? styles.activeTab : ""} key={item} onClick={() => changeMode(item)} type="button">{modeLabels[item]}</button>)}</div>
        <label className={styles.mobileModePicker}><span>Equation workflow</span><select value={mode} onChange={(event) => changeMode(event.target.value as Mode)}>{(Object.keys(modeLabels) as Mode[]).map((item) => <option key={item} value={item}>{modeLabels[item]}</option>)}</select></label>
        {mode === "linear" && <CoefficientRow items={[{ label: "a", description: "x coefficient", value: linear.a, set: (value) => setLinear((current) => ({ ...current, a: value })) }, { label: "b", description: "constant", value: linear.b, set: (value) => setLinear((current) => ({ ...current, b: value })) }]} />}
        {mode === "quadratic" && <CoefficientRow items={[{ label: "a", description: "x² coefficient", value: quadratic.a, set: (value) => setQuadratic((current) => ({ ...current, a: value })) }, { label: "b", description: "x coefficient", value: quadratic.b, set: (value) => setQuadratic((current) => ({ ...current, b: value })) }, { label: "c", description: "constant", value: quadratic.c, set: (value) => setQuadratic((current) => ({ ...current, c: value })) }]} />}
        {mode === "cubic" && <CoefficientRow items={[{ label: "a", description: "x³ coefficient", value: cubic.a, set: (value) => setCubic((current) => ({ ...current, a: value })) }, { label: "b", description: "x² coefficient", value: cubic.b, set: (value) => setCubic((current) => ({ ...current, b: value })) }, { label: "c", description: "x coefficient", value: cubic.c, set: (value) => setCubic((current) => ({ ...current, c: value })) }, { label: "d", description: "constant", value: cubic.d, set: (value) => setCubic((current) => ({ ...current, d: value })) }]} />}
        {mode === "system" && <><div className={styles.systemControls}><label>Variables<select value={systemSize} onChange={(event) => resizeSystem(Number(event.target.value))}>{Array.from({ length: 7 }, (_, index) => index + 2).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Method<select value={method} onChange={(event) => setMethod(event.target.value as LinearMethod)}><option value="auto">Auto / row reduction</option><option value="gaussian">Gaussian elimination</option><option value="gauss-jordan">Gauss-Jordan / RREF</option><option value="inverse">Matrix inverse</option><option value="cramer">Cramer’s rule (2–4)</option></select></label></div><div className={styles.systemScroll}><table><thead><tr>{variableNames.slice(0, systemSize).map((name) => <th key={name}>{name}</th>)}<th>=</th></tr></thead><tbody>{system.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, columnIndex) => <td key={columnIndex}><input value={cell} onChange={(event) => updateSystem(rowIndex, columnIndex, event.target.value)} inputMode="decimal" aria-label={`Equation ${rowIndex + 1}, ${columnIndex === systemSize ? "right side" : variableNames[columnIndex]}`} /></td>)}</tr>)}</tbody></table></div></>}
        {mode === "cubic" && <p className={styles.polynomialLink}>Need degree 4–10 roots? <Link href="/polynomial-solver">Use the Polynomial Solver →</Link></p>}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actionRow}><button className={styles.exampleButton} onClick={loadExample} type="button">Load example</button><button className={styles.solveButton} onClick={solve} type="button">Solve {modeLabels[mode]} <span>→</span></button></div>
      </article>
      <aside className={styles.answerCard} aria-live="polite"><p>SOLUTION</p>{result ? <><h2>{result.title}</h2><span className={styles.summary}>{result.summary}</span><div className={styles.answerList}>{result.answers.map((answer) => <strong key={answer}>{answer}</strong>)}</div><div className={styles.steps}><p>METHOD</p>{result.steps.map((step, index) => <article key={`${step.title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></article>)}</div></> : <div className={styles.emptyAnswer}><span>ƒ(x)</span><p>Choose an equation type or a matrix method for a flexible linear system.</p></div>}<div className={styles.connected}><p>CONNECTED TOOLS</p><span>Use Matrix Calculator for matrix operations, Graphing Calculator to visualize functions, and Polynomial Solver for higher degrees.</span></div></aside>
    </section>
  </main>;
}

function CoefficientRow({ items }: { items: Array<{ label: string; description: string; value: string; set: (value: string) => void }> }) {
  return <div className={styles.coefficientGrid} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>{items.map((item) => <label key={item.label}><span>{item.label}</span><input value={item.value} onChange={(event) => item.set(event.target.value)} inputMode="decimal" aria-label={item.description} /><small>{item.description}</small></label>)}</div>;
}
