import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Engineering Notation and Scientific Notation – Powers of Ten Guide",
  description:
    "Learn the difference between scientific notation and engineering notation, including powers of ten, multiples of three, SI prefixes, and calculator examples.",
  alternates: {
    canonical: "/guides/engineering-notation-and-scientific-notation",
  },
};

export default function EngineeringNotationGuide() {
  return (
    <GuideArticle
      eyebrow="ENGINEERING CALCULATION GUIDE"
      title="Engineering notation and scientific notation"
      description="Scientific notation writes values with powers of ten. Engineering notation keeps exponents in multiples of three so technical values line up with SI prefixes such as kilo, milli, micro, and nano."
      slug="engineering-notation-and-scientific-notation"
      formula="Scientific: a × 10ⁿ; Engineering: a × 10³ᵏ, where 1 ≤ |a| < 1000"
      example="12,500 can be written as 1.25 × 10⁴ in scientific notation or 12.5 × 10³ in engineering notation. A value of 0.000047 F can be written as 4.7 × 10⁻⁵ F or 47 µF."
      steps={[
        {
          title: "Start with scientific notation",
          body:
            "Move the decimal point until one non-zero digit is before the decimal. Count the movement to choose the power of ten. Moving left gives a positive exponent; moving right gives a negative exponent.",
        },
        {
          title: "Convert to an engineering exponent",
          body:
            "Adjust the coefficient so the exponent becomes a multiple of three, such as −9, −6, −3, 0, 3, 6, or 9. The coefficient should stay between 1 and 1000 in size.",
        },
        {
          title: "Match the exponent with an SI prefix",
          body:
            "Common engineering prefixes include nano for 10⁻⁹, micro for 10⁻⁶, milli for 10⁻³, kilo for 10³, mega for 10⁶, and giga for 10⁹.",
        },
        {
          title: "Use calculator notation carefully",
          body:
            "On SolveGrid Scientific Calculator, enter values such as 2.5e3 or 47e-6, then use MODE to compare NORM, SCI, and ENG display formats.",
        },
        {
          title: "Check units and significant figures",
          body:
            "Engineering notation is only useful when the unit still makes sense. Keep a sensible number of significant figures and do not mix prefixes without converting them first.",
        },
      ]}
      toolLinks={[
        {
          label: "Scientific Calculator",
          href: "/scientific-calculator",
          description:
            "Use SCI and ENG result formats for powers of ten, technical calculations, trigonometry, logs, constants, and variables.",
        },
        {
          label: "Unit Converter",
          href: "/unit-converter",
          description:
            "Convert engineering and everyday units through transparent base-unit conversions.",
        },
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description:
            "Use scientific notation in larger matrix and linear-algebra calculations when values are very large or small.",
        },
      ]}
    />
  );
}
