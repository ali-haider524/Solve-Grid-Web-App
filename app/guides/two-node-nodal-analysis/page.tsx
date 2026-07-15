import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Two-Node Nodal Analysis Guide – KCL, Conductance Matrix & Node Voltages",
  description:
    "Learn two-node nodal analysis with Kirchhoff current law, conductance matrices, current injections, node voltages, and a worked resistor-circuit example.",
  alternates: { canonical: "/guides/two-node-nodal-analysis" },
};

export default function TwoNodeNodalAnalysisGuide() {
  return (
    <GuideArticle
      eyebrow="CIRCUIT ANALYSIS GUIDE"
      title="Two-node nodal analysis with a conductance matrix"
      description="Nodal analysis writes Kirchhoff current law equations at each unknown node. A DC resistor network becomes a coefficient matrix where conductances multiply node voltages."
      slug="two-node-nodal-analysis"
      formula="G · V = I, where G is the conductance matrix, V is the node-voltage vector, and I is the current-injection vector"
      example="For R1 from node 1 to ground, R2 from node 2 to ground, R12 between nodes, and current injections I1 and I2, write KCL at both nodes, convert each resistor to conductance G = 1/R, then solve the 2×2 matrix for V1 and V2."
      steps={[
        {
          title: "Choose the reference node",
          body: "Ground is the reference voltage. Every unknown node voltage is measured relative to ground, so the solver reports V1 and V2 as node voltages.",
        },
        {
          title: "Convert resistors to conductances",
          body: "Use G = 1/R. A resistor from a node to ground adds conductance to that node's diagonal matrix term.",
        },
        {
          title: "Handle the resistor between nodes",
          body: "A resistor between node 1 and node 2 adds conductance to both diagonal terms and adds negative conductance to the off-diagonal terms.",
        },
        {
          title: "Place current injections on the right side",
          body: "Positive I1 and I2 values mean current is injected into the corresponding node. Those values form the I vector in G·V = I.",
        },
        {
          title: "Solve for voltage and branch current",
          body: "After solving the matrix, calculate branch current with (V1 − V2) ÷ R12 and check whether the sign matches the assumed current direction.",
        },
      ]}
      toolLinks={[
        {
          label: "DC Circuit Analysis Lab",
          href: "/circuit-analysis",
          description:
            "Calculate Ohm's law, resistor networks, voltage dividers, RC transients, and two-node nodal voltages.",
        },
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description:
            "Inspect the coefficient matrix with RREF, determinant, inverse, and rank tools.",
        },
        {
          label: "Scientific Calculator",
          href: "/scientific-calculator",
          description:
            "Use engineering notation and constants for supporting electrical calculations.",
        },
      ]}
    />
  );
}
