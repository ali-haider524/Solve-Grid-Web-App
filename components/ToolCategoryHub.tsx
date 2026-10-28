import Link from "next/link";
import { getGuidesForTools } from "../lib/guides";
import { siteName, siteUrl } from "../lib/site";
import {
  getCategoryPath,
  getToolBySlug,
  getToolsByCategory,
  toolCategories,
  type ToolCategory,
} from "../lib/tools";
import SiteFooter from "./SiteFooter";
import ToolHeader from "./ToolHeader";
import styles from "./ToolCategoryHub.module.css";

type ToolCategoryHubProps = { category: ToolCategory };

type CategoryEditorial = {
  eyebrow: string;
  heading: string;
  lead: string;
  overviewTitle: string;
  overview: string[];
  topics: Array<{ title: string; text: string; links: string[] }>;
  workflow: Array<{ title: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

const categoryEditorial: Record<ToolCategory, CategoryEditorial> = {
  math: {
    eyebrow: "FREE ONLINE MATH CALCULATORS",
    heading: "Math calculators for equations, graphs, matrices, roots, and data.",
    lead:
      "Choose a focused online math calculator for algebra, graphing, polynomial roots, matrices, descriptive statistics, and step-by-step equation workflows.",
    overviewTitle: "Find the math method that matches the question.",
    overview: [
      "SolveGrid separates graphing, equation solving, polynomial roots, matrices, and statistics into dedicated workspaces. This keeps each input clear and helps you choose between an exact algebraic method, a numerical estimate, or a visual graph.",
      "Use the Graphing Calculator when shape, intercepts, intersections, or a table of values matter. Use Equation Solver for linear, quadratic, cubic, and simultaneous equations. Use Polynomial Solver for coefficient-based roots up to degree 10, and Matrix Calculator for RREF, rank, determinants, inverses, and A·x = b systems.",
    ],
    topics: [
      {
        title: "Equations and polynomial roots",
        text: "Solve linear, quadratic, cubic, and higher-degree polynomial problems from coefficients. Compare real and complex roots, discriminants, residuals, and system-solving methods.",
        links: ["equation-solver", "polynomial-solver"],
      },
      {
        title: "Graphs, tables, and intersections",
        text: "Plot several functions, inspect values in a table, trace a chosen x-coordinate, and estimate roots or intersections inside the current graph window.",
        links: ["graphing-calculator"],
      },
      {
        title: "Matrices and statistics",
        text: "Reduce matrices to REF or RREF, calculate rank and determinants, solve linear systems, or analyse raw and grouped data with standard deviation and regression tools.",
        links: ["matrix-calculator", "statistics-calculator"],
      },
    ],
    workflow: [
      {
        title: "Start with the form of the problem",
        text: "A function written as y = f(x) usually belongs in the graphing workspace. A coefficient equation belongs in Equation Solver or Polynomial Solver. A table of observations belongs in Statistics Calculator.",
      },
      {
        title: "Choose exact or numerical output",
        text: "Quadratic and matrix methods can provide structured algebraic results, while graph intersections and higher-degree polynomial roots are often numerical approximations. The tool page states the method and scope.",
      },
      {
        title: "Check the answer another way",
        text: "Graph a solved equation, substitute a root back into the polynomial, or verify a system with matrix methods. Related-tool links make these checks easier to reach.",
      },
    ],
    faqs: [
      {
        question: "Which online math calculator should I use?",
        answer:
          "Use Graphing Calculator for curves and tables, Equation Solver for linear through cubic equations and systems, Polynomial Solver for degree 1–10 roots, Matrix Calculator for linear algebra, and Statistics Calculator for data analysis.",
      },
      {
        question: "Can SolveGrid show steps or methods?",
        answer:
          "Many tools show intermediate calculations, method notes, formulas, assumptions, or row-reduction information. The connected guides explain the underlying workflow in more detail.",
      },
      {
        question: "Are graph roots and intersections exact?",
        answer:
          "Graph-based roots and intersections are numerical estimates within the selected graph window. Use a dedicated equation or polynomial solver when you need coefficient-based values.",
      },
    ],
  },
  engineering: {
    eyebrow: "SCIENTIFIC & ENGINEERING CALCULATORS",
    heading: "Engineering calculators for scientific work, units, and technical formulas.",
    lead:
      "Use browser-based scientific and engineering tools for trigonometry, logarithms, powers, scientific notation, engineering notation, physical-unit conversion, and technical calculations.",
    overviewTitle: "Keep values, notation, and units consistent.",
    overview: [
      "Engineering calculations often combine a numerical expression with a unit conversion. SolveGrid keeps these tasks connected: use Scientific Calculator for powers, roots, logarithms, trigonometry, constants, and engineering notation, then use Unit Converter for pressure, force, energy, power, torque, density, temperature, speed, frequency, and other unit families.",
      "For circuit calculations, the DC Circuit Analysis Lab adds Ohm’s law, resistor networks, voltage dividers, RC transients, and two-node nodal analysis. Matrix and graphing tools remain one click away when a technical problem needs a coefficient system or visual check.",
    ],
    topics: [
      {
        title: "Scientific and engineering notation",
        text: "Evaluate expressions with trigonometric functions, logarithms, roots, powers, constants, variables, and normal, scientific, or engineering result formats.",
        links: ["scientific-calculator"],
      },
      {
        title: "Physical-unit conversion",
        text: "Convert metric, imperial, SI, and technical units across length, area, volume, mass, pressure, force, energy, power, torque, density, temperature, and more.",
        links: ["unit-converter"],
      },
      {
        title: "Circuit and technical analysis",
        text: "Calculate ideal DC resistor relationships, voltage dividers, RC responses, and a focused two-node nodal-analysis model with visible assumptions.",
        links: ["circuit-analysis"],
      },
    ],
    workflow: [
      {
        title: "Write every value with its unit",
        text: "Before calculating, identify the measurement unit and convert incompatible values into a common system. This prevents hidden factor-of-1000 and temperature-offset errors.",
      },
      {
        title: "Select degree or radian mode",
        text: "Trigonometric results depend on angle mode. Choose degrees for degree-based questions and radians for calculus, physics, or engineering formulas written in radians.",
      },
      {
        title: "Use engineering notation for scale",
        text: "Engineering notation uses exponents that are multiples of three, which aligns naturally with SI prefixes such as milli, micro, kilo, and mega.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a scientific calculator and a unit converter?",
        answer:
          "A scientific calculator evaluates numerical expressions and functions. A unit converter changes a measured value from one compatible unit to another. Many engineering problems require both steps.",
      },
      {
        question: "Does the unit converter support engineering units?",
        answer:
          "Yes. It includes pressure, force, energy, power, torque, density, frequency, speed, acceleration, temperature, and other engineering and everyday unit families.",
      },
      {
        question: "What is engineering notation?",
        answer:
          "Engineering notation writes powers of ten with exponents divisible by three. It is useful when working with SI prefixes and very large or very small technical values.",
      },
    ],
  },
  statistics: {
    eyebrow: "RESEARCH STATISTICS CALCULATORS",
    heading: "Statistics calculators for theses, dissertations, and survey research.",
    lead:
      "Plan your sample, check questionnaire reliability, summarise Likert responses, and run common hypothesis tests, with every step shown so you can explain it in your methods and results chapters.",
    overviewTitle: "Follow the order a research project actually needs.",
    overview: [
      "Most student research follows the same path: decide how many respondents you need, confirm that the questionnaire is reliable, describe the responses, and then test the research hypotheses. SolveGrid keeps each step in a focused calculator so inputs and outputs stay easy to check.",
      "Start with the Sample Size Calculator (Slovin, Yamane, or Cochran). After data collection, use the Cronbach's Alpha Calculator for reliability and the Likert Scale Calculator for weighted means and verbal interpretation. Use the Statistics Calculator for descriptive statistics and the Advanced Statistics Lab for t-tests, ANOVA, and correlation.",
    ],
    topics: [
      {
        title: "Before data collection",
        text: "Compute the minimum sample with Slovin's formula or Cochran's formula with finite population correction, and adjust for expected non-response.",
        links: ["sample-size-calculator"],
      },
      {
        title: "Questionnaire reliability and Likert data",
        text: "Check internal consistency with Cronbach's alpha, find weak or reverse-coded items, and convert response counts into weighted means and interpretations.",
        links: ["cronbach-alpha-calculator", "cohens-kappa-calculator", "intraclass-correlation-calculator", "likert-scale-calculator"],
      },
      {
        title: "Describe and test your data",
        text: "Calculate mean, standard deviation, quartiles, and frequency tables, then run t-tests, one-way ANOVA, and Pearson correlation with stated assumptions.",
        links: ["statistical-test-chooser", "t-test-calculator", "one-way-anova-calculator", "correlation-calculator", "linear-regression-calculator", "chi-square-calculator", "mann-whitney-u-test-calculator", "wilcoxon-signed-rank-test-calculator", "kruskal-wallis-test-calculator", "shapiro-wilk-test-calculator", "effect-size-calculator", "sobel-test-calculator", "statistics-calculator", "advanced-statistics"],
      },
    ],
    workflow: [
      {
        title: "Fix the sampling plan first",
        text: "Record the population size, margin of error, and confidence level you used. Reviewers ask for these, and changing them after data collection weakens the study.",
      },
      {
        title: "Check reliability before interpreting scales",
        text: "A composite score only makes sense if its items hang together. Report Cronbach's alpha for each subscale and reverse-code negatively worded items first.",
      },
      {
        title: "Match the test to the question and data type",
        text: "Comparing two group means calls for a t-test, three or more groups for ANOVA, and a relationship between two numeric variables for correlation. Check the assumptions each test states.",
      },
    ],
    faqs: [
      {
        question: "Which sample size formula should I use for my thesis?",
        answer:
          "Slovin's (Yamane) formula is common when the population size is known and only the margin of error is set. Cochran's formula is more defensible when you need to state the confidence level or expected proportion.",
      },
      {
        question: "Do these calculators replace SPSS?",
        answer:
          "They cover the most common thesis calculations and show their working, but they do not replace a full statistics package for complex models. Check important results with your adviser or a statistician.",
      },
      {
        question: "Is my data uploaded anywhere?",
        answer:
          "No. All calculations run in your browser and nothing you paste is sent to a server.",
      },
    ],
  },
  research: {
    eyebrow: "RESEARCH & SIMULATION LABS",
    heading: "Numerical and research tools with visible methods and scope.",
    lead:
      "Explore differential equations, symbolic algebra, optimization, circuit analysis, and statistical inference in focused workspaces.",
    overviewTitle: "Choose a numerical or symbolic method deliberately.",
    overview: [
      "Research calculations need clear assumptions, controlled inputs, and a stated numerical method. SolveGrid separates each lab so the method and limitations stay visible.",
      "Use the dedicated research hub to compare differential-equation methods, symbolic operations, linear programming, circuit analysis, and statistical inference.",
    ],
    topics: [
      {
        title: "Numerical differential equations",
        text: "Compare Euler, Improved Euler, and RK4 approximations for first-order equations and small systems.",
        links: ["differential-equation-solver"],
      },
      {
        title: "Symbolic and optimization workflows",
        text: "Simplify or differentiate supported expressions, or solve continuous two-variable linear programming models.",
        links: ["symbolic-algebra", "optimization-lab"],
      },
      {
        title: "Inference and circuit models",
        text: "Use focused statistical tests or ideal DC circuit models with clearly labelled assumptions.",
        links: ["advanced-statistics", "circuit-analysis"],
      },
    ],
    workflow: [
      {
        title: "State assumptions",
        text: "Record the model, units, initial conditions, step size, or statistical conditions before interpreting a result.",
      },
      {
        title: "Compare methods",
        text: "Numerical results should be checked with a smaller step size, another method, a graph, or an independent calculation when accuracy matters.",
      },
      {
        title: "Interpret within scope",
        text: "A browser calculation supports exploration and learning, but it does not replace domain review, formal proof, or specialist software for high-stakes work.",
      },
    ],
    faqs: [
      {
        question: "Are research-lab results exact?",
        answer:
          "Some algebraic operations are symbolic, while differential equations and many models are numerical approximations. Each lab explains its method and limitations.",
      },
      {
        question: "Can I compare numerical methods?",
        answer:
          "The differential-equation lab includes Euler, Improved Euler, and RK4 so you can compare fixed-step approximations.",
      },
      {
        question: "Are these tools a replacement for specialist research software?",
        answer:
          "No. They are focused educational and exploratory workspaces. Validate important results with appropriate theory, data checks, and specialist software.",
      },
    ],
  },
};

export default function ToolCategoryHub({ category }: ToolCategoryHubProps) {
  const categoryInfo = toolCategories[category];
  const editorial = categoryEditorial[category];
  const categoryTools = getToolsByCategory(category);
  const guideLinks = getGuidesForTools(
    categoryTools.map((tool) => tool.slug),
    6,
  );
  const categoryUrl = `${siteUrl}${getCategoryPath(category)}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: editorial.heading,
        description: editorial.lead,
        url: categoryUrl,
        inLanguage: "en",
        publisher: { "@type": "Organization", name: siteName, url: siteUrl },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: categoryTools.length,
          itemListElement: categoryTools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.name,
            url: `${siteUrl}/${tool.slug}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: editorial.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryInfo.label,
            item: categoryUrl,
          },
        ],
      },
    ],
  };

  return (
    <main id="main-content" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ToolHeader active={category} />

      <section className={styles.hero}>
        <p>{editorial.eyebrow}</p>
        <h1>{editorial.heading}</h1>
        <span>{editorial.lead}</span>
        <div className={styles.heroActions}>
          <a href="#calculators">Browse calculators</a>
          <a href="#guides">Read related guides</a>
        </div>
      </section>

      <section className={styles.content}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/tools">Tools</Link>
          <span>›</span>
          <span aria-current="page">{categoryInfo.label}</span>
        </nav>

        <section className={styles.overviewCard}>
          <div>
            <p>HOW TO USE THIS COLLECTION</p>
            <h2>{editorial.overviewTitle}</h2>
          </div>
          <div>
            {editorial.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="calculators" className={styles.calculatorSection}>
          <header className={styles.sectionHeader}>
            <div>
              <p>AVAILABLE CALCULATORS</p>
              <h2>Choose a focused tool for the task.</h2>
            </div>
            <span>{categoryInfo.description}</span>
          </header>

          <div className={styles.grid}>
            {categoryTools.map((tool) => (
              <Link className={styles.card} href={`/${tool.slug}`} key={tool.slug}>
                <span className={styles.icon}>{tool.icon}</span>
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.summary}</p>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.topicSection}>
          <header className={styles.sectionHeader}>
            <div>
              <p>COMMON WORKFLOWS</p>
              <h2>What you can calculate in this section</h2>
            </div>
            <span>
              These topic summaries use natural problem language and connect directly
              to the most relevant calculators.
            </span>
          </header>
          <div className={styles.topicGrid}>
            {editorial.topics.map((topic) => (
              <article key={topic.title}>
                <h3>{topic.title}</h3>
                <p>{topic.text}</p>
                <div>
                  {topic.links.map((slug) => {
                    const tool = getToolBySlug(slug);
                    if (!tool) return null;
                    return (
                      <Link href={`/${tool.slug}`} key={tool.slug}>
                        {tool.shortName} →
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workflowSection}>
          <div>
            <p>CHOOSE THE RIGHT METHOD</p>
            <h2>A practical three-step workflow</h2>
          </div>
          <div className={styles.workflowGrid}>
            {editorial.workflow.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        {guideLinks.length ? (
          <section className={styles.guideSection} id="guides">
            <header className={styles.sectionHeader}>
              <div>
                <p>LEARN THE FORMULA OR METHOD</p>
                <h2>Related SolveGrid guides</h2>
              </div>
              <Link href="/guides">Browse all guides →</Link>
            </header>
            <div className={styles.guideGrid}>
              {guideLinks.map((guide) => (
                <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                  <span>GUIDE</span>
                  <strong>{guide.title}</strong>
                  <small>{guide.summary}</small>
                  <b>Read →</b>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.faqSection}>
          <div>
            <p>COMMON QUESTIONS</p>
            <h2>Using {categoryInfo.label.toLowerCase()}</h2>
          </div>
          <div>
            {editorial.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.otherCategories}>
          <p>EXPLORE MORE</p>
          <div>
            {(Object.keys(toolCategories) as ToolCategory[])
              .filter((key) => key !== category)
              .map((key) => (
                <Link href={getCategoryPath(key)} key={key}>
                  {toolCategories[key].label} →
                </Link>
              ))}
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
