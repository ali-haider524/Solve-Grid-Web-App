export type ToolCategory = "math" | "engineering" | "research" | "statistics";

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
  statistics: {
    label: "Research statistics & survey tools",
    description:
      "Sample size, reliability, Likert analysis, descriptive statistics, and hypothesis tests for theses and survey research.",
    slug: "research-statistics",
    intro:
      "Free statistics calculators for student researchers: Slovin and Cochran sample size, Cronbach's alpha, Likert weighted mean, standard deviation, t-tests, ANOVA, and correlation with write-up guidance.",
  },
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
      "Use a free scientific and engineering calculator for trigonometry, logs, roots, powers, constants, scientific notation, and engineering notation.",
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
       {
        question: "How do I convert a number to engineering notation?",
        answer:
          "Enter your number and switch to ENG mode. The calculator automatically displays the result in engineering notation using powers of ten in multiples of three. For example, 12500 is shown as 12.5e3 instead of 1.25e4.",
      },
    ],
  },
  {
    slug: "graphing-calculator",
    name: "Graphing Calculator",
    shortName: "Graphing",
    category: "math",
    icon: "⌁",
    title: "Online Graphing Calculator – Graph, Table, Trace & Intersections",
    description:
      "Plot equations online, compare multiple functions, inspect tables, trace points, estimate roots and intersections, and adjust the graph window.",
    summary:
      "Plot and compare several functions, inspect tables and trace values, estimate x-intercepts and intersections, adjust the graph window, and use a clear online workflow for common graphing-calculator tasks.",
    keywords: [
      "online graphing calculator",
      "graphing calculator online",
      "ti-84 online alternative",
      "ti-84 style graphing calculator",
      "graph equations online",
      "plot equations online",
      "function graph calculator",
      "online graphing calculator with table",
      "graph table calculator",
      "graph multiple equations",
      "graphing calculator with table",
      "trace graph calculator",
      "graph intersections calculator",
      "x intercept calculator",
      "online function plotter",
    ],
    relatedSlugs: [
      "equation-solver",
      "polynomial-solver",
      "scientific-calculator",
    ],
    featured: true,
    priority: 0.95,
    useCases: [
      "Plot and compare up to eight functions or vertical lines",
      "Inspect value tables and trace a chosen x-coordinate",
      "Estimate roots and intersections in the current graph window",
      "Use an independent TI-84 style workflow for graph, table, trace, roots, and intersections",
      "Explore trigonometric functions in degrees or radians",
    ],
    features: [
      "Up to eight equation lines and vertical lines",
      "Graph, table, trace, and analysis views",
      "Approximate x-intercepts and function intersections",
      "Zoom controls and custom x/y window settings",
      "Degrees and radians for trigonometric functions",
      "Guide link for choosing the right SolveGrid tool after a graphing step",
    ],
    faqs: [
      {
        question: "Can I graph more than one equation?",
        answer:
          "Yes. Add up to eight equation lines and compare them in the same graph window. Enter functions such as y = 2x + 1 or y = x^2 − 4, and use x = 3 for a vertical line.",
      },
      {
        question: "Can I use this as a TI-84 online alternative?",
        answer:
          "It can help with many similar online graphing workflows such as graphing equations, viewing tables, tracing values, and estimating roots or intersections. SolveGrid is independent and is not an official TI-84 emulator or a Texas Instruments product.",
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
      {
        question: "How do I plot an equation?",
        answer:
          "Enter your equation in the input field, such as y = x² or y = 2x + 3, and the Graphing Calculator will instantly plot the equation on the coordinate plane. You can zoom, compare multiple equations, and analyze key graph features.",
      },
    ],
  },

  {
    slug: "equation-solver",
    name: "Equation Solver",
    shortName: "Equations",
    category: "math",
    icon: "x²",
    title:
      "Equation Solver – Linear, Quadratic, Cubic & System of Equations Calculator",
    description:
      "Solve linear, quadratic, cubic, and 2–8 variable systems online using Gaussian elimination, Gauss-Jordan RREF, inverse, and Cramer’s rule.",
    summary:
      "Use a clear online equation solver for one-variable equations and simultaneous linear systems. Enter coefficients, solve linear, quadratic, and cubic equations, or compare matrix methods for A·x = b systems.",
    keywords: [
      "equation solver",
      "online equation solver",
      "engineering equation solver online",
      "linear equation solver",
      "quadratic equation solver",
      "quadratic formula calculator",
      "cubic equation solver",
      "system of equations solver",
      "simultaneous equations solver",
      "linear system solver",
      "gaussian elimination calculator",
      "gaussian reduction calculator",
      "gauss jordan calculator",
      "rref system solver",
      "cramers rule calculator",
      "matrix equation solver",
      "coefficient matrix solver",
      "A x equals b calculator",
    ],
    relatedSlugs: [
      "matrix-calculator",
      "graphing-calculator",
      "polynomial-solver",
      "scientific-calculator",
    ],
    featured: true,
    priority: 0.95,
    useCases: [
      "Solve linear, quadratic, and cubic equations from coefficients",
      "Build 2–8 variable simultaneous equations from a coefficient matrix",
      "Compare Gaussian elimination, Gauss-Jordan RREF, inverse method, and Cramer’s rule",
      "Check whether a system has one solution, no solution, or infinitely many solutions",
    ],
    features: [
      "Linear equation solver for ax + b = 0",
      "Quadratic formula workflow with real, repeated, and complex roots",
      "Cubic equation roots from coefficient form",
      "2–8 variable system of equations solver",
      "Gaussian elimination and Gauss-Jordan RREF methods",
      "Matrix inverse method for supported square systems",
      "Cramer’s rule for small systems where applicable",
      "Worked examples and internal links to matrix, graphing, and polynomial tools",
    ],
    faqs: [
      {
        question: "Which equations can this online equation solver handle?",
        answer:
          "It solves linear equations, quadratic equations, cubic equations, and square linear systems from 2 through 8 variables using coefficient input.",
      },
      {
        question: "Can I use it as a system of equations solver?",
        answer:
          "Yes. Choose Linear system, enter coefficients in the same variable order, and pick Auto, Gaussian elimination, Gauss-Jordan RREF, matrix inverse, or Cramer’s rule where supported.",
      },
      {
        question: "What is the difference between Gaussian elimination and RREF?",
        answer:
          "Gaussian elimination usually reduces the augmented matrix to row echelon form and then back-substitutes. Gauss-Jordan continues to RREF so pivots are easier to read directly.",
      },
      {
        question: "Can the quadratic equation solver show complex roots?",
        answer:
          "Yes. If the discriminant is negative, the calculator reports complex roots in a + bi form instead of only saying that there are no real roots.",
      },
      {
        question: "Where should I solve degree 4 or higher equations?",
        answer:
          "Use the Polynomial Solver for degree 4 through 10 polynomial roots. This page focuses on linear, quadratic, cubic, and simultaneous linear systems.",
      },
      {
        question: "When should I graph the equation instead?",
        answer:
          "Use the Graphing Calculator when you want to visualize roots, intersections, or tables. Use Equation Solver when you need coefficient-based numerical answers.",
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
      "Calculate 2×2 to 10×10 matrices, REF, RREF, rank, row space, inverse, determinant, eigenvalues, arithmetic, and supported linear systems.",
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
    category: "statistics",
    icon: "σ",
    title:
      "Statistics Calculator – Standard Deviation, Variance, Quartiles & Regression",
    description:
      "Calculate sample or population standard deviation, variance, mean, median, mode, quartiles, IQR, frequency tables, grouped data, correlation, and regression.",
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
      "advanced-statistics",
      "likert-scale-calculator",
      "sample-size-calculator",
    ],
    featured: true,
    priority: 0.95,
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
      {
        question: "How do you find the standard deviation??",
        answer:
          "To find the standard deviation, calculate the mean of the dataset, subtract the mean from each value, square the differences, find the average of those squared differences (variance), and take the square root of the variance. Our Statistics Calculator performs these calculations instantly for both sample and population datasets..",
      },
    ],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortName: "Units",
    category: "engineering",
    icon: "⇄",
    title: "Unit Converter – Engineering, Metric, Imperial & Science Units",
    description:
      "Convert engineering, scientific, metric, imperial, and everyday units for length, mass, temperature, speed, pressure, energy, torque, density, and more.",
    summary:
      "Convert 17 unit families with clear formulas, base-unit context, metric and imperial workflows, and shareable pre-filled conversion links for engineering, science, study, and everyday calculations.",
    keywords: [
      "unit converter",
      "online unit converter",
      "engineering unit converter",
      "metric unit converter",
      "imperial unit converter",
      "scientific unit converter",
      "pressure converter",
      "force converter",
      "energy converter",
      "power converter",
      "torque converter",
      "density converter",
      "temperature converter",
      "speed converter",
      "data unit converter",
      "metric to imperial converter",
      "unit conversion formulas",
      "engineering conversion calculator",
    ],
    relatedSlugs: [
      "scientific-calculator",
      "circuit-analysis",
    ],
    featured: true,
    priority: 0.9,
    useCases: [
      "Metric and imperial conversions for length, area, volume, mass, and temperature",
      "Engineering conversions for force, pressure, energy, power, torque, density, and frequency",
      "Speed, time, angle, acceleration, data, and everyday conversion checks",
      "Shareable pre-filled conversion links for study notes or engineering calculations",
    ],
    features: [
      "17 conversion families",
      "Pressure, force, energy, power, torque, density, and frequency conversions",
      "Temperature formulas for Celsius, Fahrenheit, and Kelvin",
      "Metric and imperial units with base-unit explanation",
      "Scientific notation friendly output for very large or very small values",
      "Copyable pre-filled conversion links",
    ],
    faqs: [
      {
        question: "Which unit categories are included?",
        answer:
          "Length, area, volume, mass, temperature, time, speed, acceleration, angles, data, force, pressure, energy, power, torque, frequency, and density are included.",
      },
      {
        question: "Is this an engineering unit converter?",
        answer:
          "Yes. It includes common engineering conversions such as force, pressure, energy, power, torque, density, frequency, speed, acceleration, and angles.",
      },
      {
        question: "Does temperature conversion use a different formula?",
        answer:
          "Yes. Temperature uses formulas rather than simple multiplication because Celsius, Fahrenheit, and Kelvin have different zero points.",
      },
      {
        question: "Can I convert metric to imperial units?",
        answer:
          "Yes. Choose a category such as length, mass, volume, temperature, speed, or pressure, then select the metric and imperial units you need.",
      },
      {
        question: "When should I use Scientific Calculator instead?",
        answer:
          "Use Scientific Calculator when you need powers, roots, trigonometry, logarithms, constants, scientific notation, or engineering notation. Use Unit Converter when the main task is changing from one unit to another.",
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
      "Solve two-variable linear programming problems online using objective functions, constraints, feasible regions, corner points, and maximum or minimum values.",
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
      "Analyze DC circuits with Ohm’s law, series and parallel resistance, voltage dividers, RC transients, KCL, conductance matrices, and two-node nodal analysis.",
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
    category: "statistics",
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
      "cronbach-alpha-calculator",
      "sample-size-calculator",
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
    slug: "sample-size-calculator",
    name: "Sample Size Calculator",
    shortName: "Sample size",
    category: "statistics",
    icon: "n",
    title: "Sample Size Calculator – Slovin, Yamane & Cochran Formula",
    description:
      "Calculate research sample size with Slovin's formula, Taro Yamane, or Cochran's formula with finite population correction. Shows every step and a methodology sentence.",
    summary:
      "Find the minimum sample size for a survey or thesis using Slovin/Yamane or Cochran's formula, with confidence level, margin of error, population size, response-rate adjustment, and a copy-ready methods sentence.",
    keywords: [
      "sample size calculator",
      "slovin formula calculator",
      "slovin's formula",
      "taro yamane sample size calculator",
      "yamane formula",
      "cochran formula calculator",
      "sample size calculator for thesis",
      "survey sample size calculator",
      "finite population correction",
      "raosoft sample size calculator alternative",
    ],
    relatedSlugs: ["likert-scale-calculator", "cronbach-alpha-calculator", "statistics-calculator"],
    featured: true,
    priority: 0.96,
    useCases: [
      "Compute minimum respondents for a thesis survey from a known population",
      "Compare Slovin/Yamane with Cochran's formula and finite population correction",
      "Inflate the sample for expected non-response",
    ],
    features: [
      "Slovin / Taro Yamane formula",
      "Cochran formula with finite population correction",
      "90%, 95%, and 99% confidence levels",
      "Response-rate adjustment",
      "Step-by-step working and methods sentence",
    ],
    faqs: [
      {
        question: "Are Slovin's formula and Taro Yamane's formula the same?",
        answer:
          "Yes. Both use n = N ÷ (1 + N·e²). Yamane (1967) popularised the expression; many theses cite it under either name. Cite the source your adviser or department expects.",
      },
      {
        question: "When should I use Cochran's formula instead of Slovin's?",
        answer:
          "Cochran's formula lets you set the confidence level and the expected proportion p, so it is more defensible when a reviewer asks how confidence was chosen. Slovin's formula assumes p = 0.5 and roughly 95% confidence implicitly.",
      },
      {
        question: "What margin of error should I use?",
        answer:
          "5% (0.05) is the most common choice in survey research. Smaller margins such as 3% need much larger samples; larger margins such as 10% are sometimes accepted for pilot or exploratory studies.",
      },
      {
        question: "Should I round the sample size up or down?",
        answer:
          "Always round up to the next whole respondent, because rounding down produces a sample slightly smaller than the formula requires.",
      },
    ],
  },
  {
    slug: "cronbach-alpha-calculator",
    name: "Cronbach's Alpha Calculator",
    shortName: "Cronbach's alpha",
    category: "statistics",
    icon: "α",
    title: "Cronbach's Alpha Calculator – Reliability, Item-Total & Alpha if Deleted",
    description:
      "Paste questionnaire responses to calculate Cronbach's alpha, corrected item-total correlations, and alpha if item deleted. Handles reverse-coded Likert items.",
    summary:
      "Check the internal consistency of a questionnaire scale from raw item scores, reverse-code negatively worded items, and see which items lower reliability.",
    keywords: [
      "cronbach alpha calculator",
      "cronbach's alpha calculator",
      "cronbach alpha online",
      "reliability test calculator",
      "alpha if item deleted",
      "corrected item total correlation",
      "cronbach alpha interpretation",
      "reverse coded items cronbach alpha",
    ],
    relatedSlugs: ["likert-scale-calculator", "sample-size-calculator", "statistics-calculator"],
    featured: true,
    priority: 0.95,
    useCases: [
      "Test reliability of a Likert-scale questionnaire for a thesis",
      "Find items that lower alpha before the final survey",
      "Reverse-code negatively worded items automatically",
    ],
    features: [
      "Raw Cronbach's alpha",
      "Corrected item-total correlation",
      "Alpha if item deleted",
      "Reverse coding by scale minimum and maximum",
      "Interpretation band and APA-style sentence",
    ],
    faqs: [
      {
        question: "What is a good Cronbach's alpha?",
        answer:
          "A common rule of thumb (George & Mallery) is ≥ 0.9 excellent, ≥ 0.8 good, ≥ 0.7 acceptable, ≥ 0.6 questionable, ≥ 0.5 poor, and below 0.5 unacceptable. Very high values above 0.95 can signal redundant items.",
      },
      {
        question: "Why is my Cronbach's alpha negative or very low?",
        answer:
          "The most common cause is a negatively worded item that has not been reverse-coded. Mark that item as reversed and recalculate. Few items or a scale measuring more than one construct can also lower alpha.",
      },
      {
        question: "How should data be entered?",
        answer:
          "One row per respondent and one column per item, separated by commas, tabs, or spaces. You can paste directly from Excel, Google Sheets, or SPSS data view.",
      },
    ],
  },
  {
    slug: "likert-scale-calculator",
    name: "Likert Scale Weighted Mean Calculator",
    shortName: "Likert weighted mean",
    category: "statistics",
    icon: "Σw",
    title: "Likert Scale Calculator – Weighted Mean, SD & Verbal Interpretation",
    description:
      "Enter response counts for each Likert statement to get the weighted mean, standard deviation, verbal interpretation, and overall mean for 4-, 5-, or 7-point scales.",
    summary:
      "Turn questionnaire frequency counts into weighted means, standard deviations, rankings, and a verbal interpretation table ready for a thesis results chapter.",
    keywords: [
      "likert scale calculator",
      "weighted mean calculator likert scale",
      "weighted mean interpretation",
      "likert scale interpretation",
      "5 point likert scale interpretation",
      "4 point likert scale range",
      "how to analyze likert scale data",
      "likert scale mean range interpretation",
    ],
    relatedSlugs: ["cronbach-alpha-calculator", "sample-size-calculator", "statistics-calculator"],
    featured: true,
    priority: 0.95,
    useCases: [
      "Compute weighted mean per questionnaire statement",
      "Assign verbal interpretations such as Agree or Strongly Agree",
      "Produce an overall (grand) mean and rank statements",
    ],
    features: [
      "4-, 5-, and 7-point scales",
      "Equal-interval range table",
      "Weighted mean and standard deviation per item",
      "Rank and overall mean",
      "Editable verbal labels",
    ],
    faqs: [
      {
        question: "How is the interpretation range calculated?",
        answer:
          "The interval width is (highest score − lowest score) ÷ number of levels. On a 5-point scale that is (5 − 1) ÷ 5 = 0.80, giving ranges 1.00–1.80, 1.81–2.60, 2.61–3.40, 3.41–4.20, and 4.21–5.00.",
      },
      {
        question: "Is it valid to compute a mean from Likert data?",
        answer:
          "Means of individual Likert items are widely used in applied theses but are debated, because single items are ordinal. Report medians or frequencies alongside means, and prefer summed scale scores for inferential tests.",
      },
      {
        question: "Can I change the verbal labels?",
        answer:
          "Yes. Edit each label to match your instrument, for example Never–Always or Very Low–Very High.",
      },
    ],
  },
  {
    slug: "statistical-test-chooser",
    name: "Statistical Test Chooser",
    shortName: "Test chooser",
    category: "statistics",
    icon: "?",
    title: "Which Statistical Test Should I Use? Interactive Test Chooser",
    description:
      "Answer four questions to find the right statistical test: t-test, ANOVA, chi-square, Mann-Whitney, Wilcoxon, Kruskal-Wallis, or correlation, with assumptions and an APA report sentence.",
    summary:
      "Pick the right statistical test for your thesis in four questions, then see the assumptions to check and a ready-to-edit APA-style sentence for your results chapter.",
    keywords: [
      "which statistical test should i use",
      "statistical test chooser",
      "statistical test flowchart",
      "how to choose a statistical test",
      "statistical test for comparing two groups",
      "statistical test for ordinal data",
      "statistical test for categorical data",
      "should i use anova or t test",
    ],
    relatedSlugs: ["advanced-statistics", "likert-scale-calculator", "sample-size-calculator"],
    featured: true,
    priority: 0.97,
    useCases: [
      "Choose between t-tests, ANOVA, and their non-parametric alternatives",
      "Decide between chi-square, Fisher's exact, and McNemar's test",
      "Get the APA-style reporting sentence for the chosen test",
    ],
    features: [
      "14 test outcomes",
      "Parametric and non-parametric alternatives",
      "Assumption checklist",
      "Copyable APA report template",
    ],
    faqs: [
      {
        question: "Can I use a t-test on Likert scale data?",
        answer:
          "For a single Likert item, a Mann-Whitney U test is safer because the item is ordinal. For a summed or averaged scale made from several items, a t-test is widely accepted if the scores are roughly normal.",
      },
      {
        question: "What if my data are not normally distributed?",
        answer:
          "Choose the ordinal / skewed option. The chooser then recommends the non-parametric test: Mann-Whitney, Wilcoxon, Kruskal-Wallis, Friedman, or Spearman.",
      },
      {
        question: "Does this replace my supervisor or a statistician?",
        answer:
          "No. It covers the standard tests used in most theses. Complex designs such as mixed models, covariates, or multiple outcomes need expert advice.",
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
