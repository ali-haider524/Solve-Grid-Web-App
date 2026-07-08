import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Gaussian Elimination for Linear Systems",
  "Learn Gaussian elimination with row operations, augmented matrices, REF, RREF, rank checks, pivots, and back-substitution for linear systems.",
  "/guides/gaussian-elimination-for-linear-systems",
);

export default function GaussianEliminationGuide() {
  return (
    <GuideArticle
      eyebrow="LINEAR ALGEBRA GUIDE"
      title="Gaussian elimination for solving linear systems step by step"
      description="Gaussian elimination is a row-reduction method for solving simultaneous linear equations. It turns a coefficient system into REF, or row echelon form, then uses back-substitution to find the unknown values. On SolveGrid, you can use the Matrix Calculator as a matrix reducer to inspect REF, RREF, rank, pivot columns, and A·x = b workflows."
      slug="gaussian-elimination-for-linear-systems"
      formula="Valid row operations: swap two rows; multiply one row by a non-zero constant; add a multiple of one row to another row. These operations preserve the solution set of an augmented linear system."
      example="For x − y = 1 and 2x + y = 8, start with [[1, −1 | 1], [2, 1 | 8]]. Replace row 2 with row 2 − 2·row 1 to get [[1, −1 | 1], [0, 3 | 6]]. The second row gives y = 2, then back-substitution gives x = 3."
      steps={[
        {
          title: "Write every equation in the same variable order",
          body: "Place the x, y, z, and later coefficients in the same column order for every equation. Put the constant terms on the right of an augmented bar. Missing variables have coefficient 0.",
        },
        {
          title: "Choose a pivot and clear entries below it",
          body: "Use a non-zero leading value as the pivot in the first active column. Add or subtract a multiple of that pivot row from lower rows until the entries below the pivot become 0.",
        },
        {
          title: "Repeat across the remaining columns",
          body: "Move one row down and one column right, then continue elimination. The goal of ordinary Gaussian elimination is row echelon form (REF), where each new pivot is farther right than the one above it. REF is sometimes called row echelon form, and in German study material it may be called Zeilenstufenform.",
        },
        {
          title: "Back-substitute to find each unknown",
          body: "Start with the final row because it usually has the fewest unknowns. Substitute that value upward through the earlier rows until every variable is known.",
        },
        {
          title: "Use RREF or rank when you need more information",
          body: "Gauss-Jordan reduction continues from REF to RREF, which makes a unique solution easy to read directly. Rank is the number of pivot columns. Comparing pivot columns with the number of variables helps identify dependent equations, inconsistent systems, or systems with infinitely many solutions.",
        },
        {
          title: "Read rank and row-space clues from the reduced matrix",
          body: "The non-zero rows in an echelon form show independent row directions, and pivot columns show independent variable directions. This is why a matrix rank calculator with steps usually shows row operations or RREF before giving the final rank.",
        },
        {
          title: "Verify the result in the original equations",
          body: "Substitute the values back into the original system. This is especially useful after decimal rounding, pasted data, or a long matrix-reducer workflow.",
        },
      ]}
      toolLinks={[
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description:
            "Use REF, Gauss-Jordan RREF, matrix rank, and A·x = b system-solving tools with editable matrices from 2×2 to 10×10.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description:
            "Build 2–8 variable coefficient systems and compare Gaussian elimination, RREF, inverse, and Cramer’s rule where supported.",
        },
      ]}
    />
  );
}
