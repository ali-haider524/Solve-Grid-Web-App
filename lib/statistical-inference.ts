export type InferenceResult = { title: string; rows: Array<{ label: string; value: string }>; interpretation: string; assumptions: string };

function parse(values: string) {
  const result = values.split(/[\s,;\n]+/).filter(Boolean).map(Number);
  if (result.length < 2 || result.some((value) => !Number.isFinite(value))) throw new Error("Enter at least two valid numeric values.");
  return result;
}

function mean(values: number[]) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
function variance(values: number[], sample = true) { const average = mean(values); const divisor = sample ? values.length - 1 : values.length; return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / divisor; }
function sd(values: number[]) { return Math.sqrt(variance(values)); }
function fmt(value: number, digits = 8) { return Number.isFinite(value) ? String(Number(value.toPrecision(digits))) : "Undefined"; }

function logGamma(value: number): number {
  const coeffs = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (value < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  let x = 0.9999999999998099; const z = value - 1;
  for (let index = 0; index < coeffs.length; index += 1) x += coeffs[index] / (z + index + 1);
  const t = z + coeffs.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function betaContinuedFraction(a: number, b: number, x: number): number {
  const maxIterations = 200; const eps = 3e-14; const fpmin = 1e-300;
  const qab = a + b; const qap = a + 1; const qam = a - 1;
  let c = 1; let d = 1 - qab * x / qap; if (Math.abs(d) < fpmin) d = fpmin; d = 1 / d; let h = d;
  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < fpmin) d = fpmin; c = 1 + aa / c; if (Math.abs(c) < fpmin) c = fpmin; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < fpmin) d = fpmin; c = 1 + aa / c; if (Math.abs(c) < fpmin) c = fpmin; d = 1 / d; const delta = d * c; h *= delta;
    if (Math.abs(delta - 1) < eps) break;
  }
  return h;
}

function regularizedBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * betaContinuedFraction(a, b, x) / a : 1 - bt * betaContinuedFraction(b, a, 1 - x) / b;
}

function tCdf(t: number, degreesOfFreedom: number): number {
  if (t === 0) return 0.5;
  const x = degreesOfFreedom / (degreesOfFreedom + t * t);
  const ib = regularizedBeta(x, degreesOfFreedom / 2, 0.5);
  return t > 0 ? 1 - ib / 2 : ib / 2;
}

function tCritical(degreesOfFreedom: number, confidence = 0.95): number {
  const target = 1 - (1 - confidence) / 2;
  let low = 0; let high = 20;
  for (let step = 0; step < 100; step += 1) {
    const middle = (low + high) / 2;
    if (tCdf(middle, degreesOfFreedom) < target) low = middle; else high = middle;
  }
  return (low + high) / 2;
}

function twoSidedP(t: number, df: number): number { return Math.min(1, 2 * (1 - tCdf(Math.abs(t), df))); }

export function oneSampleTTest(valuesText: string, populationMean: number, confidence = 0.95): InferenceResult {
  const values = parse(valuesText); const average = mean(values); const sampleSd = sd(values); const se = sampleSd / Math.sqrt(values.length); const df = values.length - 1; const t = (average - populationMean) / se; const p = twoSidedP(t, df); const critical = tCritical(df, confidence); const margin = critical * se;
  return { title: "One-sample t-test", rows: [{ label: "n", value: String(values.length) }, { label: "Sample mean", value: fmt(average) }, { label: "Sample SD", value: fmt(sampleSd) }, { label: "t statistic", value: fmt(t) }, { label: "Degrees of freedom", value: String(df) }, { label: "Two-sided p value", value: fmt(p) }, { label: `${Math.round(confidence * 100)}% confidence interval`, value: `[${fmt(average - margin)}, ${fmt(average + margin)}]` }], interpretation: p < 0.05 ? "At the 5% level, the sample is inconsistent with the selected population mean under the test assumptions." : "At the 5% level, this test does not show enough evidence against the selected population mean.", assumptions: "Independent observations, approximately normal data or a sufficiently robust sample context, and a sample standard deviation." };
}

export function welchTTest(firstText: string, secondText: string, difference = 0): InferenceResult {
  const first = parse(firstText); const second = parse(secondText); const m1 = mean(first); const m2 = mean(second); const v1 = variance(first); const v2 = variance(second); const se2 = v1 / first.length + v2 / second.length; const t = ((m1 - m2) - difference) / Math.sqrt(se2); const df = se2 ** 2 / ((v1 / first.length) ** 2 / (first.length - 1) + (v2 / second.length) ** 2 / (second.length - 1)); const p = twoSidedP(t, df);
  return { title: "Welch two-sample t-test", rows: [{ label: "Group A mean", value: fmt(m1) }, { label: "Group B mean", value: fmt(m2) }, { label: "Mean difference", value: fmt(m1 - m2) }, { label: "t statistic", value: fmt(t) }, { label: "Welch df", value: fmt(df) }, { label: "Two-sided p value", value: fmt(p) }], interpretation: p < 0.05 ? "At the 5% level, the entered samples show evidence of a difference in means under the Welch test assumptions." : "At the 5% level, the entered samples do not show enough evidence of a difference in means.", assumptions: "Independent groups. Welch's test does not assume equal variances." };
}

export function correlationTest(xText: string, yText: string): InferenceResult {
  const x = parse(xText); const y = parse(yText); if (x.length !== y.length || x.length < 3) throw new Error("Enter matching X and Y lists with at least three pairs."); const mx = mean(x); const my = mean(y); let sxy = 0; let sx = 0; let sy = 0; for (let index = 0; index < x.length; index += 1) { const dx = x[index] - mx; const dy = y[index] - my; sxy += dx * dy; sx += dx * dx; sy += dy * dy; } const r = sxy / Math.sqrt(sx * sy); const slope = sxy / sx; const intercept = my - slope * mx; const df = x.length - 2; const t = r * Math.sqrt(df / Math.max(1e-15, 1 - r * r)); const p = twoSidedP(t, df);
  return { title: "Pearson correlation and linear regression", rows: [{ label: "Pairs", value: String(x.length) }, { label: "Correlation r", value: fmt(r) }, { label: "R²", value: fmt(r * r) }, { label: "Slope", value: fmt(slope) }, { label: "Intercept", value: fmt(intercept) }, { label: "Correlation p value", value: fmt(p) }], interpretation: p < 0.05 ? "The linear correlation is statistically distinguishable from zero at the 5% level under the test assumptions." : "The linear correlation is not statistically distinguishable from zero at the 5% level from these data alone.", assumptions: "Paired independent observations, an approximately linear relationship, and no influential outliers dominating the result." };
}

export function oneWayAnova(groupsText: string): InferenceResult {
  const groups = groupsText.split(/;/).map((part) => parse(part.trim())).filter((group) => group.length);
  if (groups.length < 3) throw new Error("Enter at least three groups separated by semicolons.");
  const all = groups.flat(); const grand = mean(all); const between = groups.reduce((sum, group) => sum + group.length * (mean(group) - grand) ** 2, 0); const within = groups.reduce((sum, group) => sum + group.reduce((inner, value) => inner + (value - mean(group)) ** 2, 0), 0); const df1 = groups.length - 1; const df2 = all.length - groups.length; if (df2 <= 0) throw new Error("Each group needs enough observations for ANOVA."); const f = (between / df1) / (within / df2); const x = (df1 * f) / (df1 * f + df2); const p = Math.max(0, 1 - regularizedBeta(x, df1 / 2, df2 / 2));
  return { title: "One-way ANOVA", rows: [{ label: "Groups", value: String(groups.length) }, { label: "Total observations", value: String(all.length) }, { label: "F statistic", value: fmt(f) }, { label: "df between", value: String(df1) }, { label: "df within", value: String(df2) }, { label: "p value", value: fmt(p) }], interpretation: p < 0.05 ? "At the 5% level, at least one group mean differs under the ANOVA assumptions." : "At the 5% level, this ANOVA does not show enough evidence that group means differ.", assumptions: "Independent observations, approximately normal residuals within groups, and similar variance across groups." };
}
