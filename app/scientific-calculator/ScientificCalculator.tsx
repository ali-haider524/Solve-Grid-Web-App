"use client";

import Link from "next/link";
import ToolHeader from "../../components/ToolHeader";
import { getToolPath, tools } from "../../lib/tools";

import { useState } from "react";
import styles from "./ScientificCalculator.module.css";
import {
  calculateExpression,
  formatMathNumber,
  type AngleMode,
} from "../../lib/math-core";

type DisplayNotation = "NORM" | "SCI" | "ENG";
type Overlay =
  "none" | "mode" | "tools" | "variables" | "constants" | "history" | "notice";
type MemoryName = "A" | "B" | "C" | "X" | "Y";
type MemoryAction = "recall" | "store";

type HistoryItem = {
  expression: string;
  result: string;
};

type CalculatorKey = {
  id: string;
  label: string;
  hint?: string;
  value?: string;
  shiftedValue?: string;
  action?:
    "shift" | "mode" | "tools" | "variables" | "clear" | "delete" | "equals";
  tone: "control" | "function" | "number" | "operator" | "danger" | "equals";
};

const calculatorKeys: CalculatorKey[] = [
  {
    id: "shift",
    label: "SHIFT",
    hint: "2nd",
    action: "shift",
    tone: "control",
  },
  { id: "mode", label: "MODE", hint: "setup", action: "mode", tone: "control" },
  {
    id: "tools",
    label: "TOOLS",
    hint: "menu",
    action: "tools",
    tone: "control",
  },
  {
    id: "variables",
    label: "VAR",
    hint: "store",
    action: "variables",
    tone: "control",
  },
  { id: "clear", label: "AC", hint: "clear", action: "clear", tone: "danger" },

  {
    id: "sin",
    label: "sin",
    hint: "sin⁻¹",
    value: "sin(",
    shiftedValue: "asin(",
    tone: "function",
  },
  {
    id: "cos",
    label: "cos",
    hint: "cos⁻¹",
    value: "cos(",
    shiftedValue: "acos(",
    tone: "function",
  },
  {
    id: "tan",
    label: "tan",
    hint: "tan⁻¹",
    value: "tan(",
    shiftedValue: "atan(",
    tone: "function",
  },
  {
    id: "log",
    label: "log",
    hint: "10ˣ",
    value: "log(",
    shiftedValue: "10^(",
    tone: "function",
  },
  {
    id: "ln",
    label: "ln",
    hint: "eˣ",
    value: "ln(",
    shiftedValue: "2.718281828459045^(",
    tone: "function",
  },

  {
    id: "square",
    label: "x²",
    hint: "√",
    value: "^2",
    shiftedValue: "sqrt(",
    tone: "function",
  },
  {
    id: "power",
    label: "xʸ",
    hint: "1/x",
    value: "^",
    shiftedValue: "1/(",
    tone: "function",
  },
  {
    id: "root",
    label: "√",
    hint: "abs",
    value: "sqrt(",
    shiftedValue: "abs(",
    tone: "function",
  },
  {
    id: "pi",
    label: "π",
    hint: "Ans",
    value: "pi",
    shiftedValue: "ans",
    tone: "function",
  },
  {
    id: "delete",
    label: "DEL",
    hint: "back",
    action: "delete",
    tone: "function",
  },

  { id: "seven", label: "7", value: "7", tone: "number" },
  { id: "eight", label: "8", value: "8", tone: "number" },
  { id: "nine", label: "9", value: "9", tone: "number" },
  { id: "divide", label: "÷", value: "/", tone: "operator" },
  { id: "multiply", label: "×", value: "*", tone: "operator" },

  { id: "four", label: "4", value: "4", tone: "number" },
  { id: "five", label: "5", value: "5", tone: "number" },
  { id: "six", label: "6", value: "6", tone: "number" },
  { id: "minus", label: "−", value: "-", tone: "operator" },
  { id: "plus", label: "+", value: "+", tone: "operator" },

  { id: "one", label: "1", value: "1", tone: "number" },
  { id: "two", label: "2", value: "2", tone: "number" },
  { id: "three", label: "3", value: "3", tone: "number" },
  {
    id: "open",
    label: "(",
    hint: "mod",
    value: "(",
    shiftedValue: "%",
    tone: "function",
  },
  { id: "close", label: ")", hint: "comma", value: ")", tone: "function" },

  { id: "zero", label: "0", value: "0", tone: "number" },
  { id: "decimal", label: ".", value: ".", tone: "number" },
  { id: "negative", label: "(−)", hint: "neg", value: "-", tone: "function" },
  { id: "exp", label: "EXP", hint: "sci", value: "e", tone: "function" },
  { id: "equals", label: "=", hint: "solve", action: "equals", tone: "equals" },
];

const memoryNames: MemoryName[] = ["A", "B", "C", "X", "Y"];

const constants = [
  { id: "pi", symbol: "π", name: "Pi", value: "pi" },
  { id: "e", symbol: "e", name: "Euler number", value: "2.718281828459045" },
  { id: "g", symbol: "g", name: "Gravity", value: "9.80665" },
  { id: "c", symbol: "c", name: "Light speed", value: "299792458" },
  { id: "h", symbol: "h", name: "Planck constant", value: "6.62607015e-34" },
];

const quickExamples = [
  { label: "Powers and roots", expression: "sqrt(81) + 2^5" },
  { label: "Combinations", expression: "ncr(8,2)" },
  { label: "Integer tools", expression: "gcd(48,18)" },
  { label: "Scientific form", expression: "2.5e3 / 4" },
  { label: "Engineering value", expression: "12500" },
  { label: "Micro value", expression: "47e-6" },
];

const connectedTools = tools.filter(
  (tool) => tool.slug !== "scientific-calculator",
);

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [lastAnswer, setLastAnswer] = useState(0);
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [notation, setNotation] = useState<DisplayNotation>("NORM");
  const [shiftActive, setShiftActive] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [memoryAction, setMemoryAction] = useState<MemoryAction>("recall");
  const [memory, setMemory] = useState<Record<MemoryName, number>>({
    A: 0,
    B: 0,
    C: 0,
    X: 0,
    Y: 0,
  });

  function appendToExpression(value: string) {
    const continuesAnswer = ["+", "-", "*", "/", "^", "%", "^2"].includes(
      value,
    );

    setExpression((currentExpression) => {
      if (!justEvaluated) {
        return `${currentExpression}${value}`;
      }

      return continuesAnswer
        ? `${formatForDisplay(lastAnswer, notation)}${value}`
        : value;
    });

    setErrorMessage("");
    setJustEvaluated(false);
  }

  function clearCalculator() {
    setExpression("");
    setResult("0");
    setErrorMessage("");
    setJustEvaluated(false);
    setShiftActive(false);
    setOverlay("none");
  }

  function loadExample(expressionValue: string) {
    setExpression(expressionValue);
    setResult("0");
    setErrorMessage("");
    setJustEvaluated(false);
    setShiftActive(false);
    setOverlay("none");
  }

  function deleteLastCharacter() {
    setExpression((currentExpression) => currentExpression.slice(0, -1));
    setErrorMessage("");
    setJustEvaluated(false);
  }

  function calculateResult() {
    if (!expression.trim()) {
      return;
    }

    try {
      const calculation = calculateExpression(expression, {
        angleMode,
        ans: lastAnswer,
        variables: memory,
      });

      const formattedResult = formatForDisplay(calculation.value, notation);

      setResult(formattedResult);
      setLastAnswer(calculation.value);
      setErrorMessage("");
      setJustEvaluated(true);
      setShiftActive(false);
      setOverlay("none");
      setHistory((currentHistory) =>
        [{ expression, result: formattedResult }, ...currentHistory].slice(
          0,
          10,
        ),
      );
    } catch (error) {
      setResult("Error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to calculate this expression.",
      );
      setJustEvaluated(false);
    }
  }

  function handleKey(key: CalculatorKey) {
    if (key.action === "shift") {
      setShiftActive((active) => !active);
      return;
    }

    if (key.action === "mode") {
      setOverlay((current) => (current === "mode" ? "none" : "mode"));
      setShiftActive(false);
      return;
    }

    if (key.action === "tools") {
      setOverlay((current) => (current === "tools" ? "none" : "tools"));
      setShiftActive(false);
      return;
    }

    if (key.action === "variables") {
      setOverlay((current) => (current === "variables" ? "none" : "variables"));
      setMemoryAction("recall");
      setShiftActive(false);
      return;
    }

    if (key.action === "clear") {
      clearCalculator();
      return;
    }

    if (key.action === "delete") {
      deleteLastCharacter();
      setShiftActive(false);
      return;
    }

    if (key.action === "equals") {
      calculateResult();
      return;
    }

    const nextValue =
      shiftActive && key.shiftedValue ? key.shiftedValue : key.value;

    if (nextValue) {
      appendToExpression(nextValue);
      setShiftActive(false);
    }
  }

  function updateAngleMode(nextAngleMode: AngleMode) {
    setAngleMode(nextAngleMode);
  }

  function updateNotation(nextNotation: DisplayNotation) {
    setNotation(nextNotation);

    if (result !== "Error") {
      setResult(formatForDisplay(lastAnswer, nextNotation));
    }
  }

  function selectTool(
    tool:
      "constants" | "variables" | "matrix" | "statistics" | "table" | "convert",
  ) {
    if (tool === "constants") {
      setOverlay("constants");
      return;
    }

    if (tool === "variables") {
      setMemoryAction("recall");
      setOverlay("variables");
      return;
    }

    const labels = {
      matrix: "Matrix & Vector workspace",
      statistics: "Statistics workspace",
      table: "Function table workspace",
      convert: "Unit conversion workspace",
    };

    setNotice(
      `${labels[tool]} belongs to its own SolveGrid tool, so it can use a proper editable grid instead of a tiny calculator screen.`,
    );
    setOverlay("notice");
  }

  function selectMemory(memoryName: MemoryName) {
    if (memoryAction === "store") {
      setMemory((currentMemory) => ({
        ...currentMemory,
        [memoryName]: lastAnswer,
      }));
      setMemoryAction("recall");
      return;
    }

    appendToExpression(formatForDisplay(memory[memoryName], notation));
    setOverlay("none");
  }

  function insertConstant(value: string) {
    appendToExpression(value);
    setOverlay("none");
  }

  function restoreHistoryItem(item: HistoryItem) {
    setExpression(item.expression);
    setResult(item.result);

    const restoredAnswer = Number(item.result);

    if (Number.isFinite(restoredAnswer)) {
      setLastAnswer(restoredAnswer);
    }

    setErrorMessage("");
    setJustEvaluated(true);
    setOverlay("none");
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="engineering" />

      <section
        className={styles.intro}
        aria-labelledby="scientific-calculator-title"
      >
        <p>FREE SCIENTIFIC & ENGINEERING CALCULATOR ONLINE</p>
        <h1 id="scientific-calculator-title">
          Scientific and Engineering Calculator Online
        </h1>
        <span>
          Evaluate trigonometry, powers, roots, logarithms, factorials,
          combinations, integer functions, engineering constants, scientific
          notation, and engineering notation directly in your browser.
        </span>
      </section>

      <section
        className={styles.calculatorStage}
        aria-label="Scientific calculator workspace"
      >
        <article
          className={styles.device}
          aria-label="SolveGrid Scientific Calculator"
        >
          <header className={styles.deviceHeader}>
            <div>
              <p>SCIENTIFIC & ENGINEERING WORKSPACE</p>
              <h2>Scientific engineering calculator</h2>
            </div>
            <div className={styles.deviceMeta}>
              <div
                className={styles.statusLights}
                aria-label="Current calculator settings"
              >
                <span>{angleMode}</span>
                <span>{notation}</span>
                <span>REAL</span>
              </div>
              <button
                className={styles.historyToggle}
                onClick={() =>
                  setOverlay((current) =>
                    current === "history" ? "none" : "history",
                  )
                }
                type="button"
              >
                History <span>{history.length}</span>
              </button>
            </div>
          </header>

          <section className={styles.display}>
            {overlay === "none" ? (
              <>
                <div className={styles.displayTopline}>
                  <span>CALC</span>
                  <span>{shiftActive ? "SHIFT READY" : "READY"}</span>
                </div>
                <label className={styles.displayLabel} htmlFor="expression">
                  EXPRESSION
                </label>
                <input
                  id="expression"
                  className={styles.expressionInput}
                  value={expression}
                  onChange={(event) => {
                    setExpression(event.target.value);
                    setErrorMessage("");
                    setJustEvaluated(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      calculateResult();
                    }

                    if (event.key === "Escape") {
                      event.preventDefault();
                      clearCalculator();
                    }
                  }}
                  placeholder="Example: 12500 or sqrt(81) + 2^5"
                  spellCheck={false}
                  inputMode="decimal"
                />
                <div className={styles.resultLine} aria-live="polite">
                  <span className={styles.displayLabel}>RESULT</span>
                  <strong>{result}</strong>
                </div>
              </>
            ) : (
              <DisplayOverlay
                angleMode={angleMode}
                history={history}
                memory={memory}
                memoryAction={memoryAction}
                notice={notice}
                notation={notation}
                overlay={overlay}
                onClose={() => setOverlay("none")}
                onClearHistory={() => setHistory([])}
                onInsertConstant={insertConstant}
                onSelectMemory={selectMemory}
                onSelectTool={selectTool}
                onSetAngleMode={updateAngleMode}
                onSetMemoryAction={setMemoryAction}
                onSetNotation={updateNotation}
                onRestoreHistory={restoreHistoryItem}
              />
            )}
          </section>

          <p
            className={
              errorMessage ? styles.errorMessage : styles.helperMessage
            }
            aria-live="polite"
          >
            {errorMessage ||
              (shiftActive
                ? "SHIFT is active. Choose a key with a small upper label."
                : "Use the keypad or type directly. Press Enter or = to evaluate the expression.")}
          </p>

          <div
            className={styles.keypad}
            aria-label="Scientific engineering calculator keypad"
          >
            {calculatorKeys.map((key) => (
              <button
                className={`${styles.key} ${styles[key.tone]} ${key.id === "shift" && shiftActive ? styles.shiftPressed : ""}`}
                key={key.id}
                onClick={() => handleKey(key)}
                type="button"
              >
                {key.hint && <span className={styles.keyHint}>{key.hint}</span>}
                <span className={styles.keyLabel}>{key.label}</span>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section
        className={styles.quickExamplesPanel}
        aria-label="Quick scientific calculator examples"
      >
        <p>QUICK INPUTS FOR SCIENCE & ENGINEERING</p>
        <div>
          {quickExamples.map((example) => (
            <button
              key={example.label}
              onClick={() => loadExample(example.expression)}
              type="button"
            >
              <strong>{example.label}</strong>
              <code>{example.expression}</code>
            </button>
          ))}
        </div>
      </section>

      <section
        className={styles.learningSection}
        aria-labelledby="scientific-calculator-guide-title"
      >
        <header className={styles.learningHeader}>
          <p>HOW THIS SCIENTIFIC AND ENGINEERING CALCULATOR HELPS</p>
          <h2 id="scientific-calculator-guide-title">
            Use the right function, angle mode, and notation for technical work.
          </h2>
          <span>
            This engineering calculator is designed for focused numeric work.
            Enter a calculation, check DEG or RAD, choose normal, scientific, or
            engineering notation, then move to a dedicated SolveGrid workspace
            when the task needs a graph, matrix, data analysis, or unit conversion.
          </span>
        </header>

        <div className={styles.featureGrid}>
          <article>
            <p>TRIGONOMETRY</p>
            <h3>Degrees and radians</h3>
            <span>
              Use sin, cos, tan, and their inverse functions. Choose DEG for
              degree-based questions and RAD for radian-based questions before
              evaluating.
            </span>
          </article>
          <article>
            <p>POWERS AND LOGS</p>
            <h3>Roots, exponents, and logarithms</h3>
            <span>
              Evaluate powers, square roots, logarithms, natural logarithms,
              absolute value, and exponential expressions in one line.
            </span>
          </article>
          <article>
            <p>COUNTING AND INTEGER TOOLS</p>
            <h3>Factorials, combinations, and GCD</h3>
            <span>
              Use functions such as fact(), ncr(), npr(), gcd(), and lcm() for
              counting problems and integer calculations.
            </span>
          </article>
          <article>
            <p>ENGINEERING FORMAT</p>
            <h3>Scientific and engineering notation</h3>
            <span>
              Enter values such as 2.5e3, 12500, or 47e-6. Use MODE to display
              results in normal, scientific, or engineering notation where ENG
              keeps powers of ten in multiples of three.
            </span>
          </article>
          <article>
            <p>MEMORY AND CONSTANTS</p>
            <h3>Reuse answers and values</h3>
            <span>
              Use Ans for the last result, store values in A, B, C, X, or Y, and
              insert selected constants from the TOOLS menu.
            </span>
          </article>
          <article>
            <p>HISTORY</p>
            <h3>Review recent calculations</h3>
            <span>
              Open History to restore a recent expression and result. This is
              useful when comparing a sequence of calculations.
            </span>
          </article>
        </div>

        <div className={styles.learningColumns}>
          <article className={styles.workflowCard}>
            <p>QUICK START</p>
            <h2>How to use the calculator</h2>
            <ol>
              <li>
                <strong>Enter an expression.</strong>
                <span>
                  Use the keypad or type directly. Write multiplication as{" "}
                  <code>*</code>, division as <code>/</code>, and exponents as{" "}
                  <code>^</code>.
                </span>
              </li>
              <li>
                <strong>Set the correct angle mode.</strong>
                <span>
                  Open MODE before trigonometry. For example,{" "}
                  <code>sin(30)</code> equals 0.5 only when the calculator is
                  set to DEG.
                </span>
              </li>
              <li>
                <strong>Evaluate and check.</strong>
                <span>
                  Press Enter or =. Read the expression again, especially
                  brackets, powers, negative signs, and units outside the
                  calculator.
                </span>
              </li>
              <li>
                <strong>Choose an output format.</strong>
                <span>
                  Use NORM for everyday output, SCI for powers of ten, and ENG
                  when you want engineering notation such as <code>12.5e3</code>
                  instead of <code>1.25e4</code>.
                </span>
              </li>
            </ol>
          </article>

          <article className={styles.examplesCard}>
            <p>WORKED INPUT EXAMPLES</p>
            <h2>Expressions you can try</h2>
            <div>
              <button
                onClick={() => loadExample("sqrt(81) + 2^5")}
                type="button"
              >
                <code>sqrt(81) + 2^5</code>
                <span>Root and exponent → 41</span>
              </button>
              <button
                onClick={() => loadExample("fact(5) + ncr(8,2)")}
                type="button"
              >
                <code>fact(5) + ncr(8,2)</code>
                <span>Factorial and combinations → 148</span>
              </button>
              <button onClick={() => loadExample("gcd(48,18)")} type="button">
                <code>gcd(48,18)</code>
                <span>Greatest common divisor → 6</span>
              </button>
              <button onClick={() => loadExample("2.5e3 / 4")} type="button">
                <code>2.5e3 / 4</code>
                <span>Scientific notation → 625</span>
              </button>
              <button onClick={() => loadExample("12500")} type="button">
                <code>12500</code>
                <span>ENG mode → 12.5e3</span>
              </button>
              <button onClick={() => loadExample("47e-6")} type="button">
                <code>47e-6</code>
                <span>ENG mode → 47e-6</span>
              </button>
            </div>
          </article>
        </div>

        <div className={styles.learningColumns}>
          <article className={styles.workflowCard}>
            <p>ENGINEERING NOTATION</p>
            <h2>How engineering notation works</h2>
            <ol>
              <li>
                <strong>Scientific notation uses any power of ten.</strong>
                <span>
                  For example, <code>12500</code> can be written as{" "}
                  <code>1.25e4</code>.
                </span>
              </li>
              <li>
                <strong>Engineering notation uses powers in groups of three.</strong>
                <span>
                  The same value can be shown as <code>12.5e3</code>, which
                  matches kilo-style engineering units.
                </span>
              </li>
              <li>
                <strong>Small technical values become easier to read.</strong>
                <span>
                  A capacitor value such as <code>47e-6</code> farads is often
                  read as 47 microfarads in engineering work.
                </span>
              </li>
            </ol>
          </article>

          <article className={styles.examplesCard}>
            <p>COMMON SEARCH QUESTIONS</p>
            <h2>Quick answers before you calculate</h2>
            <div>
              <button onClick={() => loadExample("12500")} type="button">
                <code>What is engineering notation?</code>
                <span>Use exponents in multiples of 3</span>
              </button>
              <button onClick={() => loadExample("0.000047")} type="button">
                <code>Scientific vs engineering notation</code>
                <span>SCI: 4.7e-5, ENG: 47e-6</span>
              </button>
              <button onClick={() => loadExample("9.80665 * 12")} type="button">
                <code>Engineering calculator online</code>
                <span>Use constants, powers, logs, and notation modes</span>
              </button>
            </div>
          </article>
        </div>

        <aside className={styles.nextTools}>
          <div>
            <p>USE A DEDICATED WORKSPACE WHEN NEEDED</p>
            <h2>Continue the problem in the right tool.</h2>
          </div>
          <div>
            <Link href="/guides/engineering-notation-and-scientific-notation">
              <strong>Engineering notation guide</strong>
              <span>Compare SCI, ENG, powers of ten, and SI prefixes.</span>
            </Link>
            <Link href="/graphing-calculator">
              <strong>Graphing Calculator</strong>
              <span>Plot functions, tables, roots, and intersections.</span>
            </Link>
            <Link href="/matrix-calculator">
              <strong>Matrix Calculator</strong>
              <span>Work with matrices, RREF, rank, inverse, and systems.</span>
            </Link>
            <Link href="/unit-converter">
              <strong>Unit Converter</strong>
              <span>Convert engineering, science, and everyday units.</span>
            </Link>
          </div>
        </aside>

        <p className={styles.accuracyNote}>
          Check important results independently and follow your teacher,
          institution, or exam rules for calculator use. Numeric output can
          depend on the selected angle mode, notation, input order, and
          rounding. For technical values, open MODE and compare SCI with ENG
          so the result matches the notation style required by your problem.
        </p>
      </section>
    </main>
  );
}

type DisplayOverlayProps = {
  angleMode: AngleMode;
  notation: DisplayNotation;
  overlay: Overlay;
  notice: string;
  history: HistoryItem[];
  memory: Record<MemoryName, number>;
  memoryAction: MemoryAction;
  onClose: () => void;
  onSetAngleMode: (mode: AngleMode) => void;
  onSetNotation: (notation: DisplayNotation) => void;
  onSelectTool: (
    tool:
      "constants" | "variables" | "matrix" | "statistics" | "table" | "convert",
  ) => void;
  onSetMemoryAction: (action: MemoryAction) => void;
  onSelectMemory: (name: MemoryName) => void;
  onInsertConstant: (value: string) => void;
  onClearHistory: () => void;
  onRestoreHistory: (item: HistoryItem) => void;
};

function DisplayOverlay({
  angleMode,
  notation,
  overlay,
  notice,
  history,
  memory,
  memoryAction,
  onClose,
  onSetAngleMode,
  onSetNotation,
  onSelectTool,
  onSetMemoryAction,
  onSelectMemory,
  onInsertConstant,
  onClearHistory,
  onRestoreHistory,
}: DisplayOverlayProps) {
  if (overlay === "mode") {
    return (
      <div className={styles.overlayContent}>
        <OverlayHeader title="MODE SETTINGS" onClose={onClose} />
        <p className={styles.overlayLabel}>ANGLE</p>
        <div className={styles.optionRow}>
          {(["DEG", "RAD"] as AngleMode[]).map((mode) => (
            <button
              className={
                mode === angleMode ? styles.optionActive : styles.optionButton
              }
              key={mode}
              onClick={() => onSetAngleMode(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
        <p className={styles.overlayLabel}>NUMBER FORMAT</p>
        <div className={styles.optionRow}>
          {(["NORM", "SCI", "ENG"] as DisplayNotation[]).map((mode) => (
            <button
              className={
                mode === notation ? styles.optionActive : styles.optionButton
              }
              key={mode}
              onClick={() => onSetNotation(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (overlay === "tools") {
    return (
      <div className={styles.overlayContent}>
        <OverlayHeader title="TOOLS MENU" onClose={onClose} />
        <div className={styles.toolGrid}>
          <button className={styles.toolActive} type="button" onClick={onClose}>
            CALC <span>current</span>
          </button>
          <button type="button" onClick={() => onSelectTool("constants")}>
            CONST <span>values</span>
          </button>
          <button type="button" onClick={() => onSelectTool("variables")}>
            VARS <span>memory</span>
          </button>
          {connectedTools.map((tool) => (
            <Link href={getToolPath(tool)} key={tool.slug}>
              {tool.shortName.toUpperCase()} <span>{tool.category}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (overlay === "variables") {
    return (
      <div className={styles.overlayContent}>
        <OverlayHeader title="VARIABLE MEMORY" onClose={onClose} />
        <div className={styles.memoryActions}>
          <button
            className={
              memoryAction === "recall"
                ? styles.optionActive
                : styles.optionButton
            }
            onClick={() => onSetMemoryAction("recall")}
            type="button"
          >
            RECALL
          </button>
          <button
            className={
              memoryAction === "store"
                ? styles.optionActive
                : styles.optionButton
            }
            onClick={() => onSetMemoryAction("store")}
            type="button"
          >
            STORE Ans
          </button>
        </div>
        <div className={styles.memoryGrid}>
          {memoryNames.map((name) => (
            <button
              key={name}
              onClick={() => onSelectMemory(name)}
              type="button"
            >
              <strong>{name}</strong>
              <span>{formatMathNumber(memory[name])}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (overlay === "constants") {
    return (
      <div className={styles.overlayContent}>
        <OverlayHeader title="ENGINEERING CONSTANTS" onClose={onClose} />
        <div className={styles.constantsList}>
          {constants.map((constant) => (
            <button
              key={constant.id}
              onClick={() => onInsertConstant(constant.value)}
              type="button"
            >
              <strong>{constant.symbol}</strong>
              <span>{constant.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (overlay === "history") {
    return (
      <div className={styles.overlayContent}>
        <OverlayHeader
          title="RECENT HISTORY"
          onClose={onClose}
          actionLabel="Clear"
          onAction={onClearHistory}
          disabled={history.length === 0}
        />
        {history.length === 0 ? (
          <p className={styles.emptyState}>
            Completed calculations appear here.
          </p>
        ) : (
          <div className={styles.historyList}>
            {history.map((item, index) => (
              <button
                key={`${item.expression}-${item.result}-${index}`}
                onClick={() => onRestoreHistory(item)}
                type="button"
              >
                <span>{item.expression}</span>
                <strong>= {item.result}</strong>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.overlayContent}>
      <OverlayHeader title="WORKSPACE NOTICE" onClose={onClose} />
      <p className={styles.noticeText}>{notice}</p>
      <button className={styles.returnButton} onClick={onClose} type="button">
        Return to calculator
      </button>
    </div>
  );
}

type OverlayHeaderProps = {
  title: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
};

function OverlayHeader({
  title,
  onClose,
  actionLabel,
  onAction,
  disabled,
}: OverlayHeaderProps) {
  return (
    <div className={styles.overlayHeader}>
      <p>{title}</p>
      <div>
        {actionLabel && onAction && (
          <button disabled={disabled} onClick={onAction} type="button">
            {actionLabel}
          </button>
        )}
        <button onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  );
}

function formatForDisplay(value: number, notation: DisplayNotation) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (notation === "NORM") {
    return formatMathNumber(value);
  }

  if (notation === "SCI") {
    return value.toExponential(8);
  }

  if (value === 0) {
    return "0";
  }

  const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
  const scaled = value / Math.pow(10, exponent);

  return `${Number(scaled.toPrecision(9))}e${exponent}`;
}
