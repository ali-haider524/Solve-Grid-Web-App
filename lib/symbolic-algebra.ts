export type SymbolicAction = "simplify" | "differentiate" | "evaluate" | "equivalent";

export type SymbolicRequest = {
  action: SymbolicAction;
  expression: string;
  comparison?: string;
  variable?: string;
  value?: number;
};

export type SymbolicResult = {
  title: string;
  result: string;
  method: string;
  note: string;
};

const allowedIdentifiers = new Set([
  "x", "y", "z", "a", "b", "c", "pi", "e",
  "sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh",
  "sqrt", "abs", "exp", "log", "ln", "floor", "ceil", "round", "sign", "min", "max",
]);

function normalize(expression: string) {
  return expression
    .trim()
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt")
    .replace(/\bln\s*\(/gi, "log(");
}

function validate(expression: string) {
  if (!expression) throw new Error("Enter an expression first.");
  if (expression.length > 300) throw new Error("Keep expressions under 300 characters.");
  if (!/^[0-9A-Za-z_+\-*/^().,\s]+$/.test(expression)) throw new Error("Use normal math symbols, supported functions, and variables only.");
  const withoutNumbers = expression.replace(/\d+(?:\.\d+)?(?:e[+\-]?\d+)?/gi, "0");
  const identifiers = withoutNumbers.match(/[A-Za-z_]\w*/g) ?? [];
  for (const identifier of identifiers) {
    if (!allowedIdentifiers.has(identifier.toLowerCase())) throw new Error(`\"${identifier}\" is not available in this symbolic workspace.`);
  }
}

function cleanError(error: unknown) {
  const message = error instanceof Error ? error.message : "Check the expression and try again.";
  if (/undefined symbol|undefined function/i.test(message)) return "Use supported variables and functions only.";
  if (/parenthesis|unexpected|syntax/i.test(message)) return "Check parentheses and operators in the expression.";
  return message;
}

function formatValue(value: unknown) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("The expression is undefined or too large.");
    return String(Number(value.toPrecision(12)));
  }
  return String(value);
}

export async function runSymbolicRequest(request: SymbolicRequest): Promise<SymbolicResult> {
  const expression = normalize(request.expression);
  const variable = (request.variable || "x").trim().toLowerCase();
  validate(expression);
  if (!new Set(["x", "y", "z", "a", "b", "c"]).has(variable)) throw new Error("Choose one of x, y, z, a, b, or c as the differentiation variable.");

  try {
    const mathModule = await import("mathjs");
    const math = mathModule.create(mathModule.all, { number: "number", matrix: "Array", predictable: false });
    if (request.action === "simplify") {
      return { title: "Simplified expression", result: math.simplify(expression).toString(), method: "Math.js simplification rules", note: "The simplifier rewrites the expression; domain restrictions may still matter." };
    }
    if (request.action === "differentiate") {
      return { title: `Derivative with respect to ${variable}`, result: math.derivative(expression, variable).toString(), method: "Symbolic differentiation", note: "This is a symbolic derivative, not a numerical approximation." };
    }
    if (request.action === "evaluate") {
      const value = Number.isFinite(request.value) ? request.value as number : 0;
      const evaluated = math.evaluate(expression, { x: value, y: value, z: value, a: value, b: value, c: value, pi: Math.PI, e: Math.E });
      return { title: `Evaluated at ${variable} = ${value}`, result: formatValue(evaluated), method: "Numerical evaluation", note: "All single-letter variables are assigned the selected value in this quick evaluation mode." };
    }
    const comparison = normalize(request.comparison || "");
    validate(comparison);
    const difference = math.simplify(`(${expression}) - (${comparison})`).toString();
    const equivalent = difference === "0" || difference === "0.0";
    return { title: equivalent ? "Expressions reduce to the same form" : "Expressions are not reduced to the same form", result: equivalent ? "Equivalent (simplifier result: 0)" : `Simplified difference: ${difference}`, method: "Simplify the difference between both expressions", note: "This is an algebraic simplifier check, not a formal proof over every possible domain." };
  } catch (error) { throw new Error(cleanError(error)); }
}
