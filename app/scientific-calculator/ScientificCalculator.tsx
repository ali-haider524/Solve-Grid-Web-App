"use client";

import { useState } from "react";
import styles from "./ScientificCalculator.module.css";
import {
  calculateExpression,
  formatMathNumber,
  type AngleMode,
} from "../../lib/math-core";

type DisplayNotation = "NORM" | "SCI" | "ENG";
type Overlay = "none" | "mode" | "tools" | "variables" | "constants" | "history" | "notice";
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
  action?: "shift" | "mode" | "tools" | "variables" | "clear" | "delete" | "equals";
  tone: "control" | "function" | "number" | "operator" | "danger" | "equals";
};

const calculatorKeys: CalculatorKey[] = [
  { id: "shift", label: "SHIFT", hint: "2nd", action: "shift", tone: "control" },
  { id: "mode", label: "MODE", hint: "setup", action: "mode", tone: "control" },
  { id: "tools", label: "TOOLS", hint: "menu", action: "tools", tone: "control" },
  { id: "variables", label: "VAR", hint: "store", action: "variables", tone: "control" },
  { id: "clear", label: "AC", hint: "clear", action: "clear", tone: "danger" },

  { id: "sin", label: "sin", hint: "sin⁻¹", value: "sin(", shiftedValue: "asin(", tone: "function" },
  { id: "cos", label: "cos", hint: "cos⁻¹", value: "cos(", shiftedValue: "acos(", tone: "function" },
  { id: "tan", label: "tan", hint: "tan⁻¹", value: "tan(", shiftedValue: "atan(", tone: "function" },
  { id: "log", label: "log", hint: "10ˣ", value: "log(", shiftedValue: "10^(", tone: "function" },
  { id: "ln", label: "ln", hint: "eˣ", value: "ln(", shiftedValue: "2.718281828459045^(", tone: "function" },

  { id: "square", label: "x²", hint: "√", value: "^2", shiftedValue: "sqrt(", tone: "function" },
  { id: "power", label: "xʸ", hint: "1/x", value: "^", shiftedValue: "1/(", tone: "function" },
  { id: "root", label: "√", hint: "abs", value: "sqrt(", shiftedValue: "abs(", tone: "function" },
  { id: "pi", label: "π", hint: "Ans", value: "pi", shiftedValue: "ans", tone: "function" },
  { id: "delete", label: "DEL", hint: "back", action: "delete", tone: "function" },

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
  { id: "open", label: "(", hint: "mod", value: "(", shiftedValue: "%", tone: "function" },
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
    const continuesAnswer = ["+", "-", "*", "/", "^", "%", "^2"].includes(value);

    setExpression((currentExpression) => {
      if (!justEvaluated) {
        return `${currentExpression}${value}`;
      }

      return continuesAnswer ? `${formatForDisplay(lastAnswer, notation)}${value}` : value;
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
      });

      const formattedResult = formatForDisplay(calculation.value, notation);

      setResult(formattedResult);
      setLastAnswer(calculation.value);
      setErrorMessage("");
      setJustEvaluated(true);
      setShiftActive(false);
      setOverlay("none");
      setHistory((currentHistory) => [
        { expression, result: formattedResult },
        ...currentHistory,
      ].slice(0, 10));
    } catch (error) {
      setResult("Error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to calculate this expression.",
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

    const nextValue = shiftActive && key.shiftedValue ? key.shiftedValue : key.value;

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

  function selectTool(tool: "constants" | "variables" | "matrix" | "statistics" | "table" | "convert") {
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

    setNotice(`${labels[tool]} belongs to its own SolveGrid tool, so it can use a proper editable grid instead of a tiny calculator screen.`);
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
    <main className={styles.page}>
      <header className={styles.siteHeader}>
        <a className={styles.brand} href="/">
          <span className={styles.brandMark}>∑</span>
          <span>SolveGrid</span>
        </a>

        <button
          className={styles.historyToggle}
          onClick={() => setOverlay((current) => (current === "history" ? "none" : "history"))}
          type="button"
        >
          History <span>{history.length}</span>
        </button>
      </header>

      <section className={styles.calculatorStage}>
        <article className={styles.device} aria-label="SolveGrid S1 Scientific Calculator">
          <div className={styles.deviceHeader}>
            <div>
              <p>SOLVEGRID S1</p>
              <h1>Scientific / Engineering</h1>
            </div>
            <div className={styles.statusLights} aria-label="Current calculator settings">
              <span>{angleMode}</span>
              <span>{notation}</span>
              <span>REAL</span>
            </div>
          </div>

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
                  placeholder="sin(30) + sqrt(81)"
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

          <p className={errorMessage ? styles.errorMessage : styles.helperMessage}>
            {errorMessage || (shiftActive ? "SHIFT is active. Choose a key with a small upper label." : "MODE changes settings. TOOLS opens advanced workspaces.")}
          </p>

          <div className={styles.keypad} aria-label="Scientific engineering calculator keypad">
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
  onSelectTool: (tool: "constants" | "variables" | "matrix" | "statistics" | "table" | "convert") => void;
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
              className={mode === angleMode ? styles.optionActive : styles.optionButton}
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
              className={mode === notation ? styles.optionActive : styles.optionButton}
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
          <button className={styles.toolActive} type="button" onClick={onClose}>CALC <span>current</span></button>
          <button type="button" onClick={() => onSelectTool("constants")}>CONST <span>values</span></button>
          <button type="button" onClick={() => onSelectTool("variables")}>VARS <span>memory</span></button>
          <button type="button" onClick={() => onSelectTool("matrix")}>MATRIX <span>grid</span></button>
          <button type="button" onClick={() => onSelectTool("statistics")}>STATS <span>data</span></button>
          <button type="button" onClick={() => onSelectTool("table")}>TABLE <span>x-y</span></button>
          <button type="button" onClick={() => onSelectTool("convert")}>CONVERT <span>units</span></button>
        </div>
      </div>
    );
  }

  if (overlay === "variables") {
    return (
      <div className={styles.overlayContent}>
        <OverlayHeader title="VARIABLE MEMORY" onClose={onClose} />
        <div className={styles.memoryActions}>
          <button className={memoryAction === "recall" ? styles.optionActive : styles.optionButton} onClick={() => onSetMemoryAction("recall")} type="button">RECALL</button>
          <button className={memoryAction === "store" ? styles.optionActive : styles.optionButton} onClick={() => onSetMemoryAction("store")} type="button">STORE Ans</button>
        </div>
        <div className={styles.memoryGrid}>
          {memoryNames.map((name) => (
            <button key={name} onClick={() => onSelectMemory(name)} type="button">
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
            <button key={constant.id} onClick={() => onInsertConstant(constant.value)} type="button">
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
        <OverlayHeader title="RECENT HISTORY" onClose={onClose} actionLabel="Clear" onAction={onClearHistory} disabled={history.length === 0} />
        {history.length === 0 ? (
          <p className={styles.emptyState}>Completed calculations appear here.</p>
        ) : (
          <div className={styles.historyList}>
            {history.map((item, index) => (
              <button key={`${item.expression}-${item.result}-${index}`} onClick={() => onRestoreHistory(item)} type="button">
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
      <button className={styles.returnButton} onClick={onClose} type="button">Return to calculator</button>
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

function OverlayHeader({ title, onClose, actionLabel, onAction, disabled }: OverlayHeaderProps) {
  return (
    <div className={styles.overlayHeader}>
      <p>{title}</p>
      <div>
        {actionLabel && onAction && (
          <button disabled={disabled} onClick={onAction} type="button">{actionLabel}</button>
        )}
        <button onClick={onClose} type="button">Close</button>
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
