import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import ToolHeader from "../components/ToolHeader";
import { lastUpdated } from "../lib/content-dates";
import { guides } from "../lib/guides";
import { createStaticPageMetadata } from "../lib/seo";
import { siteUrl } from "../lib/site";
import {
  getCategoryPath,
  getToolBySlug,
  toolCategories,
  tools,
  type ToolCategory,
} from "../lib/tools";

export const metadata = createStaticPageMetadata(
  "SolveGrid: Free Statistics Calculators for Thesis & Survey Research",
  "Free statistics calculators for your thesis: Slovin sample size, Cronbach's alpha, Likert weighted mean, chi-square, t-tests, ANOVA, and a test chooser.",
  "/",
);

const featuredToolSlugs = [
  "statistical-test-chooser",
  "sample-size-calculator",
  "cronbach-alpha-calculator",
  "likert-scale-calculator",
  "statistics-calculator",
  "advanced-statistics",
];

const researchPath = [
  { step: "01", title: "Plan your sample", text: "Slovin, Yamane, or Cochran formula", href: "/sample-size-calculator" },
  { step: "02", title: "Check reliability", text: "Cronbach's alpha with alpha if item deleted", href: "/cronbach-alpha-calculator" },
  { step: "03", title: "Summarise responses", text: "Likert weighted mean and interpretation", href: "/likert-scale-calculator" },
  { step: "04", title: "Describe the data", text: "Mean, standard deviation, quartiles", href: "/statistics-calculator" },
  { step: "05", title: "Choose and run the right test", text: "Test chooser, then t-tests, ANOVA, correlation", href: "/statistical-test-chooser" },
];

const featuredGuideSlugs = [
  "statistical-treatment-of-data",
  "slovin-sample-size-table",
  "choose-a-statistical-test",
  "slovin-formula-sample-size",
  "likert-scale-interpretation",
  "standard-deviation-formula",
  "graphical-linear-programming-method",
  "matrix-inverse-and-determinant",
];

const homepageFaqs = [
  {
    question: "Are SolveGrid calculators free to use?",
    answer:
      "Yes. SolveGrid provides free browser-based statistics calculators for student research, plus supporting math and numerical-methods tools. No account is needed.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required for the current public calculators. Open a tool, enter your values, and calculate directly in the browser.",
  },
  {
    question: "How do I calculate sample size for my thesis?",
    answer:
      "Use the Sample Size Calculator. Slovin's formula needs only the population size and margin of error; Cochran's formula also lets you set the confidence level and expected proportion, with a finite population correction.",
  },
  {
    question: "How do I check if my questionnaire is reliable?",
    answer:
      "Paste item scores into the Cronbach's Alpha Calculator. It reports alpha, corrected item-total correlations, and alpha if item deleted, and it can reverse-code negatively worded items.",
  },
  {
    question: "Which statistical test should I use?",
    answer:
      "It depends on your question and data type: t-tests compare two means, one-way ANOVA compares three or more, and correlation measures a relationship between two numeric variables. The 'How to choose a statistical test' guide walks through the decision.",
  },
  {
    question: "Can I use SolveGrid results in my thesis?",
    answer:
      "Yes. Each calculator shows the working and gives a write-up sentence you can adapt for your methods or results chapter. Cite the statistical method itself, such as Slovin's formula or Cronbach's alpha, and confirm your university's required format with your supervisor.",
  },
  {
    question: "Does SolveGrid replace SPSS?",
    answer:
      "For the tests it covers, such as t-tests, ANOVA, chi-square, correlation and Cronbach's alpha, SolveGrid reports the standard outputs: the test statistic, degrees of freedom, p value and effect size. You still need software like SPSS, jamovi or R for factor analysis, structural equation models or mixed models.",
  },
  {
    question: "Is my research data uploaded?",
    answer:
      "No. Calculations run in your browser. Data you paste is not sent to SolveGrid's servers.",
  },
  {
    question: "How are SolveGrid calculations checked?",
    answer:
      "Each tool is built around a defined formula, matrix operation, statistical procedure, numerical method, or unit relationship. Important assumptions and limitations are documented on tool pages, guides, and the Methods & Accuracy page.",
  },
];

const homepageReviewedDate = lastUpdated("");
const homepageReviewedLabel = new Date(`${homepageReviewedDate}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const homeSummary =
  "SolveGrid is a free set of statistics calculators for thesis and survey research. It works out sample size, questionnaire reliability, Likert means and common tests such as the t-test, ANOVA and chi-square. Every result shows the formula, the working and a sentence you can adapt for your methods or results chapter.";

const tableOfContents = [
  { href: "#which-calculator-do-i-need", label: "Which calculator do I need?" },
  { href: "#how-to-analyse-survey-data", label: "How to analyse survey data" },
  { href: "#tools", label: "Popular calculators" },
  { href: "#statistics-terms", label: "Key statistics terms" },
  { href: "#frequently-asked-questions", label: "FAQs" },
];

const calculatorComparison = [
  { task: "Decide how many respondents you need", tool: "Sample Size Calculator", href: "/sample-size-calculator", method: "Slovin, Yamane or Cochran formula", report: "Required sample size and margin of error" },
  { task: "Check if your questionnaire is reliable", tool: "Cronbach's Alpha Calculator", href: "/cronbach-alpha-calculator", method: "Cronbach's alpha, alpha if item deleted", report: "α value and its label (e.g. Good)" },
  { task: "Summarise agree–disagree answers", tool: "Likert Scale Calculator", href: "/likert-scale-calculator", method: "Weighted mean with interpretation ranges", report: "Mean, SD and verbal interpretation" },
  { task: "Describe your numeric data", tool: "Statistics Calculator", href: "/statistics-calculator", method: "Mean, median, standard deviation, quartiles", report: "M, SD and range for each variable" },
  { task: "Compare two group means", tool: "t-Test Calculator", href: "/t-test-calculator", method: "Welch, Student, paired or one-sample t-test", report: "t, df, p and Cohen's d" },
  { task: "Compare three or more group means", tool: "One-Way ANOVA Calculator", href: "/one-way-anova-calculator", method: "F test with Tukey HSD post hoc", report: "F, df, p and eta squared" },
  { task: "Test a link between two categories", tool: "Chi-Square Calculator", href: "/chi-square-calculator", method: "Chi-square test of independence", report: "χ², df, p and Cramér's V" },
  { task: "Measure a relationship between two scores", tool: "Correlation Calculator", href: "/correlation-calculator", method: "Pearson, Spearman or Kendall", report: "r or rho, n and p" },
  { task: "Test two factors and their interaction", tool: "Two-Way ANOVA Calculator", href: "/two-way-anova-calculator", method: "Type III F tests", report: "F, df, p and partial eta squared" },
  { task: "Compare three or more time points", tool: "Repeated Measures ANOVA Calculator", href: "/repeated-measures-anova-calculator", method: "F test with Greenhouse-Geisser correction", report: "F, corrected df, p and partial eta squared" },
  { task: "Check the structure of a questionnaire", tool: "Factor Analysis Calculator", href: "/factor-analysis-calculator", method: "Principal axis factoring, varimax", report: "KMO, Bartlett, loadings, % variance" },
  { task: "Compare groups controlling for a pre-test", tool: "ANCOVA Calculator", href: "/ancova-calculator", method: "ANCOVA with adjusted means", report: "F, df, p, adjusted means" },
  { task: "Predict a yes/no outcome", tool: "Logistic Regression Calculator", href: "/logistic-regression-calculator", method: "Maximum-likelihood logistic model", report: "χ², Nagelkerke R², odds ratios" },
  { task: "Report the precision of an estimate", tool: "Confidence Interval Calculator", href: "/confidence-interval-calculator", method: "t interval or Wilson interval", report: "Estimate with 95% CI [low, high]" },
];

const surveyAnalysisSteps = [
  { title: "Work out your sample size", text: "Use Slovin's or Cochran's formula before you collect data, and round up.", href: "/sample-size-calculator" },
  { title: "Check reliability", text: "Run Cronbach's alpha on each scale. Aim for 0.70 or higher.", href: "/cronbach-alpha-calculator" },
  { title: "Summarise each statement", text: "Find the Likert weighted mean and its verbal label for every item.", href: "/likert-scale-calculator" },
  { title: "Describe your variables", text: "Report the mean and standard deviation of each scale score.", href: "/statistics-calculator" },
  { title: "Choose the right test", text: "Match your question and data type to a test with the test chooser.", href: "/statistical-test-chooser" },
  { title: "Run the test and write it up", text: "Report the statistic, degrees of freedom, p value and effect size in APA style.", href: "/guides/how-to-report-t-test-apa" },
];

const statisticsTerms = [
  { term: "Sample size", definition: "The number of people you need to survey so your results represent the whole population within a chosen margin of error." },
  { term: "Margin of error", definition: "How far your sample result may be from the true population value. Thesis surveys often use 5%." },
  { term: "Cronbach's alpha", definition: "A score from 0 to 1 showing how consistently a set of questionnaire items measures the same idea. 0.70 is the usual minimum." },
  { term: "Weighted mean", definition: "The average Likert answer, found by multiplying each scale point by its count and dividing by the number of respondents." },
  { term: "Standard deviation", definition: "How spread out the scores are around the mean. A small value means answers are close together." },
  { term: "p value", definition: "The chance of seeing a result at least this large if there were really no effect. Below .05 is usually called significant." },
  { term: "Effect size", definition: "How big a difference or relationship is, such as Cohen's d or eta squared. It shows practical importance, not only significance." },
];

export default function Home() {
  const featuredTools = featuredToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));
  const featuredGuides = featuredGuideSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is (typeof guides)[number] => Boolean(guide));

  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: "Free Statistics Calculators for Thesis & Survey Research",
        description:
          "Free statistics calculators for your thesis: Slovin sample size, Cronbach's alpha, Likert weighted mean, chi-square, t-tests, ANOVA, and a test chooser.",
        inLanguage: "en",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
        author: { "@id": `${siteUrl}/about#author` },
        dateModified: homepageReviewedDate,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/og/home.png`,
          width: 1200,
          height: 630,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#what-is-solvegrid-summary", "#which-calculator-do-i-need-answer"],
        },
        mainEntity: { "@id": `${siteUrl}/#featured-tools` },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#featured-tools`,
        name: "Featured SolveGrid calculators",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: featuredTools.length,
        itemListElement: featuredTools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: `${siteUrl}/${tool.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        name: "Frequently asked questions about SolveGrid",
        description:
          "Answers about free access, sample size, questionnaire reliability, choosing a statistical test, thesis use and data privacy.",
        mainEntity: homepageFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main id="main-content" className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <ToolHeader />

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            FREE STATISTICS TOOLS FOR STUDENT RESEARCHERS
          </p>

          <h1>
            Statistics calculators for your thesis.
            <span> Every step shown.</span>
          </h1>

          <p className="hero-description">
            Calculate sample size, check questionnaire reliability, interpret
            Likert data, and run t-tests, ANOVA, and correlation, with working
            and write-up sentences you can use in your methods and results chapters.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" href="/sample-size-calculator">
              Calculate sample size <span>→</span>
            </Link>

            <Link className="secondary-button" href="/tools">
              Explore all {tools.length} tools
            </Link>
          </div>

          <div className="hero-points">
            <span>✓ Works instantly</span>
            <span>✓ No sign-up</span>
            <span>✓ Data stays in your browser</span>
          </div>
        </div>

        <nav className="home-research-path" aria-label="Research statistics workflow">
          <p>YOUR RESEARCH WORKFLOW</p>
          {researchPath.map((item) => (
            <Link href={item.href} key={item.href}>
              <span>{item.step}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </div>
              <b>→</b>
            </Link>
          ))}
        </nav>
      </section>

      <nav className="home-task-strip" aria-label="Popular calculator tasks">
        <span>POPULAR TASKS</span>
        <Link href="/sample-size-calculator">Slovin&apos;s formula</Link>
        <Link href="/cronbach-alpha-calculator">Cronbach&apos;s alpha</Link>
        <Link href="/likert-scale-calculator">Likert weighted mean</Link>
        <Link href="/statistical-test-chooser">Which statistical test?</Link>
        <Link href="/statistics-calculator">Standard deviation</Link>
        <Link href="/advanced-statistics">t-test &amp; ANOVA</Link>
      </nav>

      <section className="home-answer-section" id="what-is-solvegrid" aria-labelledby="what-is-solvegrid-heading">
        <div>
          <p className="eyebrow">IN ONE PARAGRAPH</p>
          <h2 id="what-is-solvegrid-heading">What is SolveGrid?</h2>
          <p id="what-is-solvegrid-summary" className="home-lead">
            {homeSummary}
          </p>
        </div>
        <nav className="home-toc" aria-label="On this page">
          <p>ON THIS PAGE</p>
          <ol>
            {tableOfContents.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section className="home-answer-section home-table-section" id="which-calculator-do-i-need" aria-labelledby="which-calculator-heading">
        <div className="section-heading">
          <p className="eyebrow">QUICK COMPARISON</p>
          <h2 id="which-calculator-heading">Which statistics calculator do I need for my thesis?</h2>
          <p id="which-calculator-do-i-need-answer">
            It depends on the research task. Use the sample size calculator before data
            collection, Cronbach&apos;s alpha to test questionnaire reliability, and the
            Likert calculator to summarise answers. Then use a t-test for two groups,
            ANOVA for three or more groups, chi-square for categories, and correlation
            for relationships.
          </p>
        </div>
        <div className="home-table-wrap">
          <table>
            <caption>Thesis statistics tasks and the calculator to use for each</caption>
            <thead>
              <tr>
                <th scope="col">Research task</th>
                <th scope="col">Calculator</th>
                <th scope="col">Method used</th>
                <th scope="col">What you report</th>
              </tr>
            </thead>
            <tbody>
              {calculatorComparison.map((row) => (
                <tr key={row.href}>
                  <th scope="row">{row.task}</th>
                  <td>
                    <Link href={row.href}>{row.tool}</Link>
                  </td>
                  <td>{row.method}</td>
                  <td>{row.report}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="home-answer-section" id="how-to-analyse-survey-data" aria-labelledby="survey-steps-heading">
        <div className="section-heading">
          <p className="eyebrow">STEP BY STEP</p>
          <h2 id="survey-steps-heading">How do you analyse survey data for a thesis?</h2>
          <p>
            Most thesis surveys follow the same six steps: plan the sample, check the
            questionnaire is reliable, summarise each statement, describe the variables,
            choose the right test, and report the result. Each step below links to the
            calculator that does it and shows the working.
          </p>
        </div>
        <figure className="home-figure">
          <img
            src="/images/thesis-statistics-workflow.svg"
            alt="Six-step workflow for thesis survey data: sample size, reliability, Likert means, descriptive statistics, choosing a test, and APA reporting"
            width={1200}
            height={300}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <ol className="home-steps">
          {surveyAnalysisSteps.map((step) => (
            <li key={step.href}>
              <h3 id={`step-${step.href.split("/").pop()}`}>
                <Link href={step.href}>{step.title}</Link>
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <p className="eyebrow">RESEARCH STATISTICS TOOLS</p>
          <h2 id="popular-calculators-heading">Which calculators do students use most?</h2>
          <p>
            Each tool is built for a specific problem and includes links to related
            calculators, formulas, method guides, examples, and important scope notes.
          </p>
        </div>

        <div className="tool-grid tool-grid-expanded">
          {featuredTools.map((tool) => (
            <Link
              className={`tool-card ${
                tool.slug === "sample-size-calculator" ? "featured-card" : ""
              }`}
              href={`/${tool.slug}`}
              key={tool.slug}
            >
              <div className="tool-icon">{tool.icon}</div>
              <h3 id={`tool-${tool.slug}`}>{tool.name}</h3>
              <p>{tool.summary}</p>
              <span>Use {tool.name} →</span>
            </Link>
          ))}
        </div>

        <div className="home-directory-link">
          <Link href="/tools">View all {tools.length} online calculators →</Link>
        </div>
      </section>

      <section className="home-category-section" aria-labelledby="home-categories-heading">
        <div className="section-heading">
          <p className="eyebrow">BROWSE BY SUBJECT</p>
          <h2 id="home-categories-heading">Which calculator collection fits my subject?</h2>
          <p>
            Category hubs explain which tool to use, what each method can solve, and
            which guides can help you verify or understand the result.
          </p>
        </div>
        <div className="home-category-grid">
          {(Object.keys(toolCategories) as ToolCategory[]).map((category) => (
            <Link href={getCategoryPath(category)} key={category}>
              <span>{toolCategories[category].label.toUpperCase()}</span>
              <h3 id={`category-${category}`}>{toolCategories[category].label}</h3>
              <p>{toolCategories[category].intro}</p>
              <b>Browse {toolCategories[category].label} →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div>
          <p className="eyebrow">HOW SOLVEGRID CALCULATES RESULTS</p>
          <h2 id="how-solvegrid-calculates">How does SolveGrid calculate results?</h2>
          <p className="how-answer">
            Every calculator uses a published formula or standard statistical procedure,
            the same one taught in research methods courses. You see the inputs, each step
            of the working and the assumptions, so you can check the result instead of
            trusting a black box.
          </p>
        </div>

        <div className="how-list">
          <div>
            <span>01</span>
            <p>
              Choose a focused calculator built around a formula, numerical method,
              matrix operation, statistical procedure, or unit-conversion relationship.
            </p>
          </div>

          <div>
            <span>02</span>
            <p>
              Enter values, equations, measurements, or data, then review the result
              alongside its inputs, units, assumptions, and method notes.
            </p>
          </div>

          <div>
            <span>03</span>
            <p>
              Use related tools to graph, verify, convert, or explore further. {" "}
              <Link href="/methodology">
                Read our calculation methods and accuracy notes →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section
        className="home-trust-section"
        aria-labelledby="home-trust-heading"
      >
        <header>
          <p className="eyebrow">WORKING TOOLS &amp; DOCUMENTED METHODS</p>
          <h2 id="home-trust-heading">
            Calculate in the browser and understand how the result was produced.
          </h2>
          <p>
            SolveGrid is an independent online calculator platform. Each public
            workspace is connected to method notes, related calculators, or
            practical guides so users can check inputs, units, assumptions, and
            sensible next steps.
          </p>
        </header>
        <div className="home-trust-grid">
          <article>
            <strong>{tools.length}</strong>
            <h3 id="trust-working-calculators">Working online calculators</h3>
            <p>
              Focused tools for research statistics, plus supporting math and
              numerical-methods workspaces.
            </p>
          </article>
          <article>
            <strong>Browser based</strong>
            <h3 id="trust-no-account">No account required</h3>
            <p>
              Current public calculations run directly in the browser and can be
              used without signing up.
            </p>
          </article>
          <article>
            <strong>Reviewed</strong>
            <h3 id="trust-reviewed">
              <time dateTime={homepageReviewedDate}>{homepageReviewedLabel}</time>
            </h3>
            <p>
              Methods, limitations, and important-result guidance are documented
              and updated when clearer explanations or corrections are needed.
            </p>
          </article>
        </div>
        <div className="home-trust-links">
          <Link href="/methodology">Read Methods &amp; Accuracy →</Link>
          <Link href="/about">Learn about SolveGrid →</Link>
          <Link href="/contact">Report a calculation issue →</Link>
        </div>
      </section>

      <section className="home-guide-section" aria-labelledby="home-guides-heading">
        <header>
          <div>
            <p className="eyebrow">FORMULAS &amp; METHOD GUIDES</p>
            <h2 id="home-guides-heading">Where can I learn the formulas behind each result?</h2>
          </div>
          <Link href="/guides">Browse all guides →</Link>
        </header>
        <div className="home-guide-grid">
          {featuredGuides.map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <span>GUIDE</span>
              <h3 id={`guide-${guide.slug}`}>{guide.title}</h3>
              <p>{guide.summary}</p>
              <b>Read {guide.title} →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="research-spotlight">
        <div>
          <p className="eyebrow">RESEARCH &amp; SIMULATION LABS</p>
          <h2 id="research-labs-heading">Numerical modelling deserves a dedicated workspace.</h2>
          <p>
            Explore differential equations, symbolic algebra, optimization, circuit
            analysis, and statistical inference, then connect graphs, matrices, units,
            and descriptive statistics to the investigation.
          </p>
        </div>

        <Link href="/research-tools">Explore research labs →</Link>
      </section>

      <section className="home-answer-section" id="statistics-terms" aria-labelledby="statistics-terms-heading">
        <div className="section-heading">
          <p className="eyebrow">GLOSSARY</p>
          <h2 id="statistics-terms-heading">What do common thesis statistics terms mean?</h2>
          <p>Short, plain-language definitions of the terms you will see in every results chapter.</p>
        </div>
        <dl className="home-terms">
          {statisticsTerms.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="home-faq-section"
        id="frequently-asked-questions"
        aria-labelledby="home-faq-heading"
      >
        <header>
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2 id="home-faq-heading">Frequently asked questions about SolveGrid</h2>
          <p>
            Quick answers about access, calculator choice, supported workflows,
            and how calculation methods are documented.
          </p>
        </header>
        <div>
          {homepageFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="learn-section" id="learn">
        <p className="eyebrow">MADE FOR REAL PROBLEMS</p>
        <h2 id="made-for-real-problems">
          Free statistics calculators for students, supervisors, and
          independent researchers.
        </h2>
        <p>
          SolveGrid provides calculation support, not professional advice. Verify
          high-stakes engineering, medical, financial, legal, safety, academic,
          and research results using suitable standards and qualified review.
        </p>
        <small>
          Homepage last reviewed: <time dateTime={homepageReviewedDate}>{homepageReviewedLabel}</time>
        </small>
      </section>

      <SiteFooter />
    </main>
  );
}
