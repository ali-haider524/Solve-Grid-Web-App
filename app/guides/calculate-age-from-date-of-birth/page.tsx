import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "How to Calculate Age From Date of Birth",
  "Learn how calendar age is calculated in years, months, and days using a date of birth and a reference date.",
  "/guides/calculate-age-from-date-of-birth",
);

export default function CalculateAgeGuide() {
  return (
    <GuideArticle
      eyebrow="AGE CALCULATOR GUIDE"
      title="How to calculate age from a date of birth"
      description="Calendar age is measured by comparing a date of birth with today or another reference date, then accounting for completed years, months, and days."
      slug="calculate-age-from-date-of-birth"
      formula="calendar age = completed years + completed months + remaining days"
      example="For a date of birth of 10 May 2000 and a reference date of 4 July 2026, the calculator counts completed calendar years first, then remaining months and days."
      steps={[
        { title: "Enter the date of birth", body: "Use the exact day, month, and year whenever possible. The calculator does not need a time of day." },
        { title: "Choose today or another reference date", body: "Keep today for a current age, or choose any later date when you need age on a specific day." },
        { title: "Read the calendar result", body: "The result separates completed years, months, and days. It also shows totals and the timing of the next birthday." },
      ]}
      toolLinks={[
        { label: "Age Calculator", href: "/age-calculator", description: "Calculate age by date of birth on today or a selected date." },
        { label: "BMI Calculator", href: "/bmi-calculator", description: "Use adult height and weight inputs for a general BMI screening calculation." },
      ]}
    />
  );
}
