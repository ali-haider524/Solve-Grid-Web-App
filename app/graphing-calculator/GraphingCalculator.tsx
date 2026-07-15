"use client";

import { all, create } from "mathjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./GraphingCalculator.module.css";

type AngleMode = "DEG" | "RAD";
type ViewMode = "graph" | "table" | "analysis";
type EquationKind = "function" | "vertical" | "empty";

type GraphWindow = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type Equation = {
  id: string;
  label: string;
  expression: string;
  visible: boolean;
  color: string;
};

type CompiledEquation = Equation & {
  kind: EquationKind;
  error: string | null;
  verticalX: number | null;
  evaluate: (x: number) => number | null;
};

const math = create(all, {
  number: "number",
  matrix: "Array",
  predictable: false,
});

const DEFAULT_WINDOW: GraphWindow = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

const INITIAL_EQUATIONS: Equation[] = [
  {
    id: "line-1",
    label: "y₁",
    expression: "x^2 - 4",
    visible: true,
    color: "#3157e8",
  },
  {
    id: "line-2",
    label: "y₂",
    expression: "sin(x)",
    visible: true,
    color: "#e56739",
  },
];

const EQUATION_COLORS = ["#3157e8", "#e56739", "#16a173", "#9a4fd7", "#d34473", "#be7a10", "#0087a8", "#7652d7"];
const MAX_EQUATIONS = 8;

const GRAPH_TEMPLATES = [
  { label: "Line", expression: "2x + 1" },
  { label: "Parabola", expression: "x^2 - 4" },
  { label: "Sine", expression: "sin(x)" },
  { label: "Cosine", expression: "cos(x)" },
  { label: "Absolute", expression: "abs(x)" },
  { label: "Vertical", expression: "x = 2" },
];

const ALLOWED_IDENTIFIERS = new Set([
  "x",
  "pi",
  "e",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "log",
  "ln",
  "abs",
  "exp",
]);

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [equations, setEquations] = useState<Equation[]>(INITIAL_EQUATIONS);
  const [graphWindow, setGraphWindow] = useState<GraphWindow>(DEFAULT_WINDOW);
  const [angleMode, setAngleMode] = useState<AngleMode>("RAD");
  const [viewMode, setViewMode] = useState<ViewMode>("graph");
  const [traceX, setTraceX] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [message, setMessage] = useState("Two example graphs are ready. Add up to eight equations, edit them freely, and compare them in one view.");

  const compiledEquations = useMemo<CompiledEquation[]>(() => {
    return equations.map((equation) => compileEquation(equation, angleMode));
  }, [equations, angleMode]);

  const traceValues = useMemo(() => {
    return compiledEquations
      .filter((equation) => equation.visible && !equation.error && equation.kind === "function")
      .map((equation) => ({
        id: equation.id,
        label: equation.label,
        color: equation.color,
        value: equation.evaluate(traceX),
      }));
  }, [compiledEquations, traceX]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.floor(bounds.width));
    const height = Math.max(300, Math.floor(bounds.height));
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    drawGrid(context, width, height, graphWindow);

    const xToPixel = (x: number) =>
      ((x - graphWindow.xMin) / (graphWindow.xMax - graphWindow.xMin)) * width;
    const yToPixel = (y: number) =>
      height - ((y - graphWindow.yMin) / (graphWindow.yMax - graphWindow.yMin)) * height;

    for (const equation of compiledEquations) {
      if (!equation.visible || equation.error || equation.kind === "empty") continue;

      context.lineWidth = 2.4;
      context.strokeStyle = equation.color;

      if (equation.kind === "vertical" && equation.verticalX !== null) {
        if (equation.verticalX < graphWindow.xMin || equation.verticalX > graphWindow.xMax) continue;
        const pixelX = xToPixel(equation.verticalX);
        context.beginPath();
        context.moveTo(pixelX, 0);
        context.lineTo(pixelX, height);
        context.stroke();
        continue;
      }

      context.beginPath();
      let canContinuePath = false;
      let previousY = 0;
      const sampleCount = Math.max(420, Math.min(1800, Math.round(width * 1.7)));

      for (let index = 0; index <= sampleCount; index += 1) {
        const x =
          graphWindow.xMin +
          (index / sampleCount) * (graphWindow.xMax - graphWindow.xMin);
        const y = equation.evaluate(x);

        if (y === null || !Number.isFinite(y)) {
          canContinuePath = false;
          continue;
        }

        const pixelX = xToPixel(x);
        const pixelY = yToPixel(y);
        const hasLargeJump = Math.abs(pixelY - previousY) > height * 1.25;

        if (!canContinuePath || hasLargeJump) {
          context.moveTo(pixelX, pixelY);
          canContinuePath = true;
        } else {
          context.lineTo(pixelX, pixelY);
        }

        previousY = pixelY;
      }

      context.stroke();
    }

    if (traceX >= graphWindow.xMin && traceX <= graphWindow.xMax) {
      const tracePixelX = xToPixel(traceX);

      context.save();
      context.setLineDash([6, 5]);
      context.strokeStyle = "rgba(20, 32, 58, 0.42)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(tracePixelX, 0);
      context.lineTo(tracePixelX, height);
      context.stroke();
      context.restore();

      for (const traceValue of traceValues) {
        if (
          traceValue.value === null ||
          traceValue.value < graphWindow.yMin ||
          traceValue.value > graphWindow.yMax
        ) {
          continue;
        }

        context.beginPath();
        context.fillStyle = traceValue.color;
        context.arc(tracePixelX, yToPixel(traceValue.value), 4.5, 0, Math.PI * 2);
        context.fill();
      }
    }
  }, [compiledEquations, graphWindow, traceValues, traceX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => drawGraph());
    observer.observe(canvas);
    drawGraph();

    return () => observer.disconnect();
  }, [drawGraph]);

  function updateEquation(id: string, patch: Partial<Equation>) {
    setEquations((currentEquations) =>
      currentEquations.map((equation) =>
        equation.id === id ? { ...equation, ...patch } : equation,
      ),
    );
  }

  function addEquation(expression?: string) {
    if (equations.length >= MAX_EQUATIONS) {
      setMessage("Eight graph lines are available in this version.");
      return;
    }

    setEquations((currentEquations) => {
      const nextIndex = currentEquations.length;
      const nextExpression = expression ?? "";

      return [
        ...currentEquations,
        {
          id: `line-${Date.now()}-${nextIndex}`,
          label: `y${toSubscript(nextIndex + 1)}`,
          expression: nextExpression,
          visible: true,
          color: EQUATION_COLORS[nextIndex % EQUATION_COLORS.length],
        },
      ];
    });

    setMessage(expression ? "Example graph line added." : "A blank equation line was added. Enter any supported expression.");
  }

  function clearToExamples() {
    setEquations(INITIAL_EQUATIONS);
    setTraceX(0);
    setMessage("Reset to the two example graphs.");
  }

  function removeEquation(id: string) {
    if (equations.length === 1) {
      setMessage("Keep at least one equation line available.");
      return;
    }

    setEquations((currentEquations) =>
      currentEquations.filter((equation) => equation.id !== id),
    );
  }

  function changeWindow(field: keyof GraphWindow, value: string) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;

    setGraphWindow((currentWindow) => {
      const nextWindow = { ...currentWindow, [field]: numericValue };
      if (nextWindow.xMin >= nextWindow.xMax || nextWindow.yMin >= nextWindow.yMax) {
        return currentWindow;
      }
      return nextWindow;
    });
  }

  function zoomGraph(multiplier: number) {
    setGraphWindow((currentWindow) => {
      const xCenter = (currentWindow.xMin + currentWindow.xMax) / 2;
      const yCenter = (currentWindow.yMin + currentWindow.yMax) / 2;
      const xHalfRange = ((currentWindow.xMax - currentWindow.xMin) / 2) * multiplier;
      const yHalfRange = ((currentWindow.yMax - currentWindow.yMin) / 2) * multiplier;

      return {
        xMin: roundWindowValue(xCenter - xHalfRange),
        xMax: roundWindowValue(xCenter + xHalfRange),
        yMin: roundWindowValue(yCenter - yHalfRange),
        yMax: roundWindowValue(yCenter + yHalfRange),
      };
    });
  }

  function resetGraph() {
    setGraphWindow(DEFAULT_WINDOW);
    setTraceX(0);
    setMessage("Graph window reset.");
  }

  function handleCanvasPointer(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const ratio = Math.min(1, Math.max(0, pointerX / bounds.width));
    const x = graphWindow.xMin + ratio * (graphWindow.xMax - graphWindow.xMin);
    setTraceX(roundWindowValue(x));
  }

  const tableRows = useMemo(() => {
    const center = Math.round(traceX);

    return Array.from({ length: 11 }, (_, index) => {
      const x = center - 5 + index;
      return {
        x,
        values: compiledEquations.map((equation) => ({
          id: equation.id,
          value:
            equation.visible && !equation.error && equation.kind === "function"
              ? equation.evaluate(x)
              : null,
        })),
      };
    });
  }, [compiledEquations, traceX]);

  const analysis = useMemo(() => {
    const validFunctions = compiledEquations.filter((equation) => equation.visible && !equation.error && equation.kind === "function");
    const roots = validFunctions.map((equation) => ({
      id: equation.id,
      label: equation.label,
      color: equation.color,
      roots: findApproximateRoots(equation.evaluate, graphWindow, 5),
    }));
    const intersections: Array<{ key: string; label: string; points: Array<{ x: number; y: number }> }> = [];
    for (let first = 0; first < validFunctions.length; first += 1) {
      for (let second = first + 1; second < validFunctions.length; second += 1) {
        intersections.push({
          key: `${validFunctions[first].id}-${validFunctions[second].id}`,
          label: `${validFunctions[first].label} ∩ ${validFunctions[second].label}`,
          points: findApproximateIntersections(validFunctions[first].evaluate, validFunctions[second].evaluate, graphWindow, 4),
        });
      }
    }
    return { roots, intersections };
  }, [compiledEquations, graphWindow]);

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="math" />
      <div className={styles.container}>
        <section className={styles.intro}>
          <p>FREE ONLINE GRAPHING CALCULATOR</p>
          <h1>Graph equations online, compare functions, and inspect values.</h1>
          <span>
            Plot up to eight lines, polynomials, trigonometric functions, roots,
            logarithms, absolute values, rational functions, and vertical lines.
            Then use the graph, table, trace, and analysis views to understand how
            the functions behave in the current window.
          </span>
        </section>

        <section className={styles.workspace}>
          <aside className={styles.controlPanel} id="equations">
            <div className={styles.panelHeading}>
              <div>
                <p>FUNCTION LIST</p>
                <h2>Equations</h2>
              </div>
              <div className={styles.panelActions}>
                <button className={styles.resetListButton} onClick={clearToExamples} type="button">
                  Reset
                </button>
                <button className={styles.addButton} onClick={() => addEquation()} type="button">
                  + Add blank
                </button>
              </div>
            </div>

            <p className={styles.inputGuide}>
              Use <code>y = 2x + 1</code>, <code>y2 = sin(x)</code>, or <code>x = 3</code> for a vertical line.
            </p>

            <div className={styles.templateRow} aria-label="Quick graph templates">
              {GRAPH_TEMPLATES.map((template) => (
                <button key={template.label} onClick={() => addEquation(template.expression)} type="button">
                  {template.label}
                </button>
              ))}
            </div>

            <div className={styles.equationList}>
              {compiledEquations.map((equation) => (
                <div className={styles.equationRow} key={equation.id}>
                  <button
                    className={styles.visibilityButton}
                    style={{ "--equation-color": equation.color } as React.CSSProperties}
                    onClick={() => updateEquation(equation.id, { visible: !equation.visible })}
                    type="button"
                    aria-label={`Toggle ${equation.label} visibility`}
                    aria-pressed={equation.visible}
                  >
                    <span className={equation.visible ? styles.visibleDot : styles.hiddenDot} />
                  </button>

                  <span className={styles.equationLabel}>{equation.label}</span>

                  <input
                    aria-label={`${equation.label} colour`}
                    className={styles.colorPicker}
                    onChange={(event) => updateEquation(equation.id, { color: event.target.value })}
                    type="color"
                    value={equation.color}
                  />

                  <input
                    aria-label={`${equation.label} expression`}
                    className={equation.error ? styles.invalidInput : styles.equationInput}
                    value={equation.expression}
                    onChange={(event) =>
                      updateEquation(equation.id, { expression: event.target.value })
                    }
                    placeholder="Example: 2x + 1"
                    spellCheck={false}
                  />

                  <button
                    className={styles.removeButton}
                    onClick={() => removeEquation(equation.id)}
                    type="button"
                    aria-label={`Remove ${equation.label}`}
                  >
                    ×
                  </button>

                  {equation.error ? <p className={styles.equationError}>{equation.error}</p> : null}
                </div>
              ))}
            </div>

            <div className={styles.toolGroup}>
              <button
                className={styles.toolButton}
                onClick={() => setAngleMode((mode) => (mode === "RAD" ? "DEG" : "RAD"))}
                type="button"
              >
                Angle mode <strong>{angleMode}</strong>
              </button>

              <button
                className={styles.toolButton}
                onClick={() => setSettingsOpen((isOpen) => !isOpen)}
                type="button"
                aria-expanded={settingsOpen}
              >
                Window settings <strong>{settingsOpen ? "Hide" : "Open"}</strong>
              </button>
            </div>

            {settingsOpen ? (
              <div className={styles.windowSettings}>
                <label>
                  X min
                  <input type="number" value={graphWindow.xMin} onChange={(event) => changeWindow("xMin", event.target.value)} />
                </label>
                <label>
                  X max
                  <input type="number" value={graphWindow.xMax} onChange={(event) => changeWindow("xMax", event.target.value)} />
                </label>
                <label>
                  Y min
                  <input type="number" value={graphWindow.yMin} onChange={(event) => changeWindow("yMin", event.target.value)} />
                </label>
                <label>
                  Y max
                  <input type="number" value={graphWindow.yMax} onChange={(event) => changeWindow("yMax", event.target.value)} />
                </label>
              </div>
            ) : null}
          </aside>

          <article className={styles.graphPanel}>
            <div className={styles.graphToolbar}>
              <div>
                <p>G1 GRAPHING STUDIO</p>
                <h2>{viewMode === "graph" ? "Interactive graph" : viewMode === "table" ? "Value table" : "Graph analysis"}</h2>
              </div>
              <div className={styles.statusBadge} aria-live="polite">
                <span />
                {message}
              </div>
            </div>

            <div className={styles.viewTabs}>
              <button className={viewMode === "graph" ? styles.activeTab : styles.tab} onClick={() => setViewMode("graph")} type="button">Graph</button>
              <button className={viewMode === "table" ? styles.activeTab : styles.tab} onClick={() => setViewMode("table")} type="button">Table</button>
              <button className={viewMode === "analysis" ? styles.activeTab : styles.tab} onClick={() => setViewMode("analysis")} type="button">Analysis</button>
              <div className={styles.graphActions}>
                <a className={styles.editEquationsLink} href="#equations">Equations</a>
                <button onClick={() => zoomGraph(0.65)} type="button">Zoom in</button>
                <button onClick={() => zoomGraph(1.5)} type="button">Zoom out</button>
                <button onClick={resetGraph} type="button">Reset</button>
              </div>
            </div>

            {viewMode === "graph" ? (
              <div className={styles.canvasShell}>
                <canvas
                  className={styles.canvas}
                  ref={canvasRef}
                  onPointerDown={handleCanvasPointer}
                  aria-label="Interactive coordinate graph. Tap or click to trace a value."
                />
                <p className={styles.canvasHint}>Tap the graph to trace an x value.</p>
              </div>
            ) : viewMode === "table" ? (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>x</th>
                      {compiledEquations.map((equation) => <th key={equation.id}>{equation.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.x}>
                        <td>{formatValue(row.x)}</td>
                        {row.values.map((item) => <td key={item.id}>{formatValue(item.value)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.analysisPanel}>
                <section>
                  <div className={styles.analysisHeading}><p>X-INTERCEPTS</p><span>Approximate values in the current graph window</span></div>
                  {analysis.roots.length ? analysis.roots.map((item) => (
                    <div className={styles.analysisRow} key={item.id}>
                      <b><i style={{ backgroundColor: item.color }} />{item.label}</b>
                      <span>{item.roots.length ? item.roots.map((root) => `x ≈ ${formatValue(root)}`).join(", ") : "No x-intercept found in this window"}</span>
                    </div>
                  )) : <p className={styles.analysisEmpty}>Add at least one valid visible function to analyse roots.</p>}
                </section>
                <section>
                  <div className={styles.analysisHeading}><p>INTERSECTIONS</p><span>Approximate crossing points for visible function pairs</span></div>
                  {analysis.intersections.length ? analysis.intersections.map((item) => (
                    <div className={styles.analysisRow} key={item.key}>
                      <b>{item.label}</b>
                      <span>{item.points.length ? item.points.map((point) => `(${formatValue(point.x)}, ${formatValue(point.y)})`).join(", ") : "No crossing found in this window"}</span>
                    </div>
                  )) : <p className={styles.analysisEmpty}>Add two valid visible functions to analyse intersections.</p>}
                </section>
              </div>
            )}

            <div className={styles.tracePanel}>
              <div>
                <p>TRACE</p>
                <strong>x = {formatValue(traceX)}</strong>
              </div>
              <input aria-label="Trace x value" type="range" min={graphWindow.xMin} max={graphWindow.xMax} step={(graphWindow.xMax - graphWindow.xMin) / 240} value={traceX} onChange={(event) => setTraceX(Number(event.target.value))} />
              <div className={styles.traceValues}>
                {traceValues.length === 0 ? (
                  <span>Enter a valid visible function to trace.</span>
                ) : (
                  traceValues.map((item) => (
                    <span key={item.id}><i style={{ backgroundColor: item.color }} />{item.label}: {formatValue(item.value)}</span>
                  ))
                )}
              </div>
            </div>
          </article>
        </section>

        <section className={styles.learningSection}>
          <div>
            <p>BUILT FOR REAL MATH WORK</p>
            <h2>Whether you need a graphing calculator or a graph solver online, Use this graphing calculator to compare and analyze equations, tables, roots, and intersections.</h2>
          </div>
          <p>
            Add up to eight functions or vertical lines, then move between Graph, Table, and
            Analysis views. Use the Equation Solver when you need an algebraic solution,
            the Polynomial Solver for higher-degree roots, and the Statistics Calculator for
            raw-data summaries and regression.
          </p>
        </section>

        <section className={styles.graphingGuide} aria-labelledby="graphing-guide-title">
          <header className={styles.guideHeader}>
            <div>
              <p>HOW THIS GRAPHING CALCULATOR HELPS</p>
              <h2 id="graphing-guide-title">Choose the view that answers your math question.</h2>
            </div>
            <span>
              A graph is most useful when you know what you are looking for: the shape of a
              function, a value at a chosen x-coordinate, an x-intercept, or the point where
              two equations meet.
            </span>
          </header>

          <div className={styles.featureGrid}>
            <article>
              <b>01</b>
              <h3>Plot multiple equations</h3>
              <p>
                Enter one relationship per line, including <code>y = 2x + 1</code>,
                <code>y = x^2 - 4</code>, or a vertical line such as <code>x = 3</code>.
                Keep lines visible to compare them in the same coordinate window.
              </p>
            </article>
            <article>
              <b>02</b>
              <h3>Inspect a value table</h3>
              <p>
                Switch to Table view to see calculated y-values around the current trace
                position. This is useful when a curve is close to an axis or when you want
                to compare function outputs at the same x-values.
              </p>
            </article>
            <article>
              <b>03</b>
              <h3>Trace points on a curve</h3>
              <p>
                Tap or click the graph, or move the trace slider, to inspect the current
                x-value and the visible function values at that point.
              </p>
            </article>
            <article>
              <b>04</b>
              <h3>Estimate roots and intersections</h3>
              <p>
                Open Analysis to find approximate x-intercepts and crossing points for the
                visible functions inside the current graph window.
              </p>
            </article>
            <article>
              <b>05</b>
              <h3>Adjust the graph window</h3>
              <p>
                Change x-min, x-max, y-min, and y-max when an important part of a curve is
                outside the view, appears too flat, or needs a closer comparison.
              </p>
            </article>
            <article>
              <b>06</b>
              <h3>Use degrees or radians</h3>
              <p>
                Choose the correct angle mode before graphing sine, cosine, tangent, or
                inverse trigonometric functions. A correct expression can look wrong when
                the angle mode does not match the question.
              </p>
            </article>
          </div>

          <div className={styles.methodGrid}>
            <article>
              <p>STEP 1</p>
              <h3>Enter a clear expression</h3>
              <span>
                Use <code>x^2</code> for a square, <code>sqrt(x)</code> for a square root,
                <code>sin(x)</code> for sine, and parentheses to make grouping clear.
              </span>
            </article>
            <article>
              <p>STEP 2</p>
              <h3>Choose a sensible window</h3>
              <span>
                Begin with the default view, then zoom or edit the window. For trigonometry
                in degree mode, a wider x-range such as −360 to 360 can reveal a full cycle.
              </span>
            </article>
            <article>
              <p>STEP 3</p>
              <h3>Read graph, table, and analysis together</h3>
              <span>
                Use the graph to understand shape, the table to compare exact sampled values,
                and Analysis to estimate roots and intersections in the selected window.
              </span>
            </article>
            <article>
              <p>STEP 4</p>
              <h3>Verify important answers</h3>
              <span>
                Graph analysis is numerical and window-dependent. For an exact algebraic
                answer, check the result with the Equation Solver or Polynomial Solver.
              </span>
            </article>
          </div>

          <div className={styles.exampleHeader}>
            <div>
              <p>WORKED GRAPHING EXAMPLES</p>
              <h2>Three ways to use the same workspace.</h2>
            </div>
            <span>These examples use only features that are available on this page.</span>
          </div>

          <div className={styles.exampleGrid}>
            <article>
              <span>EXAMPLE 1</span>
              <h3>Compare a line and a parabola</h3>
              <p className={styles.equationLine}>y = x² − 4 &nbsp; and &nbsp; y = 2x + 1</p>
              <p>
                Enter both equations, keep the default graph window, and open Analysis.
                The curves cross at approximately <strong>(−1.449, −1.899)</strong> and
                <strong>(3.449, 7.899)</strong>. Use Table view near either x-value to check
                that both outputs are close.
              </p>
            </article>
            <article>
              <span>EXAMPLE 2</span>
              <h3>See where a square-root graph begins</h3>
              <p className={styles.equationLine}>y = sqrt(x) &nbsp; and &nbsp; y = x / 2</p>
              <p>
                The square-root function is only defined for x values of zero or greater in
                this real-number workspace. The visible intersections are
                <strong>(0, 0)</strong> and <strong>(4, 2)</strong>, which the graph and
                table help you verify.
              </p>
            </article>
            <article>
              <span>EXAMPLE 3</span>
              <h3>Compare a trig function with a target value</h3>
              <p className={styles.equationLine}>y = sin(x) &nbsp; and &nbsp; y = 0.5</p>
              <p>
                Switch to DEG mode and set the x-window to roughly −360 through 360. Analysis
                shows the repeating places where sine reaches 0.5; within one cycle they occur
                near <strong>30°</strong> and <strong>150°</strong>.
              </p>
            </article>
          </div>

          <aside className={styles.accuracyNote}>
            <div>
              <p>ABOUT ROOTS AND INTERSECTIONS</p>
              <h3>Use the graph to explore; use an algebra tool to confirm.</h3>
            </div>
            <p>
              Roots and intersections shown in Analysis are numerical estimates based on the
              visible graph window and sampling. They are useful for checking a function,
              choosing a starting point, and understanding a curve. For an equation that needs
              an exact or higher-precision solution, continue with the
              <a href="/equation-solver"> Equation Solver</a> or
              <a href="/polynomial-solver"> Polynomial Solver</a>.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}

function compileEquation(equation: Equation, angleMode: AngleMode): CompiledEquation {
  const parsed = parseEquation(equation.expression);

  if (parsed.kind === "empty") {
    return { ...equation, kind: "empty", error: null, verticalX: null, evaluate: () => null };
  }

  try {
    validateExpression(parsed.expression);
    const compiled = math.compile(parsed.expression);

    if (parsed.kind === "vertical") {
      const value = compiled.evaluate(createGraphScope(0, angleMode));
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error("Use a finite value after x =.");
      }
      return { ...equation, kind: "vertical", error: null, verticalX: value, evaluate: () => null };
    }

    return {
      ...equation,
      kind: "function",
      error: null,
      verticalX: null,
      evaluate: (x: number) => {
        try {
          const value = compiled.evaluate(createGraphScope(x, angleMode));
          return typeof value === "number" && Number.isFinite(value) ? value : null;
        } catch {
          return null;
        }
      },
    };
  } catch (error) {
    return {
      ...equation,
      kind: parsed.kind,
      error: error instanceof Error ? error.message : "Invalid equation.",
      verticalX: null,
      evaluate: () => null,
    };
  }
}

function parseEquation(expression: string): { kind: EquationKind; expression: string } {
  let normalized = normalizeExpression(expression);

  if (!normalized) {
    return { kind: "empty", expression: "" };
  }

  const verticalMatch = normalized.match(/^x\s*=\s*(.+)$/i);

  if (verticalMatch) {
    return { kind: "vertical", expression: verticalMatch[1] };
  }

  const functionMatch = normalized.match(
    /^(?:y(?:\d+|[₀₁₂₃₄₅₆₇₈₉]+)?|f\s*\(\s*x\s*\))\s*=\s*(.+)$/i,
  );

  if (functionMatch) {
    normalized = functionMatch[1];
  }

  return { kind: "function", expression: normalized };
}

function createGraphScope(x: number, angleMode: AngleMode) {
  const toRadians = (value: number) =>
    angleMode === "DEG" ? (value * Math.PI) / 180 : value;
  const fromRadians = (value: number) =>
    angleMode === "DEG" ? (value * 180) / Math.PI : value;

  return {
    x,
    pi: Math.PI,
    e: Math.E,
    sin: (value: number) => Math.sin(toRadians(value)),
    cos: (value: number) => Math.cos(toRadians(value)),
    tan: (value: number) => Math.tan(toRadians(value)),
    asin: (value: number) => fromRadians(Math.asin(value)),
    acos: (value: number) => fromRadians(Math.acos(value)),
    atan: (value: number) => fromRadians(Math.atan(value)),
    sqrt: (value: number) => (value < 0 ? Number.NaN : Math.sqrt(value)),
    log: (value: number) => (value <= 0 ? Number.NaN : Math.log10(value)),
    ln: (value: number) => (value <= 0 ? Number.NaN : Math.log(value)),
    abs: (value: number) => Math.abs(value),
    exp: (value: number) => Math.exp(value),
  };
}

function normalizeExpression(expression: string) {
  let normalized = expression
    .trim()
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt")
    .replaceAll("²", "^2")
    .replaceAll("³", "^3");

  const functions = "sin|cos|tan|asin|acos|atan|sqrt|log|ln|abs|exp";

  normalized = normalized
    .replace(/(\d)(x|pi|\()/gi, "$1*$2")
    .replace(/(x|pi|\))(\d|\()/gi, "$1*$2")
    .replace(/\)(x|pi)/gi, ")*$1")
    .replace(new RegExp(`(\\d)(${functions})\\b`, "gi"), "$1*$2")
    .replace(new RegExp(`(x|pi|\\))(${functions})\\b`, "gi"), "$1*$2");

  return normalized;
}

function validateExpression(expression: string) {
  if (expression.length > 180) throw new Error("Equation is too long.");
  if (!/^[0-9A-Za-z_+\-*/^%().\s]+$/.test(expression)) {
    throw new Error("Use valid graph symbols only.");
  }

  const withoutNumbers = expression.replace(/\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi, "0");
  const identifiers = withoutNumbers.match(/[A-Za-z_]\w*/g) ?? [];

  for (const identifier of identifiers) {
    if (!ALLOWED_IDENTIFIERS.has(identifier.toLowerCase())) {
      throw new Error(`"${identifier}" is not supported.`);
    }
  }
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number, graphWindow: GraphWindow) {
  const xToPixel = (x: number) => ((x - graphWindow.xMin) / (graphWindow.xMax - graphWindow.xMin)) * width;
  const yToPixel = (y: number) => height - ((y - graphWindow.yMin) / (graphWindow.yMax - graphWindow.yMin)) * height;
  const xStep = niceStep((graphWindow.xMax - graphWindow.xMin) / 10);
  const yStep = niceStep((graphWindow.yMax - graphWindow.yMin) / 8);

  context.lineWidth = 1;
  context.strokeStyle = "#e5eaf2";
  for (let x = Math.ceil(graphWindow.xMin / xStep) * xStep; x <= graphWindow.xMax; x += xStep) {
    const pixelX = xToPixel(x);
    context.beginPath(); context.moveTo(pixelX, 0); context.lineTo(pixelX, height); context.stroke();
  }
  for (let y = Math.ceil(graphWindow.yMin / yStep) * yStep; y <= graphWindow.yMax; y += yStep) {
    const pixelY = yToPixel(y);
    context.beginPath(); context.moveTo(0, pixelY); context.lineTo(width, pixelY); context.stroke();
  }

  context.strokeStyle = "#55657e";
  context.lineWidth = 1.25;
  if (graphWindow.xMin <= 0 && graphWindow.xMax >= 0) {
    const axisX = xToPixel(0); context.beginPath(); context.moveTo(axisX, 0); context.lineTo(axisX, height); context.stroke();
  }
  if (graphWindow.yMin <= 0 && graphWindow.yMax >= 0) {
    const axisY = yToPixel(0); context.beginPath(); context.moveTo(0, axisY); context.lineTo(width, axisY); context.stroke();
  }

  context.fillStyle = "#60708a";
  context.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
  for (let x = Math.ceil(graphWindow.xMin / xStep) * xStep; x <= graphWindow.xMax; x += xStep) {
    if (Math.abs(x) < 0.0000001) continue;
    context.fillText(formatAxisValue(x), xToPixel(x) + 4, Math.min(height - 8, yToPixel(0) - 5));
  }
  for (let y = Math.ceil(graphWindow.yMin / yStep) * yStep; y <= graphWindow.yMax; y += yStep) {
    if (Math.abs(y) < 0.0000001) continue;
    context.fillText(formatAxisValue(y), Math.max(5, xToPixel(0) + 5), yToPixel(y) - 5);
  }
}

function niceStep(rawStep: number) {
  const exponent = Math.floor(Math.log10(rawStep));
  const fraction = rawStep / 10 ** exponent;
  const niceFraction = fraction >= 5 ? 5 : fraction >= 2 ? 2 : 1;
  return niceFraction * 10 ** exponent;
}

function formatAxisValue(value: number) { return Number(value.toPrecision(3)).toString(); }
function formatValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  const rounded = Number(value.toPrecision(8));
  return Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001)
    ? rounded.toExponential(3)
    : String(rounded);
}
function roundWindowValue(value: number) { return Number(value.toPrecision(8)); }
function toSubscript(value: number) { return String(value).replace(/\d/g, (digit) => "₀₁₂₃₄₅₆₇₈₉"[Number(digit)]); }


function findApproximateRoots(evaluate: (x: number) => number | null, graphWindow: GraphWindow, limit: number) {
  return findApproximateCrossings(evaluate, () => 0, graphWindow, limit).map((point) => point.x);
}

function findApproximateIntersections(first: (x: number) => number | null, second: (x: number) => number | null, graphWindow: GraphWindow, limit: number) {
  return findApproximateCrossings(first, second, graphWindow, limit);
}

function findApproximateCrossings(first: (x: number) => number | null, second: (x: number) => number | null, graphWindow: GraphWindow, limit: number) {
  const points: Array<{ x: number; y: number }> = [];
  const sampleCount = 700;
  let previousX = graphWindow.xMin;
  let previousFirst = first(previousX);
  let previousSecond = second(previousX);
  let previousDifference = previousFirst === null || previousSecond === null ? null : previousFirst - previousSecond;

  for (let index = 1; index <= sampleCount; index += 1) {
    const currentX = graphWindow.xMin + (index / sampleCount) * (graphWindow.xMax - graphWindow.xMin);
    const currentFirst = first(currentX);
    const currentSecond = second(currentX);
    const currentDifference = currentFirst === null || currentSecond === null ? null : currentFirst - currentSecond;

    if (previousDifference !== null && currentDifference !== null && Number.isFinite(previousDifference) && Number.isFinite(currentDifference)) {
      const crossed = previousDifference === 0 || currentDifference === 0 || previousDifference * currentDifference < 0;
      if (crossed && Math.abs(previousDifference) < 1e6 && Math.abs(currentDifference) < 1e6) {
        let left = previousX; let right = currentX;
        for (let iteration = 0; iteration < 35; iteration += 1) {
          const middle = (left + right) / 2;
          const middleFirst = first(middle); const middleSecond = second(middle);
          if (middleFirst === null || middleSecond === null) break;
          const middleDifference = middleFirst - middleSecond;
          if (Math.abs(middleDifference) < 1e-9) { left = middle; right = middle; break; }
          if (previousDifference * middleDifference <= 0) right = middle; else { left = middle; previousDifference = middleDifference; }
        }
        const x = (left + right) / 2;
        const y = first(x);
        if (y !== null && Number.isFinite(y) && !points.some((point) => Math.abs(point.x - x) < 1e-4)) {
          points.push({ x: roundWindowValue(x), y: roundWindowValue(y) });
          if (points.length >= limit) break;
        }
      }
    }
    previousX = currentX; previousFirst = currentFirst; previousSecond = currentSecond; previousDifference = currentDifference;
  }
  return points;
}
