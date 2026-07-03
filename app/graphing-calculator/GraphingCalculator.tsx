"use client";

import { all, create } from "mathjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./GraphingCalculator.module.css";

type AngleMode = "DEG" | "RAD";
type ViewMode = "graph" | "table";

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
  error: string | null;
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
    id: "y1",
    label: "y₁",
    expression: "x^2 - 4",
    visible: true,
    color: "#3157e8",
  },
  {
    id: "y2",
    label: "y₂",
    expression: "sin(x)",
    visible: true,
    color: "#e56739",
  },
];

const EQUATION_COLORS = ["#3157e8", "#e56739", "#16a173", "#9a4fd7"];

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
  const [message, setMessage] = useState("Live graph ready");

  const compiledEquations = useMemo<CompiledEquation[]>(() => {
    return equations.map((equation) => compileEquation(equation, angleMode));
  }, [equations, angleMode]);

  const traceValues = useMemo(() => {
    return compiledEquations
      .filter((equation) => equation.visible && !equation.error)
      .map((equation) => ({
        id: equation.id,
        label: equation.label,
        color: equation.color,
        value: equation.evaluate(traceX),
      }));
  }, [compiledEquations, traceX]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(300, Math.floor(bounds.width));
    const height = Math.max(310, Math.floor(bounds.height));
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

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
      if (!equation.visible || equation.error) {
        continue;
      }

      context.beginPath();
      context.lineWidth = 2.4;
      context.strokeStyle = equation.color;

      let canContinuePath = false;
      let previousY = 0;
      const sampleCount = Math.max(420, Math.min(1500, Math.round(width * 1.5)));

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
        const hasLargeJump = Math.abs(pixelY - previousY) > height * 1.35;

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

    if (!canvas) {
      return;
    }

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

  function addEquation() {
    if (equations.length >= 4) {
      setMessage("Four graph lines are enough for the first version.");
      return;
    }

    const nextIndex = equations.length;

    setEquations((currentEquations) => [
      ...currentEquations,
      {
        id: `y${nextIndex + 1}`,
        label: `y${nextIndex + 1}`,
        expression: "",
        visible: true,
        color: EQUATION_COLORS[nextIndex],
      },
    ]);
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

    if (!Number.isFinite(numericValue)) {
      return;
    }

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
    setMessage("Graph window reset");
  }

  function handleCanvasPointer(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

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
          value: equation.visible && !equation.error ? equation.evaluate(x) : null,
        })),
      };
    });
  }, [compiledEquations, traceX]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <a className={styles.brand} href="/">
            <span className={styles.brandMark}>∑</span>
            <span>SolveGrid</span>
          </a>

          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="/scientific-calculator">Scientific</a>
            <a href="/">All tools</a>
          </nav>
        </header>

        <section className={styles.intro}>
          <p>FREE ONLINE GRAPHING CALCULATOR</p>
          <h1>Graph equations. Explore patterns. See the answer.</h1>
          <span>
            Plot functions, inspect tables, trace points, and adjust the graph
            window directly in your browser.
          </span>
        </section>

        <section className={styles.workspace}>
          <aside className={styles.controlPanel}>
            <div className={styles.panelHeading}>
              <div>
                <p>FUNCTION LIST</p>
                <h2>Equations</h2>
              </div>
              <button className={styles.addButton} onClick={addEquation} type="button">
                + Add
              </button>
            </div>

            <div className={styles.equationList}>
              {compiledEquations.map((equation) => (
                <div className={styles.equationRow} key={equation.id}>
                  <button
                    className={styles.visibilityButton}
                    style={{ "--equation-color": equation.color } as React.CSSProperties}
                    onClick={() =>
                      updateEquation(equation.id, { visible: !equation.visible })
                    }
                    type="button"
                    aria-label={`Toggle ${equation.label} visibility`}
                    aria-pressed={equation.visible}
                  >
                    <span className={equation.visible ? styles.visibleDot : styles.hiddenDot} />
                  </button>

                  <span className={styles.equationLabel}>{equation.label} =</span>

                  <input
                    aria-label={`${equation.label} expression`}
                    className={equation.error ? styles.invalidInput : styles.equationInput}
                    value={equation.expression}
                    onChange={(event) =>
                      updateEquation(equation.id, { expression: event.target.value })
                    }
                    placeholder="Example: x^2 - 4"
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

                  {equation.error && (
                    <p className={styles.equationError}>{equation.error}</p>
                  )}
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

            {settingsOpen && (
              <div className={styles.windowSettings}>
                <label>
                  X min
                  <input
                    type="number"
                    value={graphWindow.xMin}
                    onChange={(event) => changeWindow("xMin", event.target.value)}
                  />
                </label>
                <label>
                  X max
                  <input
                    type="number"
                    value={graphWindow.xMax}
                    onChange={(event) => changeWindow("xMax", event.target.value)}
                  />
                </label>
                <label>
                  Y min
                  <input
                    type="number"
                    value={graphWindow.yMin}
                    onChange={(event) => changeWindow("yMin", event.target.value)}
                  />
                </label>
                <label>
                  Y max
                  <input
                    type="number"
                    value={graphWindow.yMax}
                    onChange={(event) => changeWindow("yMax", event.target.value)}
                  />
                </label>
              </div>
            )}
          </aside>

          <article className={styles.graphPanel}>
            <div className={styles.graphToolbar}>
              <div>
                <p>G1 GRAPHING STUDIO</p>
                <h2>{viewMode === "graph" ? "Interactive graph" : "Value table"}</h2>
              </div>

              <div className={styles.statusBadge}>
                <span />
                {message}
              </div>
            </div>

            <div className={styles.viewTabs}>
              <button
                className={viewMode === "graph" ? styles.activeTab : styles.tab}
                onClick={() => setViewMode("graph")}
                type="button"
              >
                Graph
              </button>
              <button
                className={viewMode === "table" ? styles.activeTab : styles.tab}
                onClick={() => setViewMode("table")}
                type="button"
              >
                Table
              </button>

              <div className={styles.graphActions}>
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
                  aria-label="Interactive coordinate graph. Click to trace a value."
                />
                <p className={styles.canvasHint}>Click anywhere on the graph to trace x values.</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>x</th>
                      {compiledEquations.map((equation) => (
                        <th key={equation.id}>{equation.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.x}>
                        <td>{formatValue(row.x)}</td>
                        {row.values.map((item) => (
                          <td key={item.id}>{formatValue(item.value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className={styles.tracePanel}>
              <div>
                <p>TRACE</p>
                <strong>x = {formatValue(traceX)}</strong>
              </div>

              <input
                aria-label="Trace x value"
                type="range"
                min={graphWindow.xMin}
                max={graphWindow.xMax}
                step={(graphWindow.xMax - graphWindow.xMin) / 240}
                value={traceX}
                onChange={(event) => setTraceX(Number(event.target.value))}
              />

              <div className={styles.traceValues}>
                {traceValues.length === 0 ? (
                  <span>Enter a valid visible equation.</span>
                ) : (
                  traceValues.map((item) => (
                    <span key={item.id}>
                      <i style={{ backgroundColor: item.color }} />
                      {item.label}: {formatValue(item.value)}
                    </span>
                  ))
                )}
              </div>
            </div>
          </article>
        </section>

        <section className={styles.learningSection}>
          <div>
            <p>BUILT FOR REAL MATH WORK</p>
            <h2>Use expressions such as x^2 - 4, sin(x), sqrt(x), and 2*x + 1.</h2>
          </div>
          <p>
            SolveGrid G1 is an independent browser-based graphing workspace.
            Matrix, statistics, and probability will have their own focused
            tools instead of being squeezed into this graph screen.
          </p>
        </section>
      </div>
    </main>
  );
}

function compileEquation(equation: Equation, angleMode: AngleMode): CompiledEquation {
  const normalizedExpression = normalizeExpression(equation.expression);

  if (!normalizedExpression) {
    return {
      ...equation,
      error: "Enter an equation.",
      evaluate: () => null,
    };
  }

  try {
    validateExpression(normalizedExpression);
    const compiled = math.compile(normalizedExpression);

    return {
      ...equation,
      error: null,
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
      error: error instanceof Error ? error.message : "Invalid equation.",
      evaluate: () => null,
    };
  }
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
  return expression
    .trim()
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt");
}

function validateExpression(expression: string) {
  if (expression.length > 180) {
    throw new Error("Equation is too long.");
  }

  if (!/^[0-9A-Za-z_+\-*/^%().\s]+$/.test(expression)) {
    throw new Error("Use valid graph symbols only.");
  }

  const withoutNumbers = expression.replace(
    /\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi,
    "0",
  );

  const identifiers = withoutNumbers.match(/[A-Za-z_]\w*/g) ?? [];

  for (const identifier of identifiers) {
    if (!ALLOWED_IDENTIFIERS.has(identifier.toLowerCase())) {
      throw new Error(`"${identifier}" is not supported.`);
    }
  }
}

function drawGrid(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  graphWindow: GraphWindow,
) {
  const xToPixel = (x: number) =>
    ((x - graphWindow.xMin) / (graphWindow.xMax - graphWindow.xMin)) * width;

  const yToPixel = (y: number) =>
    height - ((y - graphWindow.yMin) / (graphWindow.yMax - graphWindow.yMin)) * height;

  const xStep = niceStep((graphWindow.xMax - graphWindow.xMin) / 10);
  const yStep = niceStep((graphWindow.yMax - graphWindow.yMin) / 8);

  context.lineWidth = 1;
  context.strokeStyle = "#e5eaf2";

  for (
    let x = Math.ceil(graphWindow.xMin / xStep) * xStep;
    x <= graphWindow.xMax;
    x += xStep
  ) {
    const pixelX = xToPixel(x);
    context.beginPath();
    context.moveTo(pixelX, 0);
    context.lineTo(pixelX, height);
    context.stroke();
  }

  for (
    let y = Math.ceil(graphWindow.yMin / yStep) * yStep;
    y <= graphWindow.yMax;
    y += yStep
  ) {
    const pixelY = yToPixel(y);
    context.beginPath();
    context.moveTo(0, pixelY);
    context.lineTo(width, pixelY);
    context.stroke();
  }

  context.strokeStyle = "#55657e";
  context.lineWidth = 1.25;

  if (graphWindow.xMin <= 0 && graphWindow.xMax >= 0) {
    const axisX = xToPixel(0);
    context.beginPath();
    context.moveTo(axisX, 0);
    context.lineTo(axisX, height);
    context.stroke();
  }

  if (graphWindow.yMin <= 0 && graphWindow.yMax >= 0) {
    const axisY = yToPixel(0);
    context.beginPath();
    context.moveTo(0, axisY);
    context.lineTo(width, axisY);
    context.stroke();
  }

  context.fillStyle = "#60708a";
  context.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";

  for (
    let x = Math.ceil(graphWindow.xMin / xStep) * xStep;
    x <= graphWindow.xMax;
    x += xStep
  ) {
    if (Math.abs(x) < 0.0000001) {
      continue;
    }

    const pixelX = xToPixel(x);
    context.fillText(formatAxisValue(x), pixelX + 4, Math.min(height - 8, yToPixel(0) - 5));
  }

  for (
    let y = Math.ceil(graphWindow.yMin / yStep) * yStep;
    y <= graphWindow.yMax;
    y += yStep
  ) {
    if (Math.abs(y) < 0.0000001) {
      continue;
    }

    const pixelY = yToPixel(y);
    context.fillText(formatAxisValue(y), Math.max(5, xToPixel(0) + 5), pixelY - 5);
  }
}

function niceStep(rawStep: number) {
  const exponent = Math.floor(Math.log10(rawStep));
  const fraction = rawStep / 10 ** exponent;
  let niceFraction = 1;

  if (fraction >= 5) niceFraction = 5;
  else if (fraction >= 2) niceFraction = 2;

  return niceFraction * 10 ** exponent;
}

function formatAxisValue(value: number) {
  return Number(value.toPrecision(3)).toString();
}

function formatValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  const rounded = Number(value.toPrecision(8));

  if (Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001)) {
    return rounded.toExponential(3);
  }

  return String(rounded);
}

function roundWindowValue(value: number) {
  return Number(value.toPrecision(8));
}
