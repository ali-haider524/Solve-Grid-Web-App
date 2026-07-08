import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Matrix Inverse and Determinant",
  "Understand determinants, inverse matrices, singular matrices, rank, pivots, and when the inverse method can solve a linear system.",
  "/guides/matrix-inverse-and-determinant",
);

export default function MatrixInverseGuide() {
  return (
    <GuideArticle
      eyebrow="MATRIX METHOD GUIDE"
      title="Matrix inverse and determinant: when can you use them?"
      description="A determinant tells you whether a square matrix can have an ordinary inverse. When det(A) is not zero, A is invertible and the inverse method can solve a compatible system A·x = b. When det(A) is zero, the matrix is singular, so use row reduction, pivot columns, and rank to investigate the system instead."
      slug="matrix-inverse-and-determinant"
      formula="For A = [[a, b], [c, d]], det(A) = ad − bc. If det(A) ≠ 0, then A⁻¹ = (1 / det(A)) [[d, −b], [−c, a]]."
      example="Let A = [[2, 1], [1, 1]]. Its determinant is 2·1 − 1·1 = 1, so the inverse exists: A⁻¹ = [[1, −1], [−1, 2]]. For A·x = [5, 3], multiplying by A⁻¹ gives x = [2, 1]."
      steps={[
        {
          title: "Check that the matrix is square",
          body: "Determinants and ordinary inverses are defined for square matrices only: 2×2, 3×3, and so on. Rectangular matrices can still be multiplied, transposed, reduced to REF or RREF, and assigned a rank, but they do not have a standard inverse.",
        },
        {
          title: "Calculate the determinant before choosing the inverse method",
          body: "A non-zero determinant means the matrix is non-singular and an inverse exists. A zero determinant means the rows or columns are dependent, so the matrix inverse method is not available. In that case, use RREF and rank to understand what the dependency means.",
        },
        {
          title: "Find the inverse with Gauss-Jordan reduction",
          body: "A practical method is to form the augmented matrix [A | I] and use row operations until the left side becomes I. The right side then becomes A⁻¹.",
        },
        {
          title: "Use the inverse only for a compatible linear system",
          body: "For A·x = b, calculate x = A⁻¹b only when A is square and invertible. The vector b must have the same number of entries as the rows of A.",
        },
        {
          title: "Use RREF and rank when an inverse does not exist",
          body: "A singular matrix does not automatically mean the system has no solution. RREF and rank can show whether the system is inconsistent or whether it has infinitely many solutions. The pivot columns show independent directions, while zero rows reveal dependencies.",
        },
        {
          title: "Connect determinant, inverse, and rank",
          body: "For an n×n matrix, det(A) ≠ 0 means rank(A) = n and every column is independent. If det(A) = 0, the rank is less than n and the matrix needs a row-reduction check before you decide what the related system means.",
        },
        {
          title: "Check the answer by multiplication",
          body: "After calculating a solution vector x, multiply A by x and confirm that the result matches b. This catches entry mistakes and helps you understand what the matrix equation represents.",
        },
      ]}
      toolLinks={[
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description:
            "Calculate determinants, inverse matrices, RREF, rank, products, cofactors, adjugates, and supported linear-system workflows.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description:
            "Solve coefficient systems with Gaussian elimination, Gauss-Jordan RREF, inverse, or Cramer’s rule where appropriate.",
        },
      ]}
    />
  );
}
