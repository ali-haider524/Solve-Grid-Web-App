import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import ToolHeader from "../components/ToolHeader";
import { guides } from "../lib/guides";
import { createStaticPageMetadata } from "../lib/seo";
import {
  getCategoryPath,
  getFeaturedTools,
  toolCategories,
  tools,
  type ToolCategory,
} from "../lib/tools";

export const metadata = createStaticPageMetadata(
  "Free Online Math, Engineering & Everyday Calculators",
  "Use free online calculators for graphing, equations, matrices, scientific calculations, unit conversions, statistics, finance, research methods, and everyday problems.",
  "/",
);

const featuredGuideSlugs = [
  "symbolic-algebra-simplification",
  "euler-method-for-differential-equations",
  "choose-a-statistical-test",
  "engineering-notation-and-scientific-notation",
  "gaussian-elimination-for-linear-systems",
  "unit-conversion-formulas",
];

export default function Home() {
  const featuredTools = getFeaturedTools(6);
  const featuredGuides = featuredGuideSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is (typeof guides)[number] => Boolean(guide));

  return (
    <main id="main-content" className="home-page">
      <ToolHeader />

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            FREE ONLINE MATH, ENGINEERING, RESEARCH &amp; EVERYDAY TOOLS
          </p>

          <h1>
            Solve problems.<span> See each step clearly.</span>
          </h1>

          <p className="hero-description">
            Graph equations, solve algebra, calculate polynomial roots, work with
            matrices and statistics, convert units, evaluate scientific expressions,
            explore numerical models, and handle practical percentage, finance, date,
            and distance questions directly in your browser.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" href="/tools">
              Explore all tools <span>→</span>
            </Link>

            <Link className="secondary-button" href="/graphing-calculator">
              Open graphing calculator
            </Link>
          </div>

          <div className="hero-points">
            <span>✓ No installation</span>
            <span>✓ Works on mobile</span>
            <span>✓ Free core tools</span>
          </div>
        </div>

        <div className="hero-preview" aria-label="Calculator preview">
          <div className="preview-topbar">
            <span className="preview-dot dot-one" />
            <span className="preview-dot dot-two" />
            <span className="preview-dot dot-three" />
            <span className="preview-title">SolveGrid workspace</span>
          </div>

          <div className="calculator-screen">
            <span className="screen-label">EXPRESSION</span>
            <p>sqrt(81) + 3²</p>
            <span className="screen-label result-label">RESULT</span>
            <h2>18</h2>
          </div>

          <div className="keypad">
            {[
              "sin",
              "cos",
              "tan",
              "√",
              "7",
              "8",
              "9",
              "÷",
              "4",
              "5",
              "6",
              "×",
              "1",
              "2",
              "3",
              "−",
              "0",
              ".",
              "=",
              "+",
            ].map((key, index) => (
              <span
                className={key === "=" ? "key key-equals" : "key"}
                key={`${key}-${index}`}
              >
                {key}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <p className="eyebrow">CONNECTED TOOL PLATFORM</p>
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
                tool.slug === "graphing-calculator" ? "featured-card" : ""
              }`}
              href={`/${tool.slug}`}
              key={tool.slug}
            >
              <div className="tool-icon">{tool.icon}</div>
              <h3>{tool.name}</h3>
              <p>{tool.summary}</p>
              <span>Open tool →</span>
            </Link>
          ))}
        </div>

        <div className="home-directory-link">
          <Link href="/tools">Browse all {tools.length} free tools →</Link>
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
              <b>Explore category →</b>
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
              <b>Read guide →</b>
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

      <section className="learn-section" id="learn">
        <p className="eyebrow">MADE FOR REAL PROBLEMS</p>
        <h2>
          Clear browser-based tools for students, educators, engineers,
          professionals, and independent learners.
        </h2>
      </section>

      <SiteFooter />
    </main>
  );
}
