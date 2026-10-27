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
