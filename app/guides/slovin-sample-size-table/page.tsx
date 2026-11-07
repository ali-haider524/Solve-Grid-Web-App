import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Slovin's Formula Sample Size Table (N = 50 to 100,000)",
  "Ready-made Slovin's formula sample size table for populations from 50 to 100,000 at 1%, 3%, 5% and 10% margins of error, with Cochran's 95% values.",
  "/guides/slovin-sample-size-table",
);

export default function SlovinTableGuide() {
  return (
    <GuideArticle
      eyebrow="SAMPLE SIZE TABLE"
      title="Slovin's formula sample size table for populations from 50 to 100,000"
      description="Look up the minimum sample size for your population without calculating: find your population size (N) in the table and read across to your margin of error. Every value is rounded up, as thesis panels expect."
      slug="slovin-sample-size-table"
      formula="n = N ÷ (1 + N × e²)"
      example="For a population of 1,000 at a 5% margin of error: 1,000 ÷ (1 + 1,000 × 0.0025) = 285.71, rounded up to 286 respondents."
      steps={[
        {
          title: "Find your population size",
          body: "Use the total number of people who could be in your study, such as all Grade 11 students in the school. If your exact N is not listed, use the next larger row or the Sample Size Calculator for an exact answer.",
        },
        {
          title: "Choose the margin of error",
          body: "Most undergraduate and graduate theses use 5%. Use 3% when you need more precision and can survey more people, and 10% only for small exploratory studies your adviser approves.",
        },
        {
          title: "Read the sample size",
          body: "The value where your row and column meet is the minimum number of completed responses. Plan to distribute more questionnaires to allow for non-response.",
        },
        {
          title: "Adjust for non-response",
          body: "Divide the sample size by your expected response rate. If you need 286 responses and expect 80% to reply, distribute 286 ÷ 0.80 = 358 questionnaires.",
        },
        {
          title: "Cite the formula in Chapter 3",
          body: "Write the formula, the values of N and e, and the result, for example: “Using Slovin's formula with N = 1,000 and e = 0.05, the minimum sample size was 286.”",
        },
      ]}
      reference={{
        title: "Slovin's formula sample size table",
        description: "Minimum sample size n = N ÷ (1 + Ne²), rounded up. The last column shows Cochran's formula at 95% confidence, p = 0.5 and a 5% margin of error with the finite population correction, for comparison.",
        columns: ["Population (N)", "e = 1%", "e = 3%", "e = 5%", "e = 10%", "Cochran 95%, 5%"],
        rows: [
          { first: "50", second: "50", third: "48", fourth: "45", fifth: "34", sixth: "45" },
          { first: "100", second: "100", third: "92", fourth: "80", fifth: "50", sixth: "80" },
          { first: "150", second: "148", third: "133", fourth: "110", fifth: "60", sixth: "109" },
          { first: "200", second: "197", third: "170", fourth: "134", fifth: "67", sixth: "132" },
          { first: "250", second: "244", third: "205", fourth: "154", fifth: "72", sixth: "152" },
          { first: "300", second: "292", third: "237", fourth: "172", fifth: "75", sixth: "169" },
          { first: "400", second: "385", third: "295", fourth: "200", fifth: "80", sixth: "197" },
          { first: "500", second: "477", third: "345", fourth: "223", fifth: "84", sixth: "218" },
          { first: "600", second: "567", third: "390", fourth: "240", fifth: "86", sixth: "235" },
          { first: "700", second: "655", third: "430", fourth: "255", fifth: "88", sixth: "249" },
          { first: "800", second: "741", third: "466", fourth: "267", fifth: "89", sixth: "260" },
          { first: "900", second: "826", third: "498", fourth: "277", fifth: "90", sixth: "270" },
          { first: "1,000", second: "910", third: "527", fourth: "286", fifth: "91", sixth: "278" },
          { first: "1,500", second: "1,305", third: "639", fourth: "316", fifth: "94", sixth: "306" },
          { first: "2,000", second: "1,667", third: "715", fourth: "334", fifth: "96", sixth: "323" },
          { first: "2,500", second: "2,000", third: "770", fourth: "345", fifth: "97", sixth: "334" },
          { first: "3,000", second: "2,308", third: "811", fourth: "353", fifth: "97", sixth: "341" },
          { first: "4,000", second: "2,858", third: "870", fourth: "364", fifth: "98", sixth: "351" },
          { first: "5,000", second: "3,334", third: "910", fourth: "371", fifth: "99", sixth: "357" },
          { first: "10,000", second: "5,000", third: "1,000", fourth: "385", fifth: "100", sixth: "370" },
          { first: "20,000", second: "6,667", third: "1,053", fourth: "393", fifth: "100", sixth: "377" },
          { first: "50,000", second: "8,334", third: "1,087", fourth: "397", fifth: "100", sixth: "382" },
          { first: "100,000", second: "9,091", third: "1,099", fourth: "399", fifth: "100", sixth: "383" },
        ],
      }}
      faqs={[
        {
          question: "What sample size do I need for a population of 1,000?",
          answer: "With Slovin's formula you need 286 respondents at a 5% margin of error, 527 at 3% and 91 at 10%. Cochran's formula at 95% confidence and a 5% margin gives 278.",
        },
        {
          question: "What is the sample size for a population of 500 using Slovin's formula?",
          answer: "At a 5% margin of error the sample size is 500 ÷ (1 + 500 × 0.0025) = 222.2, rounded up to 223 respondents.",
        },
        {
          question: "Why does the sample size stop growing for large populations?",
          answer: "As N gets very large, Slovin's formula approaches 1 ÷ e². At a 5% margin that limit is 400, so even a population of 100,000 needs only 399 respondents.",
        },
        {
          question: "Should I round the sample size up or down?",
          answer: "Always round up. Rounding down would give a margin of error slightly larger than the one you chose.",
        },
        {
          question: "Is Slovin's formula accepted for a thesis?",
          answer: "It is widely used in theses in the Philippines and parts of Asia, but some reviewers prefer Cochran's formula or a power analysis because Slovin's formula does not include a confidence level. Check with your adviser and cite the formula you used.",
        },
      ]}
      toolLinks={[
        {
          label: "Sample Size Calculator",
          href: "/sample-size-calculator",
          description: "Get the exact sample size for any population with Slovin, Yamane or Cochran, plus a ready methodology sentence.",
        },
        {
          label: "Margin of Error Calculator",
          href: "/margin-of-error-calculator",
          description: "Already collected your data? Find the margin of error for the sample you actually got.",
        },
        {
          label: "Power Analysis Calculator",
          href: "/power-analysis-calculator",
          description: "Testing a hypothesis? Find the sample size from the effect size, alpha and power instead.",
        },
      ]}
    />
  );
}
