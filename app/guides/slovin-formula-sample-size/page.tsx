import GuideArticle from "../../../components/GuideArticle";
import VideoExplainer from "../../../components/VideoExplainer";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Slovin's Formula for Sample Size: Example & Calculation",
  "Slovin's formula n = N ÷ (1 + Ne²) with worked examples, a comparison with Cochran's formula, and how to justify sample size in a thesis.",
  "/guides/slovin-formula-sample-size",
);

export default function SlovinFormulaGuide() {
  return (
    <GuideArticle
      eyebrow="RESEARCH STATISTICS GUIDE"
      title="Slovin's formula for sample size, with worked examples"
      description="Slovin's formula (also cited as Taro Yamane's formula) estimates the minimum sample needed from a known population for a chosen margin of error. It is one of the most used sample size formulas in thesis research."
      slug="slovin-formula-sample-size"
      formula="n = N ÷ (1 + N·e²)"
      example="A school has 2,500 students and you accept a 5% margin of error. n = 2,500 ÷ (1 + 2,500 × 0.05²) = 2,500 ÷ 7.25 = 344.83, so you survey 345 students."
      steps={[
        {
          title: "Find the population size N",
          body: "N is the total number of people who meet your inclusion criteria, such as all enrolled nursing students or all registered SMEs in a district. Cite where the number came from.",
        },
        {
          title: "Choose the margin of error e",
          body: "Write e as a decimal: 5% becomes 0.05. A 5% margin is standard; 10% is sometimes accepted for small or exploratory studies; 3% needs a much larger sample.",
        },
        {
          title: "Square e and multiply by N",
          body: "With N = 2,500 and e = 0.05, N·e² = 2,500 × 0.0025 = 6.25.",
        },
        {
          title: "Add 1 and divide",
          body: "n = 2,500 ÷ (1 + 6.25) = 2,500 ÷ 7.25 = 344.83.",
        },
        {
          title: "Round up",
          body: "Always round up to the next whole respondent, giving 345. Rounding down would leave you below the minimum the formula requires.",
        },
        {
          title: "Adjust for non-response",
          body: "If you expect only 80% of invited people to respond, invite 345 ÷ 0.80 = 432 people so that you still reach the minimum.",
        },
      ]}
      reference={{
        title: "Slovin sample sizes at a glance",
        description: "Minimum sample sizes from n = N ÷ (1 + N·e²), rounded up.",
        columns: ["Population N", "e = 5%", "e = 10%"],
        rows: [
          { first: "100", second: "80", third: "50" },
          { first: "500", second: "223", third: "84" },
          { first: "1,000", second: "286", third: "91" },
          { first: "5,000", second: "371", third: "99" },
          { first: "10,000", second: "385", third: "100" },
          { first: "100,000", second: "399", third: "100" },
        ],
      }}
      faqs={[
        {
          question: "What is the difference between Slovin's and Cochran's formula?",
          answer:
            "Slovin's formula only uses the population size and margin of error. Cochran's formula also uses a confidence level (z) and an expected proportion (p), usually 95% and 0.5. For N = 2,500 at a 5% margin, Slovin gives 345, while Cochran gives n₀ = 1.96² × 0.5 × 0.5 ÷ 0.05² = 384.16, and after the finite population correction n = 384.16 ÷ (1 + 383.16 ÷ 2,500) = 334. Cochran is easier to defend because every assumption is stated.",
        },
        {
          question: "What confidence level does Slovin's formula use?",
          answer:
            "The formula itself has no confidence level, which is its main weakness. Some textbooks say it implies about 95%, but that is not part of the formula. If your adviser asks for a confidence level, use Cochran's formula, which states it directly.",
        },
        {
          question: "What if I don't know the population size?",
          answer:
            "Slovin's formula needs N, so it cannot be used. Use Cochran's formula without the finite population correction: at 95% confidence, a 5% margin and p = 0.5, the minimum is 385 respondents.",
        },
        {
          question: "How do I divide the sample across groups (stratified sampling)?",
          answer:
            "Use proportional allocation: each group's share of the sample equals its share of the population. With N = 2,500 split into 1,200, 800 and 500 students and n = 345, the groups get 345 × 1,200 ÷ 2,500 = 165.6, 110.4 and 69. Round each up to 166, 111 and 69 (346 in total) so no group falls below its minimum.",
        },
        {
          question: "Is Slovin's formula the same as Yamane's formula?",
          answer:
            "Yes. Both are n = N ÷ (1 + N·e²). Taro Yamane published it in 1967, and the name 'Slovin' is widely used in Philippine and Southeast Asian research. Cite the name your institution uses.",
        },
        {
          question: "What are the limitations of Slovin's formula?",
          answer:
            "It does not let you choose a confidence level or expected proportion, and it assumes simple random sampling. Critics argue it is often used without justification, so Cochran's formula or a power analysis can be more defensible.",
        },
        {
          question: "How do I write Slovin's formula in my methodology?",
          answer:
            "For example: 'Using Slovin's formula with a population of 2,500 and a 5% margin of error, the minimum sample size was 345 respondents.' Include the formula and the substituted values.",
        },
      ]}
      toolLinks={[
        {
          label: "Sample Size Calculator",
          href: "/sample-size-calculator",
          description:
            "Calculate Slovin, Yamane, or Cochran sample sizes with finite population correction and a ready-made methods sentence.",
        },
        {
          label: "Power Analysis Calculator",
          href: "/power-analysis-calculator",
          description: "Testing hypotheses? Find the sample size for t-tests, ANOVA, correlation, or chi-square from effect size, alpha, and power.",
        },
        {
          label: "Likert Scale Calculator",
          href: "/likert-scale-calculator",
          description: "After collecting data, compute weighted means and verbal interpretations for each statement.",
        },
      ]}
    >
      <VideoExplainer
        id="9bwsdXiJhKg"
        title="Slovin's Formula: How Many Respondents Do I Need for My Thesis? (Sample Size Example)"
        description="Find your thesis sample size with Slovin's formula step by step: a population of 2,500 at a 5% margin of error gives 344.83, rounded up to 345 respondents."
        uploadDate="2026-11-03T12:37:20-08:00"
        duration="PT45S"
        pageUrl="https://solvegrid.online/guides/slovin-formula-sample-size"
      />
    </GuideArticle>
  );
}
