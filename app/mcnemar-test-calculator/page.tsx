import MethodNotes from "../../components/MethodNotes";
import SiteFooter from "../../components/SiteFooter";
import ToolCrossLinks from "../../components/ToolCrossLinks";
import ToolSchema from "../../components/ToolSchema";
import { createToolMetadata } from "../../lib/seo";
import McNemarCalculator from "./McNemarCalculator";

export const metadata = createToolMetadata("mcnemar-test-calculator");

export default function McNemarPage() {
  return (
    <>
      <ToolSchema slug="mcnemar-test-calculator" />
      <McNemarCalculator />
      <MethodNotes
        eyebrow="METHOD"
        title="McNemar test formula, exact test, and APA reporting"
        sections={[
          {
            heading: "When to use McNemar's test",
            paragraphs: [
              "Use it for a yes/no (dichotomous) outcome measured twice on the same people, or on matched pairs: for example, whether students passed before and after a workshop, or whether patients had a symptom before and after treatment. A regular chi-square test is wrong here because the two measurements are not independent.",
            ],
          },
          {
            heading: "Formula",
            formula: "χ² = (b − c)² ÷ (b + c),   df = 1   (continuity-corrected: (|b − c| − 1)² ÷ (b + c))",
            paragraphs: [
              "b is the number who changed from category 1 to category 2 and c the number who changed the other way. The participants who did not change (a and d) carry no information about change, so they do not enter the statistic.",
            ],
          },
          {
            heading: "Exact binomial version",
            paragraphs: [
              "Under the null hypothesis, each of the b + c changers is equally likely to move in either direction, so b follows a binomial(b + c, 0.5) distribution. The exact two-sided p value is 2 × P(X ≤ min(b, c)). Use it when b + c is below about 25; SPSS reports this exact p automatically for small tables.",
            ],
          },
          {
            heading: "Effect size",
            paragraphs: [
              "The odds ratio b ÷ c tells you how much more likely change was in one direction than the other, with a 95% CI from SE(ln OR) = √(1/b + 1/c). Also report the two proportions (before and after) so readers see the size of the change.",
            ],
          },
          {
            heading: "How to report it (APA style)",
            paragraphs: [
              "“An exact McNemar test showed a significant change in the proportion of students who passed, from 45.0% before the workshop to 34.0% after, χ²(1, N = 100) = 6.37, p = .019. Fifteen students changed from pass to fail and four from fail to pass.”",
            ],
          },
          {
            heading: "References",
            list: [
              "McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. Psychometrika, 12(2), 153–157.",
              "Edwards, A. L. (1948). Note on the \"correction for continuity\" in testing the significance of the difference between correlated proportions. Psychometrika, 13(3), 185–187.",
              "Fagerland, M. W., Lydersen, S., & Laake, P. (2013). The McNemar test for binary matched-pairs data: Mid-p and asymptotic are better than exact conditional. BMC Medical Research Methodology, 13, 91.",
              "Agresti, A. (2013). Categorical data analysis (3rd ed.). Wiley.",
            ],
          },
        ]}
      />
      <ToolCrossLinks currentSlug="mcnemar-test-calculator" />
      <SiteFooter />
    </>
  );
}
