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
    description:
      "Graph functions, solve equations, find roots, calculate statistics, and work with matrices.",
    slug: "math-calculators",
    intro:
      "Free online math calculators for graphing functions, solving algebra, finding polynomial roots, analysing data, and working with matrices.",
  },
  engineering: {
    label: "Scientific & engineering tools",
    description:
      "Fast calculations for technical study, formulas, units, and numeric work.",
    slug: "engineering-calculators",
    intro:
      "Free scientific and engineering calculators for technical study, unit conversion, formulas, and everyday numeric work.",
  },
  research: {
    label: "Research & simulation labs",
    description:
      "Numerical modelling, systems analysis, and advanced study workspaces.",
    slug: "research-tools",
    intro:
      "Research-focused online tools for numerical models, differential equations, and carefully labeled simulation workflows.",
  },
  everyday: {
    label: "Everyday calculators",
    description:
      "Useful percentage, finance, conversion, distance, and adult health-screening tools.",
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
    title:
      "Scientific & Engineering Calculator Online – ENG Notation, Trig, Logs & Constants",
    description:
      "Use a free scientific and engineering calculator online for trigonometry, logarithms, roots, powers, factorials, combinations, constants, scientific notation, and engineering notation.",
    summary:
      "Evaluate trigonometry, roots, logarithms, powers, combinations, factorials, integer functions, reusable variables, constants, and normal, scientific, or engineering notation in one focused browser calculator.",
    keywords: [
      "scientific calculator online",
      "engineering calculator",
      "engineering calculator online",
      "engineer calculator",
      "engineering notation calculator",
      "calculator with engineering notation",
      "engineer notation",
      "scientific notation calculator",
      "scientific notation vs engineering notation",
      "trigonometry calculator",
      "log calculator",
      "factorial calculator",
      "ncr calculator",
      "gcd calculator",
      "combination calculator",
      "gcd lcm calculator",
    ],
    relatedSlugs: [
      "unit-converter",
      "graphing-calculator",
      "matrix-calculator",
    ],
    featured: true,
    priority: 0.95,
    useCases: [
      "Engineering calculator work with scientific notation, engineering notation, SI-prefix sized values, and constants",
      "Trigonometry, roots, powers, logarithms, and inverse trigonometric functions",
      "Factorials, combinations, permutations, GCD, LCM, variables, Ans recall, and history",
    ],
    features: [
      "Normal, scientific, and engineering result formats",
      "Degrees and radians for trigonometric calculations",
      "Scientific notation input such as 2.5e3 and small engineering values such as 47e-6",
      "factorial(), ncr(), npr(), gcd(), and lcm() input support",
      "Variables A, B, C, X, and Y with Ans recall",
      "Engineering constants including π, e, gravity, light speed, and Planck constant",
      "History for recent completed expressions",
    ],
    faqs: [
      {
        question: "Is this an engineering calculator online?",
        answer:
          "Yes. It supports technical numeric work including powers, roots, logarithms, trigonometry, constants, variables, scientific notation, and engineering notation. Use Unit Converter when a problem requires unit conversion.",
      },
      {
        question: "What is engineering notation?",
        answer:
          "Engineering notation is a powers-of-ten format where the exponent is a multiple of three. For example, 12500 can be shown as 12.5e3 instead of 1.25e4.",
      },
      {
        question: "Can I use scientific notation and engineering notation?",
        answer:
          "Yes. Enter scientific notation such as 2.5e3 for 2500. Open MODE and choose NORM, SCI, or ENG to change the result format.",
      },
      {
        question: "Does the scientific calculator work in degrees and radians?",
        answer:
          "Yes. Open MODE and choose DEG or RAD before evaluating trigonometric functions. For example, sin(30) equals 0.5 when the calculator is set to degrees.",
      },
      {
        question: "Which functions can I type directly?",
        answer:
          "Use supported expressions such as sin(), cos(), tan(), asin(), acos(), atan(), sqrt(), log(), ln(), abs(), fact(), ncr(), npr(), gcd(), and lcm(), along with brackets, powers, and arithmetic operators.",
      },
      {
        question: "When should I use another SolveGrid tool?",
        answer:
          "Use Graphing Calculator for visual functions and tables, Matrix Calculator for linear algebra, and Unit Converter when a problem requires conversion between physical units.",
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
      "Use a free online graphing calculator to plot up to eight equations, compare functions, inspect value tables, trace points, estimate roots and intersections, and adjust the graph window.",
    summary:
      "Plot and compare several functions, inspect tables and trace values, estimate x-intercepts and intersections, and adjust the graph window directly in your browser.",
    keywords: [
      "online graphing calculator",
      "plot equations online",
      "function graph calculator",
      "graph table calculator",
      "graph multiple equations",
      "graphing calculator with table",
      "graph intersections calculator",
      "x intercept calculator",
      "online function plotter",
    ],
    relatedSlugs: [
      "differential-equation-solver",
      "equation-solver",
      "polynomial-solver",
    ],
    featured: true,
    priority: 0.95,
    useCases: [
      "Plot and compare up to eight functions or vertical lines",
      "Inspect value tables and trace a chosen x-coordinate",
      "Estimate roots and intersections in the current graph window",
      "Explore trigonometric functions in degrees or radians",
    ],
    features: [
      "Up to eight equation lines and vertical lines",
      "Graph, table, trace, and analysis views",
      "Approximate x-intercepts and function intersections",
      "Zoom controls and custom x/y window settings",
      "Degrees and radians for trigonometric functions",
    ],
    faqs: [
      {
        question: "Can I graph more than one equation?",
        answer:
          "Yes. Add up to eight equation lines and compare them in the same graph window. Enter functions such as y = 2x + 1 or y = x^2 − 4, and use x = 3 for a vertical line.",
      },
      {
        question: "Can I see a table of values?",
        answer:
          "Yes. Switch to Table view to inspect calculated x and y values around the current trace position for every visible valid function.",
      },
      {
        question: "Can the graphing calculator find roots and intersections?",
        answer:
          "Yes. Open Analysis to see approximate x-intercepts and crossing points for visible functions inside the current graph window. Results are numerical estimates, so use an algebra tool when an exact answer is required.",
      },
      {
        question: "Does this graphing calculator support degrees and radians?",
        answer:
          "Yes. Use the Angle mode control before graphing trigonometric functions. Choose degrees for degree-based questions and radians for radian-based questions.",
      },
      {
        question: "Which expressions can I graph?",
        answer:
          "The workspace supports arithmetic with x, powers, parentheses, sin, cos, tan, inverse trigonometric functions, square roots, logs, natural logs, absolute value, and exponential functions. Unsupported syntax is marked in the equation list.",
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
    relatedSlugs: [
      "matrix-calculator",
      "polynomial-solver",
      "graphing-calculator",
    ],
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
        answer:
          "It solves square linear systems from 2 through 8 variables using a coefficient table and a selected matrix method.",
      },
      {
        question: "Where should I solve degree four or higher?",
        answer:
          "Use the Polynomial Solver for coefficient-based roots from degree 1 through 10.",
      },
    ],
  },
  {
    slug: "polynomial-solver",
    name: "Polynomial Solver",
    shortName: "Polynomials",
    category: "math",
    icon: "f(x)",
    title: "Polynomial Roots Calculator – Solve Degree 1 to 10 Polynomials",
    description:
      "Use an online polynomial roots calculator to solve degree 1 to 10 equations from coefficients and find real or complex roots with numerical residual checks.",
    summary:
      "Enter polynomial coefficients from the highest power to the constant term, then calculate real and complex roots numerically with residual checks for degree 1 through 10 equations.",
    keywords: [
      "polynomial roots calculator",
      "roots calculator polynomial",
      "polynomial solver",
      "find polynomial roots",
      "root of polynomial calculator",
      "degree 10 polynomial solver",
      "quartic equation solver",
      "cubic equation solver",
      "complex roots calculator",
      "polynomial equation solver",
      "coefficient polynomial solver",
    ],
    relatedSlugs: [
      "equation-solver",
      "graphing-calculator",
      "matrix-calculator",
    ],
    priority: 0.9,
    useCases: [
      "Polynomial roots from coefficients",
      "Quadratic, cubic, quartic, and higher-degree equations",
      "Real and complex numerical roots with residual checks",
    ],
    features: [
      "Degree 1 through 10 polynomial input",
      "Coefficient fields ordered from highest power to constant term",
      "Real roots and complex roots in a + bi format",
      "Residual value for each calculated root",
      "Quick samples for quadratic, cubic, quartic, and degree 5 polynomials",
      "Helpful explanations for coefficient order, real roots, and complex roots",
    ],
    faqs: [
      {
        question: "How do I enter a polynomial?",
        answer:
          "Choose the degree, then enter coefficients from the highest power down to the constant term. For x² − 5x + 6, enter 1, −5, and 6.",
      },
      {
        question: "Does this calculator find complex roots?",
        answer:
          "Yes. If a polynomial has non-real roots, they are shown in a + bi form. Complex roots are common when the real graph does not cross the x-axis for every root.",
      },
      {
        question: "What does the residual mean?",
        answer:
          "The residual is the size of f(root). A very small residual means the calculated root is close to making the polynomial equal zero.",
      },
      {
        question: "Can I solve quartic and higher-degree equations?",
        answer:
          "Yes. The workspace supports degree 1 through 10. For degree 4 and above it uses numerical root-finding instead of long symbolic formulas.",
      },
      {
        question: "When should I use the Graphing Calculator instead?",
        answer:
          "Use Graphing Calculator when you want to see the curve, x-intercepts, turning behavior, and approximate visual roots. Use Polynomial Solver when you have coefficients and need root values.",
      },
    ],
  },
  {
    slug: "matrix-calculator",
    name: "Matrix & Vector Calculator",
    shortName: "Matrix",
    category: "math",
    icon: "[ ]",
    title: "Matrix Calculator – RREF, Rank With Steps, Row Space & Systems",
    description:
      "Use an online 2×2 to 10×10 matrix calculator and matrix reducer for REF, RREF, matrix rank with steps, row space checks, inverse, determinant, arithmetic, eigenvalues, and linear systems.",
    summary:
      "Build or paste 2×2 through 10×10 matrices, then calculate arithmetic, row reduction, RREF, matrix rank, row-space clues, inverse, determinants, cofactors, adjugates, 2×2 eigenvalues, and A·x = b systems.",
    keywords: [
      "matrix calculator",
      "matrix reducer calculator",
      "matrix reduction calculator",
      "matrix rank calculator with steps",
      "matrix rank calculator",
      "row space calculator",
      "rref calculator",
      "rref calculator with steps",
      "row echelon form calculator",
      "zeilenstufenform rechner",
      "matrix inverse calculator",
      "matrix multiplication calculator",
      "matrix determinant calculator",
      "cofactor matrix calculator",
      "adjugate matrix calculator",
      "gauss jordan matrix calculator",
    ],
    relatedSlugs: [
      "equation-solver",
      "differential-equation-solver",
      "scientific-calculator",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "2×2 through 10×10 matrix calculations",
      "REF, RREF, matrix rank with steps, pivot columns, row space, transpose, determinant, trace, and inverse",
      "Matrix arithmetic, 2×2 eigenvalues, and A·x = b linear systems",
    ],
    features: [
      "Matrix addition, subtraction, multiplication, and scalar multiplication",
      "REF, Gauss-Jordan RREF, pivot columns, row echelon form, and matrix rank",
      "Rank and row-space guidance from the reduced matrix",
      "Determinant, trace, transpose, inverse, cofactor matrix, and adjugate",
      "2×2 eigenvalues and square linear systems",
      "Fractions, scientific notation, and spreadsheet paste input",
    ],
    faqs: [
      {
        question: "What matrix sizes are supported?",
        answer:
          "This workspace supports editable matrices from 2×2 through 10×10. Large grids scroll inside their card on mobile screens.",
      },
      {
        question: "What is a matrix reducer calculator?",
        answer:
          "A matrix reducer calculator uses row operations to put a matrix into REF or RREF. This workspace provides both forms and calculates rank from the pivot columns in RREF.",
      },
      {
        question: "Can I use it as a matrix rank calculator with steps?",
        answer:
          "Yes. Choose RREF(A) to see the reduced matrix, then choose rank(A) to count the pivot columns. The worked example on the page shows how row operations remove dependent rows before the final rank is read.",
      },
      {
        question: "Does the calculator help with row space?",
        answer:
          "Yes. REF and RREF help you identify independent rows and pivot structure, which are used when reasoning about row space. The page explains how non-zero reduced rows relate to rank; a formal row-space basis output can be added later.",
      },
      {
        question: "What is the difference between REF and RREF?",
        answer:
          "REF uses forward elimination to create pivots with zeros below them. RREF continues until each pivot is 1 and every other entry in a pivot column is zero.",
      },
      {
        question: "What does Zeilenstufenform mean?",
        answer:
          "Zeilenstufenform is the German term commonly used for row echelon form. In this calculator, REF(A) is the row echelon form workflow, while RREF(A) is the fully reduced Gauss-Jordan form.",
      },
      {
        question: "Can I calculate matrix rank?",
        answer:
          "Yes. Choose rank(A) to count the independent pivot columns after row reduction. A repeated or dependent row does not increase the rank.",
      },
      {
        question: "Can I solve a linear system with a matrix?",
        answer:
          "Yes. Enter square matrix A and vector b, then select Auto, Gaussian elimination, Gauss-Jordan RREF, matrix inverse, or Cramer’s rule where supported.",
      },
      {
        question: "When does an inverse not exist?",
        answer:
          "An inverse does not exist when a square matrix has determinant zero. In that case, the rows or columns are linearly dependent, so use RREF and rank to inspect the system.",
      },
    ],
  },
  {
    slug: "statistics-calculator",
    name: "Statistics Calculator",
    shortName: "Statistics",
    category: "math",
    icon: "σ",
    title:
      "Statistics Calculator – Standard Deviation, Variance, Quartiles & Regression",
    description:
      "Calculate sample or population standard deviation, variance, mean, median, mode, quartiles, IQR, frequency tables, grouped data estimates, correlation, and linear regression online.",
    summary:
      "Analyse raw data, frequency tables, grouped intervals, or paired X/Y values using descriptive statistics, sample and population standard deviation, variance, quartiles, IQR, outlier checks, and regression results.",
    keywords: [
      "statistics calculator",
      "standard deviation calculator",
      "sample standard deviation formula",
      "formula for sample standard deviation",
      "population standard deviation calculator",
      "variance calculator",
      "mean median mode calculator",
      "quartile calculator",
      "iqr calculator",
      "frequency table calculator",
      "grouped data standard deviation calculator",
      "linear regression calculator",
      "correlation calculator",
      "r squared calculator",
      "outlier calculator",
    ],
    relatedSlugs: [
      "graphing-calculator",
      "percentage-calculator",
      "matrix-calculator",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "Calculate sample or population standard deviation and variance from raw values",
      "Find mean, median, mode, range, quartiles, IQR, percentiles, and outliers",
      "Use frequency tables, grouped class intervals, and paired X/Y regression data",
    ],
    features: [
      "Raw data, frequency table, grouped data, and paired X/Y input modes",
      "Sample and population standard deviation options",
      "Variance, mean, median, mode, range, quartiles, IQR, percentile, CV, skewness, and outlier count",
      "Linear regression slope, intercept, correlation r, R², covariance, and prediction",
      "Distribution bars for entered values",
      "Selectable result metrics to keep the output focused",
    ],
    faqs: [
      {
        question: "What is the formula for sample standard deviation?",
        answer:
          "Sample standard deviation is s = √(Σ(x − x̄)² ÷ (n − 1)). Use it when the entered values are a sample from a larger population.",
      },
      {
        question: "When should I use population standard deviation?",
        answer:
          "Use population standard deviation when your data contains every value in the population being studied. It divides by n instead of n − 1.",
      },
      {
        question: "Can this statistics calculator use frequency tables?",
        answer:
          "Yes. Choose discrete frequency for exact repeated values, or grouped data when you have class intervals and frequencies.",
      },
      {
        question: "Does it calculate quartiles and IQR?",
        answer:
          "Yes. The calculator reports Q1, Q3, IQR, percentiles, and an outlier count based on the 1.5 × IQR fence rule.",
      },
      {
        question: "Can I calculate linear regression?",
        answer:
          "Yes. Use paired X/Y mode to calculate slope, intercept, correlation r, R², covariance, and an optional predicted y-value.",
      },
      {
        question: "Are grouped data results exact?",
        answer:
          "Grouped data results are estimates because each class interval is represented by its midpoint. Use raw data when exact values are available.",
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
    relatedSlugs: [
      "distance-calculator",
      "scientific-calculator",
      "percentage-calculator",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "Force, pressure, energy, power, and torque",
      "Length, area, volume, density, and temperature",
      "Speed, time, angles, frequency, and data units",
    ],
    faqs: [
      {
        question: "Which unit categories are included?",
        answer:
          "Length, area, volume, mass, temperature, time, speed, acceleration, angles, data, force, pressure, energy, power, torque, frequency, and density are included.",
      },
      {
        question: "Does temperature conversion use a different formula?",
        answer:
          "Yes. Temperature uses formulas rather than simple multiplication because Celsius, Fahrenheit, and Kelvin have different zero points.",
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
    relatedSlugs: [
      "profit-loss-calculator",
      "discount-calculator",
      "compound-interest-calculator",
    ],
    priority: 0.85,
    useCases: [
      "Percentage change and reverse percentages",
      "Markup and profit margin",
      "Compound growth over multiple periods",
    ],
    faqs: [
      {
        question: "How is percentage change calculated?",
        answer:
          "It is calculated as (new value − original value) ÷ original value × 100.",
      },
      {
        question: "Can I calculate a discount?",
        answer:
          "Yes. Use the percentage-of-a-value mode to calculate the discount amount, then subtract it from the original price.",
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
    relatedSlugs: [
      "unit-converter",
      "graphing-calculator",
      "percentage-calculator",
    ],
    priority: 0.85,
    useCases: [
      "Coordinate distance",
      "Midpoint calculations",
      "Speed, distance, and time",
    ],
    faqs: [
      {
        question: "What distance formula is used for coordinates?",
        answer: "The calculator uses √((x₂−x₁)² + (y₂−y₁)²).",
      },
      {
        question: "Can I use it for travel distance?",
        answer:
          "Yes. Use the speed and time mode to calculate one unknown value from the other two.",
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
        answer:
          "Yes. Choose any valid reference date in the Calculate age on field.",
      },
      {
        question: "Does the calculator save my date of birth?",
        answer:
          "No. The calculation runs in your browser. Dates are only placed in a shareable link when you choose Copy link.",
      },
      {
        question: "How are leap-day birthdays handled?",
        answer:
          "For a February 29 birthday, the next birthday is shown on the last day of February in years without February 29.",
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
    relatedSlugs: [
      "unit-converter",
      "percentage-calculator",
      "distance-calculator",
    ],
    priority: 0.8,
    useCases: [
      "Metric BMI calculation",
      "Imperial BMI calculation",
      "Formula and screening context",
    ],
    faqs: [
      {
        question: "Is BMI a diagnosis?",
        answer:
          "No. BMI is a screening measure and does not diagnose health conditions or account for every individual factor.",
      },
      {
        question: "Is this BMI tool for children and teens?",
        answer:
          "No. This page is designed for adults 20 and older. Younger people need age- and sex-specific assessment from a qualified health professional.",
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
    relatedSlugs: [
      "optimization-lab",
      "advanced-statistics",
      "graphing-calculator",
    ],
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
        answer:
          "The lab provides Euler, Improved Euler (Heun), and classical Runge–Kutta 4 with a user-selected fixed step size.",
      },
      {
        question: "Are the results exact?",
        answer:
          "No. The workspace reports numerical approximations. Reduce the step size and compare methods when accuracy matters.",
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
    relatedSlugs: [
      "equation-solver",
      "scientific-calculator",
      "graphing-calculator",
    ],
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
        answer:
          "No. It uses algebra-engine simplification and differentiation. A result should not be treated as a formal proof over every possible domain.",
      },
      {
        question: "Which variables can I use?",
        answer:
          "Use x, y, z, a, b, or c with supported arithmetic and common real-valued functions.",
      },
    ],
  },
  {
    slug: "optimization-lab",
    name: "Optimization Lab",
    shortName: "Optimization",
    category: "research",
    icon: "max",
    title: "Optimization Problem Solver – Linear Programming Calculator",
    description:
      "Solve two-variable optimization problems online with a linear programming calculator for objective functions, constraints, feasible regions, corner points, and maximum or minimum values.",
    summary:
      "Build a two-variable linear programming model, enter objective coefficients and constraints, inspect feasible corner points, and compare objective values to find a maximum or minimum result.",
    keywords: [
      "optimization problem solver",
      "optimization problem calculator",
      "optimization solver calculator",
      "linear programming solver",
      "linear programming calculator",
      "online linear optimization solver",
      "two variable linear programming calculator",
      "maximize objective function calculator",
      "minimize linear constraints calculator",
      "feasible region calculator",
      "corner point method calculator",
      "graphical method linear programming",
    ],
    relatedSlugs: [
      "graphing-calculator",
      "matrix-calculator",
      "differential-equation-solver",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "Two-variable linear programming and optimization problems",
      "Maximize profit, output, score, or value from constraints",
      "Minimize cost, time, waste, or resource use from constraints",
      "Feasible region and corner-point objective comparison",
    ],
    features: [
      "Objective function input for x and y coefficients",
      "Up to eight linear constraints with ≤, ≥, or = operators",
      "Maximize or minimize objective value",
      "Optional non-negative constraints x ≥ 0 and y ≥ 0",
      "Feasible corner points and objective values",
      "Graphical corner-point view for continuous two-variable models",
    ],
    faqs: [
      {
        question: "What optimization problems can this solver handle?",
        answer:
          "It handles continuous two-variable linear programming problems where the objective function and constraints are linear in x and y.",
      },
      {
        question: "How does the corner point method work?",
        answer:
          "For a bounded continuous two-variable linear program, the best objective value occurs at a feasible corner point. The lab finds feasible intersections and compares the objective value at those points.",
      },
      {
        question: "What is the objective function?",
        answer:
          "The objective function is the value being maximized or minimized, such as profit, cost, output, time, or resource use. In this lab it has the form Z = c₁x + c₂y.",
      },
      {
        question: "What are constraints in linear programming?",
        answer:
          "Constraints are limits or requirements written as linear equations or inequalities, such as 2x + 3y ≤ 42. The feasible solution must satisfy every constraint.",
      },
      {
        question: "Does this solve integer programming?",
        answer:
          "No. This release solves continuous two-variable linear programs. Integer, binary, nonlinear, or many-variable optimization problems need a different solver.",
      },
      {
        question: "Can a linear program be infeasible or unbounded?",
        answer:
          "Yes. A model is infeasible when no point satisfies all constraints. It can be unbounded when the feasible region extends in a direction that keeps improving the objective value.",
      },
    ],
  },
  {
    slug: "circuit-analysis",
    name: "DC Circuit Analysis Lab",
    shortName: "Circuit analysis",
    category: "research",
    icon: "Ω",
    title:
      "Circuit Analysis Calculator – Nodal Analysis, Ohm's Law, RC & Resistors",
    description:
      "Use a DC circuit analysis calculator for Ohm's law, series and parallel resistors, voltage dividers, RC transients, two-node nodal analysis, conductance matrices, KCL equations, and node voltages.",
    summary:
      "Calculate ideal DC resistor circuits with Ohm's law, resistor networks, voltage dividers, RC charge or discharge, and a two-node nodal-analysis solver that explains conductance matrices and current injections.",
    keywords: [
      "circuit analysis calculator",
      "dc circuit analysis calculator",
      "nodal analysis calculator",
      "two node nodal analysis",
      "node voltage calculator",
      "resistor network calculator",
      "conductance matrix calculator",
      "coefficient matrix circuit",
      "kcl circuit solver",
      "ohms law calculator",
      "voltage divider calculator",
      "series parallel resistor calculator",
      "parallel resistor calculator",
      "rc circuit calculator",
      "rc transient calculator",
      "resistor current calculator",
    ],
    relatedSlugs: [
      "matrix-calculator",
      "scientific-calculator",
      "unit-converter",
    ],
    priority: 0.88,
    useCases: [
      "Solve Ohm's law questions by leaving voltage, current, or resistance blank",
      "Calculate total resistance and optional current for series or parallel resistor networks",
      "Find voltage-divider output, RC transient voltage, and two-node nodal-analysis voltages",
      "Build a conductance matrix from KCL and solve node-voltage equations",
    ],
    features: [
      "Ohm's law with voltage, current, resistance, and power context",
      "Series and parallel resistor-network calculations",
      "Voltage divider formula using top and bottom resistors",
      "RC charge and discharge with ideal time-constant assumptions",
      "Two-node nodal-analysis model with R1, R2, R12, I1, and I2 inputs",
      "Conductance-matrix explanation and branch-current interpretation",
      "Guide link for KCL, node voltages, and coefficient-matrix setup",
    ],
    faqs: [
      {
        question: "Is this a nodal analysis calculator?",
        answer:
          "Yes. The two-node nodal mode solves an ideal resistive KCL model using R1 from node 1 to ground, R2 from node 2 to ground, R12 between the nodes, and current injections I1 and I2.",
      },
      {
        question: "What does G · V = I mean in circuit analysis?",
        answer:
          "G is the conductance matrix built from resistor values, V is the vector of unknown node voltages, and I is the vector of current injections. Solving the matrix gives the node voltages.",
      },
      {
        question: "How are current sources defined in nodal analysis?",
        answer:
          "Positive I1 and I2 values are current injected into their corresponding nodes. A negative value represents current leaving that node in the chosen sign convention.",
      },
      {
        question: "Can this solve series and parallel resistor networks?",
        answer:
          "Yes. Enter resistor values separated by commas, spaces, or semicolons. The calculator can estimate equivalent resistance and, when supply voltage is included, related current values.",
      },
      {
        question: "Is this a full SPICE simulator?",
        answer:
          "No. It is an ideal DC circuit-analysis workspace for formulas and simple resistor models. Full device models, AC sweeps, nonlinear components, and detailed transient simulation require a dedicated SPICE engine.",
      },
      {
        question: "When should I use the Matrix Calculator with circuit analysis?",
        answer:
          "Use Matrix Calculator when you want to inspect the coefficient matrix, determinant, inverse, RREF, or rank behind a circuit equation system.",
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
    relatedSlugs: [
      "statistics-calculator",
      "graphing-calculator",
      "differential-equation-solver",
    ],
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
        answer:
          "No. Statistical outputs depend on assumptions, study design, data quality, and the question being asked.",
      },
      {
        question: "Which ANOVA is included?",
        answer:
          "This workspace provides a one-way ANOVA for three or more independent groups entered as numeric lists.",
      },
    ],
  },
  {
    slug: "profit-loss-calculator",
    name: "Profit, Loss & Margin Calculator",
    shortName: "Profit & loss",
    category: "everyday",
    icon: "±",
    title: "Profit and Loss Calculator – Markup, Margin, Cost & Selling Price",
    description:
      "Calculate profit, loss, markup percentage, and profit margin from cost price and selling price. Compare markup vs margin with clear formulas and examples.",
    summary:
      "Enter cost price and selling price to calculate profit or loss amount, markup on cost, profit margin on revenue, and the difference between margin and markup.",
    keywords: [
      "profit and loss calculator",
      "profit margin calculator",
      "markup calculator",
      "markup vs margin",
      "calculating markup vs margin",
      "cost price selling price calculator",
      "profit percentage calculator",
      "loss percentage calculator",
      "gross margin calculator",
      "selling price calculator",
      "profit formula calculator",
    ],
    relatedSlugs: [
      "percentage-calculator",
      "discount-calculator",
      "simple-interest-calculator",
    ],
    featured: true,
    priority: 0.88,
    useCases: [
      "Calculate profit or loss from cost price and selling price",
      "Compare markup percentage on cost with profit margin on selling price",
      "Check business pricing examples before using a discount or percentage workflow",
    ],
    features: [
      "Profit amount and loss amount",
      "Markup percentage measured against cost",
      "Profit margin percentage measured against selling price",
      "Worked example explaining why 25% markup equals 20% margin in a common pricing case",
      "Guide link for markup vs margin formulas",
    ],
    faqs: [
      {
        question: "What is the profit formula?",
        answer:
          "Profit is selling price minus cost price. If the result is negative, the sale produced a loss instead of a profit.",
      },
      {
        question: "What is the difference between markup and margin?",
        answer:
          "Markup is profit divided by cost price. Profit margin is profit divided by selling price. Because they use different bases, the percentages are not the same.",
      },
      {
        question: "How do I calculate markup percentage?",
        answer:
          "Use markup = profit ÷ cost price × 100. For example, if cost is 80 and selling price is 100, profit is 20 and markup is 25%.",
      },
      {
        question: "How do I calculate profit margin percentage?",
        answer:
          "Use margin = profit ÷ selling price × 100. For example, if cost is 80 and selling price is 100, profit is 20 and margin is 20%.",
      },
      {
        question: "Can this calculator show a loss percentage?",
        answer:
          "Yes. Enter a selling price below cost and the calculator shows the loss amount and loss percentage on cost. The margin on selling price will also be negative.",
      },
    ],
  },
  {
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    shortName: "Simple interest",
    category: "everyday",
    icon: "i",
    title:
      "Simple Interest Calculator – Formula, Per Annum Interest & Total Amount",
    description:
      "Calculate simple interest per annum, interest earned, and total amount from principal, annual interest rate, and time using the simple interest formula.",
    summary:
      "Use principal, annual rate, and time in years, months, or days to calculate simple interest, interest earned, final amount, and a clear formula breakdown.",
    keywords: [
      "simple interest calculator",
      "how to calculate simple interest per annum",
      "calculate interest formula",
      "simple interest formula",
      "simple interest per annum",
      "interest calculator",
      "principal rate time calculator",
      "annual interest rate calculator",
      "interest earned calculator",
      "total amount calculator",
    ],
    relatedSlugs: [
      "compound-interest-calculator",
      "loan-calculator",
      "percentage-calculator",
    ],
    priority: 0.88,
    useCases: [
      "Simple interest formula: SI = P × R × T / 100",
      "Interest earned from a principal amount and annual rate",
      "Simple interest per annum with years, months, or days",
      "Total maturity amount after adding interest to principal",
    ],
    features: [
      "Principal, annual rate, and time inputs",
      "Years, months, or days converted into formula time",
      "Interest earned and total amount",
      "Formula line showing principal × rate × time / 100",
      "Worked per-annum example and simple vs compound comparison",
    ],
    faqs: [
      {
        question: "What formula does simple interest use?",
        answer:
          "Simple interest uses SI = P × R × T / 100, where P is principal, R is the annual interest rate percentage, and T is time in years.",
      },
      {
        question: "How do I calculate simple interest per annum?",
        answer:
          "Use the annual rate as R and write time in years. For example, 10,000 at 12% per annum for 2 years gives 10,000 × 12 × 2 / 100 = 2,400 interest.",
      },
      {
        question: "How are months handled in the formula?",
        answer:
          "Months are converted into years. Six months becomes 0.5 years, so simple interest for 6 months is half of one year at the same annual rate.",
      },
      {
        question: "What is the total amount?",
        answer:
          "Total amount is principal plus simple interest. If the principal is 10,000 and the interest is 2,400, the total amount is 12,400.",
      },
      {
        question: "When should I use compound interest instead?",
        answer:
          "Use compound interest when interest is periodically added to the balance and then earns interest itself, such as monthly, quarterly, or daily compounding.",
      },
    ],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    shortName: "Compound interest",
    category: "everyday",
    icon: "↗",
    title: "Compound Interest Calculator – Growth, Contributions & Frequency",
    description:
      "Calculate compound interest, future value, interest earned, regular contributions, and annual, monthly, quarterly, weekly, or daily compounding online.",
    summary:
      "Project compound growth using a starting balance, annual rate, years, frequency, and optional regular contributions.",
    keywords: [
      "compound interest calculator",
      "future value calculator",
      "investment growth calculator",
      "monthly compounding calculator",
    ],
    relatedSlugs: [
      "simple-interest-calculator",
      "loan-calculator",
      "percentage-calculator",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "Compound interest growth",
      "Regular contribution projections",
      "Future value and interest earned",
    ],
    features: [
      "Annual to daily compounding",
      "Optional recurring contributions",
      "Future value, deposits, and interest",
    ],
    faqs: [
      {
        question: "Can I choose monthly compounding?",
        answer:
          "Yes. Choose monthly, quarterly, annual, weekly, bi-weekly, or daily compounding.",
      },
      {
        question: "How are regular contributions handled?",
        answer:
          "The calculator applies an end-of-period contribution using the selected compounding frequency.",
      },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan Payment Calculator",
    shortName: "Loan payment",
    category: "everyday",
    icon: "₤",
    title: "Loan Payment Calculator – Monthly Payment & Total Interest",
    description:
      "Estimate monthly, bi-weekly, or weekly loan payments, total repaid, and total interest from loan amount, annual rate, and term.",
    summary:
      "Estimate an amortized payment, total repayment, and interest for a loan using a chosen payment frequency.",
    keywords: [
      "loan calculator",
      "monthly payment calculator",
      "loan interest calculator",
      "amortization payment calculator",
    ],
    relatedSlugs: [
      "compound-interest-calculator",
      "simple-interest-calculator",
      "percentage-calculator",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "Monthly loan payment",
      "Total interest estimate",
      "Weekly and bi-weekly payments",
    ],
    features: [
      "Amortized periodic payment",
      "Total repaid",
      "Total interest",
      "Monthly, bi-weekly, or weekly frequency",
    ],
    faqs: [
      {
        question: "Does this include lender fees?",
        answer:
          "No. This is an amortized payment estimate and does not include lender-specific fees, insurance, taxes, or rounding rules.",
      },
      {
        question: "Can I choose a weekly payment frequency?",
        answer: "Yes. Choose monthly, bi-weekly, or weekly payment frequency.",
      },
    ],
  },
  {
    slug: "discount-calculator",
    name: "Discount & Tax Calculator",
    shortName: "Discount",
    category: "everyday",
    icon: "↓",
    title: "Discount Calculator – Sale Price, Savings & Tax",
    description:
      "Calculate discount amount, sale price, savings, and tax-adjusted final price from an original price and percentage discount online.",
    summary:
      "Calculate a discount amount, sale price, optional tax, and final price with a compact discount calculator.",
    keywords: [
      "discount calculator",
      "sale price calculator",
      "discount percentage calculator",
      "price after tax calculator",
    ],
    relatedSlugs: [
      "percentage-calculator",
      "profit-loss-calculator",
      "loan-calculator",
    ],
    priority: 0.86,
    useCases: [
      "Discount amount",
      "Sale price after discount",
      "Tax-adjusted final price",
    ],
    features: [
      "Discount percentage",
      "Sale price",
      "Tax after discount",
      "Savings amount",
    ],
    faqs: [
      {
        question: "Is tax applied before or after the discount?",
        answer:
          "This tool applies the discount first, then calculates tax on the discounted sale price.",
      },
      {
        question: "Can I set tax to zero?",
        answer: "Yes. Enter zero when no tax needs to be included.",
      },
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
