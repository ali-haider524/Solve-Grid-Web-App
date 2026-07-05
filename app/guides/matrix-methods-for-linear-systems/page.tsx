import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Matrix Methods for Linear Systems",
  "Compare Gaussian elimination, Gauss-Jordan RREF, matrix inverse, and Cramer's rule when solving linear systems online.",
  "/guides/matrix-methods-for-linear-systems",
);

export default function MatrixMethodsGuide() {
  return (
    <GuideArticle
      eyebrow="LINEAR ALGEBRA GUIDE"
      title="Matrix methods for solving linear systems"
      description="A linear system can be represented as A·x = b. This guide shows when Gaussian elimination, Gauss-Jordan RREF, inverse methods, and Cramer’s rule are useful."
      slug="matrix-methods-for-linear-systems"
      formula="A\mathbf{x} = \mathbf{b}"
      example="For 2x + y = 5 and x − y = 1, write A = [[2, 1], [1, −1]], x = [x, y], and b = [5, 1]."
      steps={[
        {
          title: "Write the coefficient matrix and right-hand side",
          body: "Keep variables in the same order in every equation. The coefficients form A, the unknowns form x, and the constants form b.",
        },
        {
          title: "Choose a method that matches the task",
          body: "Gaussian elimination is efficient for many systems. Gauss-Jordan RREF is useful when you want a reduced row form. The inverse method requires a square, non-singular matrix. Cramer’s rule is most practical for smaller square systems.",
        },
        {
          title: "Check rank and determinant conditions",
          body: "A zero determinant means an inverse does not exist. Rank information helps identify whether a system has a unique solution, no solution, or infinitely many solutions.",
        },
        {
          title: "Verify the final vector",
          body: "Substitute the output values into the original equations, especially when working with rounded decimals or measured quantities.",
        },
      ]}
      toolLinks={[
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description: "Work with RREF, rank, determinant, inverse, multiplication, and system-solving methods.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description: "Build 2–8 variable linear systems and select a transparent solving method.",
        },
      ]}
    />
  );
}
