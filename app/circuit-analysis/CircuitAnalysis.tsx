"use client";

import Link from "next/link";
import { useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import {
  solveOhmsLaw,
  solveRcTransient,
  solveResistorParallel,
  solveResistorSeries,
  solveTwoNodeNodal,
  solveVoltageDivider,
  type CircuitResult,
} from "../../lib/circuit-analysis";
import styles from "../../components/ResearchLab.module.css";

type Mode = "ohm" | "series" | "parallel" | "divider" | "rc" | "nodal";

const modes: Array<{ id: Mode; label: string }> = [
  { id: "ohm", label: "Ohm's law" },
  { id: "series", label: "Series" },
  { id: "parallel", label: "Parallel" },
  { id: "divider", label: "Voltage divider" },
  { id: "rc", label: "RC transient" },
  { id: "nodal", label: "2-node nodal" },
];

const modeNotes: Record<Mode, string> = {
  ohm: "Leave exactly one field blank to solve V = I × R. This mode is useful for basic DC resistor questions and power checks.",
  series: "Enter resistor values separated by commas, spaces, or semicolons. Series resistance is the direct sum of all resistor values.",
  parallel: "Parallel resistance uses reciprocal conductance: 1/Rtotal = 1/R1 + 1/R2 + ...",
  divider: "A voltage divider estimates the output across the bottom resistor using Vout = Vin × R2 ÷ (R1 + R2).",
  rc: "The RC transient mode uses the ideal time constant τ = R × C. Capacitance is entered in microfarads.",
  nodal: "Two-node nodal analysis builds a 2×2 conductance matrix from KCL and solves for node voltages V1 and V2.",
};

function number(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseResistors(value: string) {
  return value.split(/[\s,;]+/).filter(Boolean).map(Number);
}

export default function CircuitAnalysis() {
  const [mode, setMode] = useState<Mode>("ohm");
  const [inputs, setInputs] = useState<Record<string, string>>({
    voltage: "12",
    current: "",
    resistance: "100",
    resistors: "100, 220, 330",
    supply: "12",
    rTop: "1000",
    rBottom: "1000",
    capacitance: "100",
    time: "0.1",
    rcMode: "charge",
    r1: "1000",
    r2: "2000",
    r12: "1500",
    i1: "0.01",
    i2: "0.005",
  });
  const [result, setResult] = useState<CircuitResult | null>(null);
  const [error, setError] = useState("");

  const activeMode = modes.find((item) => item.id === mode);

  const set = (key: string, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setResult(null);
    setError("");
  }

  function loadNodalExample() {
    setMode("nodal");
    setInputs((current) => ({
      ...current,
      r1: "1000",
      r2: "2000",
      r12: "1500",
      i1: "0.01",
      i2: "0.005",
    }));
    setResult(null);
    setError("");
  }

  function run() {
    try {
      setError("");

      let next: CircuitResult;

      if (mode === "ohm") {
        next = solveOhmsLaw(
          inputs.voltage.trim() === "" ? NaN : number(inputs.voltage),
          inputs.current.trim() === "" ? NaN : number(inputs.current),
          inputs.resistance.trim() === "" ? NaN : number(inputs.resistance),
        );
      } else if (mode === "series") {
        next = solveResistorSeries(
          parseResistors(inputs.resistors),
          inputs.supply.trim() === "" ? NaN : number(inputs.supply),
        );
      } else if (mode === "parallel") {
        next = solveResistorParallel(
          parseResistors(inputs.resistors),
          inputs.supply.trim() === "" ? NaN : number(inputs.supply),
        );
      } else if (mode === "divider") {
        next = solveVoltageDivider(
          number(inputs.supply),
          number(inputs.rTop),
          number(inputs.rBottom),
        );
      } else if (mode === "rc") {
        next = solveRcTransient(
          inputs.rcMode === "discharge" ? "discharge" : "charge",
          number(inputs.supply),
          number(inputs.resistance),
          number(inputs.capacitance),
          number(inputs.time),
        );
      } else {
        next = solveTwoNodeNodal({
          r1: number(inputs.r1),
          r2: number(inputs.r2),
          r12: number(inputs.r12),
          i1: number(inputs.i1),
          i2: number(inputs.i2),
        });
      }

      setResult(next);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Check the circuit values.");
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="research" />

      <section className={styles.hero}>
        <p>DC CIRCUIT ANALYSIS CALCULATOR</p>
        <h1>Nodal analysis, resistor networks, Ohm&apos;s law, and RC circuits.</h1>
        <span>
          Use ideal DC circuit models for Ohm&apos;s law, series and parallel resistors,
          voltage dividers, RC transients, and a two-node nodal-analysis calculator
          that shows the conductance-matrix idea behind KCL.
        </span>
      </section>

      <section className={styles.workspace}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>CIRCUIT WORKSPACE</p>
              <h2>{activeMode?.label}</h2>
            </div>
            <span className={styles.status}>IDEAL DC MODEL</span>
          </div>

          <div className={styles.tabRow}>
            {modes.map((item) => (
              <button
                className={mode === item.id ? styles.activeTab : undefined}
                key={item.id}
                onClick={() => changeMode(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className={styles.sectionNote}>{modeNotes[mode]}</p>

          {mode === "ohm" ? (
            <div className={styles.fieldGrid}>
              <label>
                <span>Voltage (V)</span>
                <input
                  inputMode="decimal"
                  value={inputs.voltage}
                  onChange={(event) => set("voltage", event.target.value)}
                  placeholder="Leave one blank"
                />
              </label>
              <label>
                <span>Current (A)</span>
                <input
                  inputMode="decimal"
                  value={inputs.current}
                  onChange={(event) => set("current", event.target.value)}
                  placeholder="Leave one blank"
                />
              </label>
              <label>
                <span>Resistance (Ω)</span>
                <input
                  inputMode="decimal"
                  value={inputs.resistance}
                  onChange={(event) => set("resistance", event.target.value)}
                  placeholder="Leave one blank"
                />
              </label>
            </div>
          ) : null}

          {mode === "series" || mode === "parallel" ? (
            <div className={`${styles.fieldGrid} ${styles.oneColumn}`}>
              <label>
                <span>Resistors in ohms</span>
                <input
                  value={inputs.resistors}
                  onChange={(event) => set("resistors", event.target.value)}
                  placeholder="Example: 100, 220, 330"
                />
              </label>
              <label>
                <span>Optional supply voltage (V)</span>
                <input
                  inputMode="decimal"
                  value={inputs.supply}
                  onChange={(event) => set("supply", event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {mode === "divider" ? (
            <div className={styles.fieldGrid}>
              <label>
                <span>Source voltage Vin (V)</span>
                <input
                  inputMode="decimal"
                  value={inputs.supply}
                  onChange={(event) => set("supply", event.target.value)}
                />
              </label>
              <label>
                <span>Top resistance R1 (Ω)</span>
                <input
                  inputMode="decimal"
                  value={inputs.rTop}
                  onChange={(event) => set("rTop", event.target.value)}
                />
              </label>
              <label>
                <span>Bottom resistance R2 (Ω)</span>
                <input
                  inputMode="decimal"
                  value={inputs.rBottom}
                  onChange={(event) => set("rBottom", event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {mode === "rc" ? (
            <div className={styles.fieldGrid}>
              <label>
                <span>Response</span>
                <select
                  value={inputs.rcMode}
                  onChange={(event) => set("rcMode", event.target.value)}
                >
                  <option value="charge">Charging</option>
                  <option value="discharge">Discharging</option>
                </select>
              </label>
              <label>
                <span>Source voltage (V)</span>
                <input
                  inputMode="decimal"
                  value={inputs.supply}
                  onChange={(event) => set("supply", event.target.value)}
                />
              </label>
              <label>
                <span>Resistance (Ω)</span>
                <input
                  inputMode="decimal"
                  value={inputs.resistance}
                  onChange={(event) => set("resistance", event.target.value)}
                />
              </label>
              <label>
                <span>Capacitance (μF)</span>
                <input
                  inputMode="decimal"
                  value={inputs.capacitance}
                  onChange={(event) => set("capacitance", event.target.value)}
                />
              </label>
              <label>
                <span>Time (s)</span>
                <input
                  inputMode="decimal"
                  value={inputs.time}
                  onChange={(event) => set("time", event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {mode === "nodal" ? (
            <>
              <div className={styles.fieldGrid}>
                <label>
                  <span>R1: node 1 to ground (Ω)</span>
                  <input
                    inputMode="decimal"
                    value={inputs.r1}
                    onChange={(event) => set("r1", event.target.value)}
                  />
                </label>
                <label>
                  <span>R2: node 2 to ground (Ω)</span>
                  <input
                    inputMode="decimal"
                    value={inputs.r2}
                    onChange={(event) => set("r2", event.target.value)}
                  />
                </label>
                <label>
                  <span>R12: between nodes (Ω)</span>
                  <input
                    inputMode="decimal"
                    value={inputs.r12}
                    onChange={(event) => set("r12", event.target.value)}
                  />
                </label>
                <label>
                  <span>I1 injection (A)</span>
                  <input
                    inputMode="decimal"
                    value={inputs.i1}
                    onChange={(event) => set("i1", event.target.value)}
                  />
                </label>
                <label>
                  <span>I2 injection (A)</span>
                  <input
                    inputMode="decimal"
                    value={inputs.i2}
                    onChange={(event) => set("i2", event.target.value)}
                  />
                </label>
              </div>
              <p className={styles.sectionNote}>
                Positive current is injected into the node. The model solves a
                two-node resistive KCL system, not a full SPICE simulation.
              </p>
            </>
          ) : null}

          <button className={styles.runButton} onClick={run} type="button">
            Calculate circuit <span>→</span>
          </button>

          {error ? <p className={styles.error}>{error}</p> : null}
        </article>

        <aside className={styles.resultCard} aria-live="polite">
          <p>ANALYSIS RESULT</p>
          <h2>{result?.title ?? "Ready for circuit values"}</h2>

          {result ? (
            <>
              <div className={styles.resultRows}>
                {result.values.map((row) => (
                  <div key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.methodNote}>
                <p>MODEL NOTE</p>
                <span>{result.note}</span>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <span>V = IR</span>
              <p>Select an ideal DC analysis mode and calculate a result.</p>
            </div>
          )}
        </aside>
      </section>

      <section className={styles.workspace} aria-label="Circuit analysis formulas and examples">
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>FORMULAS & WORKFLOWS</p>
              <h2>What this circuit calculator can solve</h2>
            </div>
          </div>

          <div className={styles.resultRows}>
            <div>
              <span>Ohm&apos;s law</span>
              <strong>V = I × R</strong>
            </div>
            <div>
              <span>Series resistance</span>
              <strong>Rtotal = R1 + R2 + ...</strong>
            </div>
            <div>
              <span>Parallel resistance</span>
              <strong>1/Rtotal = Σ(1/R)</strong>
            </div>
            <div>
              <span>Voltage divider</span>
              <strong>Vout = Vin × R2/(R1 + R2)</strong>
            </div>
            <div>
              <span>RC time constant</span>
              <strong>τ = R × C</strong>
            </div>
            <div>
              <span>Nodal analysis</span>
              <strong>G · V = I</strong>
            </div>
          </div>

          <div className={styles.methodNote}>
            <p>WHEN TO USE NODAL ANALYSIS</p>
            <span>
              Use the nodal-analysis calculator when a circuit has current injections,
              multiple resistor paths to ground, and a resistor between two unknown
              node voltages. The calculator builds the coefficient matrix from
              conductances, then solves the node-voltage system.
            </span>
          </div>
        </article>

        <aside className={styles.resultCard}>
          <p>WORKED NODAL EXAMPLE</p>
          <h2>Conductance matrix from two nodes</h2>

          <div className={styles.resultRows}>
            <div>
              <span>Example inputs</span>
              <strong>R1=1000Ω, R2=2000Ω, R12=1500Ω</strong>
            </div>
            <div>
              <span>Current injections</span>
              <strong>I1=0.01A, I2=0.005A</strong>
            </div>
            <div>
              <span>Matrix idea</span>
              <strong>[G] [V] = [I]</strong>
            </div>
          </div>

          <div className={styles.methodNote}>
            <p>KCL SETUP</p>
            <span>
              R1 and R2 add conductance to each node&apos;s diagonal term. The shared
              R12 branch adds conductance to both diagonal terms and negative
              conductance to the off-diagonal terms. Solving the system gives
              V1 and V2, then branch current is (V1 − V2) ÷ R12.
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button className={styles.runButton} onClick={loadNodalExample} type="button">
              Load nodal example <span>→</span>
            </button>

            <Link className={styles.runButton} href="/guides/two-node-nodal-analysis">
              Read nodal analysis guide <span>→</span>
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
