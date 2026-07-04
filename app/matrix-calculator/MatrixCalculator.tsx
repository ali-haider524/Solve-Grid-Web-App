"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  addMatrices,
  adjugate,
  cofactorMatrix,
  determinant,
  eigenvalues2,
  inverse,
  matrixRank,
  multiplyMatrices,
  ref,
  rref,
  scalarMultiply,
  solveLinearSystem,
  subtractMatrices,
  trace,
  transpose,
  type LinearMethod,
  type Matrix,
} from "../../lib/linear-algebra";
import styles from "./MatrixCalculator.module.css";

type Operation =
  | "add"
  | "subtract"
  | "multiply"
  | "scalar"
  | "transpose"
  | "determinant"
  | "trace"
  | "inverse"
  | "ref"
  | "rref"
  | "rank"
  | "cofactor"
  | "adjugate"
  | "solve"
  | "eigen";

type Grid = string[][];
type Result =
  | { kind: "matrix"; value: Matrix; label: string; detail: string }
  | { kind: "scalar"; value: number; label: string; detail: string }
  | { kind: "vector"; value: number[]; label: string; detail: string }
  | { kind: "text"; values: string[]; label: string; detail: string }
  | null;

const MIN_DIMENSION = 2;
const MAX_DIMENSION = 10;

const operationGroups: Array<{ title: string; items: Operation[] }> = [
  { title: "Matrix arithmetic", items: ["add", "subtract", "multiply", "scalar", "transpose"] },
  { title: "Core matrix operations", items: ["determinant", "trace", "inverse", "ref", "rref", "rank"] },
  { title: "Advanced operations", items: ["cofactor", "adjugate", "solve", "eigen"] },
];

const operationInfo: Record<Operation, { label: string; description: string }> = {
  add: { label: "A + B", description: "Add two matrices with the same dimensions." },
  subtract: { label: "A − B", description: "Subtract B from A." },
  multiply: { label: "A × B", description: "Multiply compatible rectangular matrices." },
  scalar: { label: "kA", description: "Multiply every matrix entry by a scalar." },
  transpose: { label: "Aᵀ", description: "Swap rows and columns." },
  determinant: { label: "det(A)", description: "Find the determinant of a square matrix." },
  trace: { label: "tr(A)", description: "Sum the main diagonal entries." },
  inverse: { label: "A⁻¹", description: "Find the inverse using row reduction." },
  ref: { label: "REF(A)", description: "Reduce A to row echelon form." },
  rref: { label: "RREF(A)", description: "Reduce A to row-reduced echelon form." },
  rank: { label: "rank(A)", description: "Count independent rows or columns." },
  cofactor: { label: "Cof(A)", description: "Build the cofactor matrix, up to 5×5." },
  adjugate: { label: "adj(A)", description: "Transpose the cofactor matrix, up to 5×5." },
  solve: { label: "A·x = b", description: "Solve a square linear system with a chosen method." },
  eigen: { label: "eigen(A)", description: "Find eigenvalues for a 2×2 matrix." },
};

function createGrid(rows: number, columns: number, previous?: Array<Array<string | number>>) {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => String(previous?.[rowIndex]?.[columnIndex] ?? "")),
  );
}

function createVector(size: number, previous?: string[]) {
  return Array.from({ length: size }, (_, index) => previous?.[index] ?? "");
}

function parseCell(input: string) {
  const value = input.trim();
  if (!value) return 0;
  if (/^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value)) return Number(value);
  const fraction = value.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/);
  if (!fraction) return Number.NaN;
  const numerator = Number(fraction[1]);
  const denominator = Number(fraction[2]);
  return denominator === 0 ? Number.NaN : numerator / denominator;
}

function parseGrid(grid: Grid): Matrix | null {
  const values = grid.map((row) => row.map(parseCell));
  return values.some((row) => row.some((value) => !Number.isFinite(value))) ? null : values;
}

function parseVector(vector: string[]) {
  const values = vector.map(parseCell);
  return values.some((value) => !Number.isFinite(value)) ? null : values;
}

function format(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (Object.is(value, -0)) return "0";
  const rounded = Number(value.toPrecision(10));
  return Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001) ? rounded.toExponential(5) : String(rounded);
}

function requiresSquare(operation: Operation) {
  return ["determinant", "trace", "inverse", "cofactor", "adjugate", "solve", "eigen"].includes(operation);
}

function needsBMatrix(operation: Operation) {
  return ["add", "subtract", "multiply"].includes(operation);
}

export default function MatrixCalculator() {
  const [operation, setOperation] = useState<Operation>("determinant");
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [bColumns, setBColumns] = useState(3);
  const [matrixA, setMatrixA] = useState<Grid>(() => createGrid(3, 3));
  const [matrixB, setMatrixB] = useState<Grid>(() => createGrid(3, 3));
  const [vectorB, setVectorB] = useState<string[]>(() => createVector(3));
  const [scalar, setScalar] = useState("1");
  const [method, setMethod] = useState<LinearMethod>("auto");
  const [pasteTarget, setPasteTarget] = useState<"a" | "b">("a");
  const [pasteText, setPasteText] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [message, setMessage] = useState("Blank cells count as 0. Enter decimals, scientific notation, or simple fractions such as 1/2.");

  const details = operationInfo[operation];
  const isSquare = rows === columns;
  const matrixBRows = operation === "multiply" ? columns : rows;
  const matrixBColumns = operation === "multiply" ? bColumns : columns;
  const dimensionLabel = useMemo(() => `${rows} × ${columns}`, [rows, columns]);

  function resizeA(nextRows: number, nextColumns: number) {
    setRows(nextRows);
    setColumns(nextColumns);
    setMatrixA((current) => createGrid(nextRows, nextColumns, current));
    setMatrixB((current) => createGrid(operation === "multiply" ? nextColumns : nextRows, operation === "multiply" ? bColumns : nextColumns, current));
    setVectorB((current) => createVector(nextRows, current));
    setResult(null);
  }

  function selectOperation(next: Operation) {
    setOperation(next);
    setResult(null);
    if (requiresSquare(next) && rows !== columns) {
      const size = Math.max(rows, columns);
      resizeA(size, size);
    }
    if (next === "eigen") resizeA(2, 2);
  }

  function setGridCell(target: "a" | "b", row: number, column: number, value: string) {
    const setter = target === "a" ? setMatrixA : setMatrixB;
    setter((current) => current.map((line, rowIndex) => line.map((cell, columnIndex) => rowIndex === row && columnIndex === column ? value : cell)));
  }

  function applyPaste() {
    const parsed = pasteText.trim().split(/\r?\n/).filter(Boolean).map((line) => line.trim().split(/\t|,|\s+/).filter(Boolean));
    if (!parsed.length || !parsed[0].length || parsed.some((row) => row.length !== parsed[0].length)) {
      setMessage("Paste a rectangular grid. Separate cells with tabs, commas, or spaces and rows with new lines.");
      return;
    }
    if (parsed.length > MAX_DIMENSION || parsed[0].length > MAX_DIMENSION) {
      setMessage(`Keep pasted matrices within ${MAX_DIMENSION} × ${MAX_DIMENSION}.`);
      return;
    }
    if (pasteTarget === "a") {
      resizeA(parsed.length, parsed[0].length);
      setMatrixA(parsed);
    } else {
      setMatrixB(parsed);
      if (operation === "multiply") setBColumns(parsed[0].length);
    }
    setPasteText("");
    setMessage("Pasted values applied. Review the dimensions, then calculate.");
  }

  function loadExample() {
    if (operation === "multiply") {
      resizeA(2, 3);
      setBColumns(2);
      setMatrixA([["1", "2", "3"], ["4", "5", "6"]]);
      setMatrixB([["7", "8"], ["9", "10"], ["11", "12"]]);
    } else if (operation === "solve") {
      resizeA(3, 3);
      setMatrixA([["2", "1", "-1"], ["-3", "-1", "2"], ["-2", "1", "2"]]);
      setVectorB(["8", "-11", "-3"]);
    } else if (operation === "eigen") {
      resizeA(2, 2);
      setMatrixA([["4", "1"], ["2", "3"]]);
    } else {
      resizeA(3, 3);
      setMatrixA([["2", "1", "0"], ["1", "3", "1"], ["0", "1", "2"]]);
    }
    setResult(null);
    setMessage("Example values loaded. You can replace any entry.");
  }

  function clearValues() {
    setMatrixA(createGrid(rows, columns));
    setMatrixB(createGrid(matrixBRows, matrixBColumns));
    setVectorB(createVector(rows));
    setResult(null);
    setMessage("Values cleared.");
  }

  function calculate() {
    const a = parseGrid(matrixA);
    const b = parseGrid(matrixB);
    const vector = parseVector(vectorB);
    if (!a || !b || !vector) {
      setResult(null);
      setMessage("Use valid decimals, scientific notation, or simple fractions such as 1/2.");
      return;
    }
    if (requiresSquare(operation) && !isSquare) {
      setResult(null);
      setMessage(`${details.label} requires the same number of rows and columns.`);
      return;
    }

    if (operation === "add" || operation === "subtract") {
      const output = operation === "add" ? addMatrices(a, b) : subtractMatrices(a, b);
      if (!output) { setResult(null); setMessage("A and B must have identical dimensions for this operation."); return; }
      setResult({ kind: "matrix", value: output, label: details.label, detail: `${details.label} calculated entry by entry.` });
      return;
    }
    if (operation === "multiply") {
      const output = multiplyMatrices(a, b);
      if (!output) { setResult(null); setMessage("For A × B, columns in A must equal rows in B."); return; }
      setResult({ kind: "matrix", value: output, label: details.label, detail: `${rows} × ${columns} multiplied by ${matrixBRows} × ${matrixBColumns}.` });
      return;
    }
    if (operation === "scalar") {
      const value = parseCell(scalar);
      if (!Number.isFinite(value)) { setResult(null); setMessage("Scalar k must be a valid number or fraction."); return; }
      setResult({ kind: "matrix", value: scalarMultiply(a, value), label: "kA", detail: `Each entry of A was multiplied by k = ${format(value)}.` });
      return;
    }
    if (operation === "transpose") { setResult({ kind: "matrix", value: transpose(a), label: "Aᵀ", detail: "Rows and columns were swapped." }); return; }
    if (operation === "determinant") { const value = determinant(a); setResult({ kind: "scalar", value: value ?? 0, label: "det(A)", detail: "Calculated by pivoted elimination." }); return; }
    if (operation === "trace") { const value = trace(a); setResult({ kind: "scalar", value: value ?? 0, label: "tr(A)", detail: "The main diagonal entries were added." }); return; }
    if (operation === "inverse") { const output = inverse(a); if (!output) { setResult(null); setMessage("A has no inverse because its determinant is zero."); return; } setResult({ kind: "matrix", value: output, label: "A⁻¹", detail: "Calculated by Gauss-Jordan elimination." }); return; }
    if (operation === "ref") { setResult({ kind: "matrix", value: ref(a).matrix, label: "REF(A)", detail: "Forward elimination created row echelon form." }); return; }
    if (operation === "rref") { setResult({ kind: "matrix", value: rref(a).matrix, label: "RREF(A)", detail: "Gauss-Jordan reduction created row-reduced echelon form." }); return; }
    if (operation === "rank") { setResult({ kind: "scalar", value: matrixRank(a), label: "rank(A)", detail: "Rank is the number of pivot columns in RREF(A)." }); return; }
    if (operation === "cofactor" || operation === "adjugate") {
      const output = operation === "cofactor" ? cofactorMatrix(a) : adjugate(a);
      if (!output) { setResult(null); setMessage("Cofactor and adjugate are limited to square matrices up to 5 × 5 for responsiveness."); return; }
      setResult({ kind: "matrix", value: output, label: details.label, detail: `${details.label} calculated from matrix minors.` });
      return;
    }
    if (operation === "eigen") {
      const output = eigenvalues2(a);
      if (!output) { setResult(null); setMessage("Eigenvalue mode currently supports 2 × 2 matrices only."); return; }
      setResult({ kind: "text", values: output.values, label: "Eigenvalues", detail: `trace(A) = ${format(output.trace)}, det(A) = ${format(output.determinant)}.` });
      return;
    }

    const solved = solveLinearSystem(a, vector, method);
    if (solved.status === "unique") {
      setResult({ kind: "vector", value: solved.solution, label: "Solution vector", detail: `${solved.method} was used. The reduced augmented matrix is available below.` });
      setMessage("A unique solution was found.");
    } else {
      setResult(null);
      setMessage(solved.status === "none" ? "The system is inconsistent, so it has no solution." : solved.status === "infinite" ? "The system has infinitely many solutions." : solved.message);
    }
  }

  return <main id="main-content" className={styles.page}>
    <ToolHeader active="math" />
    <section className={styles.hero}><p>FREE ADVANCED MATRIX & VECTOR CALCULATOR</p><h1>Choose an operation, dimensions, and method.</h1><span>Build matrices from 2×2 through 10×10, paste values from a spreadsheet, and use arithmetic, row reduction, inverse, rank, eigenvalue, and linear-system tools.</span></section>
    <section className={styles.workspace}>
      <article className={styles.inputCard}>
        <div className={styles.cardHeading}><div><p>MATRIX WORKSPACE</p><h2>{details.label}</h2></div><span>{dimensionLabel} A</span></div>
        <div className={styles.operationGroups}>{operationGroups.map((group) => <div key={group.title}><p>{group.title}</p><div className={styles.operations}>{group.items.map((item) => <button className={operation === item ? styles.activeOperation : ""} key={item} onClick={() => selectOperation(item)} type="button"><b>{operationInfo[item].label}</b><span>{operationInfo[item].description}</span></button>)}</div></div>)}</div>
        <div className={styles.dimensionPanel}><div><p>DIMENSIONS</p><span>{requiresSquare(operation) ? "This operation needs a square matrix." : operation === "multiply" ? "B rows automatically match A columns." : "Choose the rows and columns for A."}</span></div><div className={styles.dimensionControls}><label>Rows<select value={rows} onChange={(event) => resizeA(Number(event.target.value), requiresSquare(operation) ? Number(event.target.value) : columns)}>{dimensionOptions()}</select></label><label>Columns<select value={columns} disabled={requiresSquare(operation)} onChange={(event) => resizeA(requiresSquare(operation) ? Number(event.target.value) : rows, Number(event.target.value))}>{dimensionOptions()}</select></label>{operation === "multiply" && <label>B columns<select value={bColumns} onChange={(event) => { const next = Number(event.target.value); setBColumns(next); setMatrixB((current) => createGrid(columns, next, current)); }}>{dimensionOptions()}</select></label>}</div></div>
        {operation === "scalar" && <label className={styles.scalarInput}><span>Scalar k</span><input value={scalar} onChange={(event) => setScalar(event.target.value)} inputMode="decimal" placeholder="1" /></label>}
        {operation === "solve" && <label className={styles.methodInput}><span>System method</span><select value={method} onChange={(event) => setMethod(event.target.value as LinearMethod)}><option value="auto">Auto / row reduction</option><option value="gaussian">Gaussian elimination</option><option value="gauss-jordan">Gauss-Jordan / RREF</option><option value="inverse">Matrix inverse</option><option value="cramer">Cramer’s rule (2–4)</option></select></label>}
        <div className={styles.quickActions}><button onClick={loadExample} type="button">Load example</button><button onClick={clearValues} type="button">Clear values</button><span>Blank cells count as 0. Fractions such as 1/2 are accepted.</span></div>
        <details className={styles.pastePanel}><summary>Paste a matrix from a spreadsheet</summary><div><select value={pasteTarget} onChange={(event) => setPasteTarget(event.target.value as "a" | "b")} disabled={!needsBMatrix(operation)}><option value="a">Matrix A</option><option value="b">Matrix B</option></select><textarea value={pasteText} onChange={(event) => setPasteText(event.target.value)} placeholder={"1\t2\t3\n4\t5\t6"} rows={4} /><button onClick={applyPaste} type="button">Apply pasted grid</button></div></details>
        <div className={styles.matrixArea}><MatrixGrid label="Matrix A" grid={matrixA} onChange={(row, column, value) => setGridCell("a", row, column, value)} />{needsBMatrix(operation) && <MatrixGrid label="Matrix B" grid={matrixB} onChange={(row, column, value) => setGridCell("b", row, column, value)} />}{operation === "solve" && <VectorGrid values={vectorB} onChange={(index, value) => setVectorB((current) => current.map((item, currentIndex) => currentIndex === index ? value : item))} />}</div>
        <button className={styles.calculate} onClick={calculate} type="button">Calculate {details.label}<span>→</span></button>
      </article>
      <aside className={styles.resultCard} aria-live="polite"><p>RESULT</p><h2>{result?.label ?? details.label}</h2><span>{result?.detail ?? message}</span>{result && <ResultView result={result} />}{!result && <div className={styles.emptyResult}>Enter or paste values, choose an operation, then calculate.</div>}<div className={styles.connected}><p>CONNECTED WORKFLOWS</p><span>Use Equation Solver for coefficient systems, Polynomial Solver for roots, and Statistics Calculator for data analysis.</span></div></aside>
    </section>
  </main>;
}

function dimensionOptions() { return Array.from({ length: MAX_DIMENSION - MIN_DIMENSION + 1 }, (_, index) => <option key={MIN_DIMENSION + index} value={MIN_DIMENSION + index}>{MIN_DIMENSION + index}</option>); }

function MatrixGrid({ label, grid, onChange }: { label: string; grid: Grid; onChange: (row: number, column: number, value: string) => void }) {
  return <section className={styles.matrixBlock}><p>{label}</p><div className={styles.matrixScroll}><div className={styles.matrix} style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(58px, 1fr))` }}>{grid.map((row, rowIndex) => row.map((cell, columnIndex) => <input key={`${rowIndex}-${columnIndex}`} value={cell} onChange={(event) => onChange(rowIndex, columnIndex, event.target.value)} inputMode="decimal" aria-label={`${label}, row ${rowIndex + 1}, column ${columnIndex + 1}`} />))}</div></div></section>;
}

function VectorGrid({ values, onChange }: { values: string[]; onChange: (index: number, value: string) => void }) { return <section className={styles.matrixBlock}><p>Vector b</p><div className={styles.vector}>{values.map((value, index) => <input key={index} value={value} onChange={(event) => onChange(index, event.target.value)} inputMode="decimal" aria-label={`Vector b row ${index + 1}`} />)}</div></section>; }

function ResultView({ result }: { result: Exclude<Result, null> }) {
  if (result.kind === "scalar") return <strong className={styles.scalarResult}>{format(result.value)}</strong>;
  if (result.kind === "vector") return <div className={styles.resultVector}>{result.value.map((value, index) => <span key={index}>x{index + 1} = <b>{format(value)}</b></span>)}</div>;
  if (result.kind === "text") return <div className={styles.textResult}>{result.values.map((value) => <strong key={value}>{value}</strong>)}</div>;
  return <div className={styles.resultMatrixScroll}><div className={styles.resultMatrix} style={{ gridTemplateColumns: `repeat(${result.value[0]?.length ?? 1}, minmax(58px, 1fr))` }}>{result.value.flatMap((row, rowIndex) => row.map((value, columnIndex) => <span key={`${rowIndex}-${columnIndex}`}>{format(value)}</span>))}</div></div>;
}
