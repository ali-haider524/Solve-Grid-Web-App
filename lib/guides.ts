export type GuideTopic =
  | "algebra"
  | "graphing"
  | "engineering"
  | "statistics"
  | "finance"
  | "everyday"
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
    label: "Statistics & data analysis",
    description:
      "Standard deviation, descriptive statistics, statistical tests, correlation, regression, and inference choices.",
  },
  finance: {
    label: "Finance & percentage formulas",
    description:
      "Percent change, markup, margin, interest, loan payments, and practical business calculations.",
  },
  everyday: {
    label: "Everyday calculation guides",
    description:
      "Clear methods for calendar age and other common calculations used outside a specialist workflow.",
  },
  research: {
    label: "Numerical & research methods",
    description:
      "Differential equations, symbolic algebra, optimization, and method-focused research workflows.",
  },
};

export const guides: GuideInfo[] = [
  {
    slug: "percentage-increase-and-decrease",
    title: "Percentage increase and decrease",
    summary: "Find percentage change from an original value to a new value.",
    toolSlugs: ["percentage-calculator", "profit-loss-calculator", "discount-calculator"],
    topic: "finance",
  },
  {
    slug: "profit-margin-vs-markup",
    title: "Profit margin vs markup",
    summary:
      "Compare markup, profit margin, cost price, selling price, and the formulas behind business pricing.",
    toolSlugs: ["profit-loss-calculator", "percentage-calculator"],
    topic: "finance",
  },
  {
    slug: "simple-interest-formula",
    title: "Simple interest formula",
    summary: "Calculate interest from principal, annual rate, and time.",
    toolSlugs: ["simple-interest-calculator", "compound-interest-calculator"],
    topic: "finance",
  },
  {
    slug: "loan-payment-formula",
    title: "Loan payment formula",
    summary: "Understand periodic payments, total repaid, and total interest.",
    toolSlugs: ["loan-calculator", "compound-interest-calculator"],
    topic: "finance",
  },
  {
    slug: "plot-multiple-equations",
    title: "How to plot multiple equations",
    summary: "Compare functions, vertical lines, tables, roots, and intersections.",
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
    slug: "calculate-age-from-date-of-birth",
    title: "Calculate age from a date of birth",
    summary: "Find calendar age in years, months, and days on a chosen date.",
    toolSlugs: ["age-calculator"],
    topic: "everyday",
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
    toolSlugs: ["statistics-calculator"],
    topic: "statistics",
  },
  {
    slug: "engineering-notation-and-scientific-notation",
    title: "Engineering notation and scientific notation",
    summary:
      "Compare scientific notation, engineering notation, powers of ten, and SI prefixes for technical values.",
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
    toolSlugs: ["advanced-statistics", "statistics-calculator"],
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
  "profit-loss-calculator": [
    "profit-margin-vs-markup",
    "percentage-increase-and-decrease",
  ],
  "percentage-calculator": [
    "percentage-increase-and-decrease",
    "profit-margin-vs-markup",
  ],
  "simple-interest-calculator": ["simple-interest-formula", "loan-payment-formula"],
  "compound-interest-calculator": ["simple-interest-formula", "loan-payment-formula"],
  "loan-calculator": ["loan-payment-formula", "simple-interest-formula"],
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
  ],
  "advanced-statistics": [
    "choose-a-statistical-test",
    "standard-deviation-formula",
  ],
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
  "age-calculator": ["calculate-age-from-date-of-birth"],
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
