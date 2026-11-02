import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Standard Deviation Formula: Sample vs Population (Examples)",
  "Sample and population standard deviation formulas with a worked example, when to divide by n or n − 1, and how to report M and SD in APA.",
  "/guides/standard-deviation-formula",
);

export default function StandardDeviationGuide() {
  return (
    <GuideArticle
      eyebrow="STATISTICS GUIDE"
      title="Standard deviation formula: sample vs population"
      description="Standard deviation is the typical distance of values from their mean. Sample: s = √(Σ(x − x̄)² ÷ (n − 1)). Population: σ = √(Σ(x − μ)² ÷ n). Use the sample formula unless you measured every member of the group."
      slug="standard-deviation-formula"
      formula="Population: σ = √(Σ(x − μ)² ÷ n); Sample: s = √(Σ(x − x̄)² ÷ (n − 1))"
      example="For the scores 58, 64, 72, 72, 78, 84, 91: the mean is 519 ÷ 7 = 74.14. The squared deviations add up to 768.86. Sample variance = 768.86 ÷ 6 = 128.14, so the sample standard deviation is √128.14 = 11.32. If these seven scores were the whole population, variance = 768.86 ÷ 7 = 109.84 and σ = 10.48."
      steps={[
        {
          title: "Find the mean",
          body: "Add all the values and divide by how many there are. For the example scores, 519 ÷ 7 = 74.14. Use μ for a population mean and x̄ for a sample mean.",
        },
        {
          title: "Subtract the mean from each value",
          body: "Each result (x − x̄) is a deviation: how far that value sits above or below the mean. The deviations always add up to zero, which is why they are squared next.",
        },
        {
          title: "Square each deviation and add them up",
          body: "Squaring removes the negative signs and gives extra weight to values far from the mean. The total, Σ(x − x̄)², is the sum of squares. In the example it is 768.86.",
        },
        {
          title: "Divide to get the variance",
          body: "Divide the sum of squares by n − 1 for a sample (768.86 ÷ 6 = 128.14) or by n for a whole population (768.86 ÷ 7 = 109.84). This is the variance, measured in squared units.",
        },
        {
          title: "Take the square root",
          body: "The square root of the variance is the standard deviation, back in the original units: s = √128.14 = 11.32 for a sample, σ = √109.84 = 10.48 for a population.",
        },
        {
          title: "Check the result makes sense",
          body: "The SD can never be negative and is zero only when every value is identical. A quick sense check: most values should lie within about two SDs of the mean (here 74.14 ± 22.64, or 51.5 to 96.8).",
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
          question: "What is the standard deviation formula?",
          answer:
            "For a sample: s = √( Σ(x − x̄)² ÷ (n − 1) ). For a whole population: σ = √( Σ(x − μ)² ÷ n ). In both, you subtract the mean from each value, square the results, add them up, divide, and take the square root. The only difference is dividing by n − 1 (sample) or n (population).",
        },
        {
          question: "What do σ, s, μ, x̄, Σ and n mean?",
          answer:
            "σ (sigma) is the population standard deviation and s is the sample standard deviation. μ (mu) is the population mean and x̄ (x-bar) is the sample mean. Σ means \"add up\" every value that follows, x is each individual value, and n is the number of values.",
        },
        {
          question: "What is the difference between variance and standard deviation?",
          answer:
            "Variance is the average squared deviation from the mean; standard deviation is its square root. Variance is in squared units (points², cm²), so standard deviation is easier to interpret because it is in the same units as the data. In the example, the sample variance is 128.14 and the sample SD is 11.32.",
        },
        {
          question: "What are common mistakes when calculating standard deviation?",
          answer:
            "The most common are: dividing by n when the data are a sample (use n − 1); forgetting to square the deviations, so they cancel to zero; reporting the variance instead of its square root; rounding the mean too early, which makes the final SD drift; and using the mean and SD for strongly skewed data, where the median and IQR describe the data better.",
        },
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
