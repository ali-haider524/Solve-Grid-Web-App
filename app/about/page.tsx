import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";
import { siteAuthor } from "../../lib/site";

export const metadata = createStaticPageMetadata(
  "About SolveGrid and Its Author",
  "Who builds SolveGrid, how its research statistics calculators are checked against SciPy and G*Power, and how corrections are handled.",
  "/about",
);

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT SOLVEGRID"
      title="About SolveGrid"
      description="Free, browser-based statistics calculators and reporting guides for students and researchers writing a thesis, dissertation, or survey report."
      updated="28 October 2026"
      sections={[
        {
          title: "What SolveGrid does",
          paragraphs: [
            "SolveGrid helps students and early-career researchers run and report the statistics in a thesis or survey study without installing software. It covers the full workflow: planning the sample (Slovin, Cochran, and power analysis), checking questionnaire reliability (Cronbach's alpha, Cohen's kappa, ICC), describing Likert data, choosing the right test, running it (t-tests, ANOVA, chi-square, correlation, regression, and non-parametric tests), and writing the result in APA style.",
            "Every calculator shows the method, assumptions, effect sizes, and a ready-to-adapt APA sentence, and links to the guides and related tools you are likely to need next. Supporting math, engineering, and numerical-methods tools remain available for coursework.",
          ],
        },
        {
          title: `About the author: ${siteAuthor.name}`,
          paragraphs: [
            `SolveGrid is built and maintained by ${siteAuthor.name}, a software engineer and web developer with experience in SEO, web development, project management, and e-commerce. ${siteAuthor.name} is responsible for the calculators, method notes, guides, and the website itself.`,
            "The aim is to offer accurate, transparent tools that explain what they compute, not just print a number, so that students can understand and defend the statistics in their own work.",
          ],
        },
        {
          title: "How the calculations are checked",
          paragraphs: [
            "Each statistical procedure is implemented from its published formula and then tested against established reference software before it is released.",
          ],
          bullets: [
            "Results are compared with SciPy (Python) for t-tests, ANOVA, Tukey HSD, chi-square, correlation, regression, rank tests, and normality tests",
            "Power analysis results are compared with the standard G*Power values (for example 64 per group for d = 0.5, α = .05, power = .80)",
            "Reliability and agreement statistics follow the original sources (Cronbach, 1951; Cohen, 1960; Shrout & Fleiss, 1979) and are cited on each page",
            "Known approximations, such as the Fisher z method for correlation power, are stated on the page where they apply",
          ],
        },
        {
          title: "Corrections and feedback",
          paragraphs: [
            "If a result looks wrong, please report it through the Contact page with the page URL, the exact inputs, the result shown, and the result you expected. Confirmed issues are fixed and the page's update date is changed.",
          ],
        },
        {
          title: "Independence and limits",
          paragraphs: [
            "SolveGrid is an independent website. It is not affiliated with SPSS, G*Power, SciPy, or any university, and mentions of other software are for comparison only. The site is free to use and may be supported by advertising.",
            "SolveGrid provides calculation support and educational explanations. It does not replace your supervisor's or institution's guidance, and it does not provide individualised medical, legal, financial, or other professional advice.",
          ],
        },
      ]}
    />
  );
}
