import { all, create } from "mathjs";

export type AngleMode = "DEG" | "RAD";
export type DisplayNotation = "NORM" | "SCI" | "ENG";
export type VariableName = "A" | "B" | "C" | "X" | "Y";
export type MathVariables = Record<VariableName, number>;

export type CalculationOptions = {
  angleMode?: AngleMode;
  notation?: DisplayNotation;
  ans?: number;
  variables?: Partial<MathVariables>;
};

export type CalculationResult = {
  value: number;
  formatted: string;
  normalizedExpression: string;
};

const math = create(all, {
  number: "number",
  matrix: "Array",
  predictable: false,
});

const allowedIdentifiers = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "log",
  "ln",
  "abs",
  "pi",
  "e",
  "ans",
  "a",
  "b",
  "c",
  "x",
  "y",
]);

const defaultVariables: MathVariables = {
  A: 0,
  B: 0,
  C: 0,
  X: 0,
  Y: 0,
};

export function calculateExpression(
  expression: string,
  options: CalculationOptions = {},
): CalculationResult {
  const normalizedExpression = normalizeExpression(expression);
  validateExpression(normalizedExpression);

  try {
    const value = math.evaluate(
      normalizedExpression,
      createCalculatorScope(options),
    );

    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Result is too large or undefined.");
    }

    return {
      value,
      formatted: formatMathNumber(value, options.notation ?? "NORM"),
      normalizedExpression,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(cleanErrorMessage(error.message));
    }

    throw new Error("Check the expression and try again.");
  }
}

export function formatMathNumber(
  value: number,
  notation: DisplayNotation = "NORM",
) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Object.is(value, -0)) {
    return "0";
  }

  const roundedValue = Number(value.toPrecision(12));

  if (notation === "SCI") {
    return roundedValue.toExponential(8);
  }

  if (notation === "ENG" && roundedValue !== 0) {
    const exponent = Math.floor(Math.log10(Math.abs(roundedValue)) / 3) * 3;
    const coefficient = roundedValue / 10 ** exponent;
    const roundedCoefficient = Number(coefficient.toPrecision(10));

    return `${roundedCoefficient}e${exponent >= 0 ? "+" : ""}${exponent}`;
  }

  if (
    Math.abs(roundedValue) >= 1_000_000_000_000 ||
    (Math.abs(roundedValue) > 0 && Math.abs(roundedValue) < 0.000000001)
  ) {
    return roundedValue.toExponential(8);
  }

  return String(roundedValue);
}

function normalizeExpression(expression: string) {
  const cleanedExpression = expression
    .trim()
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt")
    .replace(/\bmod\b/gi, "%");

  return autoCloseParentheses(cleanedExpression);
}

function autoCloseParentheses(expression: string) {
  let openCount = 0;

  for (const character of expression) {
    if (character === "(") openCount += 1;
    if (character === ")") openCount -= 1;

    if (openCount < 0) {
      throw new Error("Check that your parentheses are balanced.");
    }
  }

  return `${expression}${")".repeat(openCount)}`;
}

function validateExpression(expression: string) {
  if (!expression) {
    throw new Error("Enter a calculation first.");
  }

  if (expression.length > 260) {
    throw new Error("This calculation is too long.");
  }

  if (!/^[0-9A-Za-z_+\-*/^%().,\s]+$/.test(expression)) {
    throw new Error("Use valid calculator symbols only.");
  }

  const withoutScientificNotation = expression.replace(
    /\d+(?:\.\d+)?(?:e[+\-]?\d+)?/gi,
    "0",
  );

  const identifiers = withoutScientificNotation.match(/[A-Za-z_]\w*/g) ?? [];

  for (const identifier of identifiers) {
    if (!allowedIdentifiers.has(identifier.toLowerCase())) {
      throw new Error(`"${identifier}" is not supported in this mode.`);
    }
  }
}

function createCalculatorScope(options: CalculationOptions) {
  const angleMode = options.angleMode ?? "DEG";
  const ans = options.ans ?? 0;
  const variables = { ...defaultVariables, ...options.variables };

  return {
    ans,
    pi: Math.PI,
    e: Math.E,
    A: variables.A,
    B: variables.B,
    C: variables.C,
    X: variables.X,
    Y: variables.Y,
    a: variables.A,
    b: variables.B,
    c: variables.C,
    x: variables.X,
    y: variables.Y,

    sin: (value: unknown) => Math.sin(toRadians(value, angleMode, "sin")),
    cos: (value: unknown) => Math.cos(toRadians(value, angleMode, "cos")),
    tan: (value: unknown) => Math.tan(toRadians(value, angleMode, "tan")),

    asin: (value: unknown) =>
      fromRadians(Math.asin(toRealNumber(value, "asin")), angleMode),
    acos: (value: unknown) =>
      fromRadians(Math.acos(toRealNumber(value, "acos")), angleMode),
    atan: (value: unknown) =>
      fromRadians(Math.atan(toRealNumber(value, "atan")), angleMode),

    sqrt: (value: unknown) => {
      const realValue = toRealNumber(value, "sqrt");

      if (realValue < 0) {
        throw new Error("Square root needs a non-negative value.");
      }

      return Math.sqrt(realValue);
    },

    log: (value: unknown) => {
      const realValue = toRealNumber(value, "log");

      if (realValue <= 0) {
        throw new Error("Logarithm needs a positive value.");
      }

      return Math.log10(realValue);
    },

    ln: (value: unknown) => {
      const realValue = toRealNumber(value, "ln");

      if (realValue <= 0) {
        throw new Error("Natural log needs a positive value.");
      }

      return Math.log(realValue);
    },

    abs: (value: unknown) => Math.abs(toRealNumber(value, "abs")),
  };
}

function toRadians(
  value: unknown,
  angleMode: AngleMode,
  functionName: string,
) {
  const realValue = toRealNumber(value, functionName);

  return angleMode === "DEG" ? (realValue * Math.PI) / 180 : realValue;
}

function fromRadians(value: number, angleMode: AngleMode) {
  return angleMode === "DEG" ? (value * 180) / Math.PI : value;
}

function toRealNumber(value: unknown, functionName: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${functionName} needs a real finite number.`);
  }

  return value;
}

function cleanErrorMessage(message: string) {
  if (message.includes("Parenthesis")) {
    return "Check that your parentheses are balanced.";
  }

  if (message.includes("Unexpected end")) {
    return "Complete the expression before calculating.";
  }

  if (message.includes("Unexpected operator")) {
    return "Check the operators in your expression.";
  }

  return message || "Check the expression and try again.";
}
