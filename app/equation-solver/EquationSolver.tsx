"use client";

import { useMemo, useState } from "react";
import styles from "./EquationSolver.module.css";

type SolverMode = "linear" | "quadratic" | "system2" | "system3" | "cubic";

type Step = {
  title: string;
  detail: string;
};

type SolverResult = {
  title: string;
  summary: string;
  answers: string[];
  steps: Step[];
};

type CoefficientInputProps = {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
};

const EPSILON = 1e-10;

const modeLabels: Record<SolverMode, string> = {
  linear: "Linear",
  quadratic: "Quadratic",
  system2: "2 variables",
  system3: "3 variables",
  cubic: "Cubic",
};

export default function EquationSolver() {
  const [mode, setMode] = useState<SolverMode>("quadratic");
  const [linear, setLinear] = useState({ a: "2", b: "8" });
  const [quadratic, setQuadratic] = useState({ a: "1", b: "-5", c: "6" });
  const [system2, setSystem2] = useState({
    a1: "2",
    b1: "1",
    c1: "8",
    a2: "1",
    b2: "-1",
    c2: "1",
  });
  const [system3, setSystem3] = useState({
    a1: "1",
    b1: "1",
    c1: "1",
    d1: "6",
    a2: "2",
    b2: "-1",
    c2: "1",
    d2: "3",
    a3: "1",
    b3: "2",
    c3: "-1",
    d3: "2",
  });
  const [cubic, setCubic] = useState({ a: "1", b: "-6", c: "11", d: "-6" });
  const [result, setResult] = useState<SolverResult | null>(null);
  const [error, setError] = useState("");

  const equationPreview = useMemo(() => {
    if (mode === "linear") {
      return `${linear.a}x + ${linear.b} = 0`;
    }

    if (mode === "quadratic") {
      return `${quadratic.a}x² + ${quadratic.b}x + ${quadratic.c} = 0`;
    }

    if (mode === "cubic") {
      return `${cubic.a}x³ + ${cubic.b}x² + ${cubic.c}x + ${cubic.d} = 0`;
    }

    if (mode === "system2") {
      return `${system2.a1}x + ${system2.b1}y = ${system2.c1}\n${system2.a2}x + ${system2.b2}y = ${system2.c2}`;
    }

    return `${system3.a1}x + ${system3.b1}y + ${system3.c1}z = ${system3.d1}\n${system3.a2}x + ${system3.b2}y + ${system3.c2}z = ${system3.d2}\n${system3.a3}x + ${system3.b3}y + ${system3.c3}z = ${system3.d3}`;
  }, [cubic, linear, mode, quadratic, system2, system3]);

  function changeMode(nextMode: SolverMode) {
    setMode(nextMode);
    setResult(null);
    setError("");
  }

  function loadSample(nextMode: SolverMode) {
    if (nextMode === "linear") setLinear({ a: "2", b: "8" });
    if (nextMode === "quadratic") setQuadratic({ a: "1", b: "-5", c: "6" });
    if (nextMode === "system2") {
      setSystem2({ a1: "2", b1: "1", c1: "8", a2: "1", b2: "-1", c2: "1" });
    }
    if (nextMode === "system3") {
      setSystem3({
        a1: "1",
        b1: "1",
        c1: "1",
        d1: "6",
        a2: "2",
        b2: "-1",
        c2: "1",
        d2: "3",
        a3: "1",
        b3: "2",
        c3: "-1",
        d3: "2",
      });
    }
    if (nextMode === "cubic") setCubic({ a: "1", b: "-6", c: "11", d: "-6" });

    changeMode(nextMode);
  }

  function solveEquation() {
    try {
      let solvedResult: SolverResult;

      if (mode === "linear") {
        solvedResult = solveLinear(
          parseCoefficient(linear.a, "a"),
          parseCoefficient(linear.b, "b"),
        );
      } else if (mode === "quadratic") {
        solvedResult = solveQuadratic(
          parseCoefficient(quadratic.a, "a"),
          parseCoefficient(quadratic.b, "b"),
          parseCoefficient(quadratic.c, "c"),
        );
      } else if (mode === "cubic") {
        solvedResult = solveCubic(
          parseCoefficient(cubic.a, "a"),
          parseCoefficient(cubic.b, "b"),
          parseCoefficient(cubic.c, "c"),
          parseCoefficient(cubic.d, "d"),
        );
      } else if (mode === "system2") {
        solvedResult = solveSystem2(
          parseCoefficient(system2.a1, "a₁"),
          parseCoefficient(system2.b1, "b₁"),
          parseCoefficient(system2.c1, "c₁"),
          parseCoefficient(system2.a2, "a₂"),
          parseCoefficient(system2.b2, "b₂"),
          parseCoefficient(system2.c2, "c₂"),
        );
      } else {
        solvedResult = solveSystem3(
          parseCoefficient(system3.a1, "a₁"),
          parseCoefficient(system3.b1, "b₁"),
          parseCoefficient(system3.c1, "c₁"),
          parseCoefficient(system3.d1, "d₁"),
          parseCoefficient(system3.a2, "a₂"),
          parseCoefficient(system3.b2, "b₂"),
          parseCoefficient(system3.c2, "c₂"),
          parseCoefficient(system3.d2, "d₂"),
          parseCoefficient(system3.a3, "a₃"),
          parseCoefficient(system3.b3, "b₃"),
          parseCoefficient(system3.c3, "c₃"),
          parseCoefficient(system3.d3, "d₃"),
        );
      }

      setResult(solvedResult);
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Check the values and try again.",
      );
    }
  }

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
            <a href="/graphing-calculator">Graphing</a>
            <a href="/equation-solver" aria-current="page">Equation solver</a>
          </nav>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>FREE ONLINE EQUATION SOLVER</p>
          <h1>From one-variable equations to real engineering systems.</h1>
          <p>
            Solve linear, quadratic, cubic, two-variable, and three-variable
            equations with readable answers and calculation steps.
          </p>
        </section>

        <section className={styles.workspace}>
          <article className={styles.solverCard}>
            <div className={styles.cardHeading}>
              <div>
                <p className={styles.cardLabel}>SELECT EQUATION TYPE</p>
                <h2>Equation workspace</h2>
              </div>
              <span className={styles.liveBadge}>Ready</span>
            </div>

            <div className={styles.modeTabs} role="tablist" aria-label="Equation type">
              {(Object.keys(modeLabels) as SolverMode[]).map((item) => (
                <button
                  className={mode === item ? styles.activeTab : styles.tab}
                  key={item}
                  onClick={() => changeMode(item)}
                  role="tab"
                  aria-selected={mode === item}
                  type="button"
                >
                  {modeLabels[item]}
                </button>
              ))}
            </div>

            <div className={styles.previewBox} aria-live="polite">
              <span>YOUR EQUATION</span>
              <strong>{equationPreview}</strong>
            </div>

            {mode === "linear" && (
              <div className={styles.coefficientGridTwo}>
                <CoefficientInput label="a" description="coefficient of x" value={linear.a} onChange={(value) => setLinear((current) => ({ ...current, a: value }))} />
                <CoefficientInput label="b" description="constant term" value={linear.b} onChange={(value) => setLinear((current) => ({ ...current, b: value }))} />
              </div>
            )}

            {mode === "quadratic" && (
              <div className={styles.coefficientGridThree}>
                <CoefficientInput label="a" description="coefficient of x²" value={quadratic.a} onChange={(value) => setQuadratic((current) => ({ ...current, a: value }))} />
                <CoefficientInput label="b" description="coefficient of x" value={quadratic.b} onChange={(value) => setQuadratic((current) => ({ ...current, b: value }))} />
                <CoefficientInput label="c" description="constant term" value={quadratic.c} onChange={(value) => setQuadratic((current) => ({ ...current, c: value }))} />
              </div>
            )}

            {mode === "cubic" && (
              <div className={styles.coefficientGridFour}>
                <CoefficientInput label="a" description="coefficient of x³" value={cubic.a} onChange={(value) => setCubic((current) => ({ ...current, a: value }))} />
                <CoefficientInput label="b" description="coefficient of x²" value={cubic.b} onChange={(value) => setCubic((current) => ({ ...current, b: value }))} />
                <CoefficientInput label="c" description="coefficient of x" value={cubic.c} onChange={(value) => setCubic((current) => ({ ...current, c: value }))} />
                <CoefficientInput label="d" description="constant term" value={cubic.d} onChange={(value) => setCubic((current) => ({ ...current, d: value }))} />
              </div>
            )}

            {mode === "system2" && (
              <div className={styles.systemGrid}>
                <p>Equation 1: a₁x + b₁y = c₁</p>
                <div className={styles.coefficientGridThree}>
                  <CoefficientInput label="a₁" description="x coefficient" value={system2.a1} onChange={(value) => setSystem2((current) => ({ ...current, a1: value }))} />
                  <CoefficientInput label="b₁" description="y coefficient" value={system2.b1} onChange={(value) => setSystem2((current) => ({ ...current, b1: value }))} />
                  <CoefficientInput label="c₁" description="right side" value={system2.c1} onChange={(value) => setSystem2((current) => ({ ...current, c1: value }))} />
                </div>
                <p>Equation 2: a₂x + b₂y = c₂</p>
                <div className={styles.coefficientGridThree}>
                  <CoefficientInput label="a₂" description="x coefficient" value={system2.a2} onChange={(value) => setSystem2((current) => ({ ...current, a2: value }))} />
                  <CoefficientInput label="b₂" description="y coefficient" value={system2.b2} onChange={(value) => setSystem2((current) => ({ ...current, b2: value }))} />
                  <CoefficientInput label="c₂" description="right side" value={system2.c2} onChange={(value) => setSystem2((current) => ({ ...current, c2: value }))} />
                </div>
              </div>
            )}

            {mode === "system3" && (
              <div className={styles.systemGrid}>
                <p>Equation 1: a₁x + b₁y + c₁z = d₁</p>
                <div className={styles.coefficientGridFour}>
                  <CoefficientInput label="a₁" description="x coefficient" value={system3.a1} onChange={(value) => setSystem3((current) => ({ ...current, a1: value }))} />
                  <CoefficientInput label="b₁" description="y coefficient" value={system3.b1} onChange={(value) => setSystem3((current) => ({ ...current, b1: value }))} />
                  <CoefficientInput label="c₁" description="z coefficient" value={system3.c1} onChange={(value) => setSystem3((current) => ({ ...current, c1: value }))} />
                  <CoefficientInput label="d₁" description="right side" value={system3.d1} onChange={(value) => setSystem3((current) => ({ ...current, d1: value }))} />
                </div>
                <p>Equation 2: a₂x + b₂y + c₂z = d₂</p>
                <div className={styles.coefficientGridFour}>
                  <CoefficientInput label="a₂" description="x coefficient" value={system3.a2} onChange={(value) => setSystem3((current) => ({ ...current, a2: value }))} />
                  <CoefficientInput label="b₂" description="y coefficient" value={system3.b2} onChange={(value) => setSystem3((current) => ({ ...current, b2: value }))} />
                  <CoefficientInput label="c₂" description="z coefficient" value={system3.c2} onChange={(value) => setSystem3((current) => ({ ...current, c2: value }))} />
                  <CoefficientInput label="d₂" description="right side" value={system3.d2} onChange={(value) => setSystem3((current) => ({ ...current, d2: value }))} />
                </div>
                <p>Equation 3: a₃x + b₃y + c₃z = d₃</p>
                <div className={styles.coefficientGridFour}>
                  <CoefficientInput label="a₃" description="x coefficient" value={system3.a3} onChange={(value) => setSystem3((current) => ({ ...current, a3: value }))} />
                  <CoefficientInput label="b₃" description="y coefficient" value={system3.b3} onChange={(value) => setSystem3((current) => ({ ...current, b3: value }))} />
                  <CoefficientInput label="c₃" description="z coefficient" value={system3.c3} onChange={(value) => setSystem3((current) => ({ ...current, c3: value }))} />
                  <CoefficientInput label="d₃" description="right side" value={system3.d3} onChange={(value) => setSystem3((current) => ({ ...current, d3: value }))} />
                </div>
              </div>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}

            <button className={styles.solveButton} onClick={solveEquation} type="button">
              Solve {modeLabels[mode].toLowerCase()} equation <span>→</span>
            </button>

            <div className={styles.samples}>
              <span>Try a sample:</span>
              <button onClick={() => loadSample("quadratic")} type="button">x² − 5x + 6 = 0</button>
              <button onClick={() => loadSample("system3")} type="button">3 variables</button>
              <button onClick={() => loadSample("cubic")} type="button">x³ − 6x² + 11x − 6 = 0</button>
            </div>
          </article>

          <aside className={styles.answerCard} aria-live="polite">
            <p className={styles.cardLabel}>SOLUTION</p>

            {result ? (
              <>
                <h2>{result.title}</h2>
                <p className={styles.summary}>{result.summary}</p>

                <div className={styles.answerList}>
                  {result.answers.map((answer) => <strong key={answer}>{answer}</strong>)}
                </div>

                <div className={styles.steps}>
                  <p>HOW IT WAS SOLVED</p>
                  {result.steps.map((step, index) => (
                    <article className={styles.step} key={`${step.title}-${index}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyAnswer}>
                <span>ƒ(x)</span>
                <h2>Choose a solver and enter coefficients.</h2>
                <p>Results and steps will appear here after you solve the equation.</p>
              </div>
            )}
          </aside>
        </section>

        <section className={styles.learningSection}>
          <div>
            <p className={styles.eyebrow}>BUILT FOR LEARNING</p>
            <h2>Use the right solver for the mathematical problem.</h2>
          </div>
          <div className={styles.learningGrid}>
            <article><span>LINEAR</span><h3>One unknown</h3><p>Use for ax + b = 0 problems.</p></article>
            <article><span>QUADRATIC & CUBIC</span><h3>Polynomial roots</h3><p>Find real roots and see complex roots where applicable.</p></article>
            <article><span>2 × 2 & 3 × 3</span><h3>Engineering systems</h3><p>Use simultaneous equations for circuit, force, and data-model problems.</p></article>
          </div>
        </section>

        <section className={styles.faqSection}>
          <p className={styles.eyebrow}>EQUATION SOLVER FAQ</p>
          <div className={styles.faqGrid}>
            <article><h2>Can this solve cubic equations?</h2><p>Yes. Enter coefficients for ax³ + bx² + cx + d = 0. The solver reports the real root and any complex roots.</p></article>
            <article><h2>Can I solve three equations with three variables?</h2><p>Yes. The 3-variable workspace uses determinants to solve a system with one unique x, y, z solution.</p></article>
            <article><h2>What is next?</h2><p>Matrix operations, inequalities, and symbolic expression solving will be separate SolveGrid tools so each workflow remains clear.</p></article>
          </div>
        </section>
      </div>
    </main>
  );
}

function CoefficientInput({ label, description, value, onChange }: CoefficientInputProps) {
  return (
    <label className={styles.coefficientInput}>
      <span>{label}</span>
      <input
        aria-label={`${label} ${description}`}
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      <small>{description}</small>
    </label>
  );
}

function parseCoefficient(value: string, label: string) {
  const parsedValue = Number(value.trim());
  if (!Number.isFinite(parsedValue)) throw new Error(`Enter a valid number for ${label}.`);
  return parsedValue;
}

function solveLinear(a: number, b: number): SolverResult {
  if (approximatelyZero(a) && approximatelyZero(b)) {
    return {
      title: "Infinitely many solutions",
      summary: "Both coefficients are zero, so the equation becomes 0 = 0.",
      answers: ["Every real x is a solution"],
      steps: [
        { title: "Check the x coefficient", detail: "a = 0, so there is no x term." },
        { title: "Check the constant", detail: "b = 0, so the equation is always true." },
      ],
    };
  }

  if (approximatelyZero(a)) {
    return {
      title: "No solution",
      summary: "There is no x term and the remaining statement is false.",
      answers: ["No real value of x satisfies this equation"],
      steps: [
        { title: "Remove the x term", detail: "a = 0, so the equation has no variable term." },
        { title: "Check the statement", detail: `${formatNumber(b)} = 0 is false.` },
      ],
    };
  }

  const x = -b / a;
  return {
    title: "One solution",
    summary: "A non-zero x coefficient gives one real solution.",
    answers: [`x = ${formatNumber(x)}`],
    steps: [
      { title: "Move the constant", detail: `${formatNumber(a)}x = ${formatNumber(-b)}.` },
      { title: "Divide by a", detail: `x = ${formatNumber(-b)} ÷ ${formatNumber(a)} = ${formatNumber(x)}.` },
    ],
  };
}

function solveQuadratic(a: number, b: number, c: number): SolverResult {
  if (approximatelyZero(a)) {
    const reduced = solveLinear(b, c);
    return { ...reduced, summary: `a = 0, so this reduces to a linear equation. ${reduced.summary}` };
  }

  const discriminant = b ** 2 - 4 * a * c;
  const baseStep: Step = { title: "Calculate the discriminant", detail: `Δ = b² − 4ac = ${formatNumber(discriminant)}.` };

  if (discriminant > EPSILON) {
    const root = Math.sqrt(discriminant);
    const x1 = (-b + root) / (2 * a);
    const x2 = (-b - root) / (2 * a);
    return {
      title: "Two real roots",
      summary: "The discriminant is positive, so the quadratic has two real solutions.",
      answers: [`x₁ = ${formatNumber(x1)}`, `x₂ = ${formatNumber(x2)}`],
      steps: [baseStep, { title: "Apply the quadratic formula", detail: "x = (−b ± √Δ) ÷ 2a." }, { title: "Calculate both roots", detail: `The roots are ${formatNumber(x1)} and ${formatNumber(x2)}.` }],
    };
  }

  if (approximatelyZero(discriminant)) {
    const x = -b / (2 * a);
    return {
      title: "One repeated real root",
      summary: "The discriminant is zero, so both roots have the same value.",
      answers: [`x = ${formatNumber(x)}`],
      steps: [baseStep, { title: "Use the repeated-root formula", detail: `x = −b ÷ 2a = ${formatNumber(x)}.` }],
    };
  }

  const realPart = -b / (2 * a);
  const imaginaryPart = Math.sqrt(-discriminant) / Math.abs(2 * a);
  return {
    title: "Two complex roots",
    summary: "The discriminant is negative, so there are no real roots.",
    answers: [`x₁ = ${formatComplex(realPart, imaginaryPart)}`, `x₂ = ${formatComplex(realPart, -imaginaryPart)}`],
    steps: [baseStep, { title: "Identify the root type", detail: "A negative discriminant creates an imaginary square root." }, { title: "Apply the complex form", detail: "x = −b ÷ 2a ± i√(−Δ) ÷ |2a|." }],
  };
}

function solveCubic(a: number, b: number, c: number, d: number): SolverResult {
  if (approximatelyZero(a)) {
    const reduced = solveQuadratic(b, c, d);
    return { ...reduced, summary: `a = 0, so this cubic reduces to a quadratic. ${reduced.summary}` };
  }

  const A = b / a;
  const B = c / a;
  const C = d / a;
  const p = B - (A ** 2) / 3;
  const q = (2 * A ** 3) / 27 - (A * B) / 3 + C;
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;
  const baseSteps: Step[] = [
    { title: "Normalize the cubic", detail: `Divide through by a = ${formatNumber(a)}.` },
    { title: "Calculate the cubic discriminant", detail: `Δ = ${formatNumber(discriminant)}.` },
  ];

  if (discriminant > EPSILON) {
    const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
    const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
    const realRoot = u + v - A / 3;
    const complexReal = -(u + v) / 2 - A / 3;
    const complexImaginary = (Math.sqrt(3) / 2) * (u - v);
    return {
      title: "One real root and two complex roots",
      summary: "The cubic discriminant is positive.",
      answers: [
        `x₁ = ${formatNumber(realRoot)}`,
        `x₂ = ${formatComplex(complexReal, complexImaginary)}`,
        `x₃ = ${formatComplex(complexReal, -complexImaginary)}`,
      ],
      steps: [...baseSteps, { title: "Apply the cubic formula", detail: "Use the normalized p and q values to obtain one real root." }],
    };
  }

  if (approximatelyZero(discriminant)) {
    const u = Math.cbrt(-q / 2);
    const root1 = 2 * u - A / 3;
    const root2 = -u - A / 3;
    const uniqueRoots = uniqueNumbers([root1, root2]);
    return {
      title: uniqueRoots.length === 1 ? "One triple real root" : "Repeated real roots",
      summary: "The cubic discriminant is zero, so at least two roots are equal.",
      answers: uniqueRoots.map((root, index) => `x${uniqueRoots.length > 1 ? `₍${index + 1}₎` : ""} = ${formatNumber(root)}`),
      steps: [...baseSteps, { title: "Use the repeated-root form", detail: "The cubic has repeated real roots because Δ = 0." }],
    };
  }

  const radius = 2 * Math.sqrt(-p / 3);
  const angle = Math.acos((-q / 2) / Math.sqrt(-((p / 3) ** 3)));
  const roots = [0, 1, 2]
    .map((index) => radius * Math.cos((angle + 2 * Math.PI * index) / 3) - A / 3)
    .sort((first, second) => first - second);

  return {
    title: "Three real roots",
    summary: "The cubic discriminant is negative, so the equation has three distinct real roots.",
    answers: roots.map((root, index) => `x${index + 1} = ${formatNumber(root)}`),
    steps: [...baseSteps, { title: "Use the trigonometric cubic form", detail: "A negative cubic discriminant produces three real roots." }],
  };
}

function solveSystem2(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): SolverResult {
  const determinant = a1 * b2 - a2 * b1;
  if (approximatelyZero(determinant)) {
    const consistent = approximatelyZero(a1 * c2 - a2 * c1) && approximatelyZero(b1 * c2 - b2 * c1);
    return {
      title: consistent ? "Infinitely many solutions" : "No unique solution",
      summary: consistent ? "Both equations represent the same line." : "The equations are parallel or inconsistent.",
      answers: [consistent ? "The system has infinitely many solutions" : "The system has no single x, y solution"],
      steps: [{ title: "Calculate the determinant", detail: `D = a₁b₂ − a₂b₁ = ${formatNumber(determinant)}.` }, { title: "Interpret D = 0", detail: consistent ? "The equations are dependent." : "The equations do not meet at one point." }],
    };
  }

  const determinantX = c1 * b2 - c2 * b1;
  const determinantY = a1 * c2 - a2 * c1;
  const x = determinantX / determinant;
  const y = determinantY / determinant;
  return {
    title: "One solution",
    summary: "The non-zero determinant means the two lines meet at one point.",
    answers: [`x = ${formatNumber(x)}`, `y = ${formatNumber(y)}`],
    steps: [
      { title: "Calculate the main determinant", detail: `D = ${formatNumber(determinant)}.` },
      { title: "Calculate Dx and Dy", detail: `Dx = ${formatNumber(determinantX)}, Dy = ${formatNumber(determinantY)}.` },
      { title: "Apply Cramer's rule", detail: `x = Dx ÷ D = ${formatNumber(x)}, y = Dy ÷ D = ${formatNumber(y)}.` },
    ],
  };
}

function solveSystem3(
  a1: number, b1: number, c1: number, d1: number,
  a2: number, b2: number, c2: number, d2: number,
  a3: number, b3: number, c3: number, d3: number,
): SolverResult {
  const determinant = determinant3([[a1, b1, c1], [a2, b2, c2], [a3, b3, c3]]);
  if (approximatelyZero(determinant)) {
    return {
      title: "No unique solution",
      summary: "The main determinant is zero, so this system needs rank analysis before a unique solution can be confirmed.",
      answers: ["No unique x, y, z solution from Cramer's rule"],
      steps: [{ title: "Calculate the main determinant", detail: `D = ${formatNumber(determinant)}.` }, { title: "Interpret D = 0", detail: "The equations may be dependent or inconsistent." }],
    };
  }

  const determinantX = determinant3([[d1, b1, c1], [d2, b2, c2], [d3, b3, c3]]);
  const determinantY = determinant3([[a1, d1, c1], [a2, d2, c2], [a3, d3, c3]]);
  const determinantZ = determinant3([[a1, b1, d1], [a2, b2, d2], [a3, b3, d3]]);
  const x = determinantX / determinant;
  const y = determinantY / determinant;
  const z = determinantZ / determinant;

  return {
    title: "One 3-variable solution",
    summary: "The non-zero determinant gives one unique x, y, z solution.",
    answers: [`x = ${formatNumber(x)}`, `y = ${formatNumber(y)}`, `z = ${formatNumber(z)}`],
    steps: [
      { title: "Calculate D", detail: `D = ${formatNumber(determinant)}.` },
      { title: "Calculate Dx, Dy and Dz", detail: `Dx = ${formatNumber(determinantX)}, Dy = ${formatNumber(determinantY)}, Dz = ${formatNumber(determinantZ)}.` },
      { title: "Apply Cramer's rule", detail: `x = ${formatNumber(x)}, y = ${formatNumber(y)}, z = ${formatNumber(z)}.` },
    ],
  };
}

function determinant3(matrix: number[][]) {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function approximatelyZero(value: number) {
  return Math.abs(value) < EPSILON;
}

function uniqueNumbers(values: number[]) {
  return values.filter((value, index) => values.findIndex((candidate) => approximatelyZero(candidate - value)) === index);
}

function formatComplex(real: number, imaginary: number) {
  const sign = imaginary < 0 ? "−" : "+";
  return `${formatNumber(real)} ${sign} ${formatNumber(Math.abs(imaginary))}i`;
}

function formatNumber(value: number) {
  if (approximatelyZero(value)) return "0";
  return String(Number(value.toPrecision(10)));
}
