"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./SimpleInterestCalculator.module.css";

type TimeUnit = "years" | "months" | "days";

type Example = {
  label: string;
  principal: string;
  rate: string;
  time: string;
  unit: TimeUnit;
};

const examples: Example[] = [
  {
    label: "Annual interest",
    principal: "10000",
    rate: "12",
    time: "2",
    unit: "years",
  },
  {
    label: "Six months",
    principal: "5000",
    rate: "8",
    time: "6",
    unit: "months",
  },
  {
    label: "Short term",
    principal: "2500",
    rate: "10",
    time: "90",
    unit: "days",
  },
];

function parseAmount(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function yearsFromTime(value: number, unit: TimeUnit) {
  if (unit === "months") return value / 12;
  if (unit === "days") return value / 365;
  return value;
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("en", {
    maximumFractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${formatNumber(value, 4)}%`;
}

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("12");
  const [time, setTime] = useState("2");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("years");

  const calculation = useMemo(() => {
    const principalValue = parseAmount(principal);
    const annualRateValue = parseAmount(annualRate);
    const timeValue = parseAmount(time);
    const timeInYears = yearsFromTime(timeValue, timeUnit);

    const isValid =
      Number.isFinite(principalValue) &&
      Number.isFinite(annualRateValue) &&
      Number.isFinite(timeValue) &&
      principalValue >= 0 &&
      timeValue >= 0;

    if (!isValid) {
      return {
        isValid: false,
        principalValue,
        annualRateValue,
        timeValue,
        timeInYears,
        interest: Number.NaN,
        totalAmount: Number.NaN,
        monthlyInterest: Number.NaN,
      };
    }

    const interest = principalValue * (annualRateValue / 100) * timeInYears;
    const totalAmount = principalValue + interest;
    const monthlyInterest = timeInYears > 0 ? interest / (timeInYears * 12) : 0;

    return {
      isValid: true,
      principalValue,
      annualRateValue,
      timeValue,
      timeInYears,
      interest,
      totalAmount,
      monthlyInterest,
    };
  }, [annualRate, principal, time, timeUnit]);

  function loadExample(example: Example) {
    setPrincipal(example.principal);
    setAnnualRate(example.rate);
    setTime(example.time);
    setTimeUnit(example.unit);
  }

  function resetCalculator() {
    setPrincipal("10000");
    setAnnualRate("12");
    setTime("2");
    setTimeUnit("years");
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="everyday" />

      <section className={styles.hero} aria-labelledby="simple-interest-title">
        <p>FREE ONLINE SIMPLE INTEREST CALCULATOR</p>
        <h1 id="simple-interest-title">
          Simple Interest Calculator for Principal, Rate, and Time
        </h1>
        <span>
          Calculate simple interest per annum, interest earned, and total amount
          using the standard principal × rate × time formula. Use it for quick
          study examples, finance homework, savings estimates, and basic
          interest formula checks.
        </span>
      </section>

      <section className={styles.workspace} aria-label="Simple interest calculator workspace">
        <article className={styles.calculatorCard}>
          <div className={styles.cardHeading}>
            <div>
              <p>CALCULATE INTEREST</p>
              <h2>Enter principal, annual rate, and time.</h2>
            </div>
            <button onClick={resetCalculator} type="button">
              Reset
            </button>
          </div>

          <div className={styles.inputGrid}>
            <label>
              <span>Principal amount</span>
              <input
                value={principal}
                onChange={(event) => setPrincipal(event.target.value)}
                inputMode="decimal"
                placeholder="10000"
              />
            </label>

            <label>
              <span>Annual interest rate (%)</span>
              <input
                value={annualRate}
                onChange={(event) => setAnnualRate(event.target.value)}
                inputMode="decimal"
                placeholder="12"
              />
            </label>

            <label>
              <span>Time</span>
              <input
                value={time}
                onChange={(event) => setTime(event.target.value)}
                inputMode="decimal"
                placeholder="2"
              />
            </label>

            <label>
              <span>Time unit</span>
              <select
                value={timeUnit}
                onChange={(event) => setTimeUnit(event.target.value as TimeUnit)}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
                <option value="days">Days</option>
              </select>
            </label>
          </div>

          <div className={styles.formulaBox}>
            <p>SIMPLE INTEREST FORMULA</p>
            <strong>Interest = Principal × Rate × Time / 100</strong>
            <span>
              Rate is treated as an annual percentage rate. Months and days are
              converted into years before the formula is applied.
            </span>
          </div>

          <div className={styles.quickExamples} aria-label="Simple interest examples">
            <p>TRY AN EXAMPLE</p>
            <div>
              {examples.map((example) => (
                <button
                  key={example.label}
                  onClick={() => loadExample(example)}
                  type="button"
                >
                  <strong>{example.label}</strong>
                  <span>
                    {formatNumber(Number(example.principal))} at {example.rate}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </article>

        <aside className={styles.resultCard} aria-live="polite">
          <p>RESULT</p>
          <h2>Simple interest result</h2>

          {!calculation.isValid ? (
            <div className={styles.warning}>
              Enter valid non-negative numbers for principal and time. The rate
              can be zero or positive depending on the problem.
            </div>
          ) : (
            <>
              <div className={styles.resultMain}>
                <span>Interest earned</span>
                <strong>{formatNumber(calculation.interest)}</strong>
              </div>

              <div className={styles.resultGrid}>
                <div>
                  <span>Total amount</span>
                  <strong>{formatNumber(calculation.totalAmount)}</strong>
                </div>
                <div>
                  <span>Time in years</span>
                  <strong>{formatNumber(calculation.timeInYears, 4)}</strong>
                </div>
                <div>
                  <span>Annual rate</span>
                  <strong>{formatPercent(calculation.annualRateValue)}</strong>
                </div>
                <div>
                  <span>Avg. monthly interest</span>
                  <strong>{formatNumber(calculation.monthlyInterest)}</strong>
                </div>
              </div>

              <div className={styles.calculationLine}>
                <p>CALCULATION</p>
                <code>
                  {formatNumber(calculation.principalValue)} ×{" "}
                  {formatNumber(calculation.annualRateValue)} ×{" "}
                  {formatNumber(calculation.timeInYears, 4)} ÷ 100 ={" "}
                  {formatNumber(calculation.interest)}
                </code>
              </div>
            </>
          )}
        </aside>
      </section>

      <section className={styles.learningSection} aria-labelledby="simple-interest-guide">
        <header className={styles.learningHeader}>
          <p>HOW TO CALCULATE SIMPLE INTEREST</p>
          <h2 id="simple-interest-guide">
            Understand the formula before using the result.
          </h2>
          <span>
            Simple interest does not add previous interest back into the balance.
            It uses the original principal, the annual rate, and the length of
            time. That makes it useful for basic interest formula problems and
            clear per-annum examples.
          </span>
        </header>

        <div className={styles.explanationGrid}>
          <article>
            <p>PRINCIPAL</p>
            <h3>The starting amount</h3>
            <span>
              Principal is the original amount of money. In the formula, it is
              the value that earns interest.
            </span>
          </article>

          <article>
            <p>RATE PER ANNUM</p>
            <h3>The annual percentage rate</h3>
            <span>
              Per annum means per year. A 12% per annum rate means 12% for one
              full year, 6% for six months, and about 3% for three months under
              simple interest.
            </span>
          </article>

          <article>
            <p>TIME</p>
            <h3>Convert months or days into years</h3>
            <span>
              If the time is given in months, divide by 12. If the time is given
              in days, divide by 365 unless your class or lender uses a different
              day-count rule.
            </span>
          </article>
        </div>

        <section className={styles.workedExample} aria-labelledby="per-annum-example">
          <div>
            <p>WORKED EXAMPLE</p>
            <h2 id="per-annum-example">
              How to calculate simple interest per annum.
            </h2>
            <span>
              Suppose the principal is 10,000, the rate is 12% per annum, and
              the time is 2 years. Multiply the values exactly in the formula,
              then add the interest to the principal to get the total amount.
            </span>
          </div>

          <div className={styles.exampleSteps}>
            <article>
              <span>01</span>
              <strong>P = 10,000</strong>
              <small>Start with the principal.</small>
            </article>
            <article>
              <span>02</span>
              <strong>R = 12%</strong>
              <small>Use the annual rate as a percentage.</small>
            </article>
            <article>
              <span>03</span>
              <strong>T = 2 years</strong>
              <small>Keep time in years.</small>
            </article>
            <article>
              <span>04</span>
              <strong>SI = 10,000 × 12 × 2 / 100 = 2,400</strong>
              <small>Total amount = 12,400.</small>
            </article>
          </div>
        </section>

        <div className={styles.comparisonGrid}>
          <article>
            <p>USE SIMPLE INTEREST WHEN</p>
            <h3>The interest is not reinvested</h3>
            <ul>
              <li>School formula questions use SI = PRT / 100.</li>
              <li>The problem says simple interest or flat interest.</li>
              <li>You only need interest earned on the original principal.</li>
            </ul>
          </article>

          <article>
            <p>USE COMPOUND INTEREST WHEN</p>
            <h3>Interest earns more interest</h3>
            <ul>
              <li>The balance grows after each compounding period.</li>
              <li>The question mentions monthly, quarterly, or daily compounding.</li>
              <li>You need future value with repeated reinvestment.</li>
            </ul>
          </article>
        </div>

        <aside className={styles.nextTools}>
          <div>
            <p>CONTINUE WITH RELATED CALCULATORS</p>
            <h2>Choose the next tool for the finance problem.</h2>
          </div>

          <div>
            <Link href="/compound-interest-calculator">
              <strong>Compound Interest Calculator</strong>
              <span>Use when interest is added back to the balance.</span>
            </Link>
            <Link href="/loan-calculator">
              <strong>Loan Payment Calculator</strong>
              <span>Estimate periodic payments and total interest.</span>
            </Link>
            <Link href="/percentage-calculator">
              <strong>Percentage Calculator</strong>
              <span>Calculate percentages, changes, growth, markup, and margins.</span>
            </Link>
          </div>
        </aside>

        <p className={styles.accuracyNote}>
          This calculator is for education and basic planning. Real accounts,
          loans, taxes, fees, and lender rules can use different rounding or
          day-count methods, so check official terms before making financial
          decisions.
        </p>
      </section>
    </main>
  );
}
