import { all, create } from "mathjs";

export type OdeMethod = "euler" | "heun" | "rk4";
export type OdeMode = "single" | "system";

export type OdePoint = {
  x: number;
  y: number;
  z?: number;
};

export type OdeSolveResult = {
  points: OdePoint[];
  method: OdeMethod;
  mode: OdeMode;
  stepCount: number;
  stepSize: number;
  warning?: string;
};

type Scope = { x: number; y: number; z: number };
type Derivative = (scope: Scope) => number;

const math = create(all, {
  number: "number",
  matrix: "Array",
  predictable: false,
});

const allowedIdentifiers = new Set([
  "x",
  "y",
  "z",
  "pi",
  "e",
  "sin",
  "cos",
  "tan",
  "sinh",
  "cosh",
  "tanh",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "abs",
  "exp",
  "log",
  "ln",
  "floor",
  "ceil",
  "round",
  "sign",
  "min",
  "max",
  "pow",
]);

function normalizeExpression(expression: string) {
  return expression
    .trim()
    .toLowerCase()
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt")
    .replace(/\bdy\/dx\s*=/g, "")
    .replace(/\bdz\/dx\s*=/g, "")
    .replace(/\by['’]?\s*=/g, "")
    .replace(/\bz['’]?\s*=/g, "")
    .replace(/(\d|\))\s*(sin|cos|tan|sinh|cosh|tanh|sqrt|abs|exp|log|ln)\b/g, "$1*$2")
    .replace(/(\d)\s*([xyz])\b/g, "$1*$2")
    .replace(/\)\s*([xyz])/g, ")*$1");
}

function validateExpression(expression: string) {
  if (!expression) {
    throw new Error("Enter a differential equation right-hand side first.");
  }

  if (expression.length > 220) {
    throw new Error("Keep each differential equation under 220 characters.");
  }

  if (!/^[0-9a-z_+\-*/^().,\s]+$/i.test(expression)) {
    throw new Error("Use numbers, x, y, z, supported functions, and normal operators only.");
  }

  const withoutScientificNotation = expression.replace(
    /\d+(?:\.\d+)?(?:e[+\-]?\d+)?/gi,
    "0",
  );

  const identifiers = withoutScientificNotation.match(/[a-z_]\w*/gi) ?? [];

  for (const identifier of identifiers) {
    if (!allowedIdentifiers.has(identifier.toLowerCase())) {
      throw new Error(`\"${identifier}\" is not supported in the ODE workspace.`);
    }
  }
}

function createScope(scope: Scope) {
  return {
    x: scope.x,
    y: scope.y,
    z: scope.z,
    pi: Math.PI,
    e: Math.E,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sqrt: (value: number) => {
      if (value < 0) throw new Error("sqrt needs a non-negative value in this real-valued lab.");
      return Math.sqrt(value);
    },
    abs: Math.abs,
    exp: Math.exp,
    log: (value: number) => {
      if (value <= 0) throw new Error("log needs a positive value.");
      return Math.log(value);
    },
    ln: (value: number) => {
      if (value <= 0) throw new Error("ln needs a positive value.");
      return Math.log(value);
    },
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    sign: Math.sign,
    min: Math.min,
    max: Math.max,
    pow: Math.pow,
  };
}

export function compileDerivative(expression: string): Derivative {
  const normalized = normalizeExpression(expression);
  validateExpression(normalized);

  let compiled: { evaluate: (scope: Record<string, unknown>) => unknown };

  try {
    compiled = math.compile(normalized) as unknown as { evaluate: (scope: Record<string, unknown>) => unknown };
  } catch {
    throw new Error("Check the equation syntax. Example: -2*y + sin(x)");
  }

  return (scope: Scope) => {
    try {
      const value = compiled.evaluate(createScope(scope));

      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error("The equation produced a non-finite value.");
      }

      return value;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(cleanMessage(error.message));
      }

      throw new Error("The equation could not be evaluated at this step.");
    }
  };
}

export function solveSingleOde(input: {
  derivative: string;
  x0: number;
  y0: number;
  xEnd: number;
  step: number;
  method: OdeMethod;
}): OdeSolveResult {
  const derivative = compileDerivative(input.derivative);
  const config = validateConfiguration(input.x0, input.xEnd, input.step);
  const points: OdePoint[] = [{ x: input.x0, y: input.y0 }];
  let x = input.x0;
  let y = input.y0;

  for (let index = 0; index < config.steps; index += 1) {
    const h = Math.abs(input.xEnd - x) < Math.abs(config.step) ? input.xEnd - x : config.step;
    y = stepSingle(derivative, input.method, x, y, h);
    x += h;

    if (!Number.isFinite(y) || !Number.isFinite(x)) {
      throw new Error("The simulation became undefined. Use a smaller step size or check the equation.");
    }

    points.push({ x, y });
  }

  return {
    points,
    method: input.method,
    mode: "single",
    stepCount: points.length - 1,
    stepSize: config.step,
    ...(config.warning ? { warning: config.warning } : {}),
  };
}

export function solveTwoStateSystem(input: {
  derivativeY: string;
  derivativeZ: string;
  x0: number;
  y0: number;
  z0: number;
  xEnd: number;
  step: number;
  method: OdeMethod;
}): OdeSolveResult {
  const derivativeY = compileDerivative(input.derivativeY);
  const derivativeZ = compileDerivative(input.derivativeZ);
  const config = validateConfiguration(input.x0, input.xEnd, input.step);
  const points: OdePoint[] = [{ x: input.x0, y: input.y0, z: input.z0 }];
  let x = input.x0;
  let y = input.y0;
  let z = input.z0;

  for (let index = 0; index < config.steps; index += 1) {
    const h = Math.abs(input.xEnd - x) < Math.abs(config.step) ? input.xEnd - x : config.step;
    const next = stepSystem(derivativeY, derivativeZ, input.method, x, y, z, h);
    x += h;
    y = next.y;
    z = next.z;

    if (!Number.isFinite(y) || !Number.isFinite(z) || !Number.isFinite(x)) {
      throw new Error("The simulation became undefined. Use a smaller step size or check the equations.");
    }

    points.push({ x, y, z });
  }

  return {
    points,
    method: input.method,
    mode: "system",
    stepCount: points.length - 1,
    stepSize: config.step,
    ...(config.warning ? { warning: config.warning } : {}),
  };
}

function validateConfiguration(x0: number, xEnd: number, requestedStep: number) {
  if (![x0, xEnd, requestedStep].every(Number.isFinite)) {
    throw new Error("Initial x, final x, and step size must be finite numbers.");
  }

  if (requestedStep === 0) {
    throw new Error("Step size cannot be zero.");
  }

  if (x0 === xEnd) {
    return { step: requestedStep, steps: 0 };
  }

  const direction = Math.sign(xEnd - x0);
  const step = Math.abs(requestedStep) * direction;
  const steps = Math.ceil(Math.abs((xEnd - x0) / step));

  if (steps > 10_000) {
    throw new Error("This run would exceed 10,000 steps. Increase the step size or shorten the interval.");
  }

  return {
    step,
    steps,
    ...(Math.sign(requestedStep) !== direction
      ? { warning: "The step direction was adjusted to move toward the selected final x value." }
      : {}),
  };
}

function stepSingle(derivative: Derivative, method: OdeMethod, x: number, y: number, h: number) {
  const f = (nextX: number, nextY: number) => derivative({ x: nextX, y: nextY, z: 0 });

  if (method === "euler") {
    return y + h * f(x, y);
  }

  if (method === "heun") {
    const k1 = f(x, y);
    const k2 = f(x + h, y + h * k1);
    return y + (h * (k1 + k2)) / 2;
  }

  const k1 = f(x, y);
  const k2 = f(x + h / 2, y + (h * k1) / 2);
  const k3 = f(x + h / 2, y + (h * k2) / 2);
  const k4 = f(x + h, y + h * k3);
  return y + (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
}

function stepSystem(
  derivativeY: Derivative,
  derivativeZ: Derivative,
  method: OdeMethod,
  x: number,
  y: number,
  z: number,
  h: number,
) {
  const f = (nextX: number, nextY: number, nextZ: number) => ({
    y: derivativeY({ x: nextX, y: nextY, z: nextZ }),
    z: derivativeZ({ x: nextX, y: nextY, z: nextZ }),
  });

  if (method === "euler") {
    const k1 = f(x, y, z);
    return { y: y + h * k1.y, z: z + h * k1.z };
  }

  if (method === "heun") {
    const k1 = f(x, y, z);
    const k2 = f(x + h, y + h * k1.y, z + h * k1.z);
    return {
      y: y + (h * (k1.y + k2.y)) / 2,
      z: z + (h * (k1.z + k2.z)) / 2,
    };
  }

  const k1 = f(x, y, z);
  const k2 = f(x + h / 2, y + (h * k1.y) / 2, z + (h * k1.z) / 2);
  const k3 = f(x + h / 2, y + (h * k2.y) / 2, z + (h * k2.z) / 2);
  const k4 = f(x + h, y + h * k3.y, z + h * k3.z);

  return {
    y: y + (h * (k1.y + 2 * k2.y + 2 * k3.y + k4.y)) / 6,
    z: z + (h * (k1.z + 2 * k2.z + 2 * k3.z + k4.z)) / 6,
  };
}

function cleanMessage(message: string) {
  if (message.includes("Undefined symbol") || message.includes("Undefined function")) {
    return "Use x, y, z and supported functions such as sin, cos, exp, sqrt, abs, and log.";
  }

  if (message.includes("Parenthesis") || message.includes("Unexpected")) {
    return "Check parentheses and operators in the differential equation.";
  }

  return message || "Check the differential equation and try again.";
}
