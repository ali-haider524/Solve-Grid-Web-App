"use client";

import Link from "next/link";
import ToolHeader from "../../components/ToolHeader";
import { useMemo, useState } from "react";
import styles from "./PolynomialSolver.module.css";

type Complex = {
  re: number;
  im: number;
};

type RootResult = {
  value: Complex;
  residual: number;
};

const MIN_DEGREE = 1;
const MAX_DEGREE = 10;
const ZERO_TOLERANCE = 1e-9;

const DEFAULTS: Record<number, string[]> = {
  1: ["1", "-4"],
  2: ["1", "-5", "6"],
  3: ["1", "-6", "11", "-6"],
  4: ["1", "0", "-5", "0", "4"],
  5: ["1", "0", "-5", "0", "4", "0"],
};

export default function PolynomialSolver() {
  const [degree, setDegree] = useState(4);
  const [coefficients, setCoefficients] = useState<string[]>(
    createDefaultCoefficients(4),
  );
  const [roots, setRoots] = useState<RootResult[]>([]);
  const [error, setError] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const equationPreview = useMemo(
    () => formatPolynomialPreview(coefficients, degree),
    [coefficients, degree],
  );

  function changeDegree(nextDegree: number) {
    const safeDegree = Math.max(MIN_DEGREE, Math.min(MAX_DEGREE, nextDegree));
    setDegree(safeDegree);
    setCoefficients(createDefaultCoefficients(safeDegree));
    setRoots([]);
    setError("");
    setIsSolved(false);
  }

  function updateCoefficient(index: number, value: string) {
    setCoefficients((current) =>
      current.map((coefficient, coefficientIndex) =>
        coefficientIndex === index ? value : coefficient,
      ),
    );
    setError("");
    setIsSolved(false);
  }

  function solve() {
    const parsed = coefficients.map((coefficient) => Number(coefficient.trim()));

    if (parsed.some((value) => !Number.isFinite(value))) {
      setError("Enter a valid number in every coefficient field.");
      setRoots([]);
      return;
    }

    if (Math.abs(parsed[0]) < ZERO_TOLERANCE) {
      setError("The leading coefficient cannot be zero. Reduce the degree instead.");
      setRoots([]);
      return;
    }

    try {
      const calculatedRoots = findPolynomialRoots(parsed);
      const orderedRoots = calculatedRoots
        .map((value) => ({
          value,
          residual: complexAbs(evaluatePolynomial(parsed, value)),
        }))
        .sort((first, second) => {
          if (Math.abs(first.value.re - second.value.re) > ZERO_TOLERANCE) {
            return first.value.re - second.value.re;
          }

          return first.value.im - second.value.im;
        });

      setRoots(orderedRoots);
      setError("");
      setIsSolved(true);
    } catch (caughtError) {
      setRoots([]);
      setIsSolved(false);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The polynomial could not be solved. Check the coefficients.",
      );
    }
  }

  function loadSample(sampleDegree: number) {
    changeDegree(sampleDegree);
  }

  const realRootCount = roots.filter(
    (root) => Math.abs(root.value.im) < ZERO_TOLERANCE,
  ).length;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="math" />
      <div className={styles.container}>
        <section className={styles.hero}>
          <p>POLYNOMIAL ROOT CALCULATOR</p>
          <h1>Polynomial solver for real and complex roots.</h1>
          <span>
            Enter coefficients for degree 1 to 10 polynomials and find real or
            complex roots numerically. Use it for quadratic, cubic, quartic, and
            higher-degree equations when you need a coefficient-based roots calculator.
          </span>
        </section>

        <section className={styles.workspace}>
          <article className={styles.inputCard}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.eyebrow}>COEFFICIENT WORKSPACE</p>
                <h2>Build your polynomial</h2>
              </div>
              <span className={styles.degreeBadge}>Degree {degree}</span>
            </div>

            <label className={styles.degreeLabel} htmlFor="polynomial-degree">
              Polynomial degree
            </label>
            <select
              className={styles.degreeSelect}
              id="polynomial-degree"
              value={degree}
              onChange={(event) => changeDegree(Number(event.target.value))}
            >
              {Array.from(
                { length: MAX_DEGREE - MIN_DEGREE + 1 },
                (_, index) => MIN_DEGREE + index,
              ).map((optionDegree) => (
                <option key={optionDegree} value={optionDegree}>
                  Degree {optionDegree}
                </option>
              ))}
            </select>

            <div className={styles.previewBox}>
              <span>YOUR POLYNOMIAL</span>
              <strong>{equationPreview} = 0</strong>
            </div>

            <div className={styles.coefficientGrid}>
              {coefficients.map((coefficient, index) => {
                const power = degree - index;
                const fieldName = power === 0 ? "a₀" : `a${toSuperscript(power)}`;

                return (
                  <label className={styles.coefficientField} key={`${degree}-${index}`}>
                    <span>{fieldName}</span>
                    <input
                      value={coefficient}
                      onChange={(event) => updateCoefficient(index, event.target.value)}
                      inputMode="decimal"
                      aria-label={`Coefficient for x to the power ${power}`}
                    />
                    <small>{power === 0 ? "constant" : `x${toSuperscript(power)}`}</small>
                  </label>
                );
              })}
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button className={styles.solveButton} onClick={solve} type="button">
              Find polynomial roots <span>→</span>
            </button>

            <div className={styles.samples}>
              <span>Try a sample:</span>
              <button type="button" onClick={() => loadSample(2)}>
                Quadratic
              </button>
              <button type="button" onClick={() => loadSample(3)}>
                Cubic
              </button>
              <button type="button" onClick={() => loadSample(4)}>
                Quartic
              </button>
              <button type="button" onClick={() => loadSample(5)}>
                Degree 5
              </button>
            </div>
          </article>

          <aside className={styles.resultCard}>
            <p className={styles.eyebrow}>ROOT RESULTS</p>
            <h2>{isSolved ? "Calculated roots" : "Ready to solve"}</h2>

            {!isSolved ? (
              <div className={styles.emptyState}>
                <span>f(x)</span>
                <p>
                  Add coefficients, then calculate the real and complex roots
                  of your polynomial.
                </p>
              </div>
            ) : (
              <>
                <p className={styles.resultSummary}>
                  {realRootCount} real {realRootCount === 1 ? "root" : "roots"}
                  {roots.length - realRootCount > 0
                    ? ` and ${roots.length - realRootCount} complex ${
                        roots.length - realRootCount === 1 ? "root" : "roots"
                      }.`
                    : "."}
                </p>

                <div className={styles.rootList}>
                  {roots.map((root, index) => (
                    <div className={styles.rootItem} key={`${root.value.re}-${root.value.im}-${index}`}>
                      <span>x{toSubscript(index + 1)}</span>
                      <strong>{formatComplex(root.value)}</strong>
                      <small>residual {formatResidual(root.residual)}</small>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className={styles.methodBox}>
              <p>HOW RESULTS ARE CALCULATED</p>
              <span>
                Degree 1–3 are also covered in Equation Solver. This polynomial
                roots calculator uses numerical root-finding for higher degrees,
                then checks each answer with a residual so you can judge the
                accuracy of the result.
              </span>
            </div>

            <Link className={styles.guideButton} href="/guides/polynomial-roots-and-complex-roots">
              Read the polynomial roots guide →
            </Link>
          </aside>
        </section>

        <section className={styles.infoGrid}>
          <article>
            <span>01</span>
            <h3>Polynomial roots from coefficients</h3>
            <p>Choose the degree, enter coefficients from the highest power down to the constant term, and solve f(x) = 0.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Real and complex roots included</h3>
            <p>Real roots are shown as ordinary numbers. Non-real roots are displayed in a + bi format when the graph does not cross the x-axis.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Residual check for accuracy</h3>
            <p>The residual shows how close f(root) is to zero, which is useful for repeated roots and higher-degree numerical answers.</p>
          </article>
        </section>

        <section className={styles.learningSection} aria-labelledby="polynomial-roots-guide-title">
          <div className={styles.learningHeader}>
            <p>POLYNOMIAL ROOTS EXPLAINED</p>
            <h2 id="polynomial-roots-guide-title">How to use this polynomial roots calculator.</h2>
            <span>
              A polynomial root is a value of x that makes f(x) equal zero. This
              workspace is built for coefficient form, so it is best when you
              already know the coefficients of xⁿ, xⁿ⁻¹, and the constant term.
            </span>
          </div>

          <div className={styles.explanationGrid}>
            <article>
              <p>COEFFICIENT ORDER</p>
              <h3>Enter highest power first</h3>
              <span>For x² − 5x + 6, enter 1, −5, and 6. For x⁴ − 5x² + 4, enter 1, 0, −5, 0, and 4.</span>
            </article>
            <article>
              <p>REAL ROOTS</p>
              <h3>Where the graph crosses</h3>
              <span>Real roots are x-intercepts of the polynomial graph. Use the Graphing Calculator when you want to see the curve visually.</span>
            </article>
            <article>
              <p>COMPLEX ROOTS</p>
              <h3>When roots contain i</h3>
              <span>Some polynomials have roots like 2 + 3i. They are valid roots even though they do not appear as x-axis crossings on a real graph.</span>
            </article>
          </div>

          <div className={styles.exampleGrid}>
            <article>
              <p>QUADRATIC EXAMPLE</p>
              <h3>x² − 5x + 6 = 0</h3>
              <span>Use degree 2 with coefficients 1, −5, 6. The roots are 2 and 3 because (x − 2)(x − 3) = 0.</span>
            </article>
            <article>
              <p>QUARTIC EXAMPLE</p>
              <h3>x⁴ − 5x² + 4 = 0</h3>
              <span>Use degree 4 with coefficients 1, 0, −5, 0, 4. The sample gives four roots: −2, −1, 1, and 2.</span>
            </article>
          </div>

          <div className={styles.relatedGuide}>
            <div>
              <p>RELATED WORKFLOWS</p>
              <h2>Use the right SolveGrid tool for the next step.</h2>
              <span>Polynomial roots are one part of algebra work. Use graphing for visual checks and equation solving for lower-degree exact workflows.</span>
            </div>
            <div>
              <Link href="/guides/polynomial-roots-and-complex-roots">Polynomial roots guide</Link>
              <Link href="/graphing-calculator">Graphing Calculator</Link>
              <Link href="/equation-solver">Equation Solver</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function createDefaultCoefficients(degree: number) {
  const sample = DEFAULTS[degree];

  if (sample) {
    return [...sample];
  }

  return Array.from({ length: degree + 1 }, (_, index) =>
    index === 0 ? "1" : "0",
  );
}

function findPolynomialRoots(coefficients: number[]) {
  const degree = coefficients.length - 1;

  if (degree === 1) {
    return [{ re: -coefficients[1] / coefficients[0], im: 0 }];
  }

  const normalized = coefficients.map((coefficient) => coefficient / coefficients[0]);
  const radius = 1 + Math.max(...normalized.slice(1).map((value) => Math.abs(value)));
  let roots = Array.from({ length: degree }, (_, index) => {
    const angle = (2 * Math.PI * index) / degree + 0.31;
    return {
      re: radius * Math.cos(angle),
      im: radius * Math.sin(angle),
    };
  });

  const maxIterations = 2200;
  const tolerance = 1e-12;
  let converged = false;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let maxChange = 0;
    const nextRoots = roots.map((root, index) => {
      let denominator: Complex = { re: 1, im: 0 };

      roots.forEach((otherRoot, otherIndex) => {
        if (index !== otherIndex) {
          const difference = complexSubtract(root, otherRoot);
          denominator = complexMultiply(denominator, difference);
        }
      });

      if (complexAbs(denominator) < 1e-16) {
        denominator = complexAdd(denominator, { re: 1e-12, im: 1e-12 });
      }

      const correction = complexDivide(
        evaluatePolynomial(normalized, root),
        denominator,
      );
      const nextRoot = complexSubtract(root, correction);
      maxChange = Math.max(maxChange, complexAbs(correction));
      return nextRoot;
    });

    roots = nextRoots;

    if (maxChange < tolerance) {
      converged = true;
      break;
    }
  }

  if (!converged) {
    throw new Error(
      "This polynomial did not converge cleanly. Try values with fewer repeated or very close roots.",
    );
  }

  return roots.map(polishRoot).map(cleanComplex);
}

function polishRoot(root: Complex) {
  return root;
}

function evaluatePolynomial(coefficients: number[], value: Complex) {
  let current: Complex = { re: coefficients[0], im: 0 };

  for (let index = 1; index < coefficients.length; index += 1) {
    current = complexAdd(
      complexMultiply(current, value),
      { re: coefficients[index], im: 0 },
    );
  }

  return current;
}

function complexAdd(first: Complex, second: Complex): Complex {
  return { re: first.re + second.re, im: first.im + second.im };
}

function complexSubtract(first: Complex, second: Complex): Complex {
  return { re: first.re - second.re, im: first.im - second.im };
}

function complexMultiply(first: Complex, second: Complex): Complex {
  return {
    re: first.re * second.re - first.im * second.im,
    im: first.re * second.im + first.im * second.re,
  };
}

function complexDivide(first: Complex, second: Complex): Complex {
  const denominator = second.re * second.re + second.im * second.im;

  if (denominator < 1e-30) {
    throw new Error("A numerical division became unstable. Try a different coefficient scale.");
  }

  return {
    re: (first.re * second.re + first.im * second.im) / denominator,
    im: (first.im * second.re - first.re * second.im) / denominator,
  };
}

function complexAbs(value: Complex) {
  return Math.hypot(value.re, value.im);
}

function cleanComplex(value: Complex): Complex {
  return {
    re: Math.abs(value.re) < ZERO_TOLERANCE ? 0 : value.re,
    im: Math.abs(value.im) < ZERO_TOLERANCE ? 0 : value.im,
  };
}

function formatComplex(value: Complex) {
  const real = formatNumber(value.re);

  if (Math.abs(value.im) < ZERO_TOLERANCE) {
    return real;
  }

  const imaginary = formatNumber(Math.abs(value.im));

  if (Math.abs(value.re) < ZERO_TOLERANCE) {
    return `${value.im < 0 ? "−" : ""}${imaginary}i`;
  }

  return `${real} ${value.im < 0 ? "−" : "+"} ${imaginary}i`;
}

function formatNumber(value: number) {
  const rounded = Number(value.toPrecision(10));

  if (Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001)) {
    return rounded.toExponential(6);
  }

  return String(rounded);
}

function formatResidual(value: number) {
  if (value < 1e-8) {
    return "< 1e-8";
  }

  return value.toExponential(2);
}

function formatPolynomialPreview(coefficients: string[], degree: number) {
  const terms = coefficients
    .map((rawCoefficient, index) => {
      const coefficient = rawCoefficient.trim();
      const power = degree - index;

      if (!coefficient || Number(coefficient) === 0) {
        return null;
      }

      const absoluteCoefficient = Math.abs(Number(coefficient));
      const sign = Number(coefficient) < 0 ? "−" : "+";
      const coefficientText = absoluteCoefficient === 1 && power > 0 ? "" : String(absoluteCoefficient);
      const variableText =
        power === 0 ? "" : power === 1 ? "x" : `x${toSuperscript(power)}`;

      return { sign, text: `${coefficientText}${variableText}` || "0" };
    })
    .filter((term): term is { sign: string; text: string } => Boolean(term));

  if (terms.length === 0) {
    return "0";
  }

  return terms
    .map((term, index) => {
      if (index === 0) {
        return term.sign === "−" ? `−${term.text}` : term.text;
      }

      return ` ${term.sign} ${term.text}`;
    })
    .join("");
}

function toSuperscript(value: number) {
  const characters: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };

  return String(value)
    .split("")
    .map((character) => characters[character] ?? character)
    .join("");
}

function toSubscript(value: number) {
  const characters: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
  };

  return String(value)
    .split("")
    .map((character) => characters[character] ?? character)
    .join("");
}
