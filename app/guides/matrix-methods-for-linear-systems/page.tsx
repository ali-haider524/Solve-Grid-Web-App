import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Matrix Methods for Linear Systems",
  "Compare Gaussian elimination, Gauss-Jordan RREF, matrix inverse, rank, pivot columns, row space, and Cramer’s rule for solving linear systems online.",
  "/guides/matrix-methods-for-linear-systems",
);

export default function MatrixMethodsGuide() {
  return (
    <GuideArticle
      eyebrow="LINEAR ALGEBRA GUIDE"
      title="Matrix methods for solving linear systems"
      description="A linear system can be written as A·x = b, where A contains coefficients, x contains unknown values, and b contains constants. This guide explains when Gaussian elimination, Gauss-Jordan RREF, the inverse method, rank checks, pivot columns, row-space reasoning, and Cramer’s rule are useful."
      slug="matrix-methods-for-linear-systems"
      formula="A·x = b"
      example="For 2x + y = 5 and x − y = 1, set A = [[2, 1], [1, −1]], x = [x, y], and b = [5, 1]. Solving the system gives x = 2 and y = 1."
      steps={[
        {
          title: "Translate equations into A, x, and b",
          body: "Keep variables in the same order in each equation. The coefficient matrix is A, the unknown column is x, and the constants become b. This structure makes the same system usable in several matrix methods.",
        },
        {
          title: "Use Gaussian elimination for an efficient general method",
          body: "Gaussian elimination reduces an augmented matrix to REF and then uses back-substitution. It is a strong default for many square systems and is practical for larger systems than Cramer’s rule.",
        },
        {
          title: "Use Gauss-Jordan RREF when you want a readable reduced form",
          body: "RREF continues row reduction until each pivot is 1 and the other entries in pivot columns are 0. This makes a unique solution easy to read, while also exposing free variables, dependent rows, row-space structure, or inconsistent rows.",
        },
        {
          title: "Use the inverse method only when det(A) is not zero",
          body: "The inverse method uses x = A⁻¹b. It requires a square, non-singular matrix, so it is most useful when you also want the inverse or when the same A matrix is paired with more than one b vector.",
        },
        {
          title: "Use Cramer’s rule for small square systems",
          body: "Cramer’s rule replaces one coefficient column at a time with b and compares determinants. It is useful for learning and small systems, but it is usually less efficient than row reduction as the system grows.",
        },
        {
          title: "Use determinant and rank to interpret special cases",
          body: "A zero determinant prevents an inverse, but RREF and rank are needed to decide whether the system has no solution or infinitely many solutions. Do not assume every singular system is inconsistent. Compare rank(A) with the rank of the augmented matrix when classifying a system.",
        },
        {
          title: "Use rank to understand special systems",
          body: "If every variable column has a pivot and the augmented system is consistent, the system has a unique solution. Missing pivots usually mean free variables. A row such as [0 0 0 | 5] means the equations contradict each other.",
        },
        {
          title: "Verify the final vector against the original equations",
          body: "Substitute the solved values back into the original equations, especially when values are rounded or come from measured data. A quick check confirms that A·x matches b.",
        },
      ]}
      toolLinks={[
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description:
            "Work with REF, RREF, rank, determinant, inverse, multiplication, and A·x = b system-solving methods in one workspace.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description:
            "Build 2–8 variable systems and select a transparent method for Gaussian, RREF, inverse, or Cramer workflows.",
        },
      ]}
    />
  );
}
