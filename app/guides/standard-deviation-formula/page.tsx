import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Standard Deviation Formula: Sample vs Population (Examples)",
  "Sample and population standard deviation formulas with a step-by-step worked example, when to use n or n − 1, how to interpret SD, and how to report M and SD in APA.",
  "/guides/standard-deviation-formula",
);

export default function StandardDeviationGuide() {
  return (
    <GuideArticle
      eyebrow="STATISTICS GUIDE"
      title="Standard deviation formula: sample vs population"
      description="Standard deviation measures how spread out values are around the mean. The key choice is whether your data represents a sample or the full population."
      slug="standard-deviation-formula"
      formula="Population: σ = √(Σ(x − μ)² ÷ n); Sample: s = √(Σ(x − x̄)² ÷ (n − 1))"
      example="For the scores 58, 64, 72, 72, 78, 84, 91: the mean is 519 ÷ 7 = 74.14. The squared deviations add up to 768.86. Sample variance = 768.86 ÷ 6 = 128.14, so the sample standard deviation is √128.14 = 11.32. If these seven scores were the whole population, variance = 768.86 ÷ 7 = 109.84 and σ = 10.48."
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
      reference={{
        title: "Worked example: deviations from the mean (x̄ = 74.14)",
        description: "Each row shows a score, how far it is from the mean, and that distance squared. The squared deviations sum to 768.86.",
        columns: ["Score (x)", "Deviation (x − x̄)", "Squared deviation (x − x̄)²"],
        rows: [
          { first: "58", second: "−16.14", third: "260.59" },
          { first: "64", second: "−10.14", third: "102.88" },
          { first: "72", second: "−2.14", third: "4.59" },
          { first: "72", second: "−2.14", third: "4.59" },
          { first: "78", second: "3.86", third: "14.88" },
          { first: "84", second: "9.86", third: "97.16" },
          { first: "91", second: "16.86", third: "284.16" },
        ],
      }}
      faqs={[
        {
          question: "Should I use the sample or population standard deviation?",
          answer:
            "Use the sample standard deviation (divide by n − 1) when your data are a sample used to describe a larger group, which is almost always the case in a thesis or survey. Use the population formula (divide by n) only when you have measured every member of the group you care about, such as every student in one class.",
        },
        {
          question: "Why do we divide by n − 1 for a sample?",
          answer:
            "A sample's values sit closer to their own mean than to the true population mean, so dividing by n would underestimate the spread. Dividing by n − 1 (Bessel's correction) removes that bias in the variance.",
        },
        {
          question: "What is a good or high standard deviation?",
          answer:
            "There is no universal cut-off; it depends on the scale. Compare the SD with the mean and the possible range: on a 1–5 Likert scale an SD near 1 is fairly spread out, while for exam scores out of 100 an SD of 10–15 is typical. The coefficient of variation (SD ÷ mean) helps compare spread across different scales.",
        },
        {
          question: "What does standard deviation tell you?",
          answer:
            "It is the typical distance of values from the mean, in the same units as the data. For roughly normal data, about 68% of values fall within 1 SD of the mean and about 95% within 2 SD.",
        },
        {
          question: "What is the difference between standard deviation and standard error?",
          answer:
            "Standard deviation describes the spread of individual values. Standard error (SE = SD ÷ √n) describes how precisely the sample mean estimates the population mean. In the example above, SE = 11.32 ÷ √7 = 4.28.",
        },
        {
          question: "How do I report mean and standard deviation in APA style?",
          answer:
            "Write the mean and SD to two decimal places in the text, for example: \"Participants scored M = 74.14, SD = 11.32 on the final exam,\" or use a table with M and SD columns. Italicise M and SD.",
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
          label: "Shapiro-Wilk Normality Test",
          href: "/shapiro-wilk-test-calculator",
          description: "Check whether your data are normal before using the mean and SD or a parametric test.",
        },
        {
          label: "Effect Size Calculator",
          href: "/effect-size-calculator",
          description: "Turn two means and SDs into Cohen's d to show how big a difference is.",
        },
        {
          label: "t-Test Calculator",
          href: "/t-test-calculator",
          description: "Compare two group means using their scores, with M and SD reported for each group.",
        },
      ]}
    />
  );
}
