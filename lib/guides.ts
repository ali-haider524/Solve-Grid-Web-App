export type GuideInfo = {
  slug: string;
  title: string;
  summary: string;
  toolSlugs: string[];
};

export const guides: GuideInfo[] = [
  {
    slug: "percentage-increase-and-decrease",
    title: "Percentage increase and decrease",
    summary: "Find percentage change from an original value to a new value.",
    toolSlugs: ["percentage-calculator", "profit-loss-calculator", "discount-calculator"],
  },
  {
    slug: "profit-margin-vs-markup",
    title: "Profit margin vs markup",
    summary:
      "Compare markup, profit margin, cost price, selling price, and the formulas behind business pricing.",
    toolSlugs: ["profit-loss-calculator", "percentage-calculator"],
  },
  {
    slug: "simple-interest-formula",
    title: "Simple interest formula",
    summary: "Calculate interest from principal, annual rate, and time.",
    toolSlugs: ["simple-interest-calculator", "compound-interest-calculator"],
  },
  {
    slug: "loan-payment-formula",
    title: "Loan payment formula",
    summary: "Understand periodic payments, total repaid, and total interest.",
    toolSlugs: ["loan-calculator", "compound-interest-calculator"],
  },
  {
    slug: "plot-multiple-equations",
    title: "How to plot multiple equations",
    summary: "Compare functions, vertical lines, tables, roots, and intersections.",
    toolSlugs: ["graphing-calculator", "equation-solver"],
  },
  {
    slug: "polynomial-roots-and-complex-roots",
    title: "Polynomial roots and complex roots",
    summary:
      "Find polynomial roots from coefficients and understand real roots, complex roots, and residual checks.",
    toolSlugs: ["polynomial-solver", "graphing-calculator", "equation-solver"],
  },
  {
    slug: "ti-84-style-graphing-workflows",
    title: "TI-84 style online problem-solving guide",
    summary:
      "Use independent online tools for scientific calculations, graphs, tables, equations, polynomial roots, matrices, statistics, and unit conversion.",
    toolSlugs: [
      "scientific-calculator",
      "graphing-calculator",
      "equation-solver",
      "polynomial-solver",
      "matrix-calculator",
      "statistics-calculator",
      "unit-converter",
    ],
  },
  {
    slug: "calculate-age-from-date-of-birth",
    title: "Calculate age from a date of birth",
    summary: "Find calendar age in years, months, and days on a chosen date.",
    toolSlugs: ["age-calculator"],
  },
  {
    slug: "gaussian-elimination-for-linear-systems",
    title: "Gaussian elimination for linear systems",
    summary:
      "Use row operations, pivots, REF, and back-substitution to solve systems with several unknown values.",
    toolSlugs: ["equation-solver", "matrix-calculator"],
  },
  {
    slug: "matrix-inverse-and-determinant",
    title: "Matrix inverse and determinant",
    summary:
      "Understand determinants, singular matrices, inverse conditions, and inverse-based system solutions.",
    toolSlugs: ["matrix-calculator", "equation-solver"],
  },
  {
    slug: "matrix-methods-for-linear-systems",
    title: "Matrix methods for linear systems",
    summary:
      "Compare Gaussian elimination, RREF, inverse, rank, and Cramer’s rule for linear systems.",
    toolSlugs: ["matrix-calculator", "equation-solver"],
  },
  {
    slug: "standard-deviation-formula",
    title: "Standard deviation formula",
    summary:
      "Compare sample and population standard deviation, variance, mean deviations, quartiles, and spread.",
    toolSlugs: ["statistics-calculator"],
  },
  {
    slug: "engineering-notation-and-scientific-notation",
    title: "Engineering notation and scientific notation",
    summary:
      "Compare scientific notation, engineering notation, powers of ten, and SI prefixes for technical values.",
    toolSlugs: ["scientific-calculator", "unit-converter"],
  },
  {
    slug: "euler-method-for-differential-equations",
    title: "Euler method for differential equations",
    summary:
      "Use a fixed step and local slope to estimate a first-order initial value problem.",
    toolSlugs: ["differential-equation-solver"],
  },
  {
    slug: "runge-kutta-rk4-method",
    title: "Runge-Kutta RK4 method",
    summary: "Understand four-slope RK4 updates for numerical ordinary differential equations.",
    toolSlugs: ["differential-equation-solver"],
  },
  {
    slug: "symbolic-algebra-simplification",
    title: "Symbolic algebra simplification and differentiation",
    summary:
      "Understand what a symbolic algebra engine can simplify, differentiate, and compare.",
    toolSlugs: ["symbolic-algebra", "scientific-calculator", "equation-solver"],
  },
  {
    slug: "graphical-linear-programming-method",
    title: "Graphical method for two-variable linear programming",
    summary:
      "Build constraints, identify feasible corner points, and test an objective function.",
    toolSlugs: ["optimization-lab", "graphing-calculator", "matrix-calculator"],
  },
  {
    slug: "two-node-nodal-analysis",
    title: "Two-node nodal analysis",
    summary:
      "Set up KCL equations, conductance terms, coefficient matrices, node voltages, and branch currents for a two-node resistor circuit.",
    toolSlugs: ["circuit-analysis", "matrix-calculator", "scientific-calculator"],
  },
  {
    slug: "choose-a-statistical-test",
    title: "How to choose a statistical test",
    summary:
      "Separate descriptive statistics, t-tests, correlation, and one-way ANOVA by the question and data type.",
    toolSlugs: ["advanced-statistics", "statistics-calculator"],
  },
];

export const guideSlugs = guides.map((guide) => guide.slug);

const preferredGuideSlugsByTool: Record<string, string[]> = {
  "profit-loss-calculator": [
    "profit-margin-vs-markup",
    "percentage-increase-and-decrease",
  ],
  "scientific-calculator": [
    "engineering-notation-and-scientific-notation",
    "ti-84-style-graphing-workflows",
  ],
  "matrix-calculator": [
    "matrix-inverse-and-determinant",
    "gaussian-elimination-for-linear-systems",
    "matrix-methods-for-linear-systems",
  ],
  "equation-solver": [
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
  "circuit-analysis": [
    "two-node-nodal-analysis",
    "matrix-methods-for-linear-systems",
  ],
};

export function getGuidesForTool(toolSlug: string, limit = 2) {
  const preferredSlugs = preferredGuideSlugsByTool[toolSlug] ?? [];

  const preferredGuides = preferredSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is GuideInfo => Boolean(guide));

  const fallbackGuides = guides.filter(
    (guide) =>
      guide.toolSlugs.includes(toolSlug) &&
      !preferredGuides.some((preferred) => preferred.slug === guide.slug),
  );

  return [...preferredGuides, ...fallbackGuides].slice(0, limit);
}
