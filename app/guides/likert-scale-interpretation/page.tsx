import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Likert Scale Interpretation: Weighted Mean Range Tables",
  description:
    "Interpret Likert scale weighted means with 4-, 5-, and 7-point range tables, learn how the interval width is calculated, and report results correctly in a thesis.",
  alternates: { canonical: "/guides/likert-scale-interpretation" },
};

export default function LikertInterpretationGuide() {
  return (
    <GuideArticle
      eyebrow="RESEARCH STATISTICS GUIDE"
      title="Likert scale interpretation using weighted mean ranges"
      description="A weighted mean summarises how respondents answered a Likert statement. To turn that number into a verbal description, you divide the scale into equal intervals and match each mean to its range."
      slug="likert-scale-interpretation"
      formula="Interval width = (highest score − lowest score) ÷ number of options"
      example="On a 5-point scale the width is (5 − 1) ÷ 5 = 0.80. A statement with a weighted mean of 3.86 falls in 3.41–4.20, so it is interpreted as Agree."
      steps={[
        {
          title: "Score each option",
          body: "Assign 1 to the lowest option (for example Strongly Disagree) and the highest number to the top option. Reverse-code negatively worded statements first.",
        },
        {
          title: "Compute the weighted mean",
          body: "Multiply each option's score by the number of respondents who chose it, add the products, and divide by the total number of respondents.",
        },
        {
          title: "Calculate the interval width",
          body: "Divide the score range by the number of options. A 4-point scale gives 0.75, a 5-point scale 0.80, and a 7-point scale about 0.86.",
        },
        {
          title: "Build the range table",
          body: "Start at 1.00 and add the width to get each upper limit. The next range starts 0.01 above the previous upper limit.",
        },
        {
          title: "Match each mean to a range",
          body: "Assign the verbal label of the range that contains the mean. Do the same for the grand mean of each dimension.",
        },
        {
          title: "Report it with spread",
          body: "Present the weighted mean, standard deviation, and interpretation in one table, and discuss the highest- and lowest-ranked statements in the text.",
        },
      ]}
      reference={{
        title: "5-point Likert scale interpretation table",
        description: "Equal intervals of 0.80.",
        columns: ["Scale", "Mean range", "Interpretation"],
        rows: [
          { first: "5", second: "4.21 – 5.00", third: "Strongly Agree" },
          { first: "4", second: "3.41 – 4.20", third: "Agree" },
          { first: "3", second: "2.61 – 3.40", third: "Neutral" },
          { first: "2", second: "1.81 – 2.60", third: "Disagree" },
          { first: "1", second: "1.00 – 1.80", third: "Strongly Disagree" },
        ],
      }}
      faqs={[
        {
          question: "What is the range for a 4-point Likert scale?",
          answer:
            "With a width of 0.75: 1.00–1.75 Strongly Disagree, 1.76–2.50 Disagree, 2.51–3.25 Agree, and 3.26–4.00 Strongly Agree.",
        },
        {
          question: "Should I use the mean or median for Likert data?",
          answer:
            "Single Likert items are ordinal, so the median and frequency percentages are the most cautious summary. Weighted means are common in applied theses; reporting both satisfies most reviewers.",
        },
        {
          question: "Which test compares Likert responses between groups?",
          answer:
            "For single items, use Mann-Whitney U (two groups) or Kruskal-Wallis (three or more). For summed scale scores that are roughly normal, an independent t-test or one-way ANOVA is common.",
        },
      ]}
      toolLinks={[
        {
          label: "Likert Scale Calculator",
          href: "/likert-scale-calculator",
          description: "Paste response counts to get weighted means, standard deviations, ranks, and interpretations automatically.",
        },
        {
          label: "Cronbach's Alpha Calculator",
          href: "/cronbach-alpha-calculator",
          description: "Check that the statements in each dimension are reliable before reporting a composite mean.",
        },
      ]}
    />
  );
}
