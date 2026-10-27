import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import ToolHeader from "../components/ToolHeader";
import { guides } from "../lib/guides";
import { createStaticPageMetadata } from "../lib/seo";
import { siteName, siteUrl } from "../lib/site";
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

const homepageReviewedDate = "2026-07-30";

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
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
        },
        dateModified: homepageReviewedDate,
        mainEntity: { "@id": `${siteUrl}/#featured-tools` },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#featured-tools`,
        name: "Featured SolveGrid calculators",
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

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <p className="eyebrow">RESEARCH STATISTICS TOOLS</p>
          <h2>Choose the right calculator, then move naturally to the next step.</h2>
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
              <h3>{tool.name}</h3>
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
          <h2 id="home-categories-heading">Start with a calculator collection.</h2>
          <p>
            Category hubs explain which tool to use, what each method can solve, and
            which guides can help you verify or understand the result.
          </p>
        </div>
        <div className="home-category-grid">
          {(Object.keys(toolCategories) as ToolCategory[]).map((category) => (
            <Link href={getCategoryPath(category)} key={category}>
              <span>{toolCategories[category].label.toUpperCase()}</span>
              <h3>{toolCategories[category].label}</h3>
              <p>{toolCategories[category].intro}</p>
              <b>Browse {toolCategories[category].label} →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div>
          <p className="eyebrow">HOW SOLVEGRID CALCULATES RESULTS</p>
          <h2>Clear calculation methods, not black-box answers.</h2>
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
            <h3>Working online calculators</h3>
            <p>
              Focused tools for research statistics, plus supporting math and
              numerical-methods workspaces.
            </p>
          </article>
          <article>
            <strong>Browser based</strong>
            <h3>No account required</h3>
            <p>
              Current public calculations run directly in the browser and can be
              used without signing up.
            </p>
          </article>
          <article>
            <strong>Reviewed</strong>
            <h3>30 July 2026</h3>
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
            <h2 id="home-guides-heading">Understand the workflow behind the answer.</h2>
          </div>
          <Link href="/guides">Browse all guides →</Link>
        </header>
        <div className="home-guide-grid">
          {featuredGuides.map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <span>GUIDE</span>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <b>Read {guide.title} →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="research-spotlight">
        <div>
          <p className="eyebrow">RESEARCH &amp; SIMULATION LABS</p>
          <h2>Numerical modelling deserves a dedicated workspace.</h2>
          <p>
            Explore differential equations, symbolic algebra, optimization, circuit
            analysis, and statistical inference, then connect graphs, matrices, units,
            and descriptive statistics to the investigation.
          </p>
        </div>

        <Link href="/research-tools">Explore research labs →</Link>
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
        <h2>
          Free statistics calculators for students, supervisors, and
          independent researchers.
        </h2>
        <p>
          SolveGrid provides calculation support, not professional advice. Verify
          high-stakes engineering, medical, financial, legal, safety, academic,
          and research results using suitable standards and qualified review.
        </p>
        <small>Homepage last reviewed: 30 July 2026</small>
      </section>

      <SiteFooter />
    </main>
  );
}
