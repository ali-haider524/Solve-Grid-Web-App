import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Engineering Unit Conversion – Pressure, Torque, Energy, Power & Density",
  "Learn engineering unit conversion for pressure, force, torque, energy, power, density, frequency, speed, acceleration, and SI-prefix based calculations.",
  "/guides/engineering-unit-conversion",
);

export default function EngineeringUnitConversionGuide() {
  return (
    <GuideArticle
      eyebrow="ENGINEERING UNITS GUIDE"
      title="Engineering unit conversion for pressure, torque, energy, power, and density"
      description="Engineering calculations often combine units from mechanics, electricity, fluids, heat, and data systems. A reliable unit converter helps keep formulas consistent before values are placed into equations."
      slug="engineering-unit-conversion"
      formula="Quantity in target unit = quantity in base SI unit ÷ target unit factor"
      example="A pressure of 2 bar equals 200,000 Pa because 1 bar = 100,000 Pa. If the target is kPa, 200,000 Pa ÷ 1000 = 200 kPa."
      steps={[
        {
          title: "Identify the physical quantity first",
          body: "Pressure, torque, energy, power, force, density, frequency, speed, and acceleration are different quantities. Choose the correct unit family before converting the number.",
        },
        {
          title: "Convert to SI base or common engineering base units",
          body: "Pressure commonly converts through pascals, force through newtons, energy through joules, power through watts, torque through newton-meters, and density through kilograms per cubic meter.",
        },
        {
          title: "Watch compound units carefully",
          body: "Torque, pressure, density, speed, and acceleration combine more than one dimension. Changing one part of a compound unit changes the full value, so use a dedicated converter instead of guessing.",
        },
        {
          title: "Use SI prefixes for readable engineering values",
          body: "Prefixes such as kilo, mega, milli, micro, and nano keep engineering numbers readable. For example, 0.000047 F can be written as 47 µF in electronics work.",
        },
        {
          title: "Check formulas after converting units",
          body: "If a formula expects newtons, meters, seconds, joules, watts, or pascals, convert the input values first. Mixing imperial and metric units inside one formula is a common source of wrong answers.",
        },
        {
          title: "Use related tools for the next calculation",
          body: "After converting units, use the scientific calculator for arithmetic, the circuit lab for resistor and RC calculations, or the matrix calculator when an engineering model becomes a coefficient system.",
        },
               {
          title: "Name the engineering quantity first",
          body: "Decide whether the value is pressure, force, torque, energy, power, density, frequency, speed, acceleration, or another quantity. The correct category prevents wrong-unit comparisons.",
        },
        {
          title: "Use SI units as a stable reference",
          body: "Many engineering formulas are easiest when values are in SI units such as meters, kilograms, seconds, newtons, pascals, joules, watts, and newton-meters.",
        },
        {
          title: "Convert before substituting into formulas",
          body: "If a formula expects SI units, convert all inputs first. Mixing inches with meters or psi with pascals can make the final result wrong even when the arithmetic is correct.",
        },
        {
          title: "Watch squared and cubed units",
          body: "Area and volume conversions are not the same as length conversions. Squared and cubed units change by squared or cubed scale factors.",
        },
        {
          title: "Use scientific notation for extreme values",
          body: "Engineering values can be very small or very large, such as microfarads, kilopascals, megajoules, or gigabytes. Scientific and engineering notation make those values easier to compare.",
        },
      ]}
      toolLinks={[
        {
          label: "Unit Converter",
          href: "/unit-converter",
          description: "Convert engineering, science, data, temperature, and everyday units in one workspace.",
        },
        {
          label: "Scientific Calculator",
          href: "/scientific-calculator",
          description: "Calculate with constants, powers, roots, scientific notation, engineering notation, and trigonometric functions.",
        },
        {
          label: "Circuit Analysis Lab",
          href: "/circuit-analysis",
          description: "Use Ohm's law, voltage divider, RC transient, and two-node nodal-analysis workflows.",
        },
      ]}
    />
  );
}
