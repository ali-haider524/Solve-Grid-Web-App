import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "How to Report Chi-Square Results in APA Style (7th ed.)",
  "APA templates for chi-square test of independence and goodness-of-fit results: χ², df, N, p, Cramér's V, and Fisher's exact test, with worked examples.",
  "/guides/how-to-report-chi-square-apa",
);

export default function ReportChiSquareGuide() {
  return (
    <GuideArticle
      eyebrow="APA REPORTING GUIDE"
      title="How to report chi-square results in APA style"
      slug="how-to-report-chi-square-apa"
      description="An APA chi-square report names the test, gives χ² with its degrees of freedom and sample size, the exact p value, and an effect size such as Cramér's V, plus the counts or percentages that show the pattern."
      formula="χ²(df, N = n) = value, p = .XXX, V = .XX"
      example="A chi-square test of independence showed a significant association between study mode and exam outcome, χ²(1, N = 100) = 4.00, p = .046, V = .20. In-person students passed more often (60%) than online students (40%)."
      steps={[
        {
          title: "Name the test",
          body: "Say whether you ran a chi-square test of independence (two categorical variables) or a goodness-of-fit test (one variable against expected proportions).",
        },
        {
          title: "Give χ² with df and N",
          body: "Write χ²(df, N = total) = value. For an r × c table, df = (r − 1)(c − 1). Including N is required by APA for chi-square.",
        },
        {
          title: "Report the exact p value",
          body: "Use p = .046 rather than p < .05, and p < .001 only for very small values.",
        },
        {
          title: "Add an effect size",
          body: "Cramér's V (or φ for 2 × 2 tables). For 2 × 2 tables, about .10 small, .30 medium, .50 large.",
        },
        {
          title: "Describe the pattern",
          body: "Give the percentages or counts that show where the difference lies, in the text or in a contingency table.",
        },
        {
          title: "Say what you did about small expected counts",
          body: "If expected counts were below 5, report Fisher's exact test for 2 × 2 tables or say which categories you combined.",
        },
      ]}
      reference={{
        title: "APA chi-square templates",
        description: "Replace the numbers with your own results.",
        columns: ["Situation", "Template", "Notes"],
        rows: [
          { first: "Test of independence, significant", second: "χ²(1, N = 100) = 4.00, p = .046, V = .20", third: "Add the percentages per group" },
          { first: "Test of independence, larger table", second: "χ²(4, N = 210) = 11.73, p = .019, V = .17", third: "df = (rows − 1)(columns − 1)" },
          { first: "Not significant", second: "χ²(2, N = 150) = 1.84, p = .398, V = .08", third: "Still report the effect size" },
          { first: "Goodness of fit", second: "χ²(2, N = 100) = 14.00, p < .001", third: "Say what the expected proportions were" },
          { first: "Small 2 × 2 table", second: "Fisher's exact test, p = .071", third: "No χ² value is reported" },
          { first: "Paired yes/no data", second: "McNemar's χ²(1, N = 60) = 5.14, p = .023", third: "Same people measured twice" },
        ],
      }}
      faqs={[
        {
          question: "Do I need to report N for a chi-square test?",
          answer: "Yes. APA asks for the sample size inside the brackets: χ²(1, N = 100) = 4.00.",
        },
        {
          question: "How do I type the χ² symbol?",
          answer:
            "In Word, type the Greek letter chi (Insert → Symbol, or type 03C7 then Alt + X) followed by a superscript 2. Writing 'chi-square' in words is also acceptable.",
        },
        {
          question: "Should I report the Yates continuity correction?",
          answer:
            "Most current guidance reports the uncorrected Pearson χ² and switches to Fisher's exact test when expected counts are small, rather than using Yates' correction.",
        },
        {
          question: "What type of data is the chi-square test used for?",
          answer: "Counts of people or cases in categories. It cannot be run on means, percentages, or continuous scores.",
        },
      ]}
      toolLinks={[
        {
          label: "Chi-Square Calculator",
          href: "/chi-square-calculator",
          description: "Get χ², df, p, expected counts, Cramér's V, and Fisher's exact test, with a ready APA sentence.",
        },
        {
          label: "Statistical Test Chooser",
          href: "/statistical-test-chooser",
          description: "Check whether chi-square, Fisher's exact, or McNemar's test fits your design.",
        },
        {
          label: "Effect Size Calculator",
          href: "/effect-size-calculator",
          description: "Convert and compare effect sizes for your other results.",
        },
      ]}
    />
  );
}
