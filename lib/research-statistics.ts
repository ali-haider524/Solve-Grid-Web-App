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

/* ---------------- Chi-square ---------------- */

function lnGamma(z: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i += 1) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/** Regularized upper incomplete gamma Q(a, x). */
function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  const gln = lnGamma(a);
  if (x < a + 1) {
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 500; n += 1) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-15) break;
    }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - gln);
  }
  let b = x + 1 - a;
  let c = 1 / 1e-300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i += 1) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-15) break;
  }
  return Math.exp(-x + a * Math.log(x) - gln) * h;
}

/** Right-tail p value of the chi-square distribution. */
export function chiSquarePValue(statistic: number, df: number) {
  return Math.min(1, Math.max(0, gammaQ(df / 2, statistic / 2)));
}

function lnFactorial(n: number) {
  return lnGamma(n + 1);
}

/** Two-sided Fisher's exact test for a 2×2 table [[a, b], [c, d]]. */
export function fisherExact2x2(a: number, b: number, c: number, d: number) {
  const r1 = a + b;
  const r2 = c + d;
  const c1 = a + c;
  const n = r1 + r2;
  const prob = (x: number) =>
    Math.exp(
      lnFactorial(r1) + lnFactorial(r2) + lnFactorial(c1) + lnFactorial(n - c1) -
        lnFactorial(n) - lnFactorial(x) - lnFactorial(r1 - x) - lnFactorial(c1 - x) - lnFactorial(r2 - c1 + x),
    );
  const observed = prob(a);
  let p = 0;
  for (let x = Math.max(0, c1 - r2); x <= Math.min(r1, c1); x += 1) {
    const px = prob(x);
    if (px <= observed * (1 + 1e-7)) p += px;
  }
  return Math.min(1, p);
}

export type ChiSquareResult = {
  statistic: number;
  df: number;
  p: number;
  n: number;
  expected: number[][];
  cramersV: number;
  lowExpectedShare: number;
  minExpected: number;
  fisherP: number | null;
};

export function chiSquareIndependence(table: number[][]): ChiSquareResult {
  const rows = table.length;
  const cols = table[0]?.length ?? 0;
  if (rows < 2 || cols < 2) throw new Error("Enter at least a 2 × 2 table of counts.");
  table.forEach((row, i) => {
    if (row.length !== cols) throw new Error(`Row ${i + 1} has ${row.length} counts; every row needs ${cols}.`);
    row.forEach((value) => {
      if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
        throw new Error("Counts must be whole numbers of 0 or more.");
      }
    });
  });
  const rowTotals = table.map((row) => row.reduce((s, v) => s + v, 0));
  const colTotals = Array.from({ length: cols }, (_, j) => table.reduce((s, row) => s + row[j], 0));
  const n = rowTotals.reduce((s, v) => s + v, 0);
  if (rowTotals.some((t) => t === 0) || colTotals.some((t) => t === 0)) {
    throw new Error("Every row and column needs at least one count.");
  }
  const expected = table.map((_, i) => colTotals.map((ct) => (rowTotals[i] * ct) / n));
  let statistic = 0;
  let low = 0;
  let minExpected = Infinity;
  table.forEach((row, i) =>
    row.forEach((obs, j) => {
      const e = expected[i][j];
      statistic += (obs - e) ** 2 / e;
      if (e < 5) low += 1;
      minExpected = Math.min(minExpected, e);
    }),
  );
  const df = (rows - 1) * (cols - 1);
  const cramersV = Math.sqrt(statistic / (n * (Math.min(rows, cols) - 1)));
  const fisherP =
    rows === 2 && cols === 2 ? fisherExact2x2(table[0][0], table[0][1], table[1][0], table[1][1]) : null;
  return {
    statistic,
    df,
    p: chiSquarePValue(statistic, df),
    n,
    expected,
    cramersV,
    lowExpectedShare: low / (rows * cols),
    minExpected,
    fisherP,
  };
}

export type GoodnessResult = {
  statistic: number;
  df: number;
  p: number;
  n: number;
  expected: number[];
  minExpected: number;
};

/** Goodness of fit. Expected proportions default to equal; given proportions are normalised. */
export function chiSquareGoodness(observed: number[], proportions?: number[]): GoodnessResult {
  if (observed.length < 2) throw new Error("Enter counts for at least two categories.");
  if (observed.some((v) => !Number.isInteger(v) || v < 0)) throw new Error("Counts must be whole numbers of 0 or more.");
  const n = observed.reduce((s, v) => s + v, 0);
  if (n === 0) throw new Error("Enter at least one count.");
  let props = proportions && proportions.length ? proportions : observed.map(() => 1);
  if (props.length !== observed.length) throw new Error("Give one expected proportion per category.");
  if (props.some((v) => !Number.isFinite(v) || v <= 0)) throw new Error("Expected proportions must be positive.");
  const total = props.reduce((s, v) => s + v, 0);
  props = props.map((v) => v / total);
  const expected = props.map((p) => p * n);
  const statistic = observed.reduce((s, o, i) => s + (o - expected[i]) ** 2 / expected[i], 0);
  const df = observed.length - 1;
  return { statistic, df, p: chiSquarePValue(statistic, df), n, expected, minExpected: Math.min(...expected) };
}

export function formatP(p: number) {
  if (!Number.isFinite(p)) return "—";
  if (p < 0.001) return "< .001";
  return p.toFixed(3).replace(/^0/, "");
}

/* ---------------- Mann-Whitney U ---------------- */

export function parseNumbers(text: string, label: string) {
  const values = text
    .split(/[\s,;\t]+/)
    .map((v) => v.trim())
    .filter(Boolean)
    .map(Number);
  if (values.some((v) => !Number.isFinite(v))) throw new Error(`${label} contains a value that is not a number.`);
  return values;
}

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function normalSf(z: number) {
  // Upper-tail probability of the standard normal, via the Numerical Recipes erfc approximation (|error| < 1.2e-7).
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.5 * x);
  const erfc =
    t *
    Math.exp(
      -x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
        t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))),
    );
  return z >= 0 ? erfc / 2 : 1 - erfc / 2;
}

/** Exact two-sided p for U with no ties (counts of U values by dynamic programming). */
function exactMannWhitneyP(u: number, n1: number, n2: number) {
  // f[i][j][k] = number of arrangements with i of sample 1 and j of sample 2 giving U = k
  const maxU = n1 * n2;
  let prev: number[][] = Array.from({ length: n2 + 1 }, () => new Array(maxU + 1).fill(0));
  for (let j = 0; j <= n2; j += 1) prev[j][0] = 1;
  for (let i = 1; i <= n1; i += 1) {
    const cur: number[][] = Array.from({ length: n2 + 1 }, () => new Array(maxU + 1).fill(0));
    cur[0][0] = 1;
    for (let j = 1; j <= n2; j += 1) {
      for (let k = 0; k <= i * j; k += 1) {
        // last element from sample 1 (beats j of sample 2) or from sample 2
        cur[j][k] = (k - j >= 0 ? prev[j][k - j] : 0) + cur[j - 1][k];
      }
    }
    prev = cur;
  }
  const dist = prev[n2];
  const total = dist.reduce((s, v) => s + v, 0);
  const lower = Math.min(u, maxU - u);
  let cum = 0;
  for (let k = 0; k <= lower; k += 1) cum += dist[k];
  return Math.min(1, (2 * cum) / total);
}

export type MannWhitneyResult = {
  n1: number;
  n2: number;
  u1: number;
  u2: number;
  u: number;
  z: number;
  p: number;
  exact: boolean;
  r: number;
  median1: number;
  median2: number;
  meanRank1: number;
  meanRank2: number;
  ties: boolean;
};

export function mannWhitney(group1: number[], group2: number[]): MannWhitneyResult {
  const n1 = group1.length;
  const n2 = group2.length;
  if (n1 < 2 || n2 < 2) throw new Error("Each group needs at least 2 values.");
  const all = [...group1.map((v) => ({ v, g: 1 })), ...group2.map((v) => ({ v, g: 2 }))].sort((a, b) => a.v - b.v);
  const ranks = new Array(all.length).fill(0);
  let tieTerm = 0;
  let ties = false;
  for (let i = 0; i < all.length; ) {
    let j = i;
    while (j + 1 < all.length && all[j + 1].v === all[i].v) j += 1;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) ranks[k] = avg;
    const t = j - i + 1;
    if (t > 1) {
      ties = true;
      tieTerm += t ** 3 - t;
    }
    i = j + 1;
  }
  let r1 = 0;
  all.forEach((item, i) => {
    if (item.g === 1) r1 += ranks[i];
  });
  const N = n1 + n2;
  const u1 = r1 - (n1 * (n1 + 1)) / 2;
  const u2 = n1 * n2 - u1;
  const u = Math.min(u1, u2);
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt(((n1 * n2) / 12) * (N + 1 - tieTerm / (N * (N - 1))));
  const z = sigma > 0 ? (u1 - mu - Math.sign(u1 - mu) * 0.5) / sigma : 0;
  const exact = !ties && n1 <= 25 && n2 <= 25;
  const p = exact ? exactMannWhitneyP(u1, n1, n2) : Math.min(1, 2 * normalSf(Math.abs(z)));
  const zNoCc = sigma > 0 ? (u1 - mu) / sigma : 0;
  return {
    n1,
    n2,
    u1,
    u2,
    u,
    z: zNoCc,
    p,
    exact,
    r: Math.abs(zNoCc) / Math.sqrt(N),
    median1: median(group1),
    median2: median(group2),
    meanRank1: r1 / n1,
    meanRank2: (N * (N + 1)) / 2 / n2 - (r1 / n2),
    ties,
  };
}

/* ---------------- Shapiro-Wilk normality test (Royston, 1995) ---------------- */

/** Inverse of the standard normal CDF (Acklam's algorithm, relative error < 1.2e-9 after refinement). */
export function normalQuantile(p: number) {
  if (p <= 0 || p >= 1) throw new Error("Probability must be between 0 and 1.");
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  let x: number;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - low) {
    const q = p - 0.5;
    const r = q * q;
    x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  // One Halley refinement step.
  const e = 1 - normalSf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

export type ShapiroResult = {
  n: number;
  w: number;
  p: number;
  mean: number;
  sd: number;
  skewness: number;
  kurtosis: number;
};

export function shapiroWilk(values: number[]): ShapiroResult {
  const n = values.length;
  if (n < 3) throw new Error("The Shapiro-Wilk test needs at least 3 values.");
  if (n > 5000) throw new Error("The Shapiro-Wilk test is defined here for up to 5,000 values.");
  const x = [...values].sort((p, q) => p - q);
  const avg = x.reduce((s, v) => s + v, 0) / n;
  const ss = x.reduce((s, v) => s + (v - avg) ** 2, 0);
  if (ss === 0) throw new Error("All values are identical, so normality cannot be tested.");

  const a = new Array<number>(n).fill(0);
  if (n === 3) {
    a[0] = -Math.SQRT1_2;
    a[2] = Math.SQRT1_2;
  } else {
    const m = Array.from({ length: n }, (_, i) => normalQuantile((i + 1 - 0.375) / (n + 0.25)));
    const mm = m.reduce((s, v) => s + v * v, 0);
    const u = 1 / Math.sqrt(n);
    const poly = (c: number[], t: number) => c.reduce((s, coef, i) => s + coef * t ** i, 0);
    const an = poly([0, 0.221157, -0.147981, -2.07119, 4.434685, -2.706056], u) + m[n - 1] / Math.sqrt(mm);
    if (n > 5) {
      const an1 = poly([0, 0.042981, -0.293762, -1.752461, 5.682633, -3.582633], u) + m[n - 2] / Math.sqrt(mm);
      const phi = (mm - 2 * m[n - 1] ** 2 - 2 * m[n - 2] ** 2) / (1 - 2 * an ** 2 - 2 * an1 ** 2);
      for (let i = 2; i < n - 2; i += 1) a[i] = m[i] / Math.sqrt(phi);
      a[n - 1] = an;
      a[n - 2] = an1;
      a[0] = -an;
      a[1] = -an1;
    } else {
      const phi = (mm - 2 * m[n - 1] ** 2) / (1 - 2 * an ** 2);
      for (let i = 1; i < n - 1; i += 1) a[i] = m[i] / Math.sqrt(phi);
      a[n - 1] = an;
      a[0] = -an;
    }
  }

  const num = a.reduce((s, coef, i) => s + coef * x[i], 0) ** 2;
  const w = Math.min(1, num / ss);

  let p: number;
  if (n === 3) {
    p = Math.max(0, Math.min(1, (6 / Math.PI) * (Math.asin(Math.sqrt(w)) - Math.asin(Math.sqrt(0.75)))));
  } else if (n <= 11) {
    const gamma = -2.273 + 0.459 * n;
    const mu = 0.544 - 0.39978 * n + 0.025054 * n ** 2 - 0.0006714 * n ** 3;
    const sigma = Math.exp(1.3822 - 0.77857 * n + 0.062767 * n ** 2 - 0.0020322 * n ** 3);
    const z = (-Math.log(gamma - Math.log(1 - w)) - mu) / sigma;
    p = normalSf(z);
  } else {
    const ln = Math.log(n);
    const mu = -1.5861 - 0.31082 * ln - 0.083751 * ln ** 2 + 0.0038915 * ln ** 3;
    const sigma = Math.exp(-0.4803 - 0.082676 * ln + 0.0030302 * ln ** 2);
    const z = (Math.log(1 - w) - mu) / sigma;
    p = normalSf(z);
  }

  const sd = Math.sqrt(ss / (n - 1));
  const m2 = ss / n;
  const m3 = x.reduce((s, v) => s + (v - avg) ** 3, 0) / n;
  const m4 = x.reduce((s, v) => s + (v - avg) ** 4, 0) / n;
  return {
    n,
    w,
    p: Math.max(0, Math.min(1, p)),
    mean: avg,
    sd,
    skewness: m3 / m2 ** 1.5,
    kurtosis: m4 / m2 ** 2 - 3,
  };
}

/* ---------------- Cohen's kappa ---------------- */

export type KappaResult = {
  n: number;
  categories: number;
  observedAgreement: number;
  expectedAgreement: number;
  kappa: number;
  se: number;
  ciLow: number;
  ciHigh: number;
  z: number;
  p: number;
  weighted: "none" | "linear" | "quadratic";
  band: string;
};

export function kappaBand(k: number) {
  if (!Number.isFinite(k)) return "Not defined";
  if (k < 0) return "Poor (less than chance)";
  if (k <= 0.2) return "Slight";
  if (k <= 0.4) return "Fair";
  if (k <= 0.6) return "Moderate";
  if (k <= 0.8) return "Substantial";
  return "Almost perfect";
}

/**
 * Cohen's kappa from a k × k agreement table (rows = rater 1, columns = rater 2).
 * Weighted kappa uses linear or quadratic disagreement weights for ordered categories.
 */
export function cohensKappa(table: number[][], weighting: "none" | "linear" | "quadratic" = "none"): KappaResult {
  const k = table.length;
  if (k < 2) throw new Error("Enter at least a 2 × 2 agreement table.");
  table.forEach((row, i) => {
    if (row.length !== k) throw new Error(`The table must be square: row ${i + 1} has ${row.length} values but there are ${k} rows.`);
    row.forEach((v) => {
      if (!Number.isInteger(v) || v < 0) throw new Error("Counts must be whole numbers of 0 or more.");
    });
  });
  const n = table.flat().reduce((s, v) => s + v, 0);
  if (n === 0) throw new Error("Enter at least one rating pair.");
  const p = table.map((row) => row.map((v) => v / n));
  const rowM = p.map((row) => row.reduce((s, v) => s + v, 0));
  const colM = Array.from({ length: k }, (_, j) => p.reduce((s, row) => s + row[j], 0));
  const w = (i: number, j: number) => {
    if (weighting === "none") return i === j ? 1 : 0;
    const d = Math.abs(i - j) / (k - 1);
    return weighting === "linear" ? 1 - d : 1 - d * d;
  };
  let po = 0;
  let pe = 0;
  for (let i = 0; i < k; i += 1) {
    for (let j = 0; j < k; j += 1) {
      po += w(i, j) * p[i][j];
      pe += w(i, j) * rowM[i] * colM[j];
    }
  }
  if (pe === 1) throw new Error("Expected agreement is 100%, so kappa is undefined (both raters used one category only).");
  const kappa = (po - pe) / (1 - pe);

  // Large-sample standard errors (Fleiss, Cohen & Everitt, 1969).
  const wBarRow = Array.from({ length: k }, (_, i) => colM.reduce((s, c, j) => s + w(i, j) * c, 0));
  const wBarCol = Array.from({ length: k }, (_, j) => rowM.reduce((s, r, i) => s + w(i, j) * r, 0));
  let varA = 0;
  let var0 = 0;
  for (let i = 0; i < k; i += 1) {
    for (let j = 0; j < k; j += 1) {
      const termA = w(i, j) * (1 - pe) - (wBarRow[i] + wBarCol[j]) * (1 - po);
      varA += p[i][j] * termA ** 2;
      var0 += rowM[i] * colM[j] * (w(i, j) - (wBarRow[i] + wBarCol[j])) ** 2;
    }
  }
  varA = (varA - (po * pe - 2 * pe + po) ** 2) / (n * (1 - pe) ** 4);
  var0 = (var0 - pe ** 2) / (n * (1 - pe) ** 2);
  const se = Math.sqrt(Math.max(0, varA));
  const se0 = Math.sqrt(Math.max(0, var0));
  const z = se0 > 0 ? kappa / se0 : 0;
  return {
    n,
    categories: k,
    observedAgreement: po,
    expectedAgreement: pe,
    kappa,
    se,
    ciLow: kappa - 1.96 * se,
    ciHigh: kappa + 1.96 * se,
    z,
    p: Math.min(1, 2 * normalSf(Math.abs(z))),
    weighted: weighting,
    band: kappaBand(kappa),
  };
}

/* ---------------- Effect sizes ---------------- */

export function dBand(d: number) {
  const a = Math.abs(d);
  if (a < 0.2) return "negligible";
  if (a < 0.5) return "small";
  if (a < 0.8) return "medium";
  return "large";
}

export function etaBand(eta: number) {
  if (eta < 0.01) return "negligible";
  if (eta < 0.06) return "small";
  if (eta < 0.14) return "medium";
  return "large";
}

export function rBand(r: number) {
  const a = Math.abs(r);
  if (a < 0.1) return "negligible";
  if (a < 0.3) return "small";
  if (a < 0.5) return "medium";
  return "large";
}

export type MeansEffect = {
  d: number;
  g: number;
  glassDelta: number;
  pooledSd: number;
  ciLow: number;
  ciHigh: number;
  r: number;
};

/** Cohen's d, Hedges' g and Glass's delta from two group means, SDs and sizes. */
export function effectFromMeans(m1: number, sd1: number, n1: number, m2: number, sd2: number, n2: number): MeansEffect {
  [m1, sd1, n1, m2, sd2, n2].forEach((v) => {
    if (!Number.isFinite(v)) throw new Error("Fill in every mean, SD, and n.");
  });
  if (sd1 <= 0 || sd2 <= 0) throw new Error("Standard deviations must be greater than 0.");
  if (n1 < 2 || n2 < 2 || !Number.isInteger(n1) || !Number.isInteger(n2)) throw new Error("Each group needs a whole-number n of at least 2.");
  const df = n1 + n2 - 2;
  const pooledSd = Math.sqrt(((n1 - 1) * sd1 ** 2 + (n2 - 1) * sd2 ** 2) / df);
  const d = (m1 - m2) / pooledSd;
  const j = 1 - 3 / (4 * df - 1);
  const se = Math.sqrt((n1 + n2) / (n1 * n2) + (d * d) / (2 * (n1 + n2)));
  return {
    d,
    g: d * j,
    glassDelta: (m1 - m2) / sd2,
    pooledSd,
    ciLow: d - 1.96 * se,
    ciHigh: d + 1.96 * se,
    r: d / Math.sqrt(d * d + ((n1 + n2) ** 2) / (n1 * n2)),
  };
}

/** d from an independent t statistic, or dz from a paired / one-sample t statistic. */
export function effectFromT(t: number, n1: number, n2?: number) {
  if (!Number.isFinite(t)) throw new Error("Enter the t value.");
  if (n2 === undefined) {
    if (!(n1 >= 2)) throw new Error("Enter n (number of pairs or participants).");
    return { d: t / Math.sqrt(n1), r: Math.sqrt((t * t) / (t * t + (n1 - 1))) * Math.sign(t) };
  }
  if (!(n1 >= 2 && n2 >= 2)) throw new Error("Enter both group sizes.");
  const df = n1 + n2 - 2;
  return { d: t * Math.sqrt(1 / n1 + 1 / n2), r: Math.sqrt((t * t) / (t * t + df)) * Math.sign(t) };
}

/** Partial eta squared and Cohen's f from an F statistic. */
export function effectFromF(f: number, df1: number, df2: number) {
  if (!Number.isFinite(f) || f < 0) throw new Error("Enter a non-negative F value.");
  if (!(df1 >= 1 && df2 >= 1)) throw new Error("Enter both degrees of freedom.");
  const eta = (f * df1) / (f * df1 + df2);
  return { etaSquared: eta, cohensF: Math.sqrt(eta / (1 - eta)) };
}

/** Convert a correlation r to d, and z (e.g. from Mann-Whitney or Wilcoxon) to r. */
export function effectFromR(r: number) {
  if (!Number.isFinite(r) || r <= -1 || r >= 1) throw new Error("r must be between −1 and 1.");
  return { d: (2 * r) / Math.sqrt(1 - r * r), rSquared: r * r };
}

export function effectFromZ(z: number, n: number) {
  if (!Number.isFinite(z) || !(n >= 2)) throw new Error("Enter z and the total N.");
  return { r: z / Math.sqrt(n) };
}

/* ---------------- Rank helpers ---------------- */

function averageRanks(values: number[]) {
  const order = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array<number>(values.length);
  let tieTerm = 0;
  for (let i = 0; i < order.length; ) {
    let j = i;
    while (j + 1 < order.length && order[j + 1].v === order[i].v) j += 1;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) ranks[order[k].i] = avg;
    const t = j - i + 1;
    if (t > 1) tieTerm += t ** 3 - t;
    i = j + 1;
  }
  return { ranks, tieTerm };
}

/* ---------------- Wilcoxon signed-rank ---------------- */

export type WilcoxonResult = {
  nPairs: number;
  nUsed: number;
  zeros: number;
  wPlus: number;
  wMinus: number;
  t: number;
  z: number;
  p: number;
  exact: boolean;
  r: number;
  medianBefore: number;
  medianAfter: number;
  medianDiff: number;
  ties: boolean;
};

function exactSignedRankP(t: number, n: number) {
  const max = (n * (n + 1)) / 2;
  let dist = new Array<number>(max + 1).fill(0);
  dist[0] = 1;
  for (let k = 1; k <= n; k += 1) {
    const next = dist.slice();
    for (let s = k; s <= max; s += 1) next[s] += dist[s - k];
    dist = next;
  }
  const total = 2 ** n;
  let cum = 0;
  for (let s = 0; s <= Math.floor(t); s += 1) cum += dist[s];
  return Math.min(1, (2 * cum) / total);
}

/** Wilcoxon signed-rank test for paired data (zero differences dropped, as in SPSS and R). */
export function wilcoxonSignedRank(before: number[], after: number[]): WilcoxonResult {
  if (before.length !== after.length) {
    throw new Error(`Both columns need the same number of values (paired data): ${before.length} vs ${after.length}.`);
  }
  const diffs = after.map((a, i) => a - before[i]);
  const nonZero = diffs.filter((d) => d !== 0);
  const n = nonZero.length;
  if (n < 2) throw new Error("At least 2 pairs with a non-zero difference are needed.");
  const { ranks, tieTerm } = averageRanks(nonZero.map(Math.abs));
  let wPlus = 0;
  nonZero.forEach((d, i) => {
    if (d > 0) wPlus += ranks[i];
  });
  const total = (n * (n + 1)) / 2;
  const wMinus = total - wPlus;
  const t = Math.min(wPlus, wMinus);
  const mu = total / 2;
  const sigma = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24 - tieTerm / 48);
  const z = sigma > 0 ? (wPlus - mu) / sigma : 0;
  const ties = tieTerm > 0;
  const exact = !ties && n <= 50 && diffs.length === n;
  const p = exact ? exactSignedRankP(t, n) : Math.min(1, 2 * normalSf(Math.abs(z)));
  return {
    nPairs: diffs.length,
    nUsed: n,
    zeros: diffs.length - n,
    wPlus,
    wMinus,
    t,
    z,
    p,
    exact,
    r: Math.abs(z) / Math.sqrt(n),
    medianBefore: median(before),
    medianAfter: median(after),
    medianDiff: median(diffs),
    ties,
  };
}

/* ---------------- Kruskal-Wallis H ---------------- */

export type KruskalGroup = { name: string; n: number; median: number; meanRank: number };
export type DunnComparison = { a: string; b: string; z: number; p: number; pAdj: number };
export type KruskalResult = {
  h: number;
  df: number;
  p: number;
  n: number;
  epsilonSquared: number;
  groups: KruskalGroup[];
  dunn: DunnComparison[];
};

export function kruskalWallis(groups: Array<{ name: string; values: number[] }>): KruskalResult {
  const k = groups.length;
  if (k < 2) throw new Error("Enter at least 2 groups (3 or more for a typical Kruskal-Wallis test).");
  groups.forEach((g) => {
    if (g.values.length < 2) throw new Error(`${g.name} needs at least 2 values.`);
  });
  const all = groups.flatMap((g) => g.values);
  const N = all.length;
  const { ranks, tieTerm } = averageRanks(all);
  let offset = 0;
  const rankSums = groups.map((g) => {
    const sum = ranks.slice(offset, offset + g.values.length).reduce((s, r) => s + r, 0);
    offset += g.values.length;
    return sum;
  });
  let h = (12 / (N * (N + 1))) * rankSums.reduce((s, rs, i) => s + (rs * rs) / groups[i].values.length, 0) - 3 * (N + 1);
  const correction = 1 - tieTerm / (N ** 3 - N);
  if (correction > 0) h /= correction;
  const df = k - 1;
  const summary = groups.map((g, i) => ({
    name: g.name,
    n: g.values.length,
    median: median(g.values),
    meanRank: rankSums[i] / g.values.length,
  }));
  const pairs = (k * (k - 1)) / 2;
  const base = (N * (N + 1)) / 12 - tieTerm / (12 * (N - 1));
  const dunn: DunnComparison[] = [];
  for (let i = 0; i < k; i += 1) {
    for (let j = i + 1; j < k; j += 1) {
      const z = (summary[i].meanRank - summary[j].meanRank) / Math.sqrt(base * (1 / summary[i].n + 1 / summary[j].n));
      const p = Math.min(1, 2 * normalSf(Math.abs(z)));
      dunn.push({ a: summary[i].name, b: summary[j].name, z, p, pAdj: Math.min(1, p * pairs) });
    }
  }
  return {
    h,
    df,
    p: chiSquarePValue(h, df),
    n: N,
    epsilonSquared: h / ((N * N - 1) / (N + 1)),
    groups: summary,
    dunn,
  };
}

/* ---------------- F distribution ---------------- */

function betacf(a: number, b: number, x: number) {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
function incompleteBeta(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

export function fCdf(f: number, d1: number, d2: number) {
  if (f <= 0) return 0;
  return incompleteBeta((d1 * f) / (d1 * f + d2), d1 / 2, d2 / 2);
}

/** Quantile of the F distribution by bisection on the CDF. */
export function fQuantile(p: number, d1: number, d2: number) {
  let lo = 0;
  let hi = 1;
  while (fCdf(hi, d1, d2) < p) hi *= 2;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (fCdf(mid, d1, d2) < p) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-12 * Math.max(1, hi)) break;
  }
  return (lo + hi) / 2;
}

/* ---------------- Intraclass correlation (Shrout & Fleiss / McGraw & Wong) ---------------- */

export type IccRow = {
  type: string;
  label: string;
  value: number;
  ciLow: number;
  ciHigh: number;
  f: number;
  df1: number;
  df2: number;
  p: number;
};

export type IccResult = { subjects: number; raters: number; rows: IccRow[] };

export function iccBand(v: number) {
  if (!Number.isFinite(v)) return "Not defined";
  if (v < 0.5) return "Poor";
  if (v < 0.75) return "Moderate";
  if (v < 0.9) return "Good";
  return "Excellent";
}

export function intraclassCorrelation(matrix: number[][]): IccResult {
  const n = matrix.length;
  const k = matrix[0]?.length ?? 0;
  if (n < 3) throw new Error("Enter at least 3 subjects (rows).");
  if (k < 2) throw new Error("Enter at least 2 raters or measurements (columns).");
  const grand = matrix.flat().reduce((s, v) => s + v, 0) / (n * k);
  const rowMeans = matrix.map((r) => r.reduce((s, v) => s + v, 0) / k);
  const colMeans = Array.from({ length: k }, (_, j) => matrix.reduce((s, r) => s + r[j], 0) / n);
  const ssTotal = matrix.flat().reduce((s, v) => s + (v - grand) ** 2, 0);
  const ssR = k * rowMeans.reduce((s, m) => s + (m - grand) ** 2, 0);
  const ssC = n * colMeans.reduce((s, m) => s + (m - grand) ** 2, 0);
  const ssE = ssTotal - ssR - ssC;
  const msR = ssR / (n - 1);
  const msC = ssC / (k - 1);
  const msE = ssE / ((n - 1) * (k - 1));
  const msW = (ssC + ssE) / (n * (k - 1));
  if (msE <= 0 && msW <= 0) throw new Error("All raters gave identical scores, so the ICC is undefined.");
  const q = 0.975;

  const icc1 = (msR - msW) / (msR + (k - 1) * msW);
  const icc2 = (msR - msE) / (msR + (k - 1) * msE + (k * (msC - msE)) / n);
  const icc3 = (msR - msE) / (msR + (k - 1) * msE);
  const icc1k = (msR - msW) / msR;
  const icc2k = (msR - msE) / (msR + (msC - msE) / n);
  const icc3k = (msR - msE) / msR;

  const f1 = msR / msW;
  const df1a = n - 1;
  const df1b = n * (k - 1);
  const f1L = f1 / fQuantile(q, df1a, df1b);
  const f1U = f1 * fQuantile(q, df1b, df1a);

  const f3 = msR / msE;
  const df3b = (n - 1) * (k - 1);
  const f3L = f3 / fQuantile(q, df1a, df3b);
  const f3U = f3 * fQuantile(q, df3b, df1a);

  const fj = msC / msE;
  const vn = (k - 1) * (n - 1) * (k * icc2 * fj + n * (1 + (k - 1) * icc2) - k * icc2) ** 2;
  const vd = (n - 1) * k * k * icc2 * icc2 * fj * fj + (n * (1 + (k - 1) * icc2) - k * icc2) ** 2;
  const v = vn / vd;
  const f2U = fQuantile(q, n - 1, v);
  const f2L = fQuantile(q, v, n - 1);
  const lb2 = (n * (msR - f2U * msE)) / (f2U * (k * msC + (k * n - k - n) * msE) + n * msR);
  const ub2 = (n * (f2L * msR - msE)) / (k * msC + (k * n - k - n) * msE + n * f2L * msR);

  const p1 = 1 - fCdf(f1, df1a, df1b);
  const p3 = 1 - fCdf(f3, df1a, df3b);

  return {
    subjects: n,
    raters: k,
    rows: [
      { type: "ICC(1,1)", label: "One-way random, single rater", value: icc1, ciLow: (f1L - 1) / (f1L + k - 1), ciHigh: (f1U - 1) / (f1U + k - 1), f: f1, df1: df1a, df2: df1b, p: p1 },
      { type: "ICC(2,1)", label: "Two-way random, absolute agreement, single rater", value: icc2, ciLow: lb2, ciHigh: ub2, f: f3, df1: df1a, df2: df3b, p: p3 },
      { type: "ICC(3,1)", label: "Two-way mixed, consistency, single rater", value: icc3, ciLow: (f3L - 1) / (f3L + k - 1), ciHigh: (f3U - 1) / (f3U + k - 1), f: f3, df1: df1a, df2: df3b, p: p3 },
      { type: "ICC(1,k)", label: "One-way random, average of raters", value: icc1k, ciLow: 1 - 1 / f1L, ciHigh: 1 - 1 / f1U, f: f1, df1: df1a, df2: df1b, p: p1 },
      { type: "ICC(2,k)", label: "Two-way random, absolute agreement, average", value: icc2k, ciLow: (lb2 * k) / (1 + lb2 * (k - 1)), ciHigh: (ub2 * k) / (1 + ub2 * (k - 1)), f: f3, df1: df1a, df2: df3b, p: p3 },
      { type: "ICC(3,k)", label: "Two-way mixed, consistency, average", value: icc3k, ciLow: 1 - 1 / f3L, ciHigh: 1 - 1 / f3U, f: f3, df1: df1a, df2: df3b, p: p3 },
    ],
  };
}

/* ---------------- Sobel / mediation ---------------- */

export type SobelResult = {
  indirect: number;
  sobel: { se: number; z: number; p: number };
  aroian: { se: number; z: number; p: number };
  goodman: { se: number; z: number; p: number } | null;
  ciLow: number;
  ciHigh: number;
  proportionMediated: number | null;
};

/**
 * Sobel (1982), Aroian (1947) and Goodman (1960) tests of the indirect effect a × b.
 * a and se(a) come from X → M; b and se(b) from M → Y controlling for X. c (total effect) is optional.
 */
export function sobelTest(a: number, sa: number, b: number, sb: number, c?: number): SobelResult {
  [a, sa, b, sb].forEach((v) => {
    if (!Number.isFinite(v)) throw new Error("Enter a, SE(a), b, and SE(b).");
  });
  if (sa <= 0 || sb <= 0) throw new Error("Standard errors must be greater than 0.");
  const ab = a * b;
  const test = (variance: number) => {
    const se = Math.sqrt(variance);
    const z = ab / se;
    return { se, z, p: Math.min(1, 2 * normalSf(Math.abs(z))) };
  };
  const base = b * b * sa * sa + a * a * sb * sb;
  const goodmanVar = base - sa * sa * sb * sb;
  const sobel = test(base);
  return {
    indirect: ab,
    sobel,
    aroian: test(base + sa * sa * sb * sb),
    goodman: goodmanVar > 0 ? test(goodmanVar) : null,
    ciLow: ab - 1.96 * sobel.se,
    ciHigh: ab + 1.96 * sobel.se,
    proportionMediated: c !== undefined && Number.isFinite(c) && c !== 0 ? ab / c : null,
  };
}

/* ---------------- t distribution and t-tests ---------------- */

/** Two-sided p value for a t statistic. */
export function tTwoSidedP(t: number, df: number) {
  if (!Number.isFinite(t)) return Number.NaN;
  return Math.min(1, incompleteBeta(df / (df + t * t), df / 2, 0.5));
}

/** Upper quantile of the t distribution: P(T > q) = alpha. */
export function tQuantileUpper(alpha: number, df: number) {
  let lo = 0;
  let hi = 1;
  while (tTwoSidedP(hi, df) / 2 > alpha) hi *= 2;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (tTwoSidedP(mid, df) / 2 > alpha) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-12 * Math.max(1, hi)) break;
  }
  return (lo + hi) / 2;
}

function sampleSd(values: number[]) {
  const m = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.sqrt(values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1));
}

export type TTestResult = {
  kind: "independent" | "paired" | "one-sample";
  t: number;
  df: number;
  p: number;
  meanDiff: number;
  ciLow: number;
  ciHigh: number;
  d: number;
  dLabel: string;
  groups: Array<{ label: string; n: number; mean: number; sd: number }>;
  welch: boolean;
  levene?: { f: number; p: number };
  student?: { t: number; df: number; p: number };
};

/** Brown-Forsythe (median-centred) Levene test for two groups. */
function leveneTwoGroups(a: number[], b: number[]) {
  const za = a.map((v) => Math.abs(v - median(a)));
  const zb = b.map((v) => Math.abs(v - median(b)));
  const all = [...za, ...zb];
  const N = all.length;
  const grand = all.reduce((s, v) => s + v, 0) / N;
  const ma = za.reduce((s, v) => s + v, 0) / za.length;
  const mb = zb.reduce((s, v) => s + v, 0) / zb.length;
  const between = za.length * (ma - grand) ** 2 + zb.length * (mb - grand) ** 2;
  const within = za.reduce((s, v) => s + (v - ma) ** 2, 0) + zb.reduce((s, v) => s + (v - mb) ** 2, 0);
  const f = within > 0 ? between / (within / (N - 2)) : 0;
  return { f, p: 1 - fCdf(f, 1, N - 2) };
}

export function independentTTest(a: number[], b: number[], useWelch = true): TTestResult {
  if (a.length < 2 || b.length < 2) throw new Error("Each group needs at least 2 values.");
  const n1 = a.length;
  const n2 = b.length;
  const m1 = a.reduce((s, v) => s + v, 0) / n1;
  const m2 = b.reduce((s, v) => s + v, 0) / n2;
  const s1 = sampleSd(a);
  const s2 = sampleSd(b);
  if (s1 === 0 && s2 === 0) throw new Error("Both groups have zero variance, so a t-test is not possible.");
  const diff = m1 - m2;
  const pooledVar = ((n1 - 1) * s1 ** 2 + (n2 - 1) * s2 ** 2) / (n1 + n2 - 2);
  const seStudent = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
  const tStudent = diff / seStudent;
  const dfStudent = n1 + n2 - 2;
  const v1 = s1 ** 2 / n1;
  const v2 = s2 ** 2 / n2;
  const seWelch = Math.sqrt(v1 + v2);
  const dfWelch = (v1 + v2) ** 2 / (v1 ** 2 / (n1 - 1) + v2 ** 2 / (n2 - 1));
  const tWelch = diff / seWelch;
  const se = useWelch ? seWelch : seStudent;
  const t = useWelch ? tWelch : tStudent;
  const df = useWelch ? dfWelch : dfStudent;
  const q = tQuantileUpper(0.025, df);
  return {
    kind: "independent",
    t,
    df,
    p: tTwoSidedP(t, df),
    meanDiff: diff,
    ciLow: diff - q * se,
    ciHigh: diff + q * se,
    d: diff / Math.sqrt(pooledVar),
    dLabel: "Cohen's d",
    groups: [
      { label: "Group 1", n: n1, mean: m1, sd: s1 },
      { label: "Group 2", n: n2, mean: m2, sd: s2 },
    ],
    welch: useWelch,
    levene: leveneTwoGroups(a, b),
    student: { t: tStudent, df: dfStudent, p: tTwoSidedP(tStudent, dfStudent) },
  };
}

export function pairedTTest(before: number[], after: number[]): TTestResult {
  if (before.length !== after.length) throw new Error(`Both columns need the same number of values: ${before.length} vs ${after.length}.`);
  if (before.length < 2) throw new Error("Enter at least 2 pairs.");
  const diffs = after.map((v, i) => v - before[i]);
  const n = diffs.length;
  const md = diffs.reduce((s, v) => s + v, 0) / n;
  const sd = sampleSd(diffs);
  if (sd === 0) throw new Error("Every pair changed by the same amount, so the t statistic is undefined.");
  const se = sd / Math.sqrt(n);
  const t = md / se;
  const df = n - 1;
  const q = tQuantileUpper(0.025, df);
  const mean = (x: number[]) => x.reduce((s, v) => s + v, 0) / x.length;
  return {
    kind: "paired",
    t,
    df,
    p: tTwoSidedP(t, df),
    meanDiff: md,
    ciLow: md - q * se,
    ciHigh: md + q * se,
    d: md / sd,
    dLabel: "Cohen's dz",
    groups: [
      { label: "Before", n, mean: mean(before), sd: sampleSd(before) },
      { label: "After", n, mean: mean(after), sd: sampleSd(after) },
    ],
    welch: false,
  };
}

export function oneSampleT(values: number[], mu: number): TTestResult {
  if (values.length < 2) throw new Error("Enter at least 2 values.");
  if (!Number.isFinite(mu)) throw new Error("Enter the test value (population mean).");
  const n = values.length;
  const m = values.reduce((s, v) => s + v, 0) / n;
  const sd = sampleSd(values);
  if (sd === 0) throw new Error("All values are identical, so the t statistic is undefined.");
  const se = sd / Math.sqrt(n);
  const t = (m - mu) / se;
  const df = n - 1;
  const q = tQuantileUpper(0.025, df);
  return {
    kind: "one-sample",
    t,
    df,
    p: tTwoSidedP(t, df),
    meanDiff: m - mu,
    ciLow: m - mu - q * se,
    ciHigh: m - mu + q * se,
    d: (m - mu) / sd,
    dLabel: "Cohen's d",
    groups: [{ label: "Sample", n, mean: m, sd }],
    welch: false,
  };
}

/* ---------------- One-way ANOVA with Tukey HSD ---------------- */

function normalCdf(z: number) {
  return z >= 0 ? 1 - normalSf(z) : normalSf(-z);
}

// P(range of k standard normals < w)
function normalRangeCdf(w: number, k: number) {
  if (w <= 0) return 0;
  const steps = 160;
  const lo = -8;
  const hi = 8;
  const h = (hi - lo) / steps;
  let sum = 0;
  for (let i = 0; i <= steps; i += 1) {
    const z = lo + i * h;
    const inner = normalCdf(z) - normalCdf(z - w);
    const f = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI) * Math.pow(Math.max(inner, 0), k - 1);
    sum += f * (i === 0 || i === steps ? 1 : i % 2 === 1 ? 4 : 2);
  }
  return Math.min(1, k * sum * (h / 3));
}

// CDF of the studentized range distribution, P(Q < q) for k means and df error degrees of freedom.
export function ptukey(q: number, k: number, df: number) {
  if (q <= 0) return 0;
  if (df > 5000) return normalRangeCdf(q, k);
  const sigma = 1 / Math.sqrt(2 * df);
  const lo = Math.max(0, 1 - 9 * sigma);
  const hi = 1 + 12 * sigma + (df < 10 ? 3 : 0);
  const steps = 140;
  const h = (hi - lo) / steps;
  const logC = (df / 2) * Math.log(df) - lnGamma(df / 2) - (df / 2 - 1) * Math.log(2);
  let sum = 0;
  for (let i = 0; i <= steps; i += 1) {
    const s = lo + i * h;
    if (s <= 0) continue;
    const dens = Math.exp(logC + (df - 1) * Math.log(s) - (df * s * s) / 2);
    sum += dens * normalRangeCdf(q * s, k) * (i === 0 || i === steps ? 1 : i % 2 === 1 ? 4 : 2);
  }
  return Math.min(1, Math.max(0, sum * (h / 3)));
}

export function qtukey(p: number, k: number, df: number) {
  let lo = 0;
  let hi = 40;
  for (let i = 0; i < 36; i += 1) {
    const mid = (lo + hi) / 2;
    if (ptukey(mid, k, df) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export type AnovaGroup = { name: string; n: number; mean: number; sd: number };
export type TukeyComparison = { a: string; b: string; diff: number; ciLow: number; ciHigh: number; q: number; p: number };
export type AnovaResult = {
  k: number;
  n: number;
  ssBetween: number;
  ssWithin: number;
  ssTotal: number;
  dfBetween: number;
  dfWithin: number;
  msBetween: number;
  msWithin: number;
  f: number;
  p: number;
  etaSquared: number;
  omegaSquared: number;
  groups: AnovaGroup[];
  levene: { f: number; df1: number; df2: number; p: number };
  welch: { f: number; df1: number; df2: number; p: number };
  tukey: TukeyComparison[];
};

function anovaCore(groups: number[][]) {
  const all = groups.flat();
  const n = all.length;
  const k = groups.length;
  const grand = all.reduce((s, v) => s + v, 0) / n;
  const means = groups.map((g) => g.reduce((s, v) => s + v, 0) / g.length);
  const ssBetween = groups.reduce((s, g, i) => s + g.length * (means[i] - grand) ** 2, 0);
  const ssWithin = groups.reduce((s, g, i) => s + g.reduce((t, v) => t + (v - means[i]) ** 2, 0), 0);
  const dfBetween = k - 1;
  const dfWithin = n - k;
  const f = ssWithin === 0 ? Infinity : ssBetween / dfBetween / (ssWithin / dfWithin);
  const p = Number.isFinite(f) ? 1 - fCdf(f, dfBetween, dfWithin) : 0;
  return { n, k, means, ssBetween, ssWithin, dfBetween, dfWithin, f, p };
}

export function oneWayAnova(input: Array<{ name: string; values: number[] }>): AnovaResult {
  const k = input.length;
  if (k < 2) throw new Error("Enter at least 2 groups (3 or more for a typical one-way ANOVA).");
  input.forEach((g) => {
    if (g.values.length < 2) throw new Error(`${g.name} needs at least 2 values.`);
  });
  const values = input.map((g) => g.values);
  const core = anovaCore(values);
  if (core.dfWithin < 1) throw new Error("Not enough values: total N must be larger than the number of groups.");
  const msBetween = core.ssBetween / core.dfBetween;
  const msWithin = core.ssWithin / core.dfWithin;
  const ssTotal = core.ssBetween + core.ssWithin;
  const groups = input.map((g, i) => ({
    name: g.name,
    n: g.values.length,
    mean: core.means[i],
    sd: Math.sqrt(g.values.reduce((s, v) => s + (v - core.means[i]) ** 2, 0) / (g.values.length - 1)),
  }));

  // Levene (Brown-Forsythe, median-centred)
  const dev = values.map((g) => {
    const m = median(g);
    return g.map((v) => Math.abs(v - m));
  });
  const lev = anovaCore(dev);
  const levene = { f: lev.f, df1: lev.dfBetween, df2: lev.dfWithin, p: Number.isFinite(lev.f) ? lev.p : 0 };

  // Welch's ANOVA
  const w = groups.map((g) => g.n / (g.sd * g.sd));
  const sw = w.reduce((s, v) => s + v, 0);
  const wMean = groups.reduce((s, g, i) => s + w[i] * g.mean, 0) / sw;
  const a = groups.reduce((s, g, i) => s + w[i] * (g.mean - wMean) ** 2, 0) / (k - 1);
  const lam = groups.reduce((s, g, i) => s + (1 - w[i] / sw) ** 2 / (g.n - 1), 0);
  const welchF = a / (1 + ((2 * (k - 2)) / (k * k - 1)) * lam);
  const welchDf2 = (k * k - 1) / (3 * lam);
  const welch = { f: welchF, df1: k - 1, df2: welchDf2, p: Number.isFinite(welchF) ? 1 - fCdf(welchF, k - 1, welchDf2) : NaN };

  // Tukey HSD (Tukey-Kramer for unequal n)
  const qCrit = qtukey(0.95, k, core.dfWithin);
  const tukey: TukeyComparison[] = [];
  for (let i = 0; i < k; i += 1) {
    for (let j = i + 1; j < k; j += 1) {
      const diff = groups[j].mean - groups[i].mean;
      const se = Math.sqrt((msWithin / 2) * (1 / groups[i].n + 1 / groups[j].n));
      const q = Math.abs(diff) / se;
      tukey.push({
        a: groups[i].name,
        b: groups[j].name,
        diff,
        ciLow: diff - qCrit * se,
        ciHigh: diff + qCrit * se,
        q,
        p: Math.min(1, Math.max(0, 1 - ptukey(q, k, core.dfWithin))),
      });
    }
  }

  return {
    k,
    n: core.n,
    ssBetween: core.ssBetween,
    ssWithin: core.ssWithin,
    ssTotal,
    dfBetween: core.dfBetween,
    dfWithin: core.dfWithin,
    msBetween,
    msWithin,
    f: core.f,
    p: core.p,
    etaSquared: core.ssBetween / ssTotal,
    omegaSquared: Math.max(0, (core.ssBetween - core.dfBetween * msWithin) / (ssTotal + msWithin)),
    groups,
    levene,
    welch,
    tukey,
  };
}

/* ---------------- Correlation: Pearson, Spearman, Kendall ---------------- */

export type CorrelationResult = {
  method: "pearson" | "spearman" | "kendall";
  n: number;
  r: number;
  df: number;
  stat: number;
  statLabel: "t" | "z";
  p: number;
  ciLow: number;
  ciHigh: number;
  rSquared: number;
  slope: number;
  intercept: number;
  meanX: number;
  meanY: number;
  sdX: number;
  sdY: number;
};

function pearsonR(x: number[], y: number[]) {
  const n = x.length;
  const mx = x.reduce((s, v) => s + v, 0) / n;
  const my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  if (sxx === 0 || syy === 0) throw new Error("One variable has no variation (all values are the same), so a correlation cannot be computed.");
  return { r: Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy))), mx, my, sxx, syy, sxy };
}

function kendallTauB(x: number[], y: number[]) {
  const n = x.length;
  let s = 0;
  let tiesX = 0;
  let tiesY = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const dx = Math.sign(x[i] - x[j]);
      const dy = Math.sign(y[i] - y[j]);
      if (dx === 0) tiesX += 1;
      if (dy === 0) tiesY += 1;
      s += dx * dy;
    }
  }
  const n0 = (n * (n - 1)) / 2;
  const tau = s / Math.sqrt((n0 - tiesX) * (n0 - tiesY));
  const groupTerms = (v: number[]) => {
    const counts = new Map<number, number>();
    v.forEach((a) => counts.set(a, (counts.get(a) ?? 0) + 1));
    let a = 0;
    let b = 0;
    let c = 0;
    counts.forEach((t) => {
      a += t * (t - 1) * (2 * t + 5);
      b += t * (t - 1) * (t - 2);
      c += t * (t - 1);
    });
    return { a, b, c };
  };
  const tx = groupTerms(x);
  const ty = groupTerms(y);
  const v0 = n * (n - 1) * (2 * n + 5);
  const variance =
    (v0 - tx.a - ty.a) / 18 + (tx.b * ty.b) / (9 * n * (n - 1) * (n - 2)) + (tx.c * ty.c) / (2 * n * (n - 1));
  const z = s / Math.sqrt(variance);
  return { tau, z };
}

export function correlation(x: number[], y: number[], method: "pearson" | "spearman" | "kendall" = "pearson"): CorrelationResult {
  if (x.length !== y.length) throw new Error(`X has ${x.length} values but Y has ${y.length}. Each X needs a matching Y.`);
  const n = x.length;
  if (n < 3) throw new Error("Enter at least 3 pairs of values.");
  const base = pearsonR(x, y);
  const slope = base.sxy / base.sxx;
  const intercept = base.my - slope * base.mx;
  const sdX = Math.sqrt(base.sxx / (n - 1));
  const sdY = Math.sqrt(base.syy / (n - 1));
  let r = base.r;
  let stat: number;
  let statLabel: "t" | "z" = "t";
  let p: number;
  let se = 1 / Math.sqrt(Math.max(n - 3, 1));
  if (method === "spearman") {
    r = pearsonR(averageRanks(x).ranks, averageRanks(y).ranks).r;
    se = Math.sqrt(1 + (r * r) / 2) / Math.sqrt(Math.max(n - 3, 1)); // Bonett & Wright (2000)
  }
  if (method === "kendall") {
    const k = kendallTauB(x, y);
    r = k.tau;
    stat = k.z;
    statLabel = "z";
    p = Math.min(1, 2 * normalSf(Math.abs(k.z)));
    se = Math.sqrt(0.437 / Math.max(n - 4, 1)); // Fieller, Hartley & Pearson (1957)
  } else {
    const df = n - 2;
    stat = Math.abs(r) >= 1 ? Math.sign(r) * Infinity : r * Math.sqrt(df / (1 - r * r));
    p = Math.abs(r) >= 1 ? 0 : tTwoSidedP(stat, df);
  }
  let ciLow = NaN;
  let ciHigh = NaN;
  if (n > 3 && Math.abs(r) < 1) {
    const z = Math.atanh(r);
    ciLow = Math.tanh(z - 1.959963984540054 * se);
    ciHigh = Math.tanh(z + 1.959963984540054 * se);
  }
  return { method, n, r, df: n - 2, stat, statLabel, p, ciLow, ciHigh, rSquared: r * r, slope, intercept, meanX: base.mx, meanY: base.my, sdX, sdY };
}

export function correlationBand(r: number) {
  const a = Math.abs(r);
  if (a < 0.1) return "negligible";
  if (a < 0.3) return "weak";
  if (a < 0.5) return "moderate";
  if (a < 0.7) return "strong";
  return "very strong";
}

export function parsePairs(text: string) {
  const x: number[] = [];
  const y: number[] = [];
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line, i) => {
      const parts = line.split(/[\s,;\t]+/).filter(Boolean);
      if (parts.length !== 2) throw new Error(`Line ${i + 1} should have exactly two numbers (X and Y).`);
      const a = Number(parts[0]);
      const b = Number(parts[1]);
      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        if (i === 0) return; // header row
        throw new Error(`Line ${i + 1} contains a value that is not a number.`);
      }
      x.push(a);
      y.push(b);
    });
  return { x, y };
}

/* ---------------- Linear regression (simple and multiple OLS) ---------------- */

export function parseDataTable(text: string): { names: string[]; rows: number[][] } {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[\t,;]+|\s+/).map((c) => c.trim()).filter(Boolean));
  if (!lines.length) throw new Error("Paste your data with one row per participant.");
  let names: string[];
  if (lines[0].some((c) => !Number.isFinite(Number(c)))) names = lines.shift() as string[];
  else names = lines[0].map((_, i) => (i === 0 ? "Y" : `X${i}`));
  const width = names.length;
  const rows = lines.map((row, r) => {
    if (row.length !== width) throw new Error(`Row ${r + 1} has ${row.length} values but there are ${width} columns.`);
    return row.map((c, j) => {
      const v = Number(c);
      if (!Number.isFinite(v)) throw new Error(`Row ${r + 1}, column ${j + 1} is not a number ("${c}").`);
      return v;
    });
  });
  if (new Set(names).size !== names.length) throw new Error("Column names must be different.");
  return { names, rows };
}

function invertMatrix(m: number[][]): number[][] {
  const n = m.length;
  const a = m.map((row, i) => [...row, ...row.map((_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c += 1) {
    let pivot = c;
    for (let r = c + 1; r < n; r += 1) if (Math.abs(a[r][c]) > Math.abs(a[pivot][c])) pivot = r;
    if (Math.abs(a[pivot][c]) < 1e-12) throw new Error("Predictors are perfectly collinear (one is an exact combination of others). Remove one and try again.");
    [a[c], a[pivot]] = [a[pivot], a[c]];
    const div = a[c][c];
    for (let j = 0; j < 2 * n; j += 1) a[c][j] /= div;
    for (let r = 0; r < n; r += 1) {
      if (r === c) continue;
      const f = a[r][c];
      if (f !== 0) for (let j = 0; j < 2 * n; j += 1) a[r][j] -= f * a[c][j];
    }
  }
  return a.map((row) => row.slice(n));
}

export type RegressionCoefficient = { name: string; b: number; se: number; t: number; p: number; ciLow: number; ciHigh: number; beta: number | null; vif: number | null };
export type RegressionResult = {
  outcome: string;
  n: number;
  k: number;
  r: number;
  rSquared: number;
  adjRSquared: number;
  see: number;
  f: number;
  dfModel: number;
  dfResidual: number;
  p: number;
  ssRegression: number;
  ssResidual: number;
  ssTotal: number;
  coefficients: RegressionCoefficient[];
  fitted: number[];
  residuals: number[];
  y: number[];
  durbinWatson: number;
  maxCooksD: number;
};

function olsFit(y: number[], xs: number[][]) {
  const n = y.length;
  const p = xs.length + 1;
  const X = y.map((_, i) => [1, ...xs.map((col) => col[i])]);
  const xtx = Array.from({ length: p }, (_, a) => Array.from({ length: p }, (_, b) => X.reduce((s, row) => s + row[a] * row[b], 0)));
  const xty = Array.from({ length: p }, (_, a) => X.reduce((s, row, i) => s + row[a] * y[i], 0));
  const inv = invertMatrix(xtx);
  const coef = inv.map((row) => row.reduce((s, v, j) => s + v * xty[j], 0));
  const fitted = X.map((row) => row.reduce((s, v, j) => s + v * coef[j], 0));
  const my = y.reduce((s, v) => s + v, 0) / n;
  const ssTotal = y.reduce((s, v) => s + (v - my) ** 2, 0);
  const ssResidual = y.reduce((s, v, i) => s + (v - fitted[i]) ** 2, 0);
  return { X, inv, coef, fitted, ssTotal, ssResidual, n, p };
}

export function linearRegression(names: string[], rows: number[][], outcomeIndex: number, predictorIndexes: number[]): RegressionResult {
  if (!predictorIndexes.length) throw new Error("Choose at least one predictor (X) variable.");
  const k = predictorIndexes.length;
  const n = rows.length;
  if (n < k + 2) throw new Error(`You need at least ${k + 2} rows of data for ${k} predictor${k > 1 ? "s" : ""}.`);
  const y = rows.map((r) => r[outcomeIndex]);
  const xs = predictorIndexes.map((j) => rows.map((r) => r[j]));
  const fit = olsFit(y, xs);
  if (fit.ssTotal === 0) throw new Error("The outcome has no variation (all values are the same).");
  const dfResidual = n - k - 1;
  const mse = fit.ssResidual / dfResidual;
  const ssRegression = fit.ssTotal - fit.ssResidual;
  const rSquared = ssRegression / fit.ssTotal;
  const f = mse === 0 ? Infinity : ssRegression / k / mse;
  const tCrit = tQuantileUpper(0.025, dfResidual);
  const sd = (v: number[]) => {
    const m = v.reduce((s, a) => s + a, 0) / v.length;
    return Math.sqrt(v.reduce((s, a) => s + (a - m) ** 2, 0) / (v.length - 1));
  };
  const sdY = sd(y);
  const coefficients: RegressionCoefficient[] = fit.coef.map((b, j) => {
    const se = Math.sqrt(Math.max(0, mse * fit.inv[j][j]));
    const t = se === 0 ? Infinity : b / se;
    let vif: number | null = null;
    if (j > 0 && k > 1) {
      const others = xs.filter((_, idx) => idx !== j - 1);
      const aux = olsFit(xs[j - 1], others);
      const r2 = 1 - aux.ssResidual / aux.ssTotal;
      vif = r2 >= 1 ? Infinity : 1 / (1 - r2);
    }
    return {
      name: j === 0 ? "(Constant)" : names[predictorIndexes[j - 1]],
      b,
      se,
      t,
      p: Number.isFinite(t) ? tTwoSidedP(t, dfResidual) : 0,
      ciLow: b - tCrit * se,
      ciHigh: b + tCrit * se,
      beta: j === 0 ? null : (b * sd(xs[j - 1])) / sdY,
      vif,
    };
  });
  const residuals = y.map((v, i) => v - fit.fitted[i]);
  let dwNum = 0;
  for (let i = 1; i < n; i += 1) dwNum += (residuals[i] - residuals[i - 1]) ** 2;
  // Cook's distance from leverages
  let maxCooksD = 0;
  fit.X.forEach((row, i) => {
    const h = row.reduce((s, v, a) => s + v * row.reduce((t, w, b) => t + fit.inv[a][b] * w, 0), 0);
    const d = (residuals[i] ** 2 / ((k + 1) * mse)) * (h / (1 - h) ** 2);
    if (Number.isFinite(d)) maxCooksD = Math.max(maxCooksD, d);
  });
  return {
    outcome: names[outcomeIndex],
    n,
    k,
    r: Math.sqrt(Math.max(0, rSquared)),
    rSquared,
    adjRSquared: 1 - ((1 - rSquared) * (n - 1)) / dfResidual,
    see: Math.sqrt(mse),
    f,
    dfModel: k,
    dfResidual,
    p: Number.isFinite(f) ? 1 - fCdf(f, k, dfResidual) : 0,
    ssRegression,
    ssResidual: fit.ssResidual,
    ssTotal: fit.ssTotal,
    coefficients,
    fitted: fit.fitted,
    residuals,
    y,
    durbinWatson: dwNum / fit.ssResidual,
    maxCooksD,
  };
}
