"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./AgeCalculator.module.css";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  weeks: number;
  remainingDays: number;
  nextBirthdayDays: number;
  nextBirthdayLabel: string;
};

function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function calculateAge(dateOfBirth: Date, referenceDate: Date): AgeResult | null {
  if (dateOfBirth.getTime() > referenceDate.getTime()) return null;

  const birthYear = dateOfBirth.getUTCFullYear();
  const birthMonth = dateOfBirth.getUTCMonth();
  const birthDay = dateOfBirth.getUTCDate();
  const referenceYear = referenceDate.getUTCFullYear();
  const referenceMonth = referenceDate.getUTCMonth();
  const referenceDay = referenceDate.getUTCDate();

  let years = referenceYear - birthYear;
  let months = referenceMonth - birthMonth;
  let days = referenceDay - birthDay;

  if (days < 0) {
    months -= 1;
    days += daysInMonth(referenceYear, referenceMonth - 1);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor(
    (referenceDate.getTime() - dateOfBirth.getTime()) / 86_400_000,
  );

  let birthdayYear = referenceYear;
  let birthdayDay = Math.min(birthDay, daysInMonth(birthdayYear, birthMonth));
  let nextBirthday = new Date(Date.UTC(birthdayYear, birthMonth, birthdayDay));

  if (nextBirthday.getTime() < referenceDate.getTime()) {
    birthdayYear += 1;
    birthdayDay = Math.min(birthDay, daysInMonth(birthdayYear, birthMonth));
    nextBirthday = new Date(Date.UTC(birthdayYear, birthMonth, birthdayDay));
  }

  const nextBirthdayDays = Math.floor(
    (nextBirthday.getTime() - referenceDate.getTime()) / 86_400_000,
  );

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths: years * 12 + months,
    weeks: Math.floor(totalDays / 7),
    remainingDays: totalDays % 7,
    nextBirthdayDays,
    nextBirthdayLabel: formatDate(nextBirthday),
  };
}

export default function AgeCalculator() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [referenceDate, setReferenceDate] = useState("");

  const calculation = useMemo(() => {
    const birth = parseDate(dateOfBirth);
    const reference = parseDate(referenceDate || localDateInputValue());

    if (!birth || !reference) {
      return { state: "empty" as const, result: null, birth: null, reference: null };
    }

    const result = calculateAge(birth, reference);

    if (!result) {
      return { state: "invalid" as const, result: null, birth, reference };
    }

    return { state: "ready" as const, result, birth, reference };
  }, [dateOfBirth, referenceDate]);

  const result = calculation.result;

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="everyday" />

      <section className={styles.hero}>
        <p>FREE ONLINE AGE CALCULATOR</p>
        <h1>Calculate age from a date of birth.</h1>
        <span>
          Find age in years, months, and days on today&apos;s date or any date you choose.
        </span>
      </section>

      <section className={styles.workspace}>
        <article className={styles.inputCard}>
          <div className={styles.cardHeading}>
            <div>
              <p>DATE INPUTS</p>
              <h2>Choose the dates</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setDateOfBirth("");
                setReferenceDate(localDateInputValue());
              }}
            >
              Clear
            </button>
          </div>

          <div className={styles.dateGrid}>
            <label>
              <span>Date of birth</span>
              <input
                type="date"
                value={dateOfBirth}
                max={referenceDate || undefined}
                onChange={(event) => {
                  setDateOfBirth(event.target.value);
                  }}
              />
            </label>
            <label>
              <span>Calculate age on <small>(leave blank for today)</small></span>
              <input
                type="date"
                value={referenceDate}
                min={dateOfBirth || undefined}
                onChange={(event) => {
                  setReferenceDate(event.target.value);
                  }}
              />
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.todayButton}
              type="button"
              onClick={() => {
                setReferenceDate(localDateInputValue());
              }}
            >
              Use today
            </button>
          </div>

          <div className={styles.notice}>
            <p>PRIVATE BY DEFAULT</p>
            <span>
              This calculation runs in your browser. Leaving the reference-date field blank calculates age as of today.
            </span>
          </div>
        </article>

        <aside className={styles.resultCard} aria-live="polite">
          <p>AGE RESULT</p>
          <h2>
            {calculation.reference
              ? referenceDate
                ? `Age on ${formatDate(calculation.reference)}`
                : "Age today"
              : "Your age"}
          </h2>

          {calculation.state === "empty" ? (
            <div className={styles.emptyState}>
              Enter a date of birth and choose today or another reference date.
            </div>
          ) : null}

          {calculation.state === "invalid" ? (
            <div className={styles.errorState}>
              The reference date must be on or after the date of birth.
            </div>
          ) : null}

          {calculation.state === "ready" && result ? (
            <>
              <div className={styles.primaryAge}>
                <strong>{result.years}</strong>
                <span>years</span>
                <strong>{result.months}</strong>
                <span>months</span>
                <strong>{result.days}</strong>
                <span>days</span>
              </div>

              <div className={styles.metricGrid}>
                <div>
                  <span>Total months</span>
                  <b>{result.totalMonths.toLocaleString()}</b>
                </div>
                <div>
                  <span>Total weeks</span>
                  <b>{result.weeks.toLocaleString()}w {result.remainingDays}d</b>
                </div>
                <div>
                  <span>Total days</span>
                  <b>{result.totalDays.toLocaleString()}</b>
                </div>
                <div>
                  <span>Next birthday</span>
                  <b>{result.nextBirthdayDays === 0 ? "Today" : `${result.nextBirthdayDays} days`}</b>
                </div>
              </div>

              <div className={styles.birthdayNote}>
                <p>NEXT BIRTHDAY</p>
                <span>{result.nextBirthdayLabel}</span>
              </div>
            </>
          ) : null}

        </aside>
      </section>
    </main>
  );
}
