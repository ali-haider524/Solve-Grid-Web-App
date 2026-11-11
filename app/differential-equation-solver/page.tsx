import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import MethodNotes from "../../components/MethodNotes";
import DifferentialEquationSolver from "./DifferentialEquationSolver";

export const metadata = createToolMetadata("differential-equation-solver");

export default function DifferentialEquationSolverPage() {
  return (
    <>
      <ToolSchema slug="differential-equation-solver" />
      <DifferentialEquationSolver />
      <MethodNotes
        eyebrow="METHOD"
        title="Euler, Heun and RK4 compared on one example"
        sections={[
          {
            heading: "What does this differential equation solver do?",
            paragraphs: [
              "It solves first-order initial value problems y′ = f(x, y), y(x₀) = y₀, and two-equation systems numerically. It steps forward with a fixed step size h using Euler, Heun (improved Euler) or fourth-order Runge–Kutta (RK4), and shows the solution curve, a phase plot for systems, and a table of values.",
            ],
          },
          {
            heading: "Worked example: y′ = y, y(0) = 1, find y(1)",
            paragraphs: [
              "The exact answer is e = 2.718282, so you can see each method's error directly.",
            ],
            list: [
              "Euler, h = 0.1 (10 steps): 2.593742, an error of 0.125.",
              "Heun, h = 0.1: 2.714081, an error of 0.0042.",
              "RK4, h = 0.1: 2.718280, an error of 0.000002.",
              "Euler with a smaller step, h = 0.05: 2.653298. Halving h only halves Euler's error, because Euler is a first-order method.",
            ],
          },
          {
            heading: "One RK4 step by hand",
            formula: "y₁ = y₀ + h(k₁ + 2k₂ + 2k₃ + k₄) ÷ 6",
            steps: [
              "For y′ = y, y(0) = 1 and h = 0.1: k₁ = f(0, 1) = 1.",
              "k₂ = f(0.05, 1 + 0.05 × 1) = 1.05.",
              "k₃ = f(0.05, 1 + 0.05 × 1.05) = 1.0525.",
              "k₄ = f(0.1, 1 + 0.1 × 1.0525) = 1.10525.",
              "y(0.1) ≈ 1 + 0.1 × (1 + 2.1 + 2.105 + 1.10525) ÷ 6 = 1.105171, against the exact e^0.1 = 1.105171.",
            ],
          },
          {
            heading: "How to choose the method and step size",
            list: [
              "Start with RK4: for smooth problems it is far more accurate than Euler for the same number of steps.",
              "Run the problem again with half the step size. If the answer barely changes, the step is small enough.",
              "Stiff equations (very fast decay next to slow change, such as y′ = −1000y) need tiny steps with these explicit methods; use an implicit solver for those.",
              "Higher-order equations, such as y″ + y = 0, can be rewritten as a two-equation system (y′ = v, v′ = −y) and solved here as a system.",
            ],
          },
      ]}
      />
      <ToolCrossLinks currentSlug="differential-equation-solver" />
      <SiteFooter />
    </>
  );
}
