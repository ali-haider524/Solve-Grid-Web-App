"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./PercentageCalculator.module.css";

type Mode =
  | "of"
  | "what-percent"
  | "change"
  | "increase"
  | "decrease"
  | "reverse-increase"
  | "reverse-decrease"
  | "markup"
  | "margin"
  | "compound";

type FieldKey = "a" | "b" | "c";

type Calculation = {
  result: number | null;
  statement: string;
  formula: string;
  detail?: string;
};

type ModeDefinition = {
  id: Mode;
  label: string;
  shortLabel: string;
  question: string;
  fields: Array<{ key: FieldKey; label: string; suffix?: string; hint?: string }>;
};

const modes: ModeDefinition[] = [
  {
    id: "of",
    label: "Percent of a value",
    shortLabel: "A% of B",
    question: "Find the percentage amount, such as 15% of 240.",
    fields: [
      { key: "a", label: "Percentage", suffix: "%", hint: "Example: 15" },
      { key: "b", label: "Value", hint: "Example: 240" },
    ],
  },
  {
    id: "what-percent",
    label: "Find percentage",
    shortLabel: "Part of whole",
    question: "Find what percent one number is of another number.",
    fields: [
      { key: "a", label: "Part", hint: "Example: 30" },
      { key: "b", label: "Whole", hint: "Example: 120" },
    ],
  },
  {
    id: "change",
    label: "Percentage change",
    shortLabel: "% change",
    question: "Find percentage increase or percentage decrease from old value to new value.",
    fields: [
      { key: "a", label: "Original value", hint: "Example: 80" },
      { key: "b", label: "New value", hint: "Example: 100" },
    ],
  },
  {
    id: "increase",
    label: "Increase by %",
    shortLabel: "Add %",
    question: "Increase a value by a percentage rate.",
    fields: [
      { key: "a", label: "Original value", hint: "Example: 500" },
      { key: "b", label: "Increase", suffix: "%", hint: "Example: 12" },
    ],
  },
  {
    id: "decrease",
    label: "Decrease by %",
    shortLabel: "Minus %",
    question: "Decrease a value by a percentage rate.",
    fields: [
      { key: "a", label: "Original value", hint: "Example: 850" },
      { key: "b", label: "Decrease", suffix: "%", hint: "Example: 20" },
    ],
  },
  {
    id: "reverse-increase",
    label: "Reverse % increase",
    shortLabel: "Before increase",
    question: "Find the original value before a percentage increase was applied.",
    fields: [
      { key: "a", label: "Final value", hint: "Example: 120" },
      { key: "b", label: "Increase", suffix: "%", hint: "Example: 20" },
    ],
  },
  {
    id: "reverse-decrease",
    label: "Reverse % decrease",
    shortLabel: "Before discount",
    question: "Find the original value before a percentage decrease or discount.",
    fields: [
      { key: "a", label: "Final value", hint: "Example: 80" },
      { key: "b", label: "Decrease", suffix: "%", hint: "Example: 20" },
    ],
  },
  {
    id: "markup",
    label: "Markup",
    shortLabel: "Markup",
    question: "Find selling price from cost and markup percentage.",
    fields: [
      { key: "a", label: "Cost", hint: "Example: 150" },
      { key: "b", label: "Markup", suffix: "%", hint: "Example: 30" },
    ],
  },
  {
    id: "margin",
    label: "Profit margin",
    shortLabel: "Margin",
    question: "Find profit margin from cost and selling price.",
    fields: [
      { key: "a", label: "Cost", hint: "Example: 150" },
      { key: "b", label: "Selling price", hint: "Example: 200" },
    ],
  },
  {
    id: "compound",
    label: "Compound growth",
    shortLabel: "Growth",
    question: "Apply the same percentage rate over multiple periods.",
    fields: [
      { key: "a", label: "Starting value", hint: "Example: 1000" },
      { key: "b", label: "Rate per period", suffix: "%", hint: "Example: 5" },
      { key: "c", label: "Periods", hint: "Example: 3" },
    ],
  },
];

const examples: Array<{
  title: string;
  description: string;
  mode: Mode;
  values: Record<FieldKey, string>;
  answer: string;
}> = [
  {
    title: "How to find percentage increase",
    description: "80 to 100 gives a 25% increase.",
    mode: "change",
    values: { a: "80", b: "100", c: "1" },
    answer: "(100 − 80) ÷ 80 × 100 = 25%",
  },
  {
    title: "Percent of a number",
    description: "15% of 240 is 36.",
    mode: "of",
    values: { a: "15", b: "240", c: "1" },
    answer: "15 × 240 ÷ 100 = 36",
  },
  {
    title: "Reverse a discount",
    description: "A final price of 80 after 20% off started at 100.",
    mode: "reverse-decrease",
    values: { a: "80", b: "20", c: "1" },
    answer: "80 ÷ (1 − 20 ÷ 100) = 100",
  },
  {
    title: "Markup vs margin",
    description: "Cost 150 and sell 200 gives 25% margin.",
    mode: "margin",
    values: { a: "150", b: "200", c: "1" },
    answer: "(200 − 150) ÷ 200 × 100 = 25%",
  },
];

const formulaCards = [
  {
    title: "Percentage increase formula",
    formula: "(new value − original value) ÷ original value × 100",
    body: "Use this when a value goes up, for example from 80 to 100. The original value is the base, so the increase is compared with 80, not with 100.",
  },
  {
    title: "Percentage decrease formula",
    formula: "(original value − new value) ÷ original value × 100",
    body: "Use this for a fall in price, marks, quantity, or measurement. A drop from 200 to 150 is a 25% decrease because 50 is one quarter of 200.",
  },
  {
    title: "Percent of a number",
    formula: "percentage × value ÷ 100",
    body: "Use this for questions such as 12% of 450, tax on a price, a commission amount, or a discount amount before subtracting it from the original price.",
  },
  {
    title: "Reverse percentage",
    formula: "final value ÷ (1 ± rate ÷ 100)",
    body: "Use reverse percentage when you know the final value after an increase or decrease and need the starting value before the percentage was applied.",
  },
];

const queryAnswers = [
  {
    question: "How do I find percentage increase?",
    answer:
      "Subtract the original value from the new value, divide by the original value, then multiply by 100. For example, from 80 to 100: (100 − 80) ÷ 80 × 100 = 25%.",
  },
  {
    question: "What is the difference between percentage change and percent of a number?",
    answer:
      "Percent of a number finds a portion, such as 15% of 240. Percentage change compares two values and tells how much the second value rose or fell compared with the first value.",
  },
  {
    question: "Why is the original value important?",
    answer:
      "Percentage increase and decrease always use the original value as the base. Using the new value as the base gives a different result and is a common mistake.",
  },
  {
    question: "Should I use markup or profit margin?",
    answer:
      "Markup compares profit with cost. Margin compares profit with selling price. Shops often use markup for pricing and margin for reporting profitability.",
  },
];

function numeric(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function format(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  if (Object.is(value, -0)) return "0";
  const rounded = Number(value.toPrecision(12));
  return Math.abs(rounded) >= 1e9 ||
    (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)
    ? rounded.toExponential(6)
    : String(rounded);
}

function calculate(mode: Mode, value: Record<FieldKey, number | null>): Calculation {
  const { a, b, c } = value;

  if (a === null || b === null || (mode === "compound" && c === null)) {
    return { result: null, statement: "Enter valid numbers to calculate.", formula: "—" };
  }

  if (mode === "of") {
    return {
      result: (a * b) / 100,
      statement: `${format(a)}% of ${format(b)} equals`,
      formula: "percentage × value ÷ 100",
      detail: "Use this for discount amounts, tax amounts, commissions, or any part-of-a-whole percentage question.",
    };
  }

  if (mode === "what-percent") {
    return b === 0
      ? {
          result: null,
          statement: "The whole value cannot be zero.",
          formula: "part ÷ whole × 100",
        }
      : {
          result: (a / b) * 100,
          statement: `${format(a)} is what percent of ${format(b)}?`,
          formula: "part ÷ whole × 100",
          detail: "The whole value is the base of the comparison.",
        };
  }

  if (mode === "change") {
    return a === 0
      ? {
          result: null,
          statement: "The original value cannot be zero for percentage change.",
          formula: "(new − original) ÷ original × 100",
        }
      : {
          result: ((b - a) / a) * 100,
          statement: `Change from ${format(a)} to ${format(b)} is`,
          formula: "(new − original) ÷ original × 100",
          detail:
            b >= a
              ? "This is a percentage increase compared with the original value."
              : "This is a percentage decrease compared with the original value.",
        };
  }

  if (mode === "increase") {
    return {
      result: a * (1 + b / 100),
      statement: `${format(a)} increased by ${format(b)}% equals`,
      formula: "original × (1 + rate ÷ 100)",
      detail: "This gives the final value after the percentage increase is applied.",
    };
  }

  if (mode === "decrease") {
    return {
      result: a * (1 - b / 100),
      statement: `${format(a)} decreased by ${format(b)}% equals`,
      formula: "original × (1 − rate ÷ 100)",
      detail: "This gives the final value after the percentage decrease is applied.",
    };
  }

  if (mode === "reverse-increase") {
    return 1 + b / 100 === 0
      ? {
          result: null,
          statement: "This rate does not produce a valid reverse calculation.",
          formula: "final ÷ (1 + rate ÷ 100)",
        }
      : {
          result: a / (1 + b / 100),
          statement: `Original value before a ${format(b)}% increase was`,
          formula: "final ÷ (1 + rate ÷ 100)",
          detail: "Use this when the current value already includes an increase.",
        };
  }

  if (mode === "reverse-decrease") {
    return 1 - b / 100 === 0
      ? {
          result: null,
          statement: "A 100% decrease cannot be reversed to one original value.",
          formula: "final ÷ (1 − rate ÷ 100)",
        }
      : {
          result: a / (1 - b / 100),
          statement: `Original value before a ${format(b)}% decrease was`,
          formula: "final ÷ (1 − rate ÷ 100)",
          detail: "Use this for original price before discount, original value before loss, or reverse percentage questions.",
        };
  }

  if (mode === "markup") {
    return {
      result: a * (1 + b / 100),
      statement: `Selling price with ${format(b)}% markup is`,
      formula: "cost × (1 + markup ÷ 100)",
      detail: "Markup is measured against cost price.",
    };
  }

  if (mode === "margin") {
    return b === 0
      ? {
          result: null,
          statement: "Selling price cannot be zero for profit margin.",
          formula: "(selling price − cost) ÷ selling price × 100",
        }
      : {
          result: ((b - a) / b) * 100,
          statement: `Profit margin from cost ${format(a)} and selling price ${format(b)} is`,
          formula: "(selling price − cost) ÷ selling price × 100",
          detail: "Margin is measured against selling price, not cost.",
        };
  }

  if (c === null || c < 0) {
    return {
      result: null,
      statement: "Periods must be zero or greater.",
      formula: "start × (1 + rate ÷ 100)^periods",
    };
  }

  return {
    result: a * (1 + b / 100) ** c,
    statement: `${format(a)} growing at ${format(b)}% for ${format(c)} periods equals`,
    formula: "start × (1 + rate ÷ 100)^periods",
    detail: "This is percentage growth per period, not a full compound-interest schedule with deposits.",
  };
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("change");
  const [inputs, setInputs] = useState<Record<FieldKey, string>>({
    a: "80",
    b: "100",
    c: "1",
  });
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("mode") as Mode | null;

      if (modes.some((item) => item.id === requested)) {
        setMode(requested as Mode);
      }

      setInputs((current) => ({
        a: params.get("a") ?? current.a,
        b: params.get("b") ?? current.b,
        c: params.get("c") ?? current.c,
      }));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const active = modes.find((item) => item.id === mode) ?? modes[0];
  const values = useMemo(
    () => ({ a: numeric(inputs.a), b: numeric(inputs.b), c: numeric(inputs.c) }),
    [inputs],
  );
  const result = useMemo(() => calculate(mode, values), [mode, values]);
  const resultIsPercent = ["what-percent", "change", "margin"].includes(mode);

  function applyExample(example: (typeof examples)[number]) {
    setMode(example.mode);
    setInputs(example.values);
    setShareMessage("");
  }

  async function copyShareLink() {
    const params = new URLSearchParams({
      mode,
      a: inputs.a || "0",
      b: inputs.b || "0",
      c: inputs.c || "0",
    });

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/percentage-calculator?${params.toString()}`,
      );
      setShareMessage("Pre-filled share link copied.");
    } catch {
      setShareMessage("Copy the current URL from your browser address bar.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="everyday" />

      <section className={styles.hero}>
        <p>FREE PERCENTAGE CALCULATOR</p>
        <h1>Percentage increase, decrease, reverse percentage, markup, and margin.</h1>
        <span>
          Choose a percentage question, enter the values, and see the result with
          the formula used. This page is built for common questions like how to
          find percentage increase, percentage decrease, percent of a number,
          reverse discount, markup, and profit margin.
        </span>
      </section>

      <section className={styles.workspace} aria-label="Percentage calculator workspace">
        <article className={styles.inputCard}>
          <div className={styles.cardHeading}>
            <div>
              <p>SELECT CALCULATION</p>
              <h2>Percentage workspace</h2>
            </div>
            <span>{modes.length} modes</span>
          </div>

          <label className={styles.modePicker}>
            <span>Calculation type</span>
            <select
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as Mode);
                setShareMessage("");
              }}
            >
              {modes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <small>{active.question}</small>
          </label>

          <div className={styles.quickModes} aria-label="Quick percentage modes">
            {modes.slice(0, 7).map((item) => (
              <button
                className={mode === item.id ? styles.activeQuick : undefined}
                key={item.id}
                onClick={() => {
                  setMode(item.id);
                  setShareMessage("");
                }}
                type="button"
              >
                {item.shortLabel}
              </button>
            ))}
          </div>

          <div className={styles.fields}>
            {active.fields.map((field) => (
              <label key={field.key}>
                <span>
                  {field.label}
                  {field.suffix ? ` (${field.suffix})` : ""}
                </span>
                <input
                  inputMode="decimal"
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  onFocus={(event) => event.currentTarget.select()}
                  placeholder="0"
                  value={inputs[field.key]}
                />
                {field.hint ? <small>{field.hint}</small> : null}
              </label>
            ))}
          </div>

          <div className={styles.formula}>{result.formula}</div>

          <div className={styles.utilityRow}>
            <span>Share this exact calculation with values pre-filled.</span>
            <button onClick={copyShareLink} type="button">
              Copy share link
            </button>
          </div>
          {shareMessage ? <p className={styles.shareMessage}>{shareMessage}</p> : null}
        </article>

        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          <h2>{active.label}</h2>
          <span className={styles.statement}>{result.statement}</span>
          <strong>
            {format(result.result)}
            {resultIsPercent && result.result !== null ? "%" : ""}
          </strong>
          {result.detail ? <b className={styles.detail}>{result.detail}</b> : null}

          <div className={styles.tip}>
            <p>RELATED FINANCE TOOLS</p>
            <div className={styles.financeLinks}>
              <Link href="/profit-loss-calculator">Profit & loss →</Link>
              <Link href="/simple-interest-calculator">Simple interest →</Link>
              <Link href="/compound-interest-calculator">Compound interest →</Link>
              <Link href="/loan-calculator">Loan payment →</Link>
              <Link href="/discount-calculator">Discount & tax →</Link>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.exampleStrip} aria-label="Percentage examples">
        <div className={styles.sectionIntro}>
          <p>TRY REAL QUESTIONS</p>
          <h2>Common percentage examples</h2>
          <span>
            These examples answer the kinds of queries users search for, while
            keeping the calculator inputs clear and editable.
          </span>
        </div>
        <div className={styles.exampleGrid}>
          {examples.map((example) => (
            <button key={example.title} onClick={() => applyExample(example)} type="button">
              <span>{example.title}</span>
              <small>{example.description}</small>
              <code>{example.answer}</code>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.contentGrid} aria-label="Percentage formulas and explanations">
        <article className={styles.explainerCard}>
          <p>WHAT IT SOLVES</p>
          <h2>Use one calculator for everyday percentage questions</h2>
          <div className={styles.solveList}>
            <span>Percentage increase and decrease</span>
            <span>Percent of a number</span>
            <span>Part as a percentage of whole</span>
            <span>Reverse percentage and original price</span>
            <span>Markup, margin, and compound growth</span>
            <span>Shareable calculation links</span>
          </div>
        </article>

        <article className={styles.explainerCard}>
          <p>HOW TO USE</p>
          <h2>Choose the problem before entering numbers</h2>
          <ol>
            <li>Select the calculation type that matches the wording of your question.</li>
            <li>Enter the original value and new value, or part and whole, depending on the mode.</li>
            <li>Check the formula line to confirm the correct base value is being used.</li>
            <li>Copy the share link when you want to reopen the same calculation later.</li>
          </ol>
        </article>
      </section>

      <section className={styles.formulaSection}>
        <div className={styles.sectionIntro}>
          <p>FORMULAS</p>
          <h2>Percentage formulas with simple meaning</h2>
          <span>
            Percentage problems often go wrong because the wrong base value is
            used. These notes show which value should be compared.
          </span>
        </div>
        <div className={styles.formulaGrid}>
          {formulaCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <code>{card.formula}</code>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.qaSection}>
        <div className={styles.sectionIntro}>
          <p>QUICK ANSWERS</p>
          <h2>Common percentage questions</h2>
        </div>
        <div className={styles.qaGrid}>
          {queryAnswers.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
