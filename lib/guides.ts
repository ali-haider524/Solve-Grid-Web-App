export type GuideTopic =
  | "algebra"
  | "graphing"
  | "engineering"
  | "statistics"
  | "research";

export type GuideInfo = {
  slug: string;
  title: string;
  summary: string;
  toolSlugs: string[];
  topic: GuideTopic;
};

export const guideTopics: Record<
  GuideTopic,
  { label: string; description: string }
> = {
  algebra: {
    label: "Algebra & linear systems",
    description:
      "Equation solving, polynomial roots, matrices, row reduction, determinants, rank, and systems of equations.",
  },
  graphing: {
    label: "Graphing & calculator workflows",
    description:
      "Plot functions, inspect tables, trace values, and connect graphing with equation-solving tools.",
  },
  engineering: {
    label: "Engineering methods & units",
    description:
      "Scientific notation, engineering notation, unit conversion, circuit analysis, and technical calculation workflows.",
  },
  statistics: {
    label: "Research statistics & data analysis",
    description:
      "Standard deviation, descriptive statistics, statistical tests, correlation, regression, and inference choices.",
  },
  research: {
    label: "Numerical & research methods",
    description:
      "Differential equations, symbolic algebra, optimization, and method-focused research workflows.",
  },
};

export const guides: GuideInfo[] = [
  {
    slug: "plot-multiple-equations",
    title: "Plot one, two, or multiple equations",
    summary:
      "Plot equations online, compare multiple functions, inspect tables, understand overlapping graphs, and estimate roots or intersections.",
    toolSlugs: ["graphing-calculator", "equation-solver"],
    topic: "graphing",
  },
  {
    slug: "linear-quadratic-cubic-equation-solver",
    title: "Linear, quadratic, cubic, and system equations",
    summary:
      "Choose the right equation-solving method for one-variable equations and simultaneous linear systems.",
    toolSlugs: ["equation-solver", "polynomial-solver", "graphing-calculator", "matrix-calculator"],
    topic: "algebra",
  },
  {
    slug: "polynomial-roots-and-complex-roots",
    title: "Polynomial roots and complex roots",
    summary:
      "Find polynomial roots from coefficients and understand real roots, complex roots, and residual checks.",
    toolSlugs: ["polynomial-solver", "graphing-calculator", "equation-solver"],
    topic: "algebra",
  },
  {
    slug: "ti-84-style-graphing-workflows",
    title: "TI-84 style online calculator workflows",
    summary:
      "Use independent online workflows for graphing equations, tables, trace values, roots, intersections, scientific calculations, matrices, statistics, and unit conversion.",
    toolSlugs: [
      "graphing-calculator",
      "scientific-calculator",
      "equation-solver",
      "polynomial-solver",
      "matrix-calculator",
      "statistics-calculator",
      "unit-converter",
    ],
    topic: "graphing",
  },
  {
    slug: "gaussian-elimination-for-linear-systems",
    title: "Gaussian elimination for linear systems",
    summary:
      "Use row operations, pivots, REF, and back-substitution to solve systems with several unknown values.",
    toolSlugs: ["equation-solver", "matrix-calculator"],
    topic: "algebra",
  },
  {
    slug: "matrix-inverse-and-determinant",
    title: "Matrix inverse and determinant",
    summary:
      "Understand determinants, singular matrices, inverse conditions, and inverse-based system solutions.",
    toolSlugs: ["matrix-calculator", "equation-solver"],
    topic: "algebra",
  },
  {
    slug: "matrix-methods-for-linear-systems",
    title: "Matrix methods for linear systems",
    summary:
      "Compare Gaussian elimination, RREF, inverse, rank, and Cramer’s rule for linear systems.",
    toolSlugs: ["matrix-calculator", "equation-solver"],
    topic: "algebra",
  },
  {
    slug: "standard-deviation-formula",
    title: "Standard deviation formula",
    summary:
      "Compare sample and population standard deviation, variance, mean deviations, quartiles, and spread.",
    toolSlugs: ["statistics-calculator", "shapiro-wilk-test-calculator", "effect-size-calculator"],
    topic: "statistics",
  },
  {
    slug: "engineering-notation-and-scientific-notation",
    title: "Engineering notation vs scientific notation",
    summary:
      "Compare SCI and ENG notation, SI prefix powers, micro and nano values, and technical powers-of-ten conversions.",
    toolSlugs: ["scientific-calculator", "unit-converter"],
    topic: "engineering",
  },
  {
    slug: "unit-conversion-formulas",
    title: "Unit conversion formulas",
    summary:
      "Convert units with base-unit formulas, metric prefixes, temperature formulas, speed, pressure, energy, torque, density, and data examples.",
    toolSlugs: ["unit-converter", "scientific-calculator"],
    topic: "engineering",
  },
  {
    slug: "engineering-unit-conversion",
    title: "Engineering unit conversion",
    summary:
      "Understand engineering conversions for pressure, force, torque, energy, power, density, frequency, and scientific notation values.",
    toolSlugs: ["unit-converter", "scientific-calculator", "circuit-analysis"],
    topic: "engineering",
  },
  {
    slug: "euler-method-for-differential-equations",
    title: "Euler method for differential equations",
    summary:
      "Use a fixed step and local slope to estimate a first-order initial value problem.",
    toolSlugs: ["differential-equation-solver"],
    topic: "research",
  },
  {
    slug: "runge-kutta-rk4-method",
    title: "Runge-Kutta RK4 method",
    summary: "Understand four-slope RK4 updates for numerical ordinary differential equations.",
    toolSlugs: ["differential-equation-solver"],
    topic: "research",
  },
  {
    slug: "symbolic-algebra-simplification",
    title: "Symbolic algebra simplification and differentiation",
    summary:
      "Understand what a symbolic algebra engine can simplify, differentiate, and compare.",
    toolSlugs: ["symbolic-algebra", "scientific-calculator", "equation-solver"],
    topic: "research",
  },
  {
    slug: "graphical-linear-programming-method",
    title: "Graphical method for two-variable linear programming",
    summary:
      "Build constraints, identify feasible corner points, and test an objective function.",
    toolSlugs: ["optimization-lab", "graphing-calculator", "matrix-calculator"],
    topic: "research",
  },
  {
    slug: "two-node-nodal-analysis",
    title: "Two-node nodal analysis",
    summary:
      "Set up KCL equations, conductance terms, coefficient matrices, node voltages, and branch currents for a two-node resistor circuit.",
    toolSlugs: ["circuit-analysis", "matrix-calculator", "scientific-calculator"],
    topic: "engineering",
  },
  {
    slug: "choose-a-statistical-test",
    title: "How to choose a statistical test",
    summary:
      "Separate descriptive statistics, t-tests, correlation, and one-way ANOVA by the question and data type.",
    toolSlugs: ["statistical-test-chooser", "advanced-statistics", "statistics-calculator"],
    topic: "statistics",
  },
  {
    slug: "slovin-formula-sample-size",
    title: "Slovin's formula for sample size (with examples)",
    summary:
      "Use n = N ÷ (1 + N·e²) to find a thesis sample size, compare it with Cochran's formula, and write it up correctly.",
    toolSlugs: ["sample-size-calculator"],
    topic: "statistics",
  },
  {
    slug: "likert-scale-interpretation",
    title: "Likert scale interpretation: weighted mean ranges",
    summary:
      "Build the 4-, 5-, and 7-point mean range tables, interpret weighted means, and report Likert results in a thesis.",
    toolSlugs: ["likert-scale-calculator", "cronbach-alpha-calculator"],
    topic: "statistics",
  },
  {
    slug: "how-to-report-anova-apa",
    title: "How to report ANOVA results in APA style",
    summary:
      "Copy-ready APA templates for one-way, Welch, repeated-measures, and two-way ANOVA with effect sizes and post hoc tests.",
    toolSlugs: ["one-way-anova-calculator", "effect-size-calculator", "statistical-test-chooser"],
    topic: "statistics",
  },
  {
    slug: "how-to-report-t-test-apa",
    title: "How to report a t-test in APA style",
    summary:
      "APA templates for independent, Welch, paired, and one-sample t-tests, plus their non-parametric alternatives.",
    toolSlugs: ["t-test-calculator", "effect-size-calculator", "mann-whitney-u-test-calculator"],
    topic: "statistics",
  },
  {
    slug: "how-to-report-chi-square-apa",
    title: "How to report chi-square results in APA style",
    summary:
      "APA templates for chi-square tests of independence and goodness of fit, with N, Cramér's V, and Fisher's exact test.",
    toolSlugs: ["chi-square-calculator", "statistical-test-chooser"],
    topic: "statistics",
  },
  {
    slug: "how-to-report-regression-apa",
    title: "How to report regression results in APA style",
    summary:
      "APA templates for simple and multiple regression: F, R², adjusted R², B, β, t, p, and CIs, with a coefficients table layout.",
    toolSlugs: ["linear-regression-calculator", "correlation-calculator", "sobel-test-calculator"],
    topic: "statistics",
  },
  {
    slug: "how-to-report-correlation-apa",
    title: "How to report a correlation in APA style",
    summary:
      "APA templates for Pearson r, Spearman rho, and Kendall tau with df, p, 95% CI, and a correlation matrix layout.",
    toolSlugs: ["correlation-calculator", "linear-regression-calculator"],
    topic: "statistics",
  },
];

export const guideSlugs = guides.map((guide) => guide.slug);

const preferredGuideSlugsByTool: Record<string, string[]> = {
  "graphing-calculator": [
    "ti-84-style-graphing-workflows",
    "plot-multiple-equations",
    "polynomial-roots-and-complex-roots",
  ],
  "scientific-calculator": [
    "engineering-notation-and-scientific-notation",
    "ti-84-style-graphing-workflows",
    "unit-conversion-formulas",
  ],
  "unit-converter": [
    "unit-conversion-formulas",
    "engineering-unit-conversion",
    "engineering-notation-and-scientific-notation",
    "ti-84-style-graphing-workflows",
  ],
  "matrix-calculator": [
    "matrix-inverse-and-determinant",
    "gaussian-elimination-for-linear-systems",
    "matrix-methods-for-linear-systems",
  ],
  "equation-solver": [
    "linear-quadratic-cubic-equation-solver",
    "gaussian-elimination-for-linear-systems",
    "matrix-methods-for-linear-systems",
    "matrix-inverse-and-determinant",
  ],
  "polynomial-solver": [
    "polynomial-roots-and-complex-roots",
    "plot-multiple-equations",
  ],
  "statistics-calculator": [
    "standard-deviation-formula",
    "choose-a-statistical-test",
    "likert-scale-interpretation",
  ],
  "advanced-statistics": [
    "choose-a-statistical-test",
    "how-to-report-t-test-apa",
    "how-to-report-anova-apa",
  ],
  "statistical-test-chooser": ["choose-a-statistical-test", "likert-scale-interpretation"],
  "chi-square-calculator": ["how-to-report-chi-square-apa", "choose-a-statistical-test"],
  "mann-whitney-u-test-calculator": ["choose-a-statistical-test", "how-to-report-t-test-apa"],
  "shapiro-wilk-test-calculator": ["choose-a-statistical-test", "how-to-report-t-test-apa"],
  "cohens-kappa-calculator": ["choose-a-statistical-test", "likert-scale-interpretation"],
  "wilcoxon-signed-rank-test-calculator": ["choose-a-statistical-test", "how-to-report-t-test-apa"],
  "power-analysis-calculator": ["slovin-formula-sample-size", "choose-a-statistical-test"],
  "friedman-test-calculator": ["choose-a-statistical-test", "how-to-report-anova-apa"],
  "mcnemar-test-calculator": ["how-to-report-chi-square-apa", "choose-a-statistical-test"],
  "kruskal-wallis-test-calculator": ["choose-a-statistical-test", "how-to-report-anova-apa"],
  "intraclass-correlation-calculator": ["choose-a-statistical-test", "likert-scale-interpretation"],
  "linear-regression-calculator": ["how-to-report-regression-apa", "how-to-report-correlation-apa", "choose-a-statistical-test"],
  "correlation-calculator": ["how-to-report-correlation-apa", "how-to-report-regression-apa", "choose-a-statistical-test"],
  "one-way-anova-calculator": ["how-to-report-anova-apa", "choose-a-statistical-test"],
  "t-test-calculator": ["how-to-report-t-test-apa", "choose-a-statistical-test"],
  "sobel-test-calculator": ["how-to-report-regression-apa", "choose-a-statistical-test"],
  "effect-size-calculator": ["how-to-report-t-test-apa", "how-to-report-anova-apa", "choose-a-statistical-test"],
  "sample-size-calculator": ["slovin-formula-sample-size", "choose-a-statistical-test"],
  "cronbach-alpha-calculator": ["likert-scale-interpretation", "choose-a-statistical-test"],
  "likert-scale-calculator": ["likert-scale-interpretation", "choose-a-statistical-test"],
  "differential-equation-solver": [
    "euler-method-for-differential-equations",
    "runge-kutta-rk4-method",
  ],
  "symbolic-algebra": [
    "symbolic-algebra-simplification",
    "linear-quadratic-cubic-equation-solver",
  ],
  "optimization-lab": [
    "graphical-linear-programming-method",
    "plot-multiple-equations",
  ],
  "circuit-analysis": [
    "two-node-nodal-analysis",
    "engineering-unit-conversion",
    "matrix-methods-for-linear-systems",
  ],
};

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuidesByTopic(topic: GuideTopic) {
  return guides.filter((guide) => guide.topic === topic);
}

export function getGuidesForTool(toolSlug: string, limit = 3) {
  const preferredSlugs = preferredGuideSlugsByTool[toolSlug] ?? [];

  const preferredGuides = preferredSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((guide): guide is GuideInfo => Boolean(guide));

  const fallbackGuides = guides.filter(
    (guide) =>
      guide.toolSlugs.includes(toolSlug) &&
      !preferredGuides.some((preferred) => preferred.slug === guide.slug),
  );

  return [...preferredGuides, ...fallbackGuides].slice(0, limit);
}

export function getGuidesForTools(toolSlugs: string[], limit = 6) {
  const toolSet = new Set(toolSlugs);

  return guides
    .map((guide) => ({
      guide,
      score: guide.toolSlugs.reduce(
        (total, toolSlug) => total + (toolSet.has(toolSlug) ? 1 : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .map((item) => item.guide)
    .slice(0, limit);
}

export function getRelatedGuides(slug: string, limit = 3) {
  const current = getGuideBySlug(slug);

  if (!current) return guides.slice(0, limit);

  const currentTools = new Set(current.toolSlugs);

  return guides
    .filter((guide) => guide.slug !== current.slug)
    .map((guide) => {
      const sharedTools = guide.toolSlugs.reduce(
        (total, toolSlug) => total + (currentTools.has(toolSlug) ? 1 : 0),
        0,
      );
      const sameTopic = guide.topic === current.topic ? 2 : 0;
      return { guide, score: sharedTools * 3 + sameTopic };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .map((item) => item.guide)
    .slice(0, limit);
}
