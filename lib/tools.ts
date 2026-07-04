export type ToolCategory = "math" | "engineering" | "research" | "everyday";

export type ToolInfo = {
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  icon: string;
  title: string;
  description: string;
  summary: string;
  keywords: string[];
  relatedSlugs: string[];
  featured?: boolean;
  priority: number;
  useCases: string[];
  features?: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type ToolSlug = string;

export const toolCategories: Record<
  ToolCategory,
  {
    label: string;
    description: string;
    slug: string;
    intro: string;
  }
> = {
  math: {
    label: "Math & algebra tools",
    description: "Graph functions, solve equations, find roots, calculate statistics, and work with matrices.",
    slug: "math-calculators",
    intro:
      "Free online math calculators for graphing functions, solving algebra, finding polynomial roots, analysing data, and working with matrices.",
  },
  engineering: {
    label: "Scientific & engineering tools",
    description: "Fast calculations for technical study, formulas, units, and numeric work.",
    slug: "engineering-calculators",
    intro:
      "Free scientific and engineering calculators for technical study, unit conversion, formulas, and everyday numeric work.",
  },
  research: {
    label: "Research & simulation labs",
    description: "Numerical modelling, systems analysis, and advanced study workspaces.",
    slug: "research-tools",
    intro:
      "Research-focused online tools for numerical models, differential equations, and carefully labeled simulation workflows.",
  },
  everyday: {
    label: "Everyday calculators",
    description: "Useful percentage, finance, conversion, distance, and adult health-screening tools.",
    slug: "everyday-calculators",
    intro:
      "Free everyday calculators for percentage, profit, interest, loan, discount, conversion, distance, and adult BMI screening tasks.",
  },
};

export const tools: ToolInfo[] = [
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    shortName: "Scientific",
    category: "engineering",
    icon: "√",
    title: "Free Scientific Calculator Online",
    description:
      "Use a free online scientific calculator for trigonometry, roots, logarithms, factorials, combinations, variables, and engineering notation.",
    summary:
      "Calculate trigonometry, roots, logs, combinations, factorials, integer functions, scientific notation, and reusable variables in a compact workspace.",
    keywords: [
      "scientific calculator online",
      "engineering calculator",
      "trigonometry calculator",
      "log calculator",
      "factorial calculator",
      "ncr calculator",
      "gcd calculator",
    ],
    relatedSlugs: ["graphing-calculator", "unit-converter", "matrix-calculator"],
    featured: true,
    priority: 0.95,
    useCases: [
      "Trigonometry, roots, and logarithms",
      "Factorials, combinations, permutations, GCD, and LCM",
      "Powers, engineering notation, variables, and constants",
    ],
    features: [
      "Degrees and radians",
      "Scientific and engineering notation",
      "factorial(), ncr(), npr(), gcd(), lcm()",
      "Variables A, B, C, X, and Y",
    ],
    faqs: [
      {
        question: "Does the scientific calculator work in degrees and radians?",
        answer: "Yes. Use MODE to switch the angle mode before evaluating trigonometric functions.",
      },
      {
        question: "Can I use scientific notation?",
        answer: "Yes. Enter values such as 2.5e3 for 2500.",
      },
    ],
  },
  {
    slug: "graphing-calculator",
    name: "Graphing Calculator",
    shortName: "Graphing",
    category: "math",
    icon: "⌁",
    title: "Free Online Graphing Calculator",
    description:
      "Plot equations online, compare up to eight graphs, inspect tables, trace values, zoom graphs, and explore functions.",
    summary:
      "Plot and compare several functions, inspect value tables, trace x-values, and adjust the graph window directly in your browser.",
    keywords: [
      "online graphing calculator",
      "plot equations online",
      "function graph calculator",
      "graph table calculator",
    ],
    relatedSlugs: ["differential-equation-solver", "equation-solver", "polynomial-solver"],
    featured: true,
    priority: 0.95,
    useCases: ["Plot functions", "Compare curves", "Inspect values and trace points"],
    faqs: [
      {
        question: "Can I graph more than one equation?",
        answer: "Yes. Add up to eight equation lines and compare them in the same graph window.",
      },
      {
        question: "Can I see a table of values?",
        answer: "Yes. Switch to the Table view to inspect calculated x and y values.",
      },
    ],
  },
  {
    slug: "equation-solver",
    name: "Equation Solver",
    shortName: "Equations",
    category: "math",
    icon: "x²",
    title: "Equation Solver – Linear, Quadratic, Cubic & Linear Systems",
    description:
      "Solve linear, quadratic, cubic, and 2–8 variable linear systems online with Gaussian elimination, Gauss-Jordan RREF, matrix inverse, and Cramer's rule.",
    summary:
      "Choose a one-variable polynomial workflow or build a coefficient system with 2–8 variables and a transparent matrix-solving method.",
    keywords: [
      "equation solver",
      "quadratic equation solver",
      "cubic equation solver",
      "simultaneous equations solver",
      "gaussian elimination calculator",
      "gauss jordan calculator",
      "cramers rule calculator",
      "matrix equation solver",
    ],
    relatedSlugs: ["matrix-calculator", "polynomial-solver", "graphing-calculator"],
    featured: true,
    priority: 0.95,
    useCases: [
      "Linear, quadratic, and cubic equations",
      "2–8 variable simultaneous equations",
      "Gaussian, Gauss-Jordan, inverse, and Cramer's methods",
    ],
    features: [
      "Linear equation solver",
      "Quadratic formula and complex roots",
      "Cubic equation roots",
      "Gaussian elimination",
      "Gauss-Jordan RREF",
      "Matrix inverse method",
      "Cramer's rule for 2–4 variables",
    ],
    faqs: [
      {
        question: "Which equation systems can this page solve?",
        answer: "It solves square linear systems from 2 through 8 variables using a coefficient table and a selected matrix method.",
      },
      {
        question: "Where should I solve degree four or higher?",
        answer: "Use the Polynomial Solver for coefficient-based roots from degree 1 through 10.",
      },
    ],
  },
  {
    slug: "polynomial-solver",
    name: "Polynomial Solver",
    shortName: "Polynomials",
    category: "math",
    icon: "f(x)",
    title: "Polynomial Solver Online – Find Roots of Degree 1 to 10",
    description:
      "Find real and complex roots of polynomial equations from degree 1 to 10 using an online coefficient-based polynomial solver.",
    summary:
      "Enter coefficients for a polynomial of degree 1 to 10 and calculate real or complex roots numerically.",
    keywords: [
      "polynomial solver",
      "quartic equation solver",
      "find polynomial roots",
      "complex roots calculator",
    ],
    relatedSlugs: ["equation-solver", "graphing-calculator", "matrix-calculator"],
    priority: 0.9,
    useCases: [
      "Quartic equations",
      "Higher-order polynomial roots",
      "Complex numerical roots",
    ],
    faqs: [
      {
        question: "Does this tool support quartic equations?",
        answer: "Yes. Choose degree 4 and enter coefficients from x⁴ through the constant term.",
      },
      {
        question: "Why can results be complex?",
        answer: "A polynomial can have roots containing i when no corresponding real root exists.",
      },
    ],
  },
  {
    slug: "matrix-calculator",
    name: "Matrix & Vector Calculator",
    shortName: "Matrix",
    category: "math",
    icon: "[ ]",
    title: "Matrix Calculator – RREF, Rank, Inverse, Eigenvalues & Systems",
    description:
      "Use an online 2×2 to 10×10 matrix calculator for determinant, inverse, transpose, REF, RREF, rank, cofactor, adjugate, matrix arithmetic, eigenvalues, and linear systems.",
    summary:
      "Build or paste flexible matrices, then calculate arithmetic, row reduction, inverse, rank, cofactors, adjugate, 2×2 eigenvalues, and A·x = b systems.",
    keywords: [
      "matrix calculator",
      "rref calculator",
      "row echelon form calculator",
      "matrix rank calculator",
      "matrix inverse calculator",
      "matrix multiplication calculator",
      "matrix determinant calculator",
      "cofactor matrix calculator",
      "adjugate matrix calculator",
      "gauss jordan matrix calculator",
    ],
    relatedSlugs: ["equation-solver", "differential-equation-solver", "scientific-calculator"],
    featured: true,
    priority: 0.9,
    useCases: ["2×2 through 10×10 matrices", "REF, RREF, rank, transpose, inverse, and trace", "Matrix products, eigenvalues, and linear systems"],
    features: [
      "Matrix addition and subtraction",
      "Matrix multiplication and scalar multiplication",
      "Determinant, trace, transpose, inverse, rank",
      "REF and Gauss-Jordan RREF",
      "Cofactor matrix and adjugate",
      "2×2 eigenvalues",
      "A·x = b with Gaussian, RREF, inverse, or Cramer's method",
    ],
    faqs: [
      {
        question: "What matrix sizes are supported?",
        answer: "This workspace supports editable matrices from 2×2 through 10×10. Large grids scroll inside their card on mobile screens.",
      },
      {
        question: "Can I solve a linear system with a matrix?",
        answer: "Yes. Enter square matrix A and vector b, then select Auto, Gaussian elimination, Gauss-Jordan RREF, matrix inverse, or Cramer's rule where supported.",
      },
      {
        question: "When does an inverse not exist?",
        answer: "An inverse does not exist when the determinant is zero.",
      },
    ],
  },
  {
    slug: "statistics-calculator",
    name: "Statistics Calculator",
    shortName: "Statistics",
    category: "math",
    icon: "σ",
    title: "Advanced Statistics Calculator – Quartiles, Frequency & Regression",
    description:
      "Calculate descriptive statistics, quartiles, IQR, variance, standard deviation, frequency tables, and linear regression from raw or paired data online.",
    summary:
      "Analyse raw data, frequency pairs, or X/Y pairs using descriptive statistics, quartiles, standard deviation, and linear regression.",
    keywords: [
      "advanced statistics calculator",
      "quartile calculator",
      "frequency table calculator",
      "linear regression calculator",
      "standard deviation calculator",
    ],
    relatedSlugs: ["differential-equation-solver", "graphing-calculator", "matrix-calculator"],
    featured: true,
    priority: 0.9,
    useCases: ["Mean, median, quartiles, and IQR", "Population and sample standard deviation", "Frequency tables and linear regression"],
    faqs: [
      {
        question: "How should I enter data?",
        answer: "Raw data accepts commas, spaces, semicolons, or new lines. Frequency mode accepts pairs such as 12:3, and regression accepts matching X and Y lists.",
      },
      {
        question: "What is the difference between population and sample standard deviation?",
        answer: "Population standard deviation divides by the full number of values. Sample standard deviation uses one fewer degree of freedom.",
      },
    ],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortName: "Units",
    category: "engineering",
    icon: "⇄",
    title: "Advanced Unit Converter – Engineering, Science & Everyday Units",
    description:
      "Convert 17 unit categories including length, force, pressure, energy, power, torque, density, temperature, speed, angles, and data units online.",
    summary:
      "Convert engineering, science, and everyday units through 17 flexible categories, with pre-filled shareable URLs for exact conversions.",
    keywords: [
      "advanced unit converter",
      "engineering unit converter",
      "pressure converter",
      "energy converter",
      "torque converter",
      "density converter",
      "temperature converter",
    ],
    relatedSlugs: ["distance-calculator", "scientific-calculator", "percentage-calculator"],
    featured: true,
    priority: 0.9,
    useCases: ["Force, pressure, energy, power, and torque", "Length, area, volume, density, and temperature", "Speed, time, angles, frequency, and data units"],
    faqs: [
      {
        question: "Which unit categories are included?",
        answer: "Length, area, volume, mass, temperature, time, speed, acceleration, angles, data, force, pressure, energy, power, torque, frequency, and density are included.",
      },
      {
        question: "Does temperature conversion use a different formula?",
        answer: "Yes. Temperature uses formulas rather than simple multiplication because Celsius, Fahrenheit, and Kelvin have different zero points.",
      },
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortName: "Percentage",
    category: "everyday",
    icon: "%",
    title: "Advanced Percentage Calculator – Change, Markup, Margin & Growth",
    description:
      "Calculate percent of a value, percentage change, increase, decrease, reverse percentages, markup, margin, and compound growth online.",
    summary:
      "Choose from ten percentage workflows including change, reverse calculations, selling-price markup, profit margin, and compound growth.",
    keywords: [
      "advanced percentage calculator",
      "percentage increase calculator",
      "reverse percentage calculator",
      "markup calculator",
      "profit margin calculator",
      "compound growth calculator",
    ],
    relatedSlugs: ["profit-loss-calculator", "discount-calculator", "compound-interest-calculator"],
    priority: 0.85,
    useCases: ["Percentage change and reverse percentages", "Markup and profit margin", "Compound growth over multiple periods"],
    faqs: [
      {
        question: "How is percentage change calculated?",
        answer: "It is calculated as (new value − original value) ÷ original value × 100.",
      },
      {
        question: "Can I calculate a discount?",
        answer: "Yes. Use the percentage-of-a-value mode to calculate the discount amount, then subtract it from the original price.",
      },
    ],
  },
  {
    slug: "distance-calculator",
    name: "Distance Calculator",
    shortName: "Distance",
    category: "everyday",
    icon: "↔",
    title: "Distance Calculator – Coordinate & Speed Distance",
    description:
      "Calculate straight-line distance between coordinates, midpoint, or travel distance from speed and time with a free online distance calculator.",
    summary:
      "Find Euclidean distance and midpoint between two points, or calculate travel distance, speed, or time from the other two values.",
    keywords: [
      "distance calculator",
      "distance between two points calculator",
      "speed distance time calculator",
      "midpoint calculator",
    ],
    relatedSlugs: ["unit-converter", "graphing-calculator", "percentage-calculator"],
    priority: 0.85,
    useCases: ["Coordinate distance", "Midpoint calculations", "Speed, distance, and time"],
    faqs: [
      {
        question: "What distance formula is used for coordinates?",
        answer: "The calculator uses √((x₂−x₁)² + (y₂−y₁)²).",
      },
      {
        question: "Can I use it for travel distance?",
        answer: "Yes. Use the speed and time mode to calculate one unknown value from the other two.",
      },
    ],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    shortName: "Age",
    category: "everyday",
    icon: "◷",
    title: "Age Calculator by Date of Birth – Years, Months & Days",
    description:
      "Calculate age from date of birth in years, months, days, total months, total weeks, and total days. Choose today or any reference date.",
    summary:
      "Enter a date of birth and calculate calendar age on today’s date or a selected reference date, with years, months, days, totals, and next-birthday timing.",
    keywords: [
      "age calculator",
      "age calculator by date of birth",
      "calculate age in years months days",
      "date of birth age calculator",
      "age on a specific date calculator",
    ],
    relatedSlugs: ["bmi-calculator", "unit-converter", "percentage-calculator"],
    featured: true,
    priority: 0.88,
    useCases: [
      "Age from date of birth", 
      "Age on a selected date",
      "Years, months, days, weeks, and total days",
    ],
    features: [
      "Date-of-birth age calculation",
      "Today or a custom reference date",
      "Years, months, and days",
      "Total months, weeks, and days",
      "Next birthday timing",
      "Optional shareable pre-filled link",
    ],
    faqs: [
      {
        question: "Can I calculate age on a date other than today?",
        answer: "Yes. Choose any valid reference date in the Calculate age on field.",
      },
      {
        question: "Does the calculator save my date of birth?",
        answer: "No. The calculation runs in your browser. Dates are only placed in a shareable link when you choose Copy link.",
      },
      {
        question: "How are leap-day birthdays handled?",
        answer: "For a February 29 birthday, the next birthday is shown on the last day of February in years without February 29.",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    shortName: "BMI",
    category: "everyday",
    icon: "●",
    title: "BMI Calculator for Adults – Metric & Imperial",
    description:
      "Calculate adult body mass index using metric or imperial measurements, with an age eligibility check for this adult-only screening tool.",
    summary:
      "Use adult height and weight measurements to calculate BMI as a screening measure. An optional age field confirms this adult-only tool is appropriate; it is not a diagnosis.",
    keywords: [
      "BMI calculator",
      "body mass index calculator",
      "BMI metric calculator",
      "BMI imperial calculator",
    ],
    relatedSlugs: ["unit-converter", "percentage-calculator", "distance-calculator"],
    priority: 0.8,
    useCases: ["Metric BMI calculation", "Imperial BMI calculation", "Formula and screening context"],
    faqs: [
      {
        question: "Is BMI a diagnosis?",
        answer: "No. BMI is a screening measure and does not diagnose health conditions or account for every individual factor.",
      },
      {
        question: "Is this BMI tool for children and teens?",
        answer: "No. This page is designed for adults 20 and older. Younger people need age- and sex-specific assessment from a qualified health professional.",
      },
    ],
  },
  {
    slug: "differential-equation-solver",
    name: "Differential Equations Lab",
    shortName: "ODE Lab",
    category: "research",
    icon: "dy/dx",
    title: "Differential Equation Solver – Euler, Heun & RK4",
    description:
      "Solve first-order ordinary differential equations and two-state systems online with Euler, Improved Euler (Heun), and Runge–Kutta 4 numerical methods.",
    summary:
      "Model first-order ODEs and two-state systems with controlled initial conditions, step sizes, solution curves, phase plots, and numerical tables.",
    keywords: [
      "differential equation solver",
      "ordinary differential equation solver",
      "runge kutta calculator",
      "rk4 solver",
      "euler method calculator",
      "heun method calculator",
      "numerical ode solver",
      "phase plot calculator",
    ],
    relatedSlugs: ["optimization-lab", "advanced-statistics", "graphing-calculator"],
    featured: true,
    priority: 0.92,
    useCases: [
      "First-order ordinary differential equations",
      "Two-state numerical systems and phase plots",
      "Euler, Improved Euler, and RK4 comparisons",
    ],
    features: [
      "First-order ODEs: y′ = f(x, y)",
      "Two-state systems: y′ and z′",
      "Euler, Improved Euler (Heun), and RK4",
      "Initial conditions and custom interval controls",
      "Solution graph, phase plot, and numerical table",
      "Up to 10,000 controlled numerical steps",
    ],
    faqs: [
      {
        question: "Which numerical methods are available?",
        answer: "The lab provides Euler, Improved Euler (Heun), and classical Runge–Kutta 4 with a user-selected fixed step size.",
      },
      {
        question: "Are the results exact?",
        answer: "No. The workspace reports numerical approximations. Reduce the step size and compare methods when accuracy matters.",
      },
    ],
  },
  {
    slug: "symbolic-algebra",
    name: "Symbolic Algebra Lab",
    shortName: "Symbolic algebra",
    category: "research",
    icon: "∂",
    title: "Symbolic Algebra Calculator – Simplify, Differentiate & Compare",
    description:
      "Use an online symbolic algebra workspace to simplify expressions, differentiate, evaluate functions, and compare algebraic forms with clear scope notes.",
    summary:
      "Simplify and differentiate expressions, evaluate a model at a chosen value, or compare two forms with a clearly labeled algebra-engine result.",
    keywords: [
      "symbolic algebra calculator",
      "simplify expression calculator",
      "derivative calculator",
      "algebraic equivalence checker",
      "symbolic differentiation online",
    ],
    relatedSlugs: ["equation-solver", "scientific-calculator", "graphing-calculator"],
    featured: true,
    priority: 0.9,
    useCases: [
      "Simplify algebraic expressions",
      "Differentiate with respect to a variable",
      "Evaluate and compare expression forms",
    ],
    features: [
      "Symbolic simplification",
      "Symbolic derivative",
      "Numeric evaluation",
      "Simplifier-based equivalence check",
    ],
    faqs: [
      {
        question: "Is this a formal proof system?",
        answer: "No. It uses algebra-engine simplification and differentiation. A result should not be treated as a formal proof over every possible domain.",
      },
      {
        question: "Which variables can I use?",
        answer: "Use x, y, z, a, b, or c with supported arithmetic and common real-valued functions.",
      },
    ],
  },
  {
    slug: "optimization-lab",
    name: "Optimization Lab",
    shortName: "Optimization",
    category: "research",
    icon: "max",
    title: "Linear Programming Solver – Two Variable Optimization Lab",
    description:
      "Solve two-variable linear programming models online with objective functions, constraints, feasible corner points, and maximize or minimize results.",
    summary:
      "Build a two-variable linear program, inspect feasible corner points, and calculate a maximum or minimum objective value in a transparent browser workspace.",
    keywords: [
      "linear programming solver",
      "two variable linear programming calculator",
      "maximize objective function calculator",
      "minimize linear constraints calculator",
      "graphical method linear programming",
    ],
    relatedSlugs: ["graphing-calculator", "matrix-calculator", "differential-equation-solver"],
    featured: true,
    priority: 0.9,
    useCases: [
      "Two-variable linear programs",
      "Maximize or minimize an objective function",
      "Feasible-region corner point analysis",
    ],
    features: [
      "Up to eight linear constraints",
      "Maximize or minimize objective",
      "Optional non-negative constraints",
      "Feasible corner points and objective values",
    ],
    faqs: [
      {
        question: "Does this solve integer programming?",
        answer: "No. This release solves continuous two-variable linear programs using corner-point evaluation. Integer and binary optimization need a separate solver.",
      },
      {
        question: "Can a linear program be unbounded?",
        answer: "Yes. Check the constraints and feasible region before treating a corner-point result as a complete unboundedness test.",
      },
    ],
  },
  {
    slug: "circuit-analysis",
    name: "DC Circuit Analysis Lab",
    shortName: "Circuit analysis",
    category: "research",
    icon: "Ω",
    title: "DC Circuit Analysis Calculator – Ohm, Nodal, RC & Resistors",
    description:
      "Analyse ideal DC resistor circuits online with Ohm's law, series and parallel resistance, voltage dividers, RC responses, and two-node nodal analysis.",
    summary:
      "Use transparent ideal-circuit calculations for resistors, voltage division, RC transients, and a two-node nodal-analysis model.",
    keywords: [
      "dc circuit analysis calculator",
      "nodal analysis calculator",
      "ohms law calculator",
      "voltage divider calculator",
      "series parallel resistor calculator",
      "rc circuit calculator",
    ],
    relatedSlugs: ["scientific-calculator", "unit-converter", "matrix-calculator"],
    priority: 0.88,
    useCases: [
      "Ohm's law and resistor networks",
      "Voltage divider and RC transient calculations",
      "Two-node DC nodal analysis",
    ],
    features: [
      "Ohm's law and power",
      "Series and parallel resistors",
      "Voltage divider",
      "RC charge and discharge",
      "Two-node nodal-analysis model",
    ],
    faqs: [
      {
        question: "Is this a full SPICE simulator?",
        answer: "No. It is an ideal DC circuit-analysis workspace. Full device models, AC sweeps, and transient SPICE simulations require a dedicated simulation engine.",
      },
      {
        question: "How are current sources defined in nodal analysis?",
        answer: "Positive I1 and I2 values are current injected into their corresponding nodes.",
      },
    ],
  },
  {
    slug: "advanced-statistics",
    name: "Advanced Statistics Lab",
    shortName: "Advanced statistics",
    category: "research",
    icon: "t",
    title: "Advanced Statistics Calculator – t Tests, ANOVA & Correlation",
    description:
      "Run one-sample and Welch t-tests, Pearson correlation, regression, and one-way ANOVA online with p values, assumptions, and transparent outputs.",
    summary:
      "Use an inference-focused statistics workspace for t-tests, correlation, simple regression, and one-way ANOVA with visible assumptions.",
    keywords: [
      "advanced statistics calculator",
      "one sample t test calculator",
      "welch t test calculator",
      "one way anova calculator",
      "pearson correlation calculator",
      "linear regression significance calculator",
    ],
    relatedSlugs: ["statistics-calculator", "graphing-calculator", "differential-equation-solver"],
    featured: true,
    priority: 0.9,
    useCases: [
      "One-sample and Welch t-tests",
      "Pearson correlation and simple regression",
      "One-way ANOVA with assumptions",
    ],
    features: [
      "Two-sided p values",
      "Confidence interval for a sample mean",
      "Welch unequal-variance t-test",
      "Correlation, R², slope, and intercept",
      "One-way ANOVA",
    ],
    faqs: [
      {
        question: "Do p values prove a research conclusion?",
        answer: "No. Statistical outputs depend on assumptions, study design, data quality, and the question being asked.",
      },
      {
        question: "Which ANOVA is included?",
        answer: "This workspace provides a one-way ANOVA for three or more independent groups entered as numeric lists.",
      },
    ],
  },
  {
    slug: "profit-loss-calculator",
    name: "Profit, Loss & Margin Calculator",
    shortName: "Profit & loss",
    category: "everyday",
    icon: "±",
    title: "Profit and Loss Calculator – Margin, Markup & Percentages",
    description: "Calculate profit, loss, markup percentage, and profit margin from cost price and selling price with a free online calculator.",
    summary: "Compare cost and selling price to calculate profit or loss amount, percentage on cost, and selling-price margin.",
    keywords: ["profit and loss calculator", "profit margin calculator", "markup calculator", "cost price selling price calculator"],
    relatedSlugs: ["percentage-calculator", "discount-calculator", "simple-interest-calculator"],
    featured: true,
    priority: 0.88,
    useCases: ["Profit and loss amount", "Markup percentage on cost", "Profit margin on selling price"],
    features: ["Profit calculator", "Loss calculator", "Markup percentage", "Profit margin percentage"],
    faqs: [
      { question: "What is the difference between markup and margin?", answer: "Markup is measured against cost, while margin is measured against selling price." },
      { question: "Can this calculator show a loss percentage?", answer: "Yes. Enter a selling price below cost and the calculator shows the loss amount and percentage of cost." },
    ],
  },
  {
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    shortName: "Simple interest",
    category: "everyday",
    icon: "i",
    title: "Simple Interest Calculator – Principal, Rate & Time",
    description: "Calculate simple interest and total amount from principal, annual interest rate, and time with a free online simple interest calculator.",
    summary: "Use principal, annual rate, and years to calculate simple interest and final amount in a clear result panel.",
    keywords: ["simple interest calculator", "interest calculator", "principal rate time calculator", "simple interest formula"],
    relatedSlugs: ["compound-interest-calculator", "loan-calculator", "percentage-calculator"],
    priority: 0.88,
    useCases: ["Simple interest formula", "Interest earned over time", "Total maturity amount"],
    features: ["Principal, rate, and time inputs", "Interest earned", "Total maturity amount"],
    faqs: [
      { question: "What formula does simple interest use?", answer: "Simple interest equals principal multiplied by annual rate multiplied by time, divided by 100." },
      { question: "When should I use compound interest instead?", answer: "Use compound interest when interest is periodically added to the balance and then earns interest itself." },
    ],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    shortName: "Compound interest",
    category: "everyday",
    icon: "↗",
    title: "Compound Interest Calculator – Growth, Contributions & Frequency",
    description: "Calculate compound interest, future value, interest earned, regular contributions, and annual, monthly, quarterly, weekly, or daily compounding online.",
    summary: "Project compound growth using a starting balance, annual rate, years, frequency, and optional regular contributions.",
    keywords: ["compound interest calculator", "future value calculator", "investment growth calculator", "monthly compounding calculator"],
    relatedSlugs: ["simple-interest-calculator", "loan-calculator", "percentage-calculator"],
    featured: true,
    priority: 0.9,
    useCases: ["Compound interest growth", "Regular contribution projections", "Future value and interest earned"],
    features: ["Annual to daily compounding", "Optional recurring contributions", "Future value, deposits, and interest"],
    faqs: [
      { question: "Can I choose monthly compounding?", answer: "Yes. Choose monthly, quarterly, annual, weekly, bi-weekly, or daily compounding." },
      { question: "How are regular contributions handled?", answer: "The calculator applies an end-of-period contribution using the selected compounding frequency." },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan Payment Calculator",
    shortName: "Loan payment",
    category: "everyday",
    icon: "₤",
    title: "Loan Payment Calculator – Monthly Payment & Total Interest",
    description: "Estimate monthly, bi-weekly, or weekly loan payments, total repaid, and total interest from loan amount, annual rate, and term.",
    summary: "Estimate an amortized payment, total repayment, and interest for a loan using a chosen payment frequency.",
    keywords: ["loan calculator", "monthly payment calculator", "loan interest calculator", "amortization payment calculator"],
    relatedSlugs: ["compound-interest-calculator", "simple-interest-calculator", "percentage-calculator"],
    featured: true,
    priority: 0.9,
    useCases: ["Monthly loan payment", "Total interest estimate", "Weekly and bi-weekly payments"],
    features: ["Amortized periodic payment", "Total repaid", "Total interest", "Monthly, bi-weekly, or weekly frequency"],
    faqs: [
      { question: "Does this include lender fees?", answer: "No. This is an amortized payment estimate and does not include lender-specific fees, insurance, taxes, or rounding rules." },
      { question: "Can I choose a weekly payment frequency?", answer: "Yes. Choose monthly, bi-weekly, or weekly payment frequency." },
    ],
  },
  {
    slug: "discount-calculator",
    name: "Discount & Tax Calculator",
    shortName: "Discount",
    category: "everyday",
    icon: "↓",
    title: "Discount Calculator – Sale Price, Savings & Tax",
    description: "Calculate discount amount, sale price, savings, and tax-adjusted final price from an original price and percentage discount online.",
    summary: "Calculate a discount amount, sale price, optional tax, and final price with a compact discount calculator.",
    keywords: ["discount calculator", "sale price calculator", "discount percentage calculator", "price after tax calculator"],
    relatedSlugs: ["percentage-calculator", "profit-loss-calculator", "loan-calculator"],
    priority: 0.86,
    useCases: ["Discount amount", "Sale price after discount", "Tax-adjusted final price"],
    features: ["Discount percentage", "Sale price", "Tax after discount", "Savings amount"],
    faqs: [
      { question: "Is tax applied before or after the discount?", answer: "This tool applies the discount first, then calculates tax on the discounted sale price." },
      { question: "Can I set tax to zero?", answer: "Yes. Enter zero when no tax needs to be included." },
    ],
  },
];

export function getToolPath(tool: Pick<ToolInfo, "slug"> | string) {
  return typeof tool === "string" ? `/${tool}` : `/${tool.slug}`;
}

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getTool(slug: string): ToolInfo {
  const tool = getToolBySlug(slug);

  if (!tool) {
    throw new Error(
      `SolveGrid tool registry is missing an entry for "${slug}". Add it to lib/tools.ts before publishing the route.`,
    );
  }

  return tool;
}

export function getToolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getCategoryPath(category: ToolCategory) {
  return `/${toolCategories[category].slug}`;
}

export function getRelatedTools(slug: string, limit = 3) {
  const current = getToolBySlug(slug);

  if (!current) {
    return tools.filter((tool) => tool.slug !== slug).slice(0, limit);
  }

  const selected = current.relatedSlugs
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((tool): tool is ToolInfo => Boolean(tool));

  if (selected.length >= limit) {
    return selected.slice(0, limit);
  }

  const fallback = tools.filter(
    (tool) =>
      tool.slug !== current.slug &&
      tool.category === current.category &&
      !selected.some((selectedTool) => selectedTool.slug === tool.slug),
  );

  return [...selected, ...fallback].slice(0, limit);
}

export function getFeaturedTools(limit = 6) {
  return tools.filter((tool) => tool.featured).slice(0, limit);
}
