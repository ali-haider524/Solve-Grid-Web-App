export type CircuitResult = { title: string; values: Array<{ label: string; value: string }>; note: string };

function finite(value: number, label: string) {
  if (!Number.isFinite(value)) throw new Error(`${label} must be a finite number.`);
  return value;
}

function positive(value: number, label: string) {
  finite(value, label);
  if (value <= 0) throw new Error(`${label} must be greater than zero.`);
  return value;
}

function fmt(value: number, unit = "") {
  if (!Number.isFinite(value)) return "Undefined";
  return `${Number(value.toPrecision(8))}${unit ? ` ${unit}` : ""}`;
}

export function solveOhmsLaw(voltage?: number, current?: number, resistance?: number): CircuitResult {
  const known = [voltage, current, resistance].filter((value) => Number.isFinite(value)).length;
  if (known !== 2) throw new Error("Enter exactly two values to solve Ohm's law.");
  let v = voltage as number; let i = current as number; let r = resistance as number;
  if (!Number.isFinite(v)) v = finite(i, "Current") * positive(r, "Resistance");
  if (!Number.isFinite(i)) i = finite(v, "Voltage") / positive(r, "Resistance");
  if (!Number.isFinite(r)) r = finite(v, "Voltage") / finite(i, "Current");
  return { title: "Ohm's law result", values: [{ label: "Voltage", value: fmt(v, "V") }, { label: "Current", value: fmt(i, "A") }, { label: "Resistance", value: fmt(r, "Ω") }, { label: "Power", value: fmt(v * i, "W") }], note: "Uses V = I × R and P = V × I for an ideal DC calculation." };
}

export function solveResistorSeries(resistors: number[], supplyVoltage?: number): CircuitResult {
  if (!resistors.length) throw new Error("Enter at least one resistor.");
  const total = resistors.reduce((sum, value, index) => sum + positive(value, `R${index + 1}`), 0);
  const hasSupply = Number.isFinite(supplyVoltage);
  const current = hasSupply ? (supplyVoltage as number) / total : NaN;
  return { title: "Series resistor network", values: [{ label: "Equivalent resistance", value: fmt(total, "Ω") }, ...(hasSupply ? [{ label: "Circuit current", value: fmt(current, "A") }, { label: "Total power", value: fmt((supplyVoltage as number) * current, "W") }] : [])], note: "Series resistances add directly. A supply voltage is optional for current and power." };
}

export function solveResistorParallel(resistors: number[], supplyVoltage?: number): CircuitResult {
  if (!resistors.length) throw new Error("Enter at least one resistor.");
  const conductance = resistors.reduce((sum, value, index) => sum + 1 / positive(value, `R${index + 1}`), 0);
  const equivalent = 1 / conductance;
  const hasSupply = Number.isFinite(supplyVoltage);
  const current = hasSupply ? (supplyVoltage as number) / equivalent : NaN;
  return { title: "Parallel resistor network", values: [{ label: "Equivalent resistance", value: fmt(equivalent, "Ω") }, ...(hasSupply ? [{ label: "Source current", value: fmt(current, "A") }, { label: "Total power", value: fmt((supplyVoltage as number) * current, "W") }] : [])], note: "Parallel conductances add: 1/Rₑq = Σ(1/Rᵢ)." };
}

export function solveVoltageDivider(sourceVoltage: number, rTop: number, rBottom: number): CircuitResult {
  const v = finite(sourceVoltage, "Source voltage");
  const upper = positive(rTop, "Top resistance");
  const lower = positive(rBottom, "Bottom resistance");
  const output = v * lower / (upper + lower);
  const current = v / (upper + lower);
  return { title: "Voltage divider", values: [{ label: "Output voltage", value: fmt(output, "V") }, { label: "Divider current", value: fmt(current, "A") }, { label: "Total resistance", value: fmt(upper + lower, "Ω") }], note: "Assumes the output is unloaded. A load changes the lower-leg equivalent resistance." };
}

export function solveRcTransient(mode: "charge" | "discharge", sourceVoltage: number, resistance: number, capacitanceMicrofarads: number, time: number): CircuitResult {
  const r = positive(resistance, "Resistance");
  const c = positive(capacitanceMicrofarads, "Capacitance") * 1e-6;
  const t = finite(time, "Time");
  if (t < 0) throw new Error("Time cannot be negative.");
  const tau = r * c;
  const ratio = Math.exp(-t / tau);
  const voltage = mode === "charge" ? sourceVoltage * (1 - ratio) : sourceVoltage * ratio;
  return { title: `RC ${mode} response`, values: [{ label: "Time constant τ", value: fmt(tau, "s") }, { label: "Capacitor voltage", value: fmt(voltage, "V") }, { label: "Elapsed time / τ", value: fmt(t / tau) }], note: "Ideal first-order RC response. Real circuits may include source resistance, leakage, and measurement loading." };
}

export function solveTwoNodeNodal(input: { r1: number; r2: number; r12: number; i1: number; i2: number }): CircuitResult {
  const r1 = positive(input.r1, "R1"); const r2 = positive(input.r2, "R2"); const r12 = positive(input.r12, "R12");
  const g1 = 1 / r1 + 1 / r12; const g2 = 1 / r2 + 1 / r12; const off = -1 / r12;
  const determinant = g1 * g2 - off * off;
  if (Math.abs(determinant) < 1e-14) throw new Error("The nodal conductance matrix is singular.");
  const v1 = (input.i1 * g2 - off * input.i2) / determinant;
  const v2 = (g1 * input.i2 - off * input.i1) / determinant;
  const i12 = (v1 - v2) / r12;
  return { title: "Two-node nodal analysis", values: [{ label: "Node V₁", value: fmt(v1, "V") }, { label: "Node V₂", value: fmt(v2, "V") }, { label: "Current through R₁₂", value: fmt(i12, "A") }], note: "Current sources I₁ and I₂ are positive when injected into their nodes. R1 and R2 connect each node to ground; R12 connects the two nodes." };
}
