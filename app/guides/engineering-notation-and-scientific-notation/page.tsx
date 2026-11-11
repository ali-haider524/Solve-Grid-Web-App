import GuideArticle from "../../../components/GuideArticle";
import MethodNotes from "../../../components/MethodNotes";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Engineering vs Scientific Notation: SI Prefixes",
  "Compare engineering notation and scientific notation, learn ENG notation and SI prefixes, and convert kilo, milli, micro, nano, and other powers of ten.",
  "/guides/engineering-notation-and-scientific-notation",
);

export default function EngineeringNotationGuide() {
  return (
    <GuideArticle
      eyebrow="ENGINEERING CALCULATION GUIDE"
      title="Engineering notation vs scientific notation and SI prefixes"
      description="Scientific notation uses a coefficient from 1 up to 10 with any integer power of ten. Engineering notation, often shown as ENG notation on a calculator, uses exponents in multiples of three so values match SI prefixes such as kilo, mega, milli, micro, nano, and pico."
      slug="engineering-notation-and-scientific-notation"
      formula="Scientific: a × 10ⁿ, 1 ≤ |a| < 10   |   Engineering: a × 10³ᵏ, 1 ≤ |a| < 1000"
      example="0.000047 F = 4.7 × 10⁻⁵ F in scientific notation. In engineering notation it is 47 × 10⁻⁶ F, which matches the micro prefix and can be written as 47 µF."
      reference={{
        title: "Common engineering prefixes and powers of ten",
        description:
          "Engineering prefix notation groups exponents in steps of three. The base unit has no prefix and uses 10⁰.",
        columns: ["SI prefix", "Power of ten", "Example"],
        rows: [
          { first: "tera (T)", second: "10¹²", third: "1 TW = 1 × 10¹² W" },
          { first: "giga (G)", second: "10⁹", third: "3 GHz = 3 × 10⁹ Hz" },
          { first: "mega (M)", second: "10⁶", third: "2 MW = 2 × 10⁶ W" },
          { first: "kilo (k)", second: "10³", third: "5 kPa = 5 × 10³ Pa" },
          { first: "base unit", second: "10⁰", third: "8 V = 8 × 10⁰ V" },
          { first: "milli (m)", second: "10⁻³", third: "12 mA = 12 × 10⁻³ A" },
          { first: "micro (µ)", second: "10⁻⁶", third: "47 µF = 47 × 10⁻⁶ F" },
          { first: "nano (n)", second: "10⁻⁹", third: "100 nF = 100 × 10⁻⁹ F" },
          { first: "pico (p)", second: "10⁻¹²", third: "22 pF = 22 × 10⁻¹² F" },
        ],
      }}
      steps={[
        {
          title: "Recognize scientific notation",
          body: "Scientific notation writes a non-zero value as a × 10ⁿ, where the coefficient a has an absolute value from 1 up to 10. For example, 92,000 becomes 9.2 × 10⁴ and 0.000047 becomes 4.7 × 10⁻⁵.",
        },
        {
          title: "Recognize engineering or ENG notation",
          body: "Engineering notation also uses powers of ten, but the exponent must be a multiple of three: ..., −12, −9, −6, −3, 0, 3, 6, 9, 12, .... The coefficient can range from 1 up to 1000 so the exponent stays aligned with an engineering prefix.",
        },
        {
          title: "Convert a scientific exponent to a multiple of three",
          body: "Adjust the decimal point and exponent together until the exponent is divisible by three. For 1.25 × 10⁴, move the decimal one place right and reduce the exponent by one to get 12.5 × 10³.",
        },
        {
          title: "Match the engineering exponent to an SI prefix",
          body: "Replace 10³ with kilo, 10⁶ with mega, 10⁻³ with milli, 10⁻⁶ with micro, 10⁻⁹ with nano, and so on. Keep the physical unit attached so the converted quantity remains clear.",
        },
        {
          title: "Translate micro and nano into scientific notation",
          body: "Micro means 10⁻⁶, so 25 microseconds equals 25 × 10⁻⁶ seconds, or 2.5 × 10⁻⁵ seconds in normalized scientific notation. Nano means 10⁻⁹, so 8 nanometres equals 8 × 10⁻⁹ metres.",
        },
        {
          title: "Convert an SI-prefixed value back to the base unit",
          body: "Replace the prefix with its power of ten and multiply. For example, 4.7 kΩ is 4.7 × 10³ Ω = 4700 Ω, while 220 nF is 220 × 10⁻⁹ F = 0.000000220 F.",
        },
        {
          title: "Use SCI and ENG calculator modes for different reading needs",
          body: "Use SCI when a standard normalized power-of-ten answer is required. Use ENG when working with electronics, measurements, or SI-prefix sized values. On SolveGrid Scientific Calculator, enter forms such as 2.5e3 or 47e-6, then compare NORM, SCI, and ENG outputs.",
        },
        {
          title: "Preserve units and sensible significant figures",
          body: "Changing notation must not change the quantity. Carry the unit through every step, use the correct capitalization for prefixes, and round only as far as the measurement or calculation justifies.",
        },
      ]}
      faqs={[
        {
          question: "What is engineering notation?",
          answer: "Engineering notation is a power-of-ten format in which the exponent is a multiple of three. This makes the value easy to express with SI prefixes such as kilo, milli, micro, and nano.",
        },
        {
          question: "What does ENG notation mean on a calculator?",
          answer: "ENG is the calculator abbreviation for engineering notation. It shifts the displayed exponent in steps of three while adjusting the coefficient so the numerical value remains unchanged.",
        },
        {
          question: "What is the difference between scientific notation and engineering notation?",
          answer: "Scientific notation keeps the coefficient from 1 up to 10 and allows any integer exponent. Engineering notation keeps the exponent divisible by three and allows the coefficient from 1 up to 1000.",
        },
        {
          question: "What is SI notation?",
          answer: "People often use SI notation to mean expressing a measurement with an International System of Units prefix, such as kPa, mA, µF, or GHz. The prefixes correspond to powers of ten and align naturally with engineering notation.",
        },
        {
          question: "How is micro written in scientific notation?",
          answer: "Micro, symbol µ, means 10⁻⁶. For example, 47 µF equals 47 × 10⁻⁶ F, which is 4.7 × 10⁻⁵ F in normalized scientific notation.",
        },
        {
          question: "How is nano written in scientific notation?",
          answer: "Nano, symbol n, means 10⁻⁹. For example, 100 nm equals 100 × 10⁻⁹ m, or 1 × 10⁻⁷ m in normalized scientific notation.",
        },
      ]}
      toolLinks={[
        {
          label: "Scientific Calculator",
          href: "/scientific-calculator",
          description: "Use NORM, SCI, and ENG display modes for powers of ten, technical calculations, trigonometry, logs, constants, and variables.",
        },
        {
          label: "Unit Converter",
          href: "/unit-converter",
          description: "Convert engineering and everyday units, including pressure, energy, power, frequency, and other SI-based quantities.",
        },
        {
          label: "Circuit Analysis",
          href: "/circuit-analysis",
          description: "Apply engineering-sized resistance, capacitance, current, and voltage values in practical DC circuit calculations.",
        },
      ]}
    >
      <MethodNotes
        eyebrow="FULL PREFIX TABLE AND COMMON MISTAKES"
        title="Every SI prefix in scientific notation, E notation, and the mistakes that cost marks"
        sections={[
          {
            heading: "All SI prefixes and their powers of ten",
            list: [
              "quetta (Q) 10³⁰ · ronna (R) 10²⁷ · yotta (Y) 10²⁴ · zetta (Z) 10²¹ · exa (E) 10¹⁸ · peta (P) 10¹⁵",
              "tera (T) 10¹² · giga (G) 10⁹ · mega (M) 10⁶ · kilo (k) 10³",
              "milli (m) 10⁻³ · micro (µ) 10⁻⁶ · nano (n) 10⁻⁹ · pico (p) 10⁻¹²",
              "femto (f) 10⁻¹⁵ · atto (a) 10⁻¹⁸ · zepto (z) 10⁻²¹ · yocto (y) 10⁻²⁴ · ronto (r) 10⁻²⁷ · quecto (q) 10⁻³⁰",
              "Not engineering prefixes (not multiples of three): hecto (h) 10², deca (da) 10¹, deci (d) 10⁻¹, centi (c) 10⁻². Ronna, quetta, ronto and quecto were added in 2022.",
            ],
          },
          {
            heading: "Mega, micro and other prefixes written in scientific notation",
            list: [
              "3.3 MΩ = 3.3 × 10⁶ Ω = 3,300,000 Ω",
              "2.2 µF = 2.2 × 10⁻⁶ F = 0.0000022 F",
              "450 nm = 450 × 10⁻⁹ m = 4.5 × 10⁻⁷ m (scientific) = 450 × 10⁻⁹ m (engineering)",
              "15 GHz = 15 × 10⁹ Hz = 1.5 × 10¹⁰ Hz",
            ],
          },
          {
            heading: "E notation on calculators, Excel and code",
            paragraphs: [
              "Calculators, spreadsheets and programming languages write × 10ⁿ as E or e: 4.7E-6 means 4.7 × 10⁻⁶ and 1.5E10 means 1.5 × 10¹⁰. In Excel, the number format 0.00E+00 shows scientific notation; ##0.0E+0 shows engineering notation (exponents in steps of three).",
            ],
          },
          {
            heading: "Five mistakes that cost marks",
            list: [
              "Mixing up M (mega, 10⁶) and m (milli, 10⁻³): 1 MΩ is a billion times 1 mΩ.",
              "Writing K for kilo. The SI symbol is lowercase k (K is kelvin).",
              "Typing u for µ in a final answer. Use µ, or write micro in full.",
              "Leaving the coefficient outside the allowed range: scientific needs 1 ≤ |a| < 10; engineering needs 1 ≤ |a| < 1000.",
              "Converting the number but forgetting the unit: 0.0047 A is 4.7 mA, not 4.7 m.",
            ],
          },
      ]}
      />
    </GuideArticle>
  );
}
