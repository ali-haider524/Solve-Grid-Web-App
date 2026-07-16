"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import { convertUnit, isUnitCategoryKey, unitCategories, unitCategoryKeys, type UnitCategoryKey } from "../../lib/unit-catalog";
import styles from "./UnitConverter.module.css";

function format(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (Object.is(value, -0)) return "0";
  const rounded = Number(value.toPrecision(12));
  return Math.abs(rounded) >= 1e9 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)
    ? rounded.toExponential(6)
    : String(rounded);
}

function getDefaults(category: UnitCategoryKey) {
  const units = unitCategories[category].units;
  return { from: units[0].id, to: units[Math.min(1, units.length - 1)].id };
}


const categoryHighlights = [
  {
    title: "Engineering conversions",
    body:
      "Convert pressure, force, energy, power, torque, density, frequency, angle, acceleration, and speed units for technical calculations.",
  },
  {
    title: "Metric and imperial units",
    body:
      "Switch between meters, feet, inches, kilograms, pounds, liters, gallons, Celsius, Fahrenheit, miles per hour, kilometers per hour, and more.",
  },
  {
    title: "Shareable conversion links",
    body:
      "Copy a pre-filled URL after choosing the value, category, source unit, and result unit, so the same conversion can be reopened later.",
  },
];

const exampleConversions = [
  { label: "Pressure", example: "1 bar = 100 kPa = 100,000 Pa" },
  { label: "Temperature", example: "°C to °F uses °F = °C × 9/5 + 32" },
  { label: "Torque", example: "1 N·m ≈ 0.737562 lb·ft" },
  { label: "Speed", example: "1 m/s = 3.6 km/h" },
  { label: "Energy", example: "1 kWh = 3,600,000 J" },
  { label: "Data", example: "1 MiB = 1,048,576 bytes" },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategoryKey>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  const [input, setInput] = useState("0");
  const [shareMessage, setShareMessage] = useState("");

  const current = unitCategories[category];
  const numericInput = Number(input);
  const output = useMemo(
    () => Number.isFinite(numericInput) ? convertUnit(numericInput, category, from, to) : Number.NaN,
    [numericInput, category, from, to],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const requestedCategory = params.get("category");
      const nextCategory = isUnitCategoryKey(requestedCategory) ? requestedCategory : "length";
      const defaults = getDefaults(nextCategory);
      const units = unitCategories[nextCategory].units;
      const requestedFrom = params.get("from");
      const requestedTo = params.get("to");
      const requestedValue = params.get("value");

      setCategory(nextCategory);
      setFrom(units.some((unit) => unit.id === requestedFrom) ? requestedFrom! : defaults.from);
      setTo(units.some((unit) => unit.id === requestedTo) ? requestedTo! : defaults.to);
      if (requestedValue !== null && Number.isFinite(Number(requestedValue))) setInput(requestedValue);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function switchCategory(nextCategory: UnitCategoryKey) {
    const defaults = getDefaults(nextCategory);
    setCategory(nextCategory);
    setFrom(defaults.from);
    setTo(defaults.to);
    setInput("0");
    setShareMessage("");
  }

  function swapUnits() {
    setFrom(to);
    setTo(from);
  }

  async function copyShareLink() {
    const params = new URLSearchParams({ category, from, to, value: Number.isFinite(numericInput) ? input || "0" : "0" });
    const url = `${window.location.origin}/unit-converter?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Pre-filled share link copied.");
    } catch {
      setShareMessage("Copy the current URL from your browser address bar.");
    }
  }

  const fromUnit = current.units.find((unit) => unit.id === from);
  const toUnit = current.units.find((unit) => unit.id === to);

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="engineering" />
      <section className={styles.hero}>
        <p>FREE ADVANCED UNIT CONVERTER</p>
        <h1>Convert engineering, science, and everyday units from one workspace.</h1>
        <span>
          Choose from 17 conversion families including length, pressure, energy, torque,
          density, angles, frequency, temperature, data, and more.
        </span>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.categories} aria-label="Conversion categories">
          <div className={styles.categoryHeading}>
            <p>CONVERSION TYPE</p>
            <span>{unitCategoryKeys.length} families</span>
          </div>
          <select aria-label="Choose a conversion category" value={category} onChange={(event) => switchCategory(event.target.value as UnitCategoryKey)}>
            {unitCategoryKeys.map((key) => <option key={key} value={key}>{unitCategories[key].label}</option>)}
          </select>
          <div className={styles.categoryList}>
            {unitCategoryKeys.map((key) => (
              <button className={key === category ? styles.selected : ""} key={key} onClick={() => switchCategory(key)} type="button">
                <span>{unitCategories[key].label}</span>
                <small>{unitCategories[key].units.length} units</small>
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.converter}>
          <div className={styles.cardHeader}>
            <div>
              <p>ACTIVE CATEGORY</p>
              <h2>{current.label}</h2>
              <span>{current.description}</span>
            </div>
            <b>{current.baseLabel} base</b>
          </div>

          <div className={styles.fields}>
            <label className={styles.valueField}>
              <span>FROM</span>
              <input aria-label="Value to convert" inputMode="decimal" onChange={(event) => setInput(event.target.value)} onFocus={(event) => event.currentTarget.select()} placeholder="0" value={input} />
              <select value={from} onChange={(event) => setFrom(event.target.value)}>
                {current.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}{unit.symbol ? ` (${unit.symbol})` : ""}</option>)}
              </select>
            </label>

            <button aria-label="Swap source and result units" className={styles.swap} onClick={swapUnits} type="button">⇄</button>

            <label className={styles.valueField}>
              <span>TO</span>
              <strong aria-live="polite">{format(output)}</strong>
              <select value={to} onChange={(event) => setTo(event.target.value)}>
                {current.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}{unit.symbol ? ` (${unit.symbol})` : ""}</option>)}
              </select>
            </label>
          </div>

          <div className={styles.resultLine}>
            <span>{format(Number.isFinite(numericInput) ? numericInput : Number.NaN)} {fromUnit?.symbol ?? fromUnit?.label}</span>
            <b>=</b>
            <strong>{format(output)} {toUnit?.symbol ?? toUnit?.label}</strong>
          </div>

          <div className={styles.utilityRow}>
            <span>Share exact conversions with a URL containing category, value, from, and to parameters.</span>
            <button onClick={copyShareLink} type="button">Copy share link</button>
          </div>
          {shareMessage ? <p className={styles.shareMessage}>{shareMessage}</p> : null}

          <div className={styles.formula}>
            <p>HOW THIS CONVERSION WORKS</p>
            <span>
              {category === "temperature"
                ? "Temperature values convert through Celsius so each scale keeps its correct zero point."
                : `Values convert through the ${current.baseLabel} base unit, then into your selected result unit.`}
            </span>
          </div>
        </section>
      </section>

      <section className={styles.learningSection} aria-label="Unit conversion formulas and examples">
        <div className={styles.learningIntro}>
          <p>UNIT CONVERSION GUIDE</p>
          <h2>Convert units with clear formulas, examples, and engineering context.</h2>
          <span>
            Use this unit converter when a problem mixes measurement systems, engineering units,
            scientific notation, or practical everyday values. The calculator uses a base-unit
            workflow for most categories and special formulas where offsets matter, such as temperature.
          </span>
        </div>

        <div className={styles.highlightGrid}>
          {categoryHighlights.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className={styles.exampleGrid}>
          <article className={styles.explainerCard}>
            <p>COMMON CONVERSIONS</p>
            <h3>Examples users often search for</h3>
            <div className={styles.exampleList}>
              {exampleConversions.map((item) => (
                <span key={item.label}>
                  <b>{item.label}</b>
                  <code>{item.example}</code>
                </span>
              ))}
            </div>
          </article>

          <article className={styles.explainerCard}>
            <p>HOW TO CHOOSE A TOOL</p>
            <h3>Use the right SolveGrid workflow</h3>
            <ul>
              <li>Use Unit Converter for measurement units, temperature scales, pressure, torque, energy, speed, and data units.</li>
              <li>Use Scientific Calculator for arithmetic, trigonometry, logarithms, constants, scientific notation, and engineering notation.</li>
              <li>Use Distance Calculator for coordinate distance, midpoint, speed, time, and travel-distance formulas.</li>
            </ul>
            <div className={styles.guideLinks}>
              <Link href="/guides/unit-conversion-formulas">Read unit conversion formulas →</Link>
              <Link href="/guides/engineering-unit-conversion">Read engineering unit guide →</Link>
              <Link href="/scientific-calculator">Open scientific calculator →</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
