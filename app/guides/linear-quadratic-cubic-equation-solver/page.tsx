import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Equation Solver Guide – Linear, Quadratic, Cubic & Systems",
  "Learn how to solve linear, quadratic, cubic, and simultaneous equations using coefficients, formulas, Gaussian elimination, RREF, inverse method, and Cramer’s rule.",
  "/guides/linear-quadratic-cubic-equation-solver",
);

export default function EquationSolverGuide() {
  return (
    <GuideArticle
      eyebrow="EQUATION SOLVER GUIDE"
      title="How to solve linear, quadratic, cubic, and system equations"
      description="Equation solving starts by identifying the equation form. A one-variable equation may be linear, quadratic, or cubic, while a simultaneous system is usually written as a coefficient matrix A·x = b."
      slug="linear-quadratic-cubic-equation-solver"
      formula="Linear: ax + b = 0; Quadratic: ax² + bx + c = 0; Cubic: ax³ + bx² + cx + d = 0; System: A·x = b"
      example="For x² − 5x + 6 = 0, the quadratic roots are x = 2 and x = 3. For a system, write each row as coefficients followed by the right-side value, then solve the matrix system."
      steps={[
        {
          title: "Identify the equation type first",
          body: "If the highest power is x, use the linear workflow. If the highest power is x², use the quadratic workflow. If the highest power is x³, use the cubic workflow. If there are several equations with several unknowns, use the linear system workflow.",
        },
        {
          title: "Enter coefficients in the correct order",
          body: "For one-variable equations, enter a, b, c, and d exactly as they appear in standard form. For systems, keep variables in the same order on every row and put constants on the right side of the augmented matrix.",
        },
        {
          title: "Use the discriminant for quadratics",
          body: "The quadratic discriminant Δ = b² − 4ac explains the result type. Positive means two real roots, zero means one repeated real root, and negative means complex roots.",
        },
        {
          title: "Use system methods for simultaneous equations",
          body: "Gaussian elimination, Gauss-Jordan RREF, matrix inverse, and Cramer’s rule are different ways to solve A·x = b. Row reduction is usually the safest general method, while Cramer’s rule is mainly for small systems.",
        },
        {
          title: "Classify special system results",
          body: "A system can have one solution, no solution, or infinitely many solutions. RREF and rank checks help show whether rows contradict each other or whether one variable is free.",
        },
        {
          title: "Check whether another SolveGrid tool is better",
          body: "Use Polynomial Solver for degree 4 to 10 roots, Graphing Calculator for visual intercepts and tables, and Matrix Calculator when you want deeper REF, RREF, determinant, rank, or inverse inspection.",
        },
      ]}
      toolLinks={[
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description: "Solve linear, quadratic, cubic, and 2–8 variable systems with selected matrix methods.",
        },
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description: "Inspect RREF, rank, inverse, determinant, and A·x = b workflows for matrix systems.",
        },
        {
          label: "Graphing Calculator",
          href: "/graphing-calculator",
          description: "Graph equations, compare functions, inspect tables, and estimate roots or intersections.",
        },
      ]}
    />
  );
}
