export type LinearConstraint = {
  a: number;
  b: number;
  operator: "<=" | ">=" | "=";
  c: number;
};

export type LinearProgram = {
  objectiveX: number;
  objectiveY: number;
  direction: "max" | "min";
  constraints: LinearConstraint[];
  nonNegative: boolean;
};

export type LpPoint = { x: number; y: number; value: number };

export type LpResult = {
  feasiblePoints: LpPoint[];
  optimum?: LpPoint;
  status: "optimal" | "infeasible" | "insufficient";
  note: string;
};

const EPSILON = 1e-8;

function intersection(first: LinearConstraint, second: LinearConstraint) {
  const determinant = first.a * second.b - second.a * first.b;
  if (Math.abs(determinant) < EPSILON) return null;
  return {
    x: (first.c * second.b - second.c * first.b) / determinant,
    y: (first.a * second.c - second.a * first.c) / determinant,
  };
}

function isFeasible(point: { x: number; y: number }, constraints: LinearConstraint[]) {
  return constraints.every((constraint) => {
    const lhs = constraint.a * point.x + constraint.b * point.y;
    if (constraint.operator === "<=") return lhs <= constraint.c + EPSILON;
    if (constraint.operator === ">=") return lhs >= constraint.c - EPSILON;
    return Math.abs(lhs - constraint.c) <= EPSILON;
  });
}

function uniquePoints(points: Array<{ x: number; y: number }>) {
  const result: Array<{ x: number; y: number }> = [];
  for (const point of points) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
    if (!result.some((existing) => Math.abs(existing.x - point.x) < 1e-7 && Math.abs(existing.y - point.y) < 1e-7)) {
      result.push(point);
    }
  }
  return result;
}

export function solveTwoVariableLinearProgram(program: LinearProgram): LpResult {
  const constraints = program.constraints.filter((item) => [item.a, item.b, item.c].every(Number.isFinite));
  if (!constraints.length) {
    return { feasiblePoints: [], status: "insufficient", note: "Add at least one numeric constraint." };
  }

  const allConstraints = [...constraints];
  if (program.nonNegative) {
    allConstraints.push({ a: 1, b: 0, operator: ">=", c: 0 }, { a: 0, b: 1, operator: ">=", c: 0 });
  }

  const candidates: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];
  for (let first = 0; first < allConstraints.length; first += 1) {
    for (let second = first + 1; second < allConstraints.length; second += 1) {
      const point = intersection(allConstraints[first], allConstraints[second]);
      if (point) candidates.push(point);
    }
  }

  const feasible = uniquePoints(candidates)
    .filter((point) => isFeasible(point, allConstraints))
    .map((point) => ({ ...point, value: program.objectiveX * point.x + program.objectiveY * point.y }))
    .sort((first, second) => first.x - second.x || first.y - second.y);

  if (!feasible.length) {
    return { feasiblePoints: [], status: "infeasible", note: "No feasible corner point was found for the entered constraints." };
  }

  const optimum = feasible.reduce((best, point) => {
    if (program.direction === "max") return point.value > best.value ? point : best;
    return point.value < best.value ? point : best;
  }, feasible[0]);

  return {
    feasiblePoints: feasible,
    optimum,
    status: "optimal",
    note: "The result is evaluated at feasible corner points. Check for an unbounded feasible region before treating this as a complete LP certificate.",
  };
}
