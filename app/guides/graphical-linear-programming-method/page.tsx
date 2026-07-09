import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Graphical Linear Programming Method",
  "Learn how to solve a two-variable linear programming problem with an objective function, constraints, feasible region, corner points, and objective-value comparison.",
  "/guides/graphical-linear-programming-method",
);

export default function GraphicalLinearProgrammingGuide() {
  return (
    <GuideArticle
      title="Graphical method for two-variable linear programming"
      eyebrow="OPTIMIZATION GUIDE"
      slug="graphical-linear-programming-method"
      description="The graphical method is used for continuous two-variable linear programming problems. It helps you turn an optimization question into an objective function, draw or inspect the constraints, identify the feasible region, and compare objective values at corner points."
      formula="Maximize or minimize Z = c₁x + c₂y subject to linear constraints such as ax + by ≤ c."
      example="Maximize Z = 3x + 5y subject to 2x + y ≤ 18, 2x + 3y ≤ 42, 3x + y ≤ 24, and x,y ≥ 0. The feasible corner points are tested, and the best objective value gives the optimum for the bounded continuous model."
      steps={[
        {
          title: "Write the decision variables",
          body: "Decide what x and y represent. They might be products, hours, units, ingredients, or any two quantities that can vary in the problem.",
        },
        {
          title: "Build the objective function",
          body: "Write the value you want to maximize or minimize as Z = c₁x + c₂y. For example, if x gives 3 units of profit and y gives 5 units of profit, the objective is Z = 3x + 5y.",
        },
        {
          title: "Enter every constraint",
          body: "Each resource limit becomes a linear inequality such as 2x + 3y ≤ 42. Use ≤ for upper limits, ≥ for minimum requirements, and = for exact balance requirements.",
        },
        {
          title: "Include non-negative restrictions when needed",
          body: "Many real problems cannot have negative quantities, so x ≥ 0 and y ≥ 0 should stay enabled for production, budget, resource, and quantity models.",
        },
        {
          title: "Inspect the feasible region",
          body: "The feasible region is the overlap of all constraints. If there is no overlap, the model is infeasible. If the region extends forever in a direction that improves the objective, the model can be unbounded.",
        },
        {
          title: "Compare objective values at corner points",
          body: "For a bounded continuous two-variable linear program, the optimum occurs at a feasible corner point. Evaluate Z at every feasible corner and choose the largest value for maximization or the smallest value for minimization.",
        },
        {
          title: "Interpret the final point in the original problem",
          body: "The optimum point gives the recommended x and y values. Always check that those values make sense for the real situation, especially if the problem actually needs whole numbers.",
        },
      ]}
      toolLinks={[
        {
          label: "Optimization Lab",
          href: "/optimization-lab",
          description:
            "Build a two-variable linear program, inspect feasible corner points, and calculate the maximum or minimum objective value.",
        },
        {
          label: "Graphing Calculator",
          href: "/graphing-calculator",
          description:
            "Plot constraint boundary lines or related functions when you want a visual check.",
        },
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description:
            "Use matrix tools when linear systems or row-reduction steps appear inside a larger optimization problem.",
        },
      ]}
    />
  );
}
