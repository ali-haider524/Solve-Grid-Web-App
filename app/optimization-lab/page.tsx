import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import MethodNotes from "../../components/MethodNotes";
import OptimizationLab from "./OptimizationLab";

export const metadata = createToolMetadata("optimization-lab");
export default function OptimizationLabPage() { return <><ToolSchema slug="optimization-lab" /><OptimizationLab /><MethodNotes
        eyebrow="METHOD"
        title="Linear programming solver: worked examples, formulation and limits"
        sections={[
          {
            heading: "What does this linear programming solver do?",
            paragraphs: [
              "It solves a linear program with two decision variables, x and y: maximise or minimise Z = ax + by subject to ≤, ≥ and = constraints. It lists every feasible corner point of the region and picks the best one, because the optimum of a bounded linear program always lies at a corner.",
            ],
          },
          {
            heading: "Worked example: maximise profit",
            paragraphs: [
              "A workshop earns $40 per table (x) and $30 per chair (y). A table needs 2 carpentry hours and a chair 1; there are 100 carpentry hours. Each item needs 1 finishing hour; there are 80 finishing hours.",
            ],
            steps: [
              "Objective: maximise Z = 40x + 30y.",
              "Constraints: 2x + y ≤ 100, x + y ≤ 80, x ≥ 0, y ≥ 0.",
              "Corner points: (0, 0) → 0; (50, 0) → 2,000; (20, 60) → 2,600; (0, 80) → 2,400.",
              "Optimum: make 20 tables and 60 chairs for a maximum profit of $2,600. Both hour limits are fully used (binding).",
            ],
          },
          {
            heading: "Worked example: minimise cost",
            paragraphs: [
              "A feed mix uses ingredient x at $2 per kg and y at $3 per kg. It needs at least 8 units of energy (x + y ≥ 8) and at least 12 units of protein (x + 3y ≥ 12).",
            ],
            steps: [
              "Objective: minimise Z = 2x + 3y.",
              "Corner points of the feasible region: (0, 8) → 24; (6, 2) → 18; (12, 0) → 24.",
              "Optimum: 6 kg of x and 2 kg of y at a minimum cost of $18.",
            ],
          },
          {
            heading: "How to turn a word problem into a linear program",
            list: [
              "Decision variables: what you choose (how many tables, how many kg).",
              "Objective: the profit or cost per unit of each variable, to maximise or minimise.",
              "Constraints: one inequality per limited resource or requirement, in the same units on both sides.",
              "Non-negativity: x ≥ 0 and y ≥ 0 when negative quantities make no sense.",
              "Check: plug the answer back into every constraint and read which ones are binding.",
            ],
          },
          {
            heading: "Infeasible, unbounded and multiple optimal solutions",
            list: [
              "Infeasible: no point satisfies all constraints at once, so the solver finds no corner. Look for contradictory limits such as x + y ≤ 5 and x + y ≥ 8.",
              "Unbounded: the region is open in the direction you are optimising, so the objective can grow forever. A maximisation with only ≥ constraints is the usual cause; add the missing upper limit.",
              "Multiple optima: two neighbouring corners give the same best value, so every point on the edge between them is optimal. This happens when the objective is parallel to a binding constraint.",
            ],
          },
          {
            heading: "Limits of this solver and what to use for bigger models",
            paragraphs: [
              "The corner-point method works for two variables only, and it assumes continuous values. For three or more variables, use the simplex method, for example Excel's Solver add-in (Data → Solver, Simplex LP engine) or SciPy's linprog. For whole-number answers, use integer programming, because rounding an LP answer can break a constraint or miss the true optimum.",
            ],
          },
      ]}
      />
      <ToolCrossLinks currentSlug="optimization-lab" /><SiteFooter /></>; }
