import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Unit Conversion Formulas – Metric, Imperial, Temperature & Speed",
  "Learn common unit conversion formulas for metric and imperial values, temperature, speed, pressure, energy, torque, density, data units, and engineering calculations.",
  "/guides/unit-conversion-formulas",
);

export default function UnitConversionFormulasGuide() {
  return (
    <GuideArticle
      eyebrow="UNIT CONVERSION GUIDE"
      title="Unit conversion formulas for metric, imperial, and engineering units"
      description="Unit conversion changes a measurement into another unit without changing the real quantity. Most categories use a base-unit multiplier, while temperature uses an offset formula because Celsius, Fahrenheit, and Kelvin have different zero points."
      slug="unit-conversion-formulas"
      formula="Converted value = input value × source factor ÷ target factor; °F = °C × 9/5 + 32; °C = (°F − 32) × 5/9"
      example="If 1 kilometer equals 1000 meters and 1 mile equals 1609.344 meters, then 5 kilometers = 5000 ÷ 1609.344 = 3.10686 miles."
      steps={[
        {
          title: "Choose the correct conversion family",
          body: "Length, area, volume, mass, speed, pressure, energy, power, torque, density, angle, frequency, data, and temperature each use their own unit list. Choose the family first so meters are not mixed with seconds or pascals.",
        },
        {
          title: "Convert through a base unit when possible",
          body: "Most conversions work by converting the source value to a base unit, then converting from the base unit to the target unit. For example, feet can convert to meters first, then meters can convert to kilometers.",
        },
        {
          title: "Use special temperature formulas",
          body: "Temperature conversion is not simple multiplication. Celsius to Fahrenheit adds 32 after scaling, Fahrenheit to Celsius subtracts 32 before scaling, and Kelvin uses an absolute zero offset.",
        },
        {
          title: "Keep significant digits reasonable",
          body: "Engineering and science problems often need enough digits to avoid rounding too early. For homework or estimates, round only after the final converted value is calculated.",
        },
        {
          title: "Check whether the unit is squared or cubed",
          body: "Area and volume conversions are different from length conversions. If 1 m = 100 cm, then 1 m² = 10,000 cm² and 1 m³ = 1,000,000 cm³.",
        },
        {
          title: "Use scientific notation for very large or tiny results",
          body: "Values such as bytes, frequencies, pressures, and densities can become very large or very small. Use scientific or engineering notation when the decimal form becomes hard to read.",
        },
        {
          title: "Identify the unit family",
          body: "Choose the correct family first: length, area, volume, mass, temperature, speed, pressure, energy, power, torque, density, data, angle, frequency, force, acceleration, or time.",
        },
        {
          title: "Convert through the base unit when needed",
          body: "Many converters first change the input into a base unit, then change that base value into the target unit. For example, kilometers can convert through meters before becoming miles or feet.",
        },
        {
          title: "Handle temperature separately",
          body: "Temperature conversion is different because Celsius, Fahrenheit, and Kelvin do not share the same zero point. That is why °F to °C and °C to °F need formulas with +32 or −32.",
        },
        { 
          title: "Check the size of the result",
          body: "Engineering and scientific problems often produce very large or very small numbers. Use scientific notation or engineering notation when the result is easier to read that way.",
        },
        {
          title: "Keep the physical meaning consistent",
          body: "Do not convert between unrelated families. Pressure, torque, energy, and power have different meanings even when their formulas may include related base units.",
        },
      
      ]}
      toolLinks={[
        {
          label: "Unit Converter",
          href: "/unit-converter",
          description: "Convert length, area, volume, mass, temperature, speed, pressure, energy, power, torque, density, data, and more.",
        },
        {
          label: "Scientific Calculator",
          href: "/scientific-calculator",
          description: "Use scientific notation, engineering notation, constants, powers, roots, logarithms, and trigonometry.",
        },
        {
          label: "Distance Calculator",
          href: "/distance-calculator",
          description: "Calculate coordinate distance, midpoint, speed, time, and travel distance.",
        },
      ]}
    />
  );
}
