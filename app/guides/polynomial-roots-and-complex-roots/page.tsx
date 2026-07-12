import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Polynomial Roots and Complex Roots – Coefficients, Examples & Residuals",
  description:
    "Learn how to find polynomial roots from coefficients, read real and complex roots, and understand residual checks for numerical polynomial answers.",
  alternates: { canonical: "/guides/polynomial-roots-and-complex-roots" },
};

export default function PolynomialRootsGuide() {
  return (
    <GuideArticle
      eyebrow="POLYNOMIAL ROOTS GUIDE"
      title="Polynomial roots and complex roots"
      description="A polynomial root is a value of x that makes f(x) equal zero. Learn how coefficient order, real roots, complex roots, and residual checks work before using a polynomial roots calculator."
      slug="polynomial-roots-and-complex-roots"
      formula="f(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀; roots solve f(x) = 0"
      example="For x² − 5x + 6 = 0, enter coefficients 1, −5, and 6. The roots are 2 and 3 because (x − 2)(x − 3) = 0."
      steps={[
        {
          title: "Choose the polynomial degree",
          body:
            "The degree is the highest power of x. A quadratic has degree 2, a cubic has degree 3, and higher-degree polynomials continue the same coefficient pattern.",
        },
        {
          title: "Enter coefficients from highest power to constant",
          body:
            "For x⁴ − 5x² + 4, include zero placeholders and enter 1, 0, −5, 0, and 4. Missing middle powers still need a coefficient of zero.",
        },
        {
          title: "Read real and complex roots",
          body:
            "Real roots appear as ordinary numbers and are x-intercepts on a real graph. Complex roots appear in a + bi form and may not cross the x-axis visually.",
        },
        {
          title: "Check the residual",
          body:
            "The residual measures how close f(root) is to zero. A very small residual means the numerical answer is close to satisfying the original polynomial.",
        },
        {
          title: "Use graphing for a visual check",
          body:
            "A graph helps you see real x-intercepts, turning points, and approximate behavior. Use Polynomial Solver when you need coefficient-based root values.",
        },
      ]}
      toolLinks={[
        {
          label: "Polynomial Solver",
          href: "/polynomial-solver",
          description:
            "Enter coefficients for degree 1 to 10 polynomials and calculate real or complex roots.",
        },
        {
          label: "Graphing Calculator",
          href: "/graphing-calculator",
          description:
            "Plot the polynomial curve to inspect x-intercepts and visual behavior.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description:
            "Use exact lower-degree equation workflows and linear system tools where appropriate.",
        },
      ]}
    />
  );
}
