"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  solveTwoVariableLinearProgram,
  type LinearConstraint,
  type LpResult,
} from "../../lib/linear-programming";
import styles from "../../components/ResearchLab.module.css";

type ConstraintInput = {
  a: string;
  b: string;
  operator: LinearConstraint["operator"];
  c: string;
};

const initialConstraints: ConstraintInput[] = [
  { a: "2", b: "1", operator: "<=", c: "18" },
  { a: "2", b: "3", operator: "<=", c: "42" },
  { a: "3", b: "1", operator: "<=", c: "24" },
];

function coordinate(point: number) {
  return Number(point.toPrecision(7));
}

function LpChart({ result }: { result: LpResult }) {
  const points = result.feasiblePoints;

  if (!points.length) return null;

  const maxX = Math.max(1, ...points.map((point) => point.x)) * 1.2;
  const maxY = Math.max(1, ...points.map((point) => point.y)) * 1.2;
  const sx = (value: number) => 44 + (value / maxX) * 330;
  const sy = (value: number) => 220 - (value / maxY) * 175;
  const polygon = points.map((point) => `${sx(point.x)},${sy(point.y)}`).join(" ");

  return (
    <figure className={styles.chartFrame}>
      <p className={styles.chartTitle}>FEASIBLE CORNER POINTS</p>
      <svg
        viewBox="0 0 410 250"
        role="img"
        aria-label="Feasible linear-programming corner points"
      >
        <line x1="44" y1="220" x2="380" y2="220" stroke="#aab9d2" />
        <line x1="44" y1="220" x2="44" y2="28" stroke="#aab9d2" />
        {points.length >= 3 ? (
          <polygon
            points={polygon}
            fill="rgba(49,87,232,.16)"
            stroke="#3157e8"
            strokeWidth="2"
          />
        ) : null}
        {points.map((point) => (
          <g key={`${point.x}-${point.y}`}>
            <circle
              cx={sx(point.x)}
              cy={sy(point.y)}
              r="4"
              fill={
                result.optimum?.x === point.x && result.optimum?.y === point.y
                  ? "#e56a39"
                  : "#3157e8"
              }
            />
            <text
              x={sx(point.x) + 6}
              y={sy(point.y) - 7}
              fill="#526681"
              fontSize="10"
            >
              ({coordinate(point.x)}, {coordinate(point.y)})
            </text>
          </g>
        ))}
        <text x="374" y="238" fill="#627590" fontSize="11">
          x
        </text>
        <text x="28" y="34" fill="#627590" fontSize="11">
          y
        </text>
      </svg>
      <figcaption>
        Orange marks the selected optimum. This visualises the feasible corner
        points used by the two-variable linear programming solver.
      </figcaption>
    </figure>
  );
}

export default function OptimizationLab() {
  const [objectiveX, setObjectiveX] = useState("3");
  const [objectiveY, setObjectiveY] = useState("5");
  const [direction, setDirection] = useState<"max" | "min">("max");
  const [nonNegative, setNonNegative] = useState(true);
  const [constraints, setConstraints] = useState<ConstraintInput[]>(initialConstraints);
  const [result, setResult] = useState<LpResult | null>(null);
  const [error, setError] = useState("");

  const parsedConstraints = useMemo(
    () =>
      constraints.map((item) => ({
        a: Number(item.a),
        b: Number(item.b),
        c: Number(item.c),
        operator: item.operator,
      })),
    [constraints],
  );

  function updateConstraint(index: number, key: keyof ConstraintInput, value: string) {
    setConstraints((items) =>
      items.map((item, current) =>
        current === index ? { ...item, [key]: value } : item,
      ),
    );
  }

  function loadExample() {
    setObjectiveX("3");
    setObjectiveY("5");
    setDirection("max");
    setNonNegative(true);
    setConstraints(initialConstraints);
    setResult(null);
    setError("");
  }

  function clearModel() {
    setObjectiveX("0");
    setObjectiveY("0");
    setDirection("max");
    setNonNegative(true);
    setConstraints([{ a: "", b: "", operator: "<=", c: "" }]);
    setResult(null);
    setError("");
  }

  function run() {
    try {
      setError("");
      setResult(
        solveTwoVariableLinearProgram({
          objectiveX: Number(objectiveX),
          objectiveY: Number(objectiveY),
          direction,
          constraints: parsedConstraints,
          nonNegative,
        }),
      );
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the optimisation model.");
    }
  }

  const resultHeading = result?.optimum
    ? `${direction === "max" ? "Maximum" : "Minimum"} objective`
    : result
      ? "No optimum found"
      : "Ready to solve";

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="research" />

      <section className={styles.hero}>
        <p>OPTIMIZATION PROBLEM SOLVER</p>
        <h1>Linear programming solver for two-variable optimization problems.</h1>
        <span>
          Build a model with an objective function, linear constraints, and
          optional non-negative restrictions. The lab evaluates feasible corner
          points so you can maximise or minimise the objective in the browser.
        </span>
      </section>

      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>LINEAR PROGRAM</p>
              <h2>Objective and constraints</h2>
            </div>
            <span className={styles.status}>2 VARIABLES</span>
          </div>

          <div className={`${styles.fieldGrid} ${styles.twoMobile}`}>
            <label>
              <span>Direction</span>
              <select
                value={direction}
                onChange={(event) => setDirection(event.target.value as "max" | "min")}
              >
                <option value="max">Maximize</option>
                <option value="min">Minimize</option>
              </select>
            </label>
            <label>
              <span>Objective coefficient for x</span>
              <input
                inputMode="decimal"
                value={objectiveX}
                onChange={(event) => setObjectiveX(event.target.value)}
              />
            </label>
            <label>
              <span>Objective coefficient for y</span>
              <input
                inputMode="decimal"
                value={objectiveY}
                onChange={(event) => setObjectiveY(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.methodNote}>
            <p>OBJECTIVE FUNCTION</p>
            <span>
              The model uses Z = {objectiveX || "0"}x + {objectiveY || "0"}y.
              Choose maximise for profit, output, or score problems, and minimise
              for cost, waste, distance, or time problems.
            </span>
          </div>

          <div className={styles.switchRow}>
            <span>Include non-negative constraints: x ≥ 0 and y ≥ 0</span>
            <input
              checked={nonNegative}
              onChange={(event) => setNonNegative(event.target.checked)}
              type="checkbox"
            />
          </div>

          <div className={styles.constraintList}>
            {constraints.map((constraint, index) => (
              <div className={styles.constraintRow} key={index}>
                <input
                  aria-label={`Constraint ${index + 1} x coefficient`}
                  inputMode="decimal"
                  value={constraint.a}
                  onChange={(event) => updateConstraint(index, "a", event.target.value)}
                />
                <input
                  aria-label={`Constraint ${index + 1} y coefficient`}
                  inputMode="decimal"
                  value={constraint.b}
                  onChange={(event) => updateConstraint(index, "b", event.target.value)}
                />
                <select
                  aria-label={`Constraint ${index + 1} operator`}
                  value={constraint.operator}
                  onChange={(event) =>
                    updateConstraint(
                      index,
                      "operator",
                      event.target.value as LinearConstraint["operator"],
                    )
                  }
                >
                  <option value="<=">≤</option>
                  <option value=">=">≥</option>
                  <option value="=">=</option>
                </select>
                <input
                  aria-label={`Constraint ${index + 1} constant`}
                  inputMode="decimal"
                  value={constraint.c}
                  onChange={(event) => updateConstraint(index, "c", event.target.value)}
                />
                {constraints.length > 1 ? (
                  <button
                    className={styles.removeButton}
                    aria-label="Remove constraint"
                    onClick={() =>
                      setConstraints((items) =>
                        items.filter((_, current) => current !== index),
                      )
                    }
                    type="button"
                  >
                    ×
                  </button>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>

          {constraints.length < 8 ? (
            <button
              className={styles.smallButton}
              onClick={() =>
                setConstraints((items) => [
                  ...items,
                  { a: "", b: "", operator: "<=", c: "" },
                ])
              }
              type="button"
            >
              + Add constraint
            </button>
          ) : null}

          <div className={styles.methodNote}>
            <p>QUICK EXAMPLE</p>
            <span>
              Try maximise Z = 3x + 5y with 2x + y ≤ 18, 2x + 3y ≤ 42,
              3x + y ≤ 24, and x,y ≥ 0. The solver evaluates the feasible
              corner points and compares objective values.
            </span>
          </div>

          <div className={styles.switchRow}>
            <span>Load the sample model or clear the form before entering your own.</span>
            <button className={styles.smallButton} onClick={loadExample} type="button">
              Load example
            </button>
            <button className={styles.smallButton} onClick={clearModel} type="button">
              Clear model
            </button>
          </div>

          <button className={styles.runButton} onClick={run} type="button">
            Solve linear program <span>→</span>
          </button>
          {error ? <p className={styles.error}>{error}</p> : null}
        </article>

        <aside className={styles.resultCard} aria-live="polite">
          <p>OPTIMUM</p>
          <h2>{resultHeading}</h2>
          {result?.optimum ? (
            <>
              <strong className={styles.resultValue}>
                Z = {coordinate(result.optimum.value)} at ({coordinate(result.optimum.x)},{" "}
                {coordinate(result.optimum.y)})
              </strong>
              <div className={styles.resultRows}>
                {result.feasiblePoints.map((point) => (
                  <div key={`${point.x}-${point.y}`}>
                    <span>
                      Corner ({coordinate(point.x)}, {coordinate(point.y)})
                    </span>
                    <strong>Z = {coordinate(point.value)}</strong>
                  </div>
                ))}
              </div>
              <LpChart result={result} />
              <div className={styles.methodNote}>
                <p>METHOD</p>
                <span>{result.note}</span>
              </div>
            </>
          ) : result ? (
            <div className={styles.empty}>
              <span>check model</span>
              <p>{result.note}</p>
            </div>
          ) : (
            <div className={styles.empty}>
              <span>max Z</span>
              <p>Enter coefficients and constraints, then solve the two-variable model.</p>
            </div>
          )}
        </aside>
      </section>

      <section className={styles.workspace} aria-labelledby="optimization-explainer">
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>HOW IT WORKS</p>
              <h2 id="optimization-explainer">What this optimization calculator solves</h2>
            </div>
            <span className={styles.status}>LP</span>
          </div>
          <div className={styles.methodNote}>
            <p>OBJECTIVE FUNCTION</p>
            <span>
              The objective function is the quantity you want to maximise or
              minimise, such as profit, cost, output, time, or resource use. In a
              two-variable linear program it has the form Z = c₁x + c₂y.
            </span>
          </div>
          <div className={styles.methodNote}>
            <p>CONSTRAINTS</p>
            <span>
              Constraints describe limits such as material, labour, budget, or
              capacity. A constraint like 2x + 3y ≤ 42 means every feasible choice
              of x and y must stay on the allowed side of that boundary line.
            </span>
          </div>
          <div className={styles.methodNote}>
            <p>FEASIBLE REGION</p>
            <span>
              The feasible region is the overlap of all constraints. For a bounded
              continuous two-variable linear program, the best value occurs at one
              of the feasible corner points, so the lab calculates and compares
              those corners.
            </span>
          </div>
        </article>

        <article className={styles.resultCard}>
          <p>WORKED EXAMPLE</p>
          <h2>Maximise a production objective</h2>
          <div className={styles.resultRows}>
            <div>
              <span>Objective</span>
              <strong>Maximise Z = 3x + 5y</strong>
            </div>
            <div>
              <span>Constraints</span>
              <strong>2x + y ≤ 18, 2x + 3y ≤ 42, 3x + y ≤ 24</strong>
            </div>
            <div>
              <span>Method</span>
              <strong>Evaluate feasible corner points</strong>
            </div>
          </div>
          <div className={styles.methodNote}>
            <p>INTERPRETATION</p>
            <span>
              If x and y represent two products, each constraint can represent a
              limited resource. The optimum is the feasible corner where the
              objective value is highest for a maximisation problem or lowest for a
              minimisation problem.
            </span>
          </div>
          <div className={styles.methodNote}>
            <p>LIMITATIONS</p>
            <span>
              This page solves continuous two-variable linear programming models.
              It does not solve integer, binary, nonlinear, or many-variable
              optimization problems.
            </span>
          </div>
        </article>
      </section>
    </main>
  );
}
