import GuideArticle from "../../../components/GuideArticle";
import MethodNotes from "../../../components/MethodNotes";
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
    >
      <MethodNotes
        eyebrow="WORKED EXAMPLES"
        title="2×2 and 3×3 inverse and determinant, worked by hand"
        sections={[
          {
            heading: "2×2 inverse shortcut formula",
            formula: "A = [a b; c d],   det(A) = ad − bc,   A⁻¹ = (1 ÷ det A) × [d −b; −c a]",
            steps: [
              "A = [4 7; 2 6].",
              "det(A) = 4 × 6 − 7 × 2 = 24 − 14 = 10.",
              "Swap a and d, change the signs of b and c: [6 −7; −2 4].",
              "Divide by 10: A⁻¹ = [0.6 −0.7; −0.2 0.4].",
              "Check: A × A⁻¹ = [1 0; 0 1].",
            ],
          },
          {
            heading: "3×3 determinant by cofactor expansion",
            formula: "det(A) = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃,   Cᵢⱼ = (−1)ⁱ⁺ʲ Mᵢⱼ",
            steps: [
              "A = [1 2 3; 0 1 4; 5 6 0].",
              "Expand along row 1: 1 × (1·0 − 4·6) − 2 × (0·0 − 4·5) + 3 × (0·6 − 1·5).",
              "= 1 × (−24) − 2 × (−20) + 3 × (−5) = −24 + 40 − 15 = 1.",
              "det(A) = 1 ≠ 0, so A is invertible: A⁻¹ = [−24 18 5; 20 −15 −4; −5 4 1].",
            ],
          },
          {
            heading: "Adjugate (cofactor) formula for the inverse",
            formula: "A⁻¹ = adj(A) ÷ det(A),   adj(A) = transpose of the cofactor matrix",
            paragraphs: [
              "This is how textbooks define the inverse, and it is practical for 2×2 and 3×3 matrices. For 4×4 and larger, Gauss-Jordan reduction of [A | I] is much faster and less error-prone, which is the method the matrix calculator shows.",
            ],
          },
          {
            heading: "Properties worth remembering",
            list: [
              "det(AB) = det(A) × det(B).",
              "det(A⁻¹) = 1 ÷ det(A).",
              "(AB)⁻¹ = B⁻¹A⁻¹ (the order reverses).",
              "(Aᵀ)⁻¹ = (A⁻¹)ᵀ and det(Aᵀ) = det(A).",
              "Swapping two rows changes the sign of the determinant; multiplying a row by k multiplies it by k.",
            ],
          },
      ]}
      />
    </GuideArticle>
  );
}
