import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Standard Deviation Formula – Sample vs Population | SolveGrid",
  description:
    "Learn the sample standard deviation formula, population standard deviation formula, variance, mean deviations, and when to use n or n − 1 with worked examples.",
  alternates: { canonical: "/guides/standard-deviation-formula" },
};

export default function StandardDeviationGuide() {
  return (
    <GuideArticle
      eyebrow="STATISTICS GUIDE"
      title="Standard deviation formula: sample vs population"
      description="Standard deviation measures how spread out values are around the mean. The key choice is whether your data represents a sample or the full population."
      slug="standard-deviation-formula"
      formula="Population: σ = √(Σ(x − μ)² ÷ n); Sample: s = √(Σ(x − x̄)² ÷ (n − 1))"
      example="For 58, 64, 72, 72, 78, 84, 91, the mean is about 74.14. In sample mode, variance is about 128.14 and sample standard deviation is about 11.32."
      steps={[
        {
          title: "Enter the data in the right format",
          body: "Use raw values for a normal list, frequency rows when exact values repeat, grouped intervals when you only have class ranges, or paired X/Y values for regression.",
        },
        {
          title: "Calculate the mean",
          body: "Add the values and divide by the number of values. In grouped data, the calculator estimates the mean from class midpoints and frequencies.",
        },
        {
          title: "Find each deviation from the mean",
          body: "Subtract the mean from each value. These deviations show how far each value sits above or below the center of the data.",
        },
        {
          title: "Square and add the deviations",
          body: "Squaring removes negative signs and gives more weight to larger distances from the mean. The total squared deviation is the base for variance.",
        },
        {
          title: "Choose sample or population",
          body: "Use n for population standard deviation when the entered values are the entire group. Use n − 1 for sample standard deviation when the values represent a sample.",
        },
        {
          title: "Take the square root",
          body: "The square root of variance gives standard deviation, which is easier to interpret because it uses the same unit as the original data.",
        },
      ]}
      toolLinks={[
        {
          label: "Statistics Calculator",
          href: "/statistics-calculator",
          description:
            "Calculate sample or population standard deviation, variance, mean, quartiles, IQR, frequency tables, and regression.",
        },
        {
          label: "Graphing Calculator",
          href: "/graphing-calculator",
          description:
            "Use graphs and tables when you want to visually inspect relationships or trends in numeric data.",
        },
      ]}
    />
  );
}
