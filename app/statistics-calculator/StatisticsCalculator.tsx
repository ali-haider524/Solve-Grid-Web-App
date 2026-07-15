"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./StatisticsCalculator.module.css";

type DataMode = "raw" | "frequency" | "grouped" | "paired";
type FrequencyRow = { id: number; value: string; frequency: string };
type GroupedRow = { id: number; lower: string; upper: string; frequency: string };
type PairRow = { id: number; x: string; y: string };
type VarianceMode = "population" | "sample";
type MetricId =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "mode"
  | "min"
  | "max"
  | "range"
  | "q1"
  | "q3"
  | "iqr"
  | "percentile"
  | "variance"
  | "standardDeviation"
  | "cv"
  | "skewness"
  | "outliers"
  | "slope"
  | "intercept"
  | "correlation"
  | "rSquared"
  | "covariance"
  | "prediction";

type Summary = {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: string;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  percentile: number;
  variance: number | null;
  standardDeviation: number | null;
  cv: number | null;
  skewness: number | null;
  outliers: number;
  histogram: Array<{ label: string; count: number }>;
  note?: string;
};

type Regression = {
  count: number;
  slope: number;
  intercept: number;
  correlation: number;
  rSquared: number;
  covariance: number;
  predictedY: number | null;
};

type ResultState =
  | { type: "summary"; value: Summary }
  | { type: "regression"; value: Regression }
  | null;

const metricGroups: Array<{ title: string; items: Array<{ id: MetricId; label: string; modes: DataMode[] }> }> = [
  {
    title: "Descriptive statistics",
    items: [
      { id: "count", label: "Count", modes: ["raw", "frequency", "grouped"] },
      { id: "sum", label: "Sum", modes: ["raw", "frequency", "grouped"] },
      { id: "mean", label: "Mean", modes: ["raw", "frequency", "grouped"] },
      { id: "median", label: "Median", modes: ["raw", "frequency", "grouped"] },
      { id: "mode", label: "Mode", modes: ["raw", "frequency", "grouped"] },
      { id: "min", label: "Minimum", modes: ["raw", "frequency", "grouped"] },
      { id: "max", label: "Maximum", modes: ["raw", "frequency", "grouped"] },
      { id: "range", label: "Range", modes: ["raw", "frequency", "grouped"] },
    ],
  },
  {
    title: "Spread, position, and shape",
    items: [
      { id: "q1", label: "Q1", modes: ["raw", "frequency", "grouped"] },
      { id: "q3", label: "Q3", modes: ["raw", "frequency", "grouped"] },
      { id: "iqr", label: "IQR", modes: ["raw", "frequency", "grouped"] },
      { id: "percentile", label: "Percentile", modes: ["raw", "frequency", "grouped"] },
      { id: "variance", label: "Variance", modes: ["raw", "frequency", "grouped"] },
      { id: "standardDeviation", label: "Standard deviation", modes: ["raw", "frequency", "grouped"] },
      { id: "cv", label: "Coefficient of variation", modes: ["raw", "frequency", "grouped"] },
      { id: "skewness", label: "Skewness", modes: ["raw", "frequency"] },
      { id: "outliers", label: "Outlier count", modes: ["raw", "frequency"] },
    ],
  },
  {
    title: "Paired-data regression",
    items: [
      { id: "slope", label: "Slope", modes: ["paired"] },
      { id: "intercept", label: "Intercept", modes: ["paired"] },
      { id: "correlation", label: "Correlation r", modes: ["paired"] },
      { id: "rSquared", label: "R²", modes: ["paired"] },
      { id: "covariance", label: "Covariance", modes: ["paired"] },
      { id: "prediction", label: "Predicted Y", modes: ["paired"] },
    ],
  },
];

const defaultMetrics: MetricId[] = [
  "count",
  "mean",
  "median",
  "mode",
  "range",
  "q1",
  "q3",
  "iqr",
  "standardDeviation",
  "variance",
];

const initialFrequencyRows = (): FrequencyRow[] => [
  { id: 1, value: "", frequency: "" },
  { id: 2, value: "", frequency: "" },
  { id: 3, value: "", frequency: "" },
];

const initialGroupedRows = (): GroupedRow[] => [
  { id: 1, lower: "", upper: "", frequency: "" },
  { id: 2, lower: "", upper: "", frequency: "" },
  { id: 3, lower: "", upper: "", frequency: "" },
];

const initialPairRows = (): PairRow[] => [
  { id: 1, x: "", y: "" },
  { id: 2, x: "", y: "" },
  { id: 3, x: "", y: "" },
];

function format(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  if (Object.is(value, -0)) return "0";
  const rounded = Number(value.toPrecision(10));
  return Math.abs(rounded) >= 1_000_000 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 0.000001)
    ? rounded.toExponential(5)
    : String(rounded);
}

function parseNumber(input: string, label: string) {
  const normalized = input.trim();
  if (!normalized) throw new Error(`${label} is required.`);
  const value = Number(normalized);
  if (!Number.isFinite(value)) throw new Error(`${label} must be a valid number.`);
  return value;
}

function parseRaw(input: string) {
  const values = input.trim().split(/[\s,;]+/).filter(Boolean).map(Number);
  if (!values.length) throw new Error("Enter at least one value.");
  if (values.some((value) => !Number.isFinite(value))) throw new Error("Use valid numbers separated by commas, spaces, semicolons, or new lines.");
  return values;
}

function createWeightedValues(rows: FrequencyRow[]) {
  const output: number[] = [];
  for (const row of rows) {
    if (!row.value.trim() && !row.frequency.trim()) continue;
    const value = parseNumber(row.value, "Value");
    const frequency = parseNumber(row.frequency, "Frequency");
    if (!Number.isInteger(frequency) || frequency < 1) throw new Error("Frequency must be a positive whole number.");
    if (output.length + frequency > 20_000) throw new Error("Keep the total frequency at 20,000 or below.");
    output.push(...Array.from({ length: frequency }, () => value));
  }
  if (!output.length) throw new Error("Add at least one value and frequency.");
  return output;
}

function median(sorted: number[]) {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function percentile(sorted: number[], percentage: number) {
  const position = ((percentage / 100) * (sorted.length - 1));
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function histogram(values: number[]) {
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .slice(0, 16)
    .map(([value, count]) => ({ label: format(value), count }));
}

function summarizeValues(values: number[], percentileValue: number, varianceMode: VarianceMode): Summary {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  const frequency = histogram(sorted);
  const maxFrequency = Math.max(...frequency.map((item) => item.count));
  const modes = maxFrequency > 1 ? frequency.filter((item) => item.count === maxFrequency).map((item) => item.label).join(", ") : "None";
  const squared = sorted.reduce((total, value) => total + (value - mean) ** 2, 0);
  const divisor = varianceMode === "sample" && count > 1 ? count - 1 : count;
  const variance = divisor > 0 ? squared / divisor : null;
  const standardDeviation = variance === null ? null : Math.sqrt(variance);
  const thirdMoment = sorted.reduce((total, value) => total + (value - mean) ** 3, 0) / count;
  const skewness = standardDeviation && standardDeviation > 0 ? thirdMoment / standardDeviation ** 3 : 0;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  return {
    count,
    sum,
    mean,
    median: median(sorted),
    mode: modes,
    min: sorted[0],
    max: sorted[count - 1],
    range: sorted[count - 1] - sorted[0],
    q1,
    q3,
    iqr,
    percentile: percentile(sorted, percentileValue),
    variance,
    standardDeviation,
    cv: mean === 0 || standardDeviation === null ? null : (standardDeviation / Math.abs(mean)) * 100,
    skewness,
    outliers: sorted.filter((value) => value < lowFence || value > highFence).length,
    histogram: frequency,
  };
}

function summarizeGrouped(rows: GroupedRow[], percentileValue: number, varianceMode: VarianceMode): Summary {
  const groups = rows
    .filter((row) => row.lower.trim() || row.upper.trim() || row.frequency.trim())
    .map((row) => ({
      lower: parseNumber(row.lower, "Class lower bound"),
      upper: parseNumber(row.upper, "Class upper bound"),
      frequency: parseNumber(row.frequency, "Class frequency"),
    }))
    .sort((a, b) => a.lower - b.lower);

  if (!groups.length) throw new Error("Add at least one class interval.");
  if (groups.some((group) => group.upper <= group.lower)) throw new Error("Each class upper bound must be greater than its lower bound.");
  if (groups.some((group) => !Number.isInteger(group.frequency) || group.frequency < 1)) throw new Error("Grouped frequencies must be positive whole numbers.");

  const count = groups.reduce((total, group) => total + group.frequency, 0);
  const weightedSum = groups.reduce((total, group) => total + ((group.lower + group.upper) / 2) * group.frequency, 0);
  const mean = weightedSum / count;
  const midpointVarianceSum = groups.reduce((total, group) => {
    const midpoint = (group.lower + group.upper) / 2;
    return total + group.frequency * (midpoint - mean) ** 2;
  }, 0);
  const divisor = varianceMode === "sample" && count > 1 ? count - 1 : count;
  const variance = midpointVarianceSum / divisor;
  const standardDeviation = Math.sqrt(variance);

  const estimatePosition = (position: number) => {
    let previousCumulative = 0;
    for (const group of groups) {
      const cumulative = previousCumulative + group.frequency;
      if (position <= cumulative) {
        const width = group.upper - group.lower;
        return group.lower + ((position - previousCumulative) / group.frequency) * width;
      }
      previousCumulative = cumulative;
    }
    return groups[groups.length - 1].upper;
  };

  const modalIndex = groups.reduce((best, current, index, all) => current.frequency > all[best].frequency ? index : best, 0);
  const modal = groups[modalIndex];
  const previous = groups[modalIndex - 1]?.frequency ?? 0;
  const next = groups[modalIndex + 1]?.frequency ?? 0;
  const denominator = 2 * modal.frequency - previous - next;
  const estimatedMode = denominator === 0 ? (modal.lower + modal.upper) / 2 : modal.lower + ((modal.frequency - previous) / denominator) * (modal.upper - modal.lower);

  return {
    count,
    sum: weightedSum,
    mean,
    median: estimatePosition(count / 2),
    mode: `≈ ${format(estimatedMode)} (${format(modal.lower)}–${format(modal.upper)})`,
    min: groups[0].lower,
    max: groups[groups.length - 1].upper,
    range: groups[groups.length - 1].upper - groups[0].lower,
    q1: estimatePosition(count / 4),
    q3: estimatePosition((3 * count) / 4),
    iqr: estimatePosition((3 * count) / 4) - estimatePosition(count / 4),
    percentile: estimatePosition((percentileValue / 100) * count),
    variance,
    standardDeviation,
    cv: mean === 0 ? null : (standardDeviation / Math.abs(mean)) * 100,
    skewness: null,
    outliers: 0,
    histogram: groups.map((group) => ({ label: `${format(group.lower)}–${format(group.upper)}`, count: group.frequency })),
    note: "Grouped-data values are estimated from class intervals and midpoints.",
  };
}

function regression(rows: PairRow[], predictionX: string): Regression {
  const pairs = rows.filter((row) => row.x.trim() || row.y.trim()).map((row) => ({ x: parseNumber(row.x, "X value"), y: parseNumber(row.y, "Y value") }));
  if (pairs.length < 2) throw new Error("Add at least two X/Y pairs.");
  const count = pairs.length;
  const meanX = pairs.reduce((sum, pair) => sum + pair.x, 0) / count;
  const meanY = pairs.reduce((sum, pair) => sum + pair.y, 0) / count;
  const numerator = pairs.reduce((sum, pair) => sum + (pair.x - meanX) * (pair.y - meanY), 0);
  const xSpread = pairs.reduce((sum, pair) => sum + (pair.x - meanX) ** 2, 0);
  const ySpread = pairs.reduce((sum, pair) => sum + (pair.y - meanY) ** 2, 0);
  if (xSpread === 0 || ySpread === 0) throw new Error("Correlation needs variation in both X and Y values.");
  const slope = numerator / xSpread;
  const intercept = meanY - slope * meanX;
  const correlation = numerator / Math.sqrt(xSpread * ySpread);
  const prediction = predictionX.trim() ? parseNumber(predictionX, "Prediction X") : null;
  return {
    count,
    slope,
    intercept,
    correlation,
    rSquared: correlation ** 2,
    covariance: numerator / (count - 1),
    predictedY: prediction === null ? null : slope * prediction + intercept,
  };
}

export default function StatisticsCalculator() {
  const [mode, setMode] = useState<DataMode>("raw");
  const [rawData, setRawData] = useState("");
  const [frequencyRows, setFrequencyRows] = useState<FrequencyRow[]>(initialFrequencyRows);
  const [groupedRows, setGroupedRows] = useState<GroupedRow[]>(initialGroupedRows);
  const [pairRows, setPairRows] = useState<PairRow[]>(initialPairRows);
  const [varianceMode, setVarianceMode] = useState<VarianceMode>("sample");
  const [percentileInput, setPercentileInput] = useState("90");
  const [predictionInput, setPredictionInput] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<MetricId[]>(defaultMetrics);
  const [result, setResult] = useState<ResultState>(null);
  const [error, setError] = useState("");

  const availableMetrics = useMemo(() => metricGroups.flatMap((group) => group.items).filter((item) => item.modes.includes(mode)), [mode]);

  function setDataMode(nextMode: DataMode) {
    setMode(nextMode);
    setResult(null);
    setError("");
  }

  function toggleMetric(metric: MetricId) {
    setSelectedMetrics((current) => current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric]);
  }

  function updateFrequency(id: number, field: keyof Omit<FrequencyRow, "id">, value: string) {
    setFrequencyRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function updateGrouped(id: number, field: keyof Omit<GroupedRow, "id">, value: string) {
    setGroupedRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function updatePair(id: number, field: keyof Omit<PairRow, "id">, value: string) {
    setPairRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function addRow(kind: "frequency" | "grouped" | "paired") {
    const id = Date.now();
    if (kind === "frequency") setFrequencyRows((rows) => [...rows, { id, value: "", frequency: "" }]);
    if (kind === "grouped") setGroupedRows((rows) => [...rows, { id, lower: "", upper: "", frequency: "" }]);
    if (kind === "paired") setPairRows((rows) => [...rows, { id, x: "", y: "" }]);
  }

  function removeRow(kind: "frequency" | "grouped" | "paired", id: number) {
    if (kind === "frequency") setFrequencyRows((rows) => rows.length === 1 ? rows : rows.filter((row) => row.id !== id));
    if (kind === "grouped") setGroupedRows((rows) => rows.length === 1 ? rows : rows.filter((row) => row.id !== id));
    if (kind === "paired") setPairRows((rows) => rows.length === 1 ? rows : rows.filter((row) => row.id !== id));
  }

  function calculate() {
    try {
      const percentileValue = parseNumber(percentileInput, "Percentile");
      if (percentileValue < 0 || percentileValue > 100) throw new Error("Percentile must be between 0 and 100.");
      if (mode === "paired") {
        setResult({ type: "regression", value: regression(pairRows, predictionInput) });
      } else if (mode === "grouped") {
        setResult({ type: "summary", value: summarizeGrouped(groupedRows, percentileValue, varianceMode) });
      } else {
        const values = mode === "raw" ? parseRaw(rawData) : createWeightedValues(frequencyRows);
        setResult({ type: "summary", value: summarizeValues(values, percentileValue, varianceMode) });
      }
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "Check the data and try again.");
    }
  }

  function loadExample() {
    if (mode === "raw") setRawData("58, 64, 72, 72, 78, 84, 91");
    if (mode === "frequency") setFrequencyRows([{ id: 1, value: "1", frequency: "2" }, { id: 2, value: "2", frequency: "3" }, { id: 3, value: "3", frequency: "5" }]);
    if (mode === "grouped") setGroupedRows([{ id: 1, lower: "0", upper: "10", frequency: "3" }, { id: 2, lower: "10", upper: "20", frequency: "7" }, { id: 3, lower: "20", upper: "30", frequency: "5" }]);
    if (mode === "paired") setPairRows([{ id: 1, x: "1", y: "2" }, { id: 2, x: "2", y: "4" }, { id: 3, x: "3", y: "5" }, { id: 4, x: "4", y: "8" }]);
    setError("");
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="math" />
      <section className={styles.hero}>
        <p>FREE ADVANCED STATISTICS CALCULATOR</p>
        <h1>Statistics calculator for standard deviation, variance, quartiles, and regression.</h1>
        <span>Calculate mean, median, mode, sample or population standard deviation, variance, quartiles, IQR, frequency tables, grouped data estimates, correlation, and linear regression from one focused workspace.</span>
      </section>

      <section className={styles.workspace}>
        <article className={styles.inputCard}>
          <div className={styles.cardHeading}><div><p>DATA WORKSPACE</p><h2>Input and options</h2></div><span>{mode === "paired" ? "X / Y" : varianceMode}</span></div>
          <div className={styles.modeTabs} role="tablist" aria-label="Statistics data type">
            <button className={mode === "raw" ? styles.active : ""} onClick={() => setDataMode("raw")} type="button"><b>Ungrouped data</b><small>Paste values separated by commas, spaces, or lines.</small></button>
            <button className={mode === "frequency" ? styles.active : ""} onClick={() => setDataMode("frequency")} type="button"><b>Discrete frequency</b><small>Enter exact values and their frequencies.</small></button>
            <button className={mode === "grouped" ? styles.active : ""} onClick={() => setDataMode("grouped")} type="button"><b>Grouped data</b><small>Enter class intervals and frequencies.</small></button>
            <button className={mode === "paired" ? styles.active : ""} onClick={() => setDataMode("paired")} type="button"><b>Paired X / Y</b><small>Regression, correlation, and prediction.</small></button>
          </div>
          <label className={styles.mobileModePicker}><span>Data type</span><select value={mode} onChange={(event) => setDataMode(event.target.value as DataMode)}><option value="raw">Ungrouped data</option><option value="frequency">Discrete frequency</option><option value="grouped">Grouped data</option><option value="paired">Paired X / Y regression</option></select></label>

          {mode === "raw" && <label className={styles.dataLabel}><span>Values</span><textarea value={rawData} onChange={(event) => setRawData(event.target.value)} placeholder="Example: 58, 64, 72, 72, 78, 84, 91" rows={6} /></label>}
          {mode === "frequency" && <EditableTable columns={["Value", "Frequency"]} rows={frequencyRows.map((row) => [row.value, row.frequency])} onChange={(rowIndex, columnIndex, value) => updateFrequency(frequencyRows[rowIndex].id, columnIndex === 0 ? "value" : "frequency", value)} onAdd={() => addRow("frequency")} onRemove={(rowIndex) => removeRow("frequency", frequencyRows[rowIndex].id)} />}
          {mode === "grouped" && <EditableTable columns={["Lower", "Upper", "Frequency"]} rows={groupedRows.map((row) => [row.lower, row.upper, row.frequency])} onChange={(rowIndex, columnIndex, value) => updateGrouped(groupedRows[rowIndex].id, columnIndex === 0 ? "lower" : columnIndex === 1 ? "upper" : "frequency", value)} onAdd={() => addRow("grouped")} onRemove={(rowIndex) => removeRow("grouped", groupedRows[rowIndex].id)} />}
          {mode === "paired" && <><EditableTable columns={["X", "Y"]} rows={pairRows.map((row) => [row.x, row.y])} onChange={(rowIndex, columnIndex, value) => updatePair(pairRows[rowIndex].id, columnIndex === 0 ? "x" : "y", value)} onAdd={() => addRow("paired")} onRemove={(rowIndex) => removeRow("paired", pairRows[rowIndex].id)} /><label className={styles.singleInput}><span>Optional prediction X</span><input value={predictionInput} onChange={(event) => setPredictionInput(event.target.value)} inputMode="decimal" placeholder="Example: 5" /></label></>}

          {mode !== "paired" && <div className={styles.optionRow}><label><span>Variance and SD</span><select value={varianceMode} onChange={(event) => setVarianceMode(event.target.value as VarianceMode)}><option value="sample">Sample (n − 1)</option><option value="population">Population (n)</option></select></label><label><span>Percentile</span><input value={percentileInput} onChange={(event) => setPercentileInput(event.target.value)} inputMode="decimal" /></label></div>}

          <details className={styles.metricsPanel}>
            <summary>Select the results you want</summary>
            <div className={styles.metricsActions}><button type="button" onClick={() => setSelectedMetrics(availableMetrics.map((item) => item.id))}>Select relevant</button><button type="button" onClick={() => setSelectedMetrics([])}>Clear</button></div>
            <div className={styles.metricChoices}>{availableMetrics.map((item) => <label key={item.id}><input type="checkbox" checked={selectedMetrics.includes(item.id)} onChange={() => toggleMetric(item.id)} /> <span>{item.label}</span></label>)}</div>
          </details>

          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actionRow}><button className={styles.exampleButton} onClick={loadExample} type="button">Load example</button><button className={styles.calculateButton} onClick={calculate} type="button">Calculate selected statistics <span>→</span></button></div>
        </article>

        <article className={styles.resultCard} aria-live="polite">
          <div className={styles.cardHeading}><div><p>RESULT</p><h2>{result ? "Analysis" : "Ready"}</h2></div><span>{result?.type === "summary" ? `${result.value.count} values` : result?.type === "regression" ? `${result.value.count} pairs` : "No data"}</span></div>
          {!result && <div className={styles.emptyResult}><span>σ</span><p>Choose a data type, select the statistics you need, then calculate.</p></div>}
          {result?.type === "summary" && <SummaryResultView value={result.value} selected={selectedMetrics} />}
          {result?.type === "regression" && <RegressionResultView value={result.value} selected={selectedMetrics} />}
        </article>
      </section>

      <section className={styles.learningSection} aria-labelledby="statistics-guide-title">
        <div className={styles.learningHeader}>
          <p>STATISTICS FORMULAS EXPLAINED</p>
          <h2 id="statistics-guide-title">Understand the result before you use it.</h2>
          <span>
            This statistics calculator is built for class assignments, research summaries, lab data,
            and business reports where users need both a number and a clear method. Choose the data
            format first, then decide whether the problem needs sample or population statistics.
          </span>
        </div>

        <div className={styles.topicGrid}>
          <article>
            <p>STANDARD DEVIATION</p>
            <h3>Sample vs population SD</h3>
            <span>
              Use sample standard deviation when your values are only part of a larger group. Use
              population standard deviation when the values are the complete population being studied.
            </span>
          </article>
          <article>
            <p>VARIANCE</p>
            <h3>Average squared spread</h3>
            <span>
              Variance measures average squared distance from the mean. Standard deviation is the
              square root of variance, so it is easier to read in the original unit.
            </span>
          </article>
          <article>
            <p>QUARTILES AND IQR</p>
            <h3>Middle spread of the data</h3>
            <span>
              Q1, Q3, and IQR help explain spread without being controlled by very large or very
              small values. IQR is useful when checking possible outliers.
            </span>
          </article>
          <article>
            <p>FREQUENCY TABLES</p>
            <h3>Repeated values and grouped intervals</h3>
            <span>
              Use discrete frequency rows when exact values repeat. Use grouped data when values are
              already summarized into class intervals such as 10–20 or 20–30.
            </span>
          </article>
          <article>
            <p>LINEAR REGRESSION</p>
            <h3>Paired X/Y relationship</h3>
            <span>
              Paired mode calculates slope, intercept, correlation, R², covariance, and an optional
              predicted y-value for a selected x-value.
            </span>
          </article>
          <article>
            <p>OUTLIERS</p>
            <h3>1.5 × IQR rule</h3>
            <span>
              The outlier count uses the common IQR fence method: values below Q1 − 1.5×IQR or above
              Q3 + 1.5×IQR are flagged as possible outliers.
            </span>
          </article>
        </div>
      </section>

      <section className={styles.formulaSection} aria-labelledby="standard-deviation-formula-title">
        <div className={styles.formulaIntro}>
          <p>WORKED EXAMPLE</p>
          <h2 id="standard-deviation-formula-title">How sample standard deviation is calculated.</h2>
          <span>
            For the raw data set 58, 64, 72, 72, 78, 84, 91, the mean is about 74.14.
            With sample mode selected, the calculator divides the squared deviations by n − 1.
          </span>
        </div>
        <div className={styles.formulaCards}>
          <article>
            <span>Sample variance</span>
            <code>s² = Σ(x − x̄)² ÷ (n − 1)</code>
            <p>For the example data, sample variance is about 128.14.</p>
          </article>
          <article>
            <span>Sample standard deviation</span>
            <code>s = √128.14 ≈ 11.32</code>
            <p>The typical distance from the mean is about 11.32 data units.</p>
          </article>
          <article>
            <span>Population standard deviation</span>
            <code>σ = √(Σ(x − μ)² ÷ n)</code>
            <p>Use this only when your entered values are the full population.</p>
          </article>
        </div>
      </section>

      <section className={styles.queryAnswerSection} aria-labelledby="statistics-question-title">
        <div>
          <p>COMMON QUESTIONS</p>
          <h2 id="statistics-question-title">Quick answers for statistics problems.</h2>
        </div>
        <div className={styles.answerGrid}>
          <article>
            <h3>What is the formula for sample standard deviation?</h3>
            <p>Subtract the mean from each value, square each difference, add them, divide by n − 1, then take the square root.</p>
          </article>
          <article>
            <h3>What is the difference between variance and standard deviation?</h3>
            <p>Variance is squared spread. Standard deviation is the square root of variance, so it is easier to compare with the original data unit.</p>
          </article>
          <article>
            <h3>When should I use grouped data?</h3>
            <p>Use grouped data when you only have class intervals and frequencies. The calculator estimates mean and spread using each class midpoint.</p>
          </article>
          <article>
            <h3>Can this calculator do linear regression?</h3>
            <p>Yes. Choose paired X/Y mode to calculate slope, intercept, correlation r, R², covariance, and optional prediction.</p>
          </article>
        </div>
      </section>

      <section className={styles.relatedSection} aria-label="Related statistics guides and tools">
        <Link href="/guides/standard-deviation-formula">Read the standard deviation formula guide →</Link>
        <Link href="/graphing-calculator">Use Graphing Calculator for visual checks →</Link>
      </section>
    </main>
  );
}

function EditableTable({ columns, rows, onChange, onAdd, onRemove }: { columns: string[]; rows: string[][]; onChange: (row: number, column: number, value: string) => void; onAdd: () => void; onRemove: (row: number) => void }) {
  return <div className={styles.tablePanel}><div className={styles.tableScroll}><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}<th aria-label="Row controls" /></tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, columnIndex) => <td key={`${rowIndex}-${columnIndex}`}><input value={value} onChange={(event) => onChange(rowIndex, columnIndex, event.target.value)} inputMode="decimal" aria-label={`${columns[columnIndex]} row ${rowIndex + 1}`} /></td>)}<td><button className={styles.removeRow} onClick={() => onRemove(rowIndex)} type="button">×</button></td></tr>)}</tbody></table></div><button className={styles.addRow} onClick={onAdd} type="button">+ Add row</button></div>;
}

function SummaryResultView({ value, selected }: { value: Summary; selected: MetricId[] }) {
  const metrics: Array<[MetricId, string, string]> = [
    ["count", "Count", format(value.count)], ["sum", "Sum", format(value.sum)], ["mean", "Mean", format(value.mean)], ["median", "Median", format(value.median)], ["mode", "Mode", value.mode], ["min", "Minimum", format(value.min)], ["max", "Maximum", format(value.max)], ["range", "Range", format(value.range)], ["q1", "Q1", format(value.q1)], ["q3", "Q3", format(value.q3)], ["iqr", "IQR", format(value.iqr)], ["percentile", "Percentile", format(value.percentile)], ["variance", "Variance", format(value.variance)], ["standardDeviation", "Standard deviation", format(value.standardDeviation)], ["cv", "CV", value.cv === null ? "—" : `${format(value.cv)}%`], ["skewness", "Skewness", format(value.skewness)], ["outliers", "Outliers", format(value.outliers)],
  ];
  const selectedMetrics = metrics.filter(([id]) => selected.includes(id));
  return <><div className={styles.metricGrid}>{selectedMetrics.length ? selectedMetrics.map(([id, label, metricValue]) => <Metric key={id} label={label} value={metricValue} />) : <p className={styles.noMetrics}>Select at least one result in the options panel.</p>}</div>{value.note && <p className={styles.note}>{value.note}</p>}<Distribution values={value.histogram} /></>;
}

function RegressionResultView({ value, selected }: { value: Regression; selected: MetricId[] }) {
  const metrics: Array<[MetricId, string, string]> = [
    ["slope", "Slope", format(value.slope)], ["intercept", "Intercept", format(value.intercept)], ["correlation", "Correlation r", format(value.correlation)], ["rSquared", "R²", format(value.rSquared)], ["covariance", "Covariance", format(value.covariance)], ["prediction", "Predicted Y", format(value.predictedY)],
  ];
  return <><div className={styles.metricGrid}>{metrics.filter(([id]) => selected.includes(id)).map(([id, label, metricValue]) => <Metric key={id} label={label} value={metricValue} />)}</div><div className={styles.formula}><p>LINEAR REGRESSION EQUATION</p><strong>y = {format(value.slope)}x {value.intercept >= 0 ? "+" : "−"} {format(Math.abs(value.intercept))}</strong></div></>;
}

function Distribution({ values }: { values: Array<{ label: string; count: number }> }) {
  const max = Math.max(...values.map((item) => item.count), 1);
  return <div className={styles.distribution}><div><p>DISTRIBUTION</p><span>Frequency bars for the entered data.</span></div><div className={styles.bars}>{values.map((item) => <div className={styles.barRow} key={item.label}><span title={item.label}>{item.label}</span><i><b style={{ width: `${(item.count / max) * 100}%` }} /></i><strong>{item.count}</strong></div>)}</div></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className={styles.metric}><span>{label}</span><strong>{value}</strong></div>; }
