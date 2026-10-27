// Pure calculation helpers for the research-statistics tools.
// Kept framework-free so they can be unit tested with plain Node.

export type ResultRow = { label: string; value: string };

const zByConfidence: Record<string, number> = {
  "90": 1.6449,
  "95": 1.96,
  "99": 2.5758,
};

export function zForConfidence(confidence: string) {
  const z = zByConfidence[confidence];
  if (!z) throw new Error("Choose a 90%, 95%, or 99% confidence level.");
  return z;
}

function assertFinite(value: number, message: string) {
  if (!Number.isFinite(value)) throw new Error(message);
}

/* ---------------- Sample size ---------------- */

export type SlovinResult = { raw: number; n: number };

/** Slovin / Taro Yamane: n = N / (1 + N e²). */
export function slovinSampleSize(population: number, marginOfError: number): SlovinResult {
  assertFinite(population, "Enter the population size N.");
  assertFinite(marginOfError, "Enter the margin of error.");
  if (population < 1 || !Number.isInteger(population)) {
    throw new Error("Population size must be a whole number of at least 1.");
  }
  if (marginOfError <= 0 || marginOfError >= 1) {
    throw new Error("Margin of error must be between 0 and 1 (for example 0.05 for 5%).");
  }
  const raw = population / (1 + population * marginOfError ** 2);
  return { raw, n: Math.ceil(raw - 1e-9) };
}

export type CochranResult = {
  z: number;
  n0: number;
  corrected: number | null;
  n: number;
};

/**
 * Cochran: n0 = z² p (1 − p) / e². With a finite population N the
 * correction n = n0 / (1 + (n0 − 1) / N) is applied.
 */
export function cochranSampleSize(
  confidence: string,
  marginOfError: number,
  proportion: number,
  population?: number,
): CochranResult {
  const z = zForConfidence(confidence);
  assertFinite(marginOfError, "Enter the margin of error.");
  assertFinite(proportion, "Enter the expected proportion p.");
  if (marginOfError <= 0 || marginOfError >= 1) {
    throw new Error("Margin of error must be between 0 and 1 (for example 0.05 for 5%).");
  }
  if (proportion <= 0 || proportion >= 1) {
    throw new Error("Expected proportion p must be between 0 and 1. Use 0.5 if unknown.");
  }
  const n0 = (z ** 2 * proportion * (1 - proportion)) / marginOfError ** 2;
  let corrected: number | null = null;
  if (population !== undefined && Number.isFinite(population) && population > 0) {
    if (!Number.isInteger(population)) throw new Error("Population size must be a whole number.");
    corrected = n0 / (1 + (n0 - 1) / population);
  }
  const base = corrected ?? n0;
  return { z, n0, corrected, n: Math.ceil(base - 1e-9) };
}

/** Inflate a sample for expected non-response. Rate is 0–1. */
export function adjustForResponseRate(n: number, responseRate: number) {
  if (!Number.isFinite(responseRate) || responseRate <= 0 || responseRate > 1) {
    throw new Error("Expected response rate must be between 1% and 100%.");
  }
  return Math.ceil(n / responseRate - 1e-9);
}

/* ---------------- Data parsing ---------------- */

/** Parse pasted spreadsheet data: one row per line, cells split by comma, tab, semicolon or spaces. */
export function parseMatrix(text: string): number[][] {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(/[\t,;]+|\s+/)
        .map((cell) => cell.trim())
        .filter(Boolean),
    );

  if (rows.length && rows[0].some((cell) => !Number.isFinite(Number(cell)))) {
    rows.shift(); // header row
  }

  const matrix = rows.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      const value = Number(cell);
      if (!Number.isFinite(value)) {
        throw new Error(`Row ${rowIndex + 1}, column ${columnIndex + 1} is not a number ("${cell}").`);
      }
      return value;
    }),
  );

  if (!matrix.length) throw new Error("Paste at least two respondents' item scores.");
  const width = matrix[0].length;
  matrix.forEach((row, index) => {
    if (row.length !== width) {
      throw new Error(`Row ${index + 1} has ${row.length} values but the first row has ${width}. Every respondent needs a score for every item.`);
    }
  });
  return matrix;
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function sampleVariance(values: number[]) {
  const m = mean(values);
  return values.reduce((total, value) => total + (value - m) ** 2, 0) / (values.length - 1);
}

function pearson(x: number[], y: number[]) {
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i += 1) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  if (sxx === 0 || syy === 0) return Number.NaN;
  return sxy / Math.sqrt(sxx * syy);
}

/* ---------------- Cronbach's alpha ---------------- */

export type ItemStatistic = {
  item: number;
  reversed: boolean;
  mean: number;
  sd: number;
  correctedItemTotal: number;
  alphaIfDeleted: number;
};

export type CronbachResult = {
  respondents: number;
  items: number;
  alpha: number;
  standardizedAlpha: number;
  band: string;
  itemStats: ItemStatistic[];
};

export function alphaBand(alpha: number) {
  if (!Number.isFinite(alpha)) return "Not defined";
  if (alpha >= 0.9) return "Excellent";
  if (alpha >= 0.8) return "Good";
  if (alpha >= 0.7) return "Acceptable";
  if (alpha >= 0.6) return "Questionable";
  if (alpha >= 0.5) return "Poor";
  return "Unacceptable";
}

function rawAlpha(columns: number[][]) {
  const k = columns.length;
  const respondents = columns[0].length;
  const totals = Array.from({ length: respondents }, (_, r) =>
    columns.reduce((sum, column) => sum + column[r], 0),
  );
  const itemVarianceSum = columns.reduce((sum, column) => sum + sampleVariance(column), 0);
  const totalVariance = sampleVariance(totals);
  if (totalVariance === 0) return Number.NaN;
  return (k / (k - 1)) * (1 - itemVarianceSum / totalVariance);
}

/** Reverse-code a score on a scale from min to max: (min + max) − x. */
export function reverseScore(value: number, scaleMin: number, scaleMax: number) {
  return scaleMin + scaleMax - value;
}

export function cronbachAlpha(
  matrix: number[][],
  reversedItems: number[] = [],
  scaleMin = 1,
  scaleMax = 5,
): CronbachResult {
  const respondents = matrix.length;
  const k = matrix[0]?.length ?? 0;
  if (respondents < 3) throw new Error("Cronbach's alpha needs at least 3 respondents.");
  if (k < 2) throw new Error("Cronbach's alpha needs at least 2 items (columns).");
  if (scaleMax <= scaleMin) throw new Error("Scale maximum must be greater than the minimum.");

  const reversed = new Set(reversedItems);
  const columns = Array.from({ length: k }, (_, c) =>
    matrix.map((row) => (reversed.has(c + 1) ? reverseScore(row[c], scaleMin, scaleMax) : row[c])),
  );

  const alpha = rawAlpha(columns);

  // Standardized alpha from the mean inter-item correlation.
  let correlationSum = 0;
  let pairs = 0;
  for (let i = 0; i < k; i += 1) {
    for (let j = i + 1; j < k; j += 1) {
      const r = pearson(columns[i], columns[j]);
      if (Number.isFinite(r)) {
        correlationSum += r;
        pairs += 1;
      }
    }
  }
  const meanR = pairs ? correlationSum / pairs : Number.NaN;
  const standardizedAlpha = (k * meanR) / (1 + (k - 1) * meanR);

  const totals = Array.from({ length: respondents }, (_, r) =>
    columns.reduce((sum, column) => sum + column[r], 0),
  );

  const itemStats = columns.map((column, index) => {
    const rest = totals.map((total, r) => total - column[r]);
    const others = columns.filter((_, other) => other !== index);
    return {
      item: index + 1,
      reversed: reversed.has(index + 1),
      mean: mean(column),
      sd: Math.sqrt(sampleVariance(column)),
      correctedItemTotal: pearson(column, rest),
      alphaIfDeleted: others.length >= 2 ? rawAlpha(others) : Number.NaN,
    };
  });

  return { respondents, items: k, alpha, standardizedAlpha, band: alphaBand(alpha), itemStats };
}

/* ---------------- Likert weighted mean ---------------- */

export const defaultLikertLabels: Record<number, string[]> = {
  4: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
  5: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  7: [
    "Strongly Disagree",
    "Disagree",
    "Somewhat Disagree",
    "Neutral",
    "Somewhat Agree",
    "Agree",
    "Strongly Agree",
  ],
};

export type LikertRange = { level: number; low: number; high: number; label: string };

/** Equal-interval ranges: width = (points − 1) / points. */
export function likertRanges(points: number, labels: string[]): LikertRange[] {
  if (!Number.isInteger(points) || points < 2) throw new Error("A Likert scale needs at least 2 points.");
  const width = (points - 1) / points;
  return Array.from({ length: points }, (_, i) => ({
    level: i + 1,
    low: i === 0 ? 1 : Math.round((1 + width * i + 0.01) * 100) / 100,
    high: i === points - 1 ? points : Math.round((1 + width * (i + 1)) * 100) / 100,
    label: labels[i] ?? `Level ${i + 1}`,
  }));
}

export function interpretMean(value: number, ranges: LikertRange[]) {
  const rounded = Math.round(value * 100) / 100;
  const match = ranges.find((range) => rounded >= range.low && rounded <= range.high);
  return (match ?? (rounded < ranges[0].low ? ranges[0] : ranges[ranges.length - 1])).label;
}

export type LikertItemResult = {
  statement: string;
  n: number;
  weightedMean: number;
  sd: number;
  interpretation: string;
  rank: number;
};

export type LikertResult = {
  items: LikertItemResult[];
  overallMean: number;
  overallInterpretation: string;
  ranges: LikertRange[];
};

/**
 * Each row: "Statement text, c1, c2, ..., cP" where c1 is the count of
 * respondents choosing 1 (lowest) and cP the count choosing P (highest).
 */
export function parseLikertRows(text: string, points: number) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cells = line.split(/\t|,|;/).map((cell) => cell.trim()).filter((cell) => cell !== "");
      const counts = cells.slice(-points).map(Number);
      const statement = cells.slice(0, cells.length - points).join(", ") || `Statement ${index + 1}`;
      if (counts.length !== points || counts.some((count) => !Number.isFinite(count) || count < 0)) {
        throw new Error(`Line ${index + 1} needs ${points} non-negative counts after the statement.`);
      }
      return { statement, counts };
    });
}

export function likertAnalysis(
  rows: Array<{ statement: string; counts: number[] }>,
  points: number,
  labels: string[],
): LikertResult {
  if (!rows.length) throw new Error("Add at least one statement with response counts.");
  const ranges = likertRanges(points, labels);

  const items = rows.map(({ statement, counts }) => {
    const n = counts.reduce((sum, count) => sum + count, 0);
    if (n === 0) throw new Error(`"${statement}" has no responses.`);
    const weightedMean = counts.reduce((sum, count, i) => sum + count * (i + 1), 0) / n;
    const variance =
      n > 1 ? counts.reduce((sum, count, i) => sum + count * (i + 1 - weightedMean) ** 2, 0) / (n - 1) : 0;
    return {
      statement,
      n,
      weightedMean,
      sd: Math.sqrt(variance),
      interpretation: interpretMean(weightedMean, ranges),
      rank: 0,
    };
  });

  const order = [...items].sort((a, b) => b.weightedMean - a.weightedMean);
  items.forEach((item) => {
    item.rank = order.findIndex((other) => other.weightedMean === item.weightedMean) + 1;
  });

  const overallMean = mean(items.map((item) => item.weightedMean));
  return { items, overallMean, overallInterpretation: interpretMean(overallMean, ranges), ranges };
}

export function fixed(value: number, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}
