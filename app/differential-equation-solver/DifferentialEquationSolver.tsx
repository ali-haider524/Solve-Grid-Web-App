"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  solveSingleOde,
  solveTwoStateSystem,
  type OdeMethod,
  type OdeMode,
  type OdePoint,
  type OdeSolveResult,
} from "../../lib/differential-equations";
import styles from "./DifferentialEquationSolver.module.css";

type InputState = {
  derivativeY: string;
  derivativeZ: string;
  x0: string;
  y0: string;
  z0: string;
  xEnd: string;
  step: string;
};

type ViewMode = "solution" | "phase" | "table";

const initialInput: InputState = {
  derivativeY: "y",
  derivativeZ: "-y",
  x0: "0",
  y0: "1",
  z0: "0",
  xEnd: "4",
  step: "0.1",
};

const presets: Array<{
  id: string;
  label: string;
  mode: OdeMode;
  input: InputState;
}> = [
  {
    id: "growth",
    label: "Exponential growth",
    mode: "single",
    input: { ...initialInput, derivativeY: "y", xEnd: "3", step: "0.1" },
  },
  {
    id: "decay-forced",
    label: "Forced decay",
    mode: "single",
    input: { ...initialInput, derivativeY: "-2*y + sin(x)", y0: "1", xEnd: "8", step: "0.05" },
  },
  {
    id: "logistic",
    label: "Logistic model",
    mode: "single",
    input: { ...initialInput, derivativeY: "0.8*y*(1-y/10)", y0: "0.5", xEnd: "12", step: "0.1" },
  },
  {
    id: "oscillator",
    label: "Harmonic system",
    mode: "system",
    input: { ...initialInput, derivativeY: "z", derivativeZ: "-y", y0: "1", z0: "0", xEnd: "12", step: "0.05" },
  },
];

const methodLabels: Record<OdeMethod, string> = {
  euler: "Euler",
  heun: "Improved Euler (Heun)",
  rk4: "Runge–Kutta 4 (RK4)",
};

function parseInput(value: string, label: string) {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a finite number.`);
  }

  return parsed;
}

function format(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return "—";
  if (Object.is(value, -0)) return "0";
  const rounded = Number(value.toPrecision(9));
  return Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001)
    ? rounded.toExponential(5)
    : String(rounded);
}

function sampleRows(points: OdePoint[]) {
  const limit = 220;
  const stride = Math.max(1, Math.ceil(points.length / limit));
  const sampled = points.filter((_, index) => index % stride === 0);
  const last = points[points.length - 1];

  if (sampled[sampled.length - 1] !== last) {
    sampled.push(last);
  }

  return sampled;
}

function chartBounds(values: number[]) {
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return { min: -1, max: 1 };
  const rawMin = Math.min(...finite);
  const rawMax = Math.max(...finite);
  const span = rawMax - rawMin || Math.max(1, Math.abs(rawMin) * 0.2);
  return { min: rawMin - span * 0.12, max: rawMax + span * 0.12 };
}

function pathPoints(points: Array<{ horizontal: number; vertical: number }>, width: number, height: number) {
  const xBounds = chartBounds(points.map((point) => point.horizontal));
  const yBounds = chartBounds(points.map((point) => point.vertical));
  const mapX = (value: number) => ((value - xBounds.min) / (xBounds.max - xBounds.min)) * width;
  const mapY = (value: number) => height - ((value - yBounds.min) / (yBounds.max - yBounds.min)) * height;

  return {
    points: points.map((point) => `${mapX(point.horizontal).toFixed(2)},${mapY(point.vertical).toFixed(2)}`).join(" "),
    xBounds,
    yBounds,
    mapX,
    mapY,
  };
}

function SolutionPlot({ result, view }: { result: OdeSolveResult; view: ViewMode }) {
  const width = 760;
  const height = 360;
  const hasZ = result.mode === "system";
  const phaseAvailable = hasZ && result.points.some((point) => point.z !== undefined);

  if (view === "table") return null;

  const ySeries = result.points.map((point) => ({ horizontal: view === "phase" ? point.y : point.x, vertical: view === "phase" ? point.z ?? 0 : point.y }));
  const zSeries = result.points.map((point) => ({ horizontal: point.x, vertical: point.z ?? 0 }));
  const yPath = pathPoints(ySeries, width, height);
  const zPath = pathPoints(zSeries, width, height);
  const verticalLabel = view === "phase" ? "z" : "state";
  const horizontalLabel = view === "phase" ? "y" : "x";

  return (
    <figure className={styles.plotFrame}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={view === "phase" ? "Phase plot" : "Numerical solution plot"}>
        <rect width={width} height={height} rx="18" fill="#fbfcff" />
        {Array.from({ length: 7 }, (_, index) => {
          const x = (index / 6) * width;
          const y = (index / 6) * height;
          return (
            <g key={`grid-${index}`}>
              <line x1={x} x2={x} y1="0" y2={height} stroke="#e4eaf4" strokeWidth="1" />
              <line x1="0" x2={width} y1={y} y2={y} stroke="#e4eaf4" strokeWidth="1" />
            </g>
          );
        })}
        <polyline points={yPath.points} fill="none" stroke="#3157e8" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
        {hasZ && view === "solution" ? (
          <polyline points={zPath.points} fill="none" stroke="#e56a39" strokeWidth="2.7" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
        <text x="18" y="28" fill="#52647e" fontSize="17" fontWeight="700">{verticalLabel}</text>
        <text x={width - 28} y={height - 16} fill="#52647e" fontSize="17" fontWeight="700">{horizontalLabel}</text>
      </svg>
      <figcaption>
        <span><i className={styles.legendY} /> y</span>
        {hasZ && view === "solution" ? <span><i className={styles.legendZ} /> z</span> : null}
        {view === "phase" && !phaseAvailable ? <span>Phase plot needs a two-state system.</span> : null}
      </figcaption>
    </figure>
  );
}

export default function DifferentialEquationSolver() {
  const [mode, setMode] = useState<OdeMode>("single");
  const [method, setMethod] = useState<OdeMethod>("rk4");
  const [input, setInput] = useState<InputState>(initialInput);
  const [result, setResult] = useState<OdeSolveResult | null>(null);
  const [view, setView] = useState<ViewMode>("solution");
  const [message, setMessage] = useState("Choose a preset or enter an equation, then run a numerical simulation.");
  const [error, setError] = useState("");

  const finalPoint = result?.points[result.points.length - 1];
  const availableViews = useMemo(() => (mode === "system" ? ["solution", "phase", "table"] as ViewMode[] : ["solution", "table"] as ViewMode[]), [mode]);

  function updateInput(key: keyof InputState, value: string) {
    setInput((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function loadPreset(presetId: string) {
    const preset = presets.find((item) => item.id === presetId);
    if (!preset) return;
    setMode(preset.mode);
    setInput(preset.input);
    setResult(null);
    setView("solution");
    setError("");
    setMessage(`${preset.label} is loaded. Run the simulation to inspect its numerical solution.`);
  }

  function changeMode(nextMode: OdeMode) {
    setMode(nextMode);
    setResult(null);
    setView("solution");
    setError("");
    setMessage(nextMode === "single" ? "Single first-order ODE mode uses y′ = f(x, y)." : "Two-state system mode uses y′ = f(x, y, z) and z′ = g(x, y, z).");
  }

  function runSimulation() {
    try {
      const x0 = parseInput(input.x0, "Initial x");
      const y0 = parseInput(input.y0, "Initial y");
      const xEnd = parseInput(input.xEnd, "Final x");
      const step = parseInput(input.step, "Step size");

      const next = mode === "single"
        ? solveSingleOde({ derivative: input.derivativeY, x0, y0, xEnd, step, method })
        : solveTwoStateSystem({ derivativeY: input.derivativeY, derivativeZ: input.derivativeZ, x0, y0, z0: parseInput(input.z0, "Initial z"), xEnd, step, method });

      setResult(next);
      setError("");
      setView("solution");
      setMessage(`${methodLabels[method]} completed ${next.stepCount} numerical steps. Results are approximations, not symbolic proofs.`);
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "The simulation could not run.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="research" />
      <section className={styles.hero}>
        <p>RESEARCH & SIMULATION LAB</p>
        <h1>Differential equation solver for numerical models.</h1>
        <span>Model first-order ordinary differential equations and two-state systems with Euler, Improved Euler, and RK4. Inspect solution curves, phase plots, and numerical tables directly in your browser.</span>
      </section>

      <section className={styles.workspace} aria-label="Differential equation numerical workspace">
        <article className={styles.resultCard}>
          <div className={styles.panelHeading}>
            <div>
              <p>NUMERICAL OUTPUT</p>
              <h2>{result ? "Solution preview" : "Ready to simulate"}</h2>
            </div>
            <span className={styles.methodBadge}>{methodLabels[method]}</span>
          </div>

          {result && finalPoint ? (
            <>
              <div className={styles.metricRow}>
                <div><span>Final x</span><strong>{format(finalPoint.x)}</strong></div>
                <div><span>Final y</span><strong>{format(finalPoint.y)}</strong></div>
                {result.mode === "system" ? <div><span>Final z</span><strong>{format(finalPoint.z)}</strong></div> : null}
                <div><span>Steps</span><strong>{result.stepCount}</strong></div>
              </div>
              <div className={styles.viewTabs} role="tablist" aria-label="Solution views">
                {availableViews.map((item) => (
                  <button className={view === item ? styles.activeTab : ""} key={item} onClick={() => setView(item)} type="button">{item === "solution" ? "Solution" : item === "phase" ? "Phase plot" : "Table"}</button>
                ))}
              </div>
              {view === "table" ? (
                <div className={styles.tableWrap}>
                  <table>
                    <thead><tr><th>x</th><th>y</th>{result.mode === "system" ? <th>z</th> : null}</tr></thead>
                    <tbody>{sampleRows(result.points).map((point, index) => <tr key={`${point.x}-${index}`}><td>{format(point.x)}</td><td>{format(point.y)}</td>{result.mode === "system" ? <td>{format(point.z)}</td> : null}</tr>)}</tbody>
                  </table>
                </div>
              ) : <SolutionPlot result={result} view={view} />}
              {result.warning ? <p className={styles.warning}>{result.warning}</p> : null}
            </>
          ) : (
            <div className={styles.emptyResult}><span>dy/dx</span><p>Set the equation, initial values, interval, and method. Your graph, final values, and table will appear here.</p></div>
          )}
          <p className={error ? styles.errorMessage : styles.statusMessage}>{error || message}</p>
        </article>

        <article className={styles.controlCard}>
          <div className={styles.panelHeading}>
            <div><p>MODEL SETUP</p><h2>Build the numerical experiment</h2></div>
            <button className={styles.clearButton} onClick={() => { setInput(initialInput); setMode("single"); setResult(null); setError(""); setMessage("Model reset to the starting example."); }} type="button">Reset</button>
          </div>

          <div className={styles.modeToggle}>
            <button className={mode === "single" ? styles.activeMode : ""} onClick={() => changeMode("single")} type="button"><strong>First-order ODE</strong><span>y′ = f(x, y)</span></button>
            <button className={mode === "system" ? styles.activeMode : ""} onClick={() => changeMode("system")} type="button"><strong>Two-state system</strong><span>y′ and z′</span></button>
          </div>

          <div className={styles.presetRow} aria-label="Numerical model examples">
            <span>Examples</span>
            <div>{presets.map((preset) => <button key={preset.id} onClick={() => loadPreset(preset.id)} type="button">{preset.label}</button>)}</div>
          </div>

          <div className={styles.equationStack}>
            <label><span>dy/dx = f(x, y{mode === "system" ? ", z" : ""})</span><input value={input.derivativeY} onChange={(event) => updateInput("derivativeY", event.target.value)} placeholder="Example: -2*y + sin(x)" spellCheck={false} /></label>
            {mode === "system" ? <label><span>dz/dx = g(x, y, z)</span><input value={input.derivativeZ} onChange={(event) => updateInput("derivativeZ", event.target.value)} placeholder="Example: -y" spellCheck={false} /></label> : null}
          </div>

          <div className={styles.fieldGrid}>
            <label><span>Initial x</span><input inputMode="decimal" value={input.x0} onChange={(event) => updateInput("x0", event.target.value)} /></label>
            <label><span>Initial y</span><input inputMode="decimal" value={input.y0} onChange={(event) => updateInput("y0", event.target.value)} /></label>
            {mode === "system" ? <label><span>Initial z</span><input inputMode="decimal" value={input.z0} onChange={(event) => updateInput("z0", event.target.value)} /></label> : null}
            <label><span>Final x</span><input inputMode="decimal" value={input.xEnd} onChange={(event) => updateInput("xEnd", event.target.value)} /></label>
            <label><span>Step size</span><input inputMode="decimal" value={input.step} onChange={(event) => updateInput("step", event.target.value)} /></label>
            <label><span>Method</span><select value={method} onChange={(event) => setMethod(event.target.value as OdeMethod)}>{(Object.keys(methodLabels) as OdeMethod[]).map((item) => <option key={item} value={item}>{methodLabels[item]}</option>)}</select></label>
          </div>

          <button className={styles.runButton} onClick={runSimulation} type="button">Run numerical simulation <span>→</span></button>
          <div className={styles.assumptionNote}><p>METHOD NOTE</p><span>Euler is fast but less accurate. Heun improves the slope estimate. RK4 is a strong general-purpose fixed-step method. All outputs are numerical approximations.</span></div>
        </article>
      </section>

      <section className={styles.methodStrip}>
        <article><span>01</span><h2>Choose the model</h2><p>Enter the right-hand side only, such as <code>-2*y + sin(x)</code>. Use x, y, and z with supported functions.</p></article>
        <article><span>02</span><h2>Set initial conditions</h2><p>Specify where the numerical experiment begins, its final x value, and a controlled step size.</p></article>
        <article><span>03</span><h2>Inspect the approximation</h2><p>Compare curves, phase behavior, and tables. Reduce the step size when accuracy needs checking.</p></article>
      </section>
    </main>
  );
}
