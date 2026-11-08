import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Frequency and Percentage Formula in Research (with Examples)",
  "The percentage formula P = (f ÷ N) × 100 for the profile of respondents, with a worked table, ranking, multiple-response items and a sample interpretation.",
  "/guides/frequency-and-percentage-formula",
);

export default function FrequencyPercentageGuide() {
  return (
    <GuideArticle
      eyebrow="THESIS CHAPTER 3 & 4 GUIDE"
      title="Frequency and percentage formula for the profile of respondents"
      description="Frequency and percentage is the standard statistical treatment for describing the profile of respondents: how many people fall in each category of sex, age group, year level, course or income bracket, and what share of the total that is."
      slug="frequency-and-percentage-formula"
      formula="P = (f ÷ N) × 100"
      example="If 72 of 120 respondents are female, P = (72 ÷ 120) × 100 = 60.0%. The remaining 48 male respondents are (48 ÷ 120) × 100 = 40.0%, and the two percentages add up to 100%."
      steps={[
        {
          title: "Count the frequency of each category",
          body: "Tally how many respondents chose each option. The frequency f is that count. Check that the frequencies add up to N, the number of respondents who answered the item.",
        },
        {
          title: "Divide by the total and multiply by 100",
          body: "For each category, compute P = (f ÷ N) × 100. Round to one or two decimal places and use the same rounding throughout the table.",
        },
        {
          title: "Check the total",
          body: "The percentages for a single-answer item should add up to 100%. A total of 99.9% or 100.1% from rounding is fine; mention it in a note if your panel is strict.",
        },
        {
          title: "Rank the categories (optional)",
          body: "Many thesis formats add a Rank column: rank 1 for the highest frequency. Give tied categories the average rank, for example two categories tied for second place both get rank 2.5.",
        },
        {
          title: "Handle multiple-response items",
          body: "If respondents could choose more than one option, divide by the number of respondents, not the number of answers, and note that totals can exceed 100%.",
        },
        {
          title: "Interpret the table in words",
          body: "Describe the largest groups first, then notable small groups: “Most respondents were female (60.0%), and the majority were 18–20 years old (55.0%).” Do not repeat every number in the text.",
        },
      ]}
      reference={{
        title: "Sample profile of respondents table (N = 120)",
        description: "Frequency, percentage and rank for two profile variables.",
        columns: ["Profile variable", "Frequency (f)", "Percentage (%)", "Rank"],
        rows: [
          { first: "Sex: Female", second: "72", third: "60.0", fourth: "1" },
          { first: "Sex: Male", second: "48", third: "40.0", fourth: "2" },
          { first: "Age: 18–20", second: "66", third: "55.0", fourth: "1" },
          { first: "Age: 21–23", second: "42", third: "35.0", fourth: "2" },
          { first: "Age: 24 and above", second: "12", third: "10.0", fourth: "3" },
        ],
      }}
      faqs={[
        {
          question: "What is the formula for percentage in research?",
          answer: "P = (f ÷ N) × 100, where P is the percentage, f the frequency of a category and N the total number of respondents. For example, 30 of 150 respondents is (30 ÷ 150) × 100 = 20%.",
        },
        {
          question: "How do I write frequency and percentage in the statistical treatment?",
          answer: "“Frequency and percentage were used to describe the profile of the respondents in terms of sex, age and year level, using P = (f ÷ N) × 100, where P is the percentage, f the frequency and N the total number of respondents.”",
        },
        {
          question: "How do I interpret a frequency and percentage table?",
          answer: "Start with the largest category of each variable, then mention any notable minority groups and what the profile means for your study. Keep the numbers in the table and the meaning in the text.",
        },
        {
          question: "Is frequency and percentage enough for Likert data?",
          answer: "It is a good start for single items, but most theses also report the weighted mean and its verbal interpretation for each statement, and Cronbach's alpha for each scale.",
        },
      ]}
      toolLinks={[
        {
          label: "Likert Scale Calculator",
          href: "/likert-scale-calculator",
          description: "Frequencies, weighted mean and interpretation for every Likert statement in one table.",
        },
        {
          label: "Statistical Treatment of Data Guide",
          href: "/guides/statistical-treatment-of-data",
          description: "Match each research question to the right statistical tool and write Chapter 3.",
        },
        {
          label: "Descriptive Statistics Calculator",
          href: "/statistics-calculator",
          description: "Mean, median, standard deviation and quartiles for numeric profile variables like age or GPA.",
        },
      ]}
    />
  );
}
