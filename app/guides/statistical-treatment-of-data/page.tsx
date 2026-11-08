import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Statistical Treatment of Data in Research: Examples & Formulas",
  "How to write the statistical treatment of data for Chapter 3: which tool answers each research question, the formulas, and a sample write-up you can adapt.",
  "/guides/statistical-treatment-of-data",
);

export default function StatisticalTreatmentGuide() {
  return (
    <GuideArticle
      eyebrow="THESIS CHAPTER 3 GUIDE"
      title="Statistical treatment of data in a thesis, with formulas and a sample write-up"
      description="The statistical treatment of data is the part of your methodology that says which statistical tool you will use for each research question, and why. Match every statement of the problem to one tool, give its formula, and say how you will interpret the result."
      slug="statistical-treatment-of-data"
      formula="One research question → one statistical tool → one formula → one interpretation rule"
      example="Statement of the problem: “Is there a significant difference in performance between male and female students?” Treatment: independent-samples t-test at α = .05, reported as t(df) = …, p = …, with Cohen's d."
      steps={[
        {
          title: "List your statements of the problem",
          body: "Copy each research question from Chapter 1 and note what it asks: a profile (describe), a level or extent (describe a Likert scale), a difference between groups, or a relationship between variables.",
        },
        {
          title: "Describe the respondents' profile",
          body: "Use frequency and percentage for categorical profile variables such as sex, year level or course: P = (f ÷ N) × 100. Use the mean and standard deviation for numeric ones such as age or GPA.",
        },
        {
          title: "Measure levels with the weighted mean",
          body: "For Likert statements, compute the weighted mean WM = Σfx ÷ N for each item and dimension, then interpret it with an equal-interval range table (for a 5-point scale: 4.21–5.00 Strongly Agree down to 1.00–1.80 Strongly Disagree). Report the standard deviation too.",
        },
        {
          title: "Test differences between groups",
          body: "Two independent groups: independent-samples t-test (Welch). The same people measured twice: paired t-test. Three or more groups: one-way ANOVA with Tukey post hoc. If the data are ordinal or not normal, use Mann-Whitney U, Wilcoxon or Kruskal-Wallis instead.",
        },
        {
          title: "Test relationships between variables",
          body: "Two numeric or Likert-scale scores: Pearson r (or Spearman rho for ranks). Two categorical variables such as sex and preferred mode: chi-square test of independence. Predicting an outcome from several variables: linear or logistic regression.",
        },
        {
          title: "Add sample size and reliability",
          body: "State how the sample was computed (for example Slovin's formula with e = 0.05) and the reliability of each questionnaire scale (Cronbach's alpha of .70 or higher). Say which software or calculator you used and the significance level, usually α = .05.",
        },
      ]}
      reference={{
        title: "Which statistical treatment answers which research question",
        description: "A quick map from the type of statement of the problem to the tool, how it is reported, and where to compute it.",
        columns: ["Research question asks about", "Statistical treatment", "Report it as"],
        rows: [
          { first: "Profile of respondents (sex, course, year)", second: "Frequency and percentage", third: "f and % in a table" },
          { first: "Numeric profile (age, GPA, income)", second: "Mean and standard deviation", third: "M = …, SD = …" },
          { first: "Level or extent on a Likert scale", second: "Weighted mean with interpretation range", third: "WM = 3.90, Agree" },
          { first: "Reliability of the questionnaire", second: "Cronbach's alpha", third: "α = .84 (Good)" },
          { first: "Difference between two groups", second: "Independent-samples t-test", third: "t(df) = …, p = …, d = …" },
          { first: "Before vs after on the same people", second: "Paired t-test or Wilcoxon signed-rank", third: "t(df) = …, p = …" },
          { first: "Difference among three or more groups", second: "One-way ANOVA (Kruskal-Wallis if ordinal)", third: "F(df1, df2) = …, p = …, η² = …" },
          { first: "Relationship between two scores", second: "Pearson r (Spearman rho for ranks)", third: "r(df) = …, p = …" },
          { first: "Relationship between two categories", second: "Chi-square test of independence", third: "χ²(df, N = …) = …, p = …" },
          { first: "Predicting an outcome", second: "Linear or logistic regression", third: "R², F, B, p (or OR)" },
        ],
      }}
      faqs={[
        {
          question: "What is the statistical treatment of data in research?",
          answer: "It is the section of Chapter 3 that explains which statistical tools you used to analyse the data for each research question, the formula of each tool, and how the results were interpreted. Reviewers check that every research question has a matching tool.",
        },
        {
          question: "What is a sample statistical treatment of data for a survey questionnaire?",
          answer: "“Frequency and percentage were used to describe the respondents' profile. The weighted mean and standard deviation were used to determine the level of each variable, interpreted with a 0.80-wide range table. The independent-samples t-test and one-way ANOVA were used to test differences by profile, and Pearson r to test the relationship between the variables, all at the .05 level of significance.”",
        },
        {
          question: "What statistical treatment should I use for Likert scale data?",
          answer: "Use the weighted mean and standard deviation to describe each item, with a verbal interpretation from the range table. For comparing groups on summed scale scores, use a t-test or ANOVA; for single items or clearly non-normal data, use Mann-Whitney U or Kruskal-Wallis.",
        },
        {
          question: "Do I need to include formulas in the statistical treatment?",
          answer: "Most Philippine and Asian thesis formats ask for the formula of each tool with its symbols explained, for example WM = Σfx ÷ N, where f is the frequency, x the scale value and N the number of respondents. Check your school's thesis manual.",
        },
        {
          question: "What level of significance should I use?",
          answer: "The .05 level is standard for social science, education and business research. Use .01 only if your field or adviser requires stricter evidence.",
        },
      ]}
      toolLinks={[
        {
          label: "Statistical Test Chooser",
          href: "/statistical-test-chooser",
          description: "Answer a few questions about your design and data to get the right test for each research question.",
        },
        {
          label: "Likert Scale Calculator",
          href: "/likert-scale-calculator",
          description: "Weighted mean, standard deviation and verbal interpretation for every statement and dimension.",
        },
        {
          label: "Sample Size Calculator",
          href: "/sample-size-calculator",
          description: "Slovin, Yamane or Cochran sample size with a methodology sentence for Chapter 3.",
        },
        {
          label: "Cronbach's Alpha Calculator",
          href: "/cronbach-alpha-calculator",
          description: "Check questionnaire reliability before you interpret any scale scores.",
        },
      ]}
    />
  );
}
