"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import ToolHeader from "./ToolHeader";
import styles from "./FinancialCalculator.module.css";

export type FinancialToolKind =
  | "profit-loss"
  | "simple-interest"
  | "compound-interest"
  | "loan"
  | "discount";

type ResultItem = { label: string; value: number | null; suffix?: string };
type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  workspaceTitle: string;
  resultTitle: string;
  tip: string;
};

type Example = {
  label: string;
  cost: string;
  selling: string;
};

const copy: Record<FinancialToolKind, Copy> = {
  "profit-loss": {
    eyebrow: "FREE PROFIT, LOSS, MARKUP & MARGIN CALCULATOR",
    title: "Profit and loss calculator for markup, margin, cost, and selling price.",
    description:
      "Enter cost price and selling price to calculate profit or loss amount, markup on cost, and profit margin on selling price with clear formulas and examples.",
    workspaceTitle: "Cost and selling price inputs",
    resultTitle: "Profit, loss, markup, and margin result",
    tip: "Read the markup vs margin guide when you need to explain why 25% markup is not the same as 25% margin.",
  },
  "simple-interest": {
    eyebrow: "FREE SIMPLE INTEREST CALCULATOR",
    title: "Calculate simple interest and total amount from principal, rate, and time.",
    description:
      "Use the standard simple-interest formula for clear school, business, and savings examples.",
    workspaceTitle: "Interest inputs",
    resultTitle: "Simple interest result",
    tip: "Use Compound Interest Calculator when interest is added to the balance over time.",
  },
  "compound-interest": {
    eyebrow: "FREE COMPOUND INTEREST CALCULATOR",
    title: "Project compound interest with flexible compounding periods.",
    description:
      "Calculate growth from principal, annual rate, years, compounding frequency, and an optional regular contribution.",
    workspaceTitle: "Growth inputs",
    resultTitle: "Compound growth result",
    tip: "Use Loan Calculator when you need periodic payments and total borrowing cost.",
  },
  loan: {
    eyebrow: "FREE LOAN PAYMENT CALCULATOR",
    title: "Estimate periodic loan payments, total repaid, and interest.",
    description:
      "Enter the loan amount, annual rate, term, and payment frequency to calculate an amortized payment estimate.",
    workspaceTitle: "Loan inputs",
    resultTitle: "Loan payment result",
    tip: "This provides an estimate. Actual lender fees, insurance, taxes, and rounding can change a final quote.",
  },
  discount: {
    eyebrow: "FREE DISCOUNT & TAX CALCULATOR",
    title: "Calculate discount amount, sale price, and tax-adjusted total.",
    description:
      "Enter an original price, discount rate, and optional tax rate to see each step clearly.",
    workspaceTitle: "Price inputs",
    resultTitle: "Discount result",
    tip: "Use Percentage Calculator for reverse discounts, percent change, and markup questions.",
  },
};

const profitExamples: Example[] = [
  { label: "25% markup, 20% margin", cost: "80", selling: "100" },
  { label: "Loss example", cost: "120", selling: "96" },
  { label: "Retail pricing", cost: "450", selling: "599" },
];

function numberValue(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function format(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  if (Object.is(value, -0)) return "0";
  const rounded = Number(value.toPrecision(12));
  return Math.abs(rounded) >= 1e9 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)
    ? rounded.toExponential(6)
    : String(rounded);
}

function NumericField({
  label,
  suffix,
  value,
  onChange,
  hint,
}: {
  label: string;
  suffix?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}{suffix ? ` (${suffix})` : ""}</span>
      <input
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        onFocus={(event) => event.currentTarget.select()}
        placeholder="0"
        value={value}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export default function FinancialCalculator({ kind }: { kind: FinancialToolKind }) {
  const content = copy[kind];
  const [values, setValues] = useState({
    a: "0",
    b: "0",
    c: "0",
    contribution: "0",
    periods: "12",
  });

  const update = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const numeric = useMemo(
    () => ({
      a: numberValue(values.a),
      b: numberValue(values.b),
      c: numberValue(values.c),
      contribution: numberValue(values.contribution),
      periods: numberValue(values.periods),
    }),
    [values],
  );

  const outcome = useMemo(() => {
    const { a, b, c, contribution, periods } = numeric;
    const invalid = (status: string) => ({ status, formula: "—", items: [] as ResultItem[] });

    if (a === null || b === null || (kind !== "profit-loss" && c === null)) {
      return invalid("Enter valid numbers to calculate.");
    }

    if (kind === "profit-loss") {
      const difference = b - a;
      return {
        status: difference >= 0 ? "Profit" : "Loss",
        formula:
          "profit = selling price − cost price; markup = profit ÷ cost × 100; margin = profit ÷ selling price × 100",
        items: [
          { label: difference >= 0 ? "Profit amount" : "Loss amount", value: Math.abs(difference) },
          { label: difference >= 0 ? "Markup on cost" : "Loss on cost", value: a === 0 ? null : (difference / a) * 100, suffix: "%" },
          { label: "Margin on selling price", value: b === 0 ? null : (difference / b) * 100, suffix: "%" },
        ],
      };
    }

    if (c === null) return invalid("Enter valid numbers to calculate.");

    if (kind === "simple-interest") {
      if (c < 0) return invalid("Time must be zero or greater.");
      const interest = (a * b * c) / 100;
      return {
        status: "Interest calculated",
        formula: "interest = principal × annual rate × years ÷ 100",
        items: [
          { label: "Simple interest", value: interest },
          { label: "Total amount", value: a + interest },
        ],
      };
    }

    if (kind === "compound-interest") {
      const frequency = periods ?? 12;
      if (c < 0 || frequency <= 0) {
        return invalid("Years and compounding periods must be greater than zero.");
      }
      const periodicRate = b / 100 / frequency;
      const totalPeriods = frequency * c;
      const contributionValue = contribution ?? 0;
      const principalGrowth = a * (1 + periodicRate) ** totalPeriods;
      const contributionGrowth = periodicRate === 0
        ? contributionValue * totalPeriods
        : contributionValue * (((1 + periodicRate) ** totalPeriods - 1) / periodicRate);
      const futureValue = principalGrowth + contributionGrowth;
      const deposited = a + contributionValue * totalPeriods;
      return {
        status: "Growth calculated",
        formula: "future value = principal growth + regular-contribution growth",
        items: [
          { label: "Future value", value: futureValue },
          { label: "Total deposited", value: deposited },
          { label: "Interest earned", value: futureValue - deposited },
        ],
      };
    }

    if (kind === "loan") {
      const frequency = periods ?? 12;
      if (a < 0 || b < 0 || c <= 0 || frequency <= 0) {
        return invalid("Loan amount and rate must be zero or greater; term and payments must be greater than zero.");
      }
      const totalPayments = frequency * c;
      const periodicRate = b / 100 / frequency;
      const payment = periodicRate === 0
        ? a / totalPayments
        : (a * periodicRate) / (1 - (1 + periodicRate) ** -totalPayments);
      const repaid = payment * totalPayments;
      return {
        status: "Payment estimate",
        formula: "payment = P × r ÷ (1 − (1 + r)⁻ⁿ)",
        items: [
          { label: "Payment each period", value: payment },
          { label: "Total repaid", value: repaid },
          { label: "Total interest", value: repaid - a },
        ],
      };
    }

    if (b < 0 || c < 0) return invalid("Discount and tax rates must be zero or greater.");
    const discount = (a * b) / 100;
    const sale = a - discount;
    const tax = (sale * c) / 100;
    return {
      status: "Discount calculated",
      formula: "sale price = original price − discount; total = sale price + tax",
      items: [
        { label: "Discount amount", value: discount },
        { label: "Sale price", value: sale },
        { label: "Final price after tax", value: sale + tax },
      ],
    };
  }, [kind, numeric]);

  function loadProfitExample(example: Example) {
    setValues({ a: example.cost, b: example.selling, c: "0", contribution: "0", periods: "12" });
  }

  let fields: ReactNode;
  if (kind === "profit-loss") {
    fields = (
      <>
        <NumericField label="Cost price" value={values.a} onChange={update("a")} hint="What you paid or produced it for." />
        <NumericField label="Selling price" value={values.b} onChange={update("b")} hint="What the customer pays." />
        <div className={styles.placeholderField}>
          <span>Calculation</span>
          <b>Amount + %</b>
          <small>Profit, loss, markup, and margin</small>
        </div>
      </>
    );
  } else if (kind === "simple-interest") {
    fields = (
      <>
        <NumericField label="Principal" value={values.a} onChange={update("a")} />
        <NumericField label="Annual rate" suffix="%" value={values.b} onChange={update("b")} />
        <NumericField label="Time" suffix="years" value={values.c} onChange={update("c")} />
      </>
    );
  } else if (kind === "compound-interest") {
    fields = (
      <>
        <NumericField label="Starting principal" value={values.a} onChange={update("a")} />
        <NumericField label="Annual rate" suffix="%" value={values.b} onChange={update("b")} />
        <NumericField label="Years" value={values.c} onChange={update("c")} />
        <NumericField label="Contribution each period" value={values.contribution} onChange={update("contribution")} />
        <label className={styles.field}>
          <span>Compounding</span>
          <select value={values.periods} onChange={(event) => update("periods")(event.target.value)}>
            <option value="1">Annual</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="26">Bi-weekly</option>
            <option value="52">Weekly</option>
            <option value="365">Daily</option>
          </select>
          <small>Contribution uses this period.</small>
        </label>
      </>
    );
  } else if (kind === "loan") {
    fields = (
      <>
        <NumericField label="Loan amount" value={values.a} onChange={update("a")} />
        <NumericField label="Annual rate" suffix="%" value={values.b} onChange={update("b")} />
        <NumericField label="Loan term" suffix="years" value={values.c} onChange={update("c")} />
        <label className={styles.field}>
          <span>Payment frequency</span>
          <select value={values.periods} onChange={(event) => update("periods")(event.target.value)}>
            <option value="12">Monthly</option>
            <option value="26">Bi-weekly</option>
            <option value="52">Weekly</option>
          </select>
          <small>Payments per year.</small>
        </label>
      </>
    );
  } else {
    fields = (
      <>
        <NumericField label="Original price" value={values.a} onChange={update("a")} />
        <NumericField label="Discount" suffix="%" value={values.b} onChange={update("b")} />
        <NumericField label="Tax after discount" suffix="%" value={values.c} onChange={update("c")} />
      </>
    );
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="everyday" />

      <section className={styles.hero}>
        <p>{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <span>{content.description}</span>
      </section>

      <section className={styles.workspace}>
        <article className={styles.inputCard}>
          <div className={styles.cardHeading}>
            <div>
              <p>INPUTS</p>
              <h2>{content.workspaceTitle}</h2>
            </div>
            <button onClick={() => setValues({ a: "0", b: "0", c: "0", contribution: "0", periods: "12" })} type="button">
              Reset
            </button>
          </div>

          <div className={styles.fields}>{fields}</div>

          {kind === "profit-loss" ? (
            <div className={styles.quickExamples} aria-label="Profit and loss examples">
              <span>Try a pricing example:</span>
              {profitExamples.map((example) => (
                <button key={example.label} onClick={() => loadProfitExample(example)} type="button">
                  {example.label}
                </button>
              ))}
            </div>
          ) : null}

          <div className={styles.formula}>{outcome.formula}</div>
        </article>

        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          <h2>{content.resultTitle}</h2>
          <span className={styles.status}>{outcome.status}</span>
          <div className={styles.resultList}>
            {outcome.items.length ? (
              outcome.items.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{format(item.value)}{item.suffix ?? ""}</strong>
                </div>
              ))
            ) : (
              <p>Enter values above to see the calculation.</p>
            )}
          </div>
          <div className={styles.tip}>
            <p>USEFUL NEXT STEP</p>
            <span>{content.tip}</span>
          </div>
        </aside>
      </section>

      {kind === "profit-loss" ? <ProfitLossLearning /> : null}
    </main>
  );
}

function ProfitLossLearning() {
  return (
    <section className={styles.learningSection} aria-labelledby="profit-loss-guide-title">
      <header className={styles.learningHeader}>
        <p>PROFIT, MARKUP, AND MARGIN EXPLAINED</p>
        <h2 id="profit-loss-guide-title">How to calculate profit margin and markup correctly.</h2>
        <span>
          Profit and loss questions usually start with cost price and selling price. The same profit amount can produce different percentages depending on whether you compare it with cost or revenue.
        </span>
      </header>

      <div className={styles.formulaGrid}>
        <article>
          <p>PROFIT OR LOSS</p>
          <h3>selling price − cost price</h3>
          <span>If the answer is positive, you made a profit. If the answer is negative, the sale is a loss.</span>
        </article>
        <article>
          <p>MARKUP FORMULA</p>
          <h3>profit ÷ cost × 100</h3>
          <span>Markup measures how much you added above cost. A cost of 80 sold for 100 gives 25% markup.</span>
        </article>
        <article>
          <p>MARGIN FORMULA</p>
          <h3>profit ÷ selling price × 100</h3>
          <span>Profit margin measures what share of the selling price remains as profit. The same example gives 20% margin.</span>
        </article>
      </div>

      <div className={styles.comparisonGrid}>
        <article>
          <p>WORKED EXAMPLE</p>
          <h3>Cost 80, selling price 100</h3>
          <ul>
            <li>Profit = 100 − 80 = 20</li>
            <li>Markup = 20 ÷ 80 × 100 = 25%</li>
            <li>Margin = 20 ÷ 100 × 100 = 20%</li>
          </ul>
        </article>
        <article>
          <p>COMMON MISTAKE</p>
          <h3>Markup and margin are not the same percentage.</h3>
          <span>
            Markup uses cost as the base. Margin uses selling price as the base. That is why a 25% markup does not mean 25% profit margin.
          </span>
        </article>
      </div>

      <div className={styles.relatedGuide}>
        <div>
          <p>LEARN THE FORMULA</p>
          <h2>Need the full markup vs margin explanation?</h2>
          <span>Open the guide for the formula, example, and business pricing workflow.</span>
        </div>
        <Link href="/guides/profit-margin-vs-markup">Read profit margin vs markup guide →</Link>
      </div>
    </section>
  );
}
