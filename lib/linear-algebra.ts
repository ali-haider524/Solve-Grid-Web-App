export type Matrix = number[][];
export type LinearMethod = "auto" | "gaussian" | "gauss-jordan" | "inverse" | "cramer";
export type LinearSystemResult =
  | { status: "unique"; solution: number[]; reduced: Matrix; method: string }
  | { status: "infinite"; reduced: Matrix; method: string }
  | { status: "none"; reduced: Matrix; method: string }
  | { status: "unsupported"; message: string; reduced: Matrix; method: string };

export const LINEAR_EPSILON = 1e-10;

export function cleanNumber(value: number) {
  return Math.abs(value) < LINEAR_EPSILON ? 0 : value;
}

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

export function transpose(matrix: Matrix): Matrix {
  if (!matrix.length || !matrix[0]?.length) return [];
  return matrix[0].map((_, column) => matrix.map((row) => cleanNumber(row[column])));
}

export function addMatrices(a: Matrix, b: Matrix): Matrix | null {
  if (!sameSize(a, b)) return null;
  return a.map((row, rowIndex) => row.map((value, columnIndex) => cleanNumber(value + b[rowIndex][columnIndex])));
}

export function subtractMatrices(a: Matrix, b: Matrix): Matrix | null {
  if (!sameSize(a, b)) return null;
  return a.map((row, rowIndex) => row.map((value, columnIndex) => cleanNumber(value - b[rowIndex][columnIndex])));
}

export function scalarMultiply(matrix: Matrix, scalar: number): Matrix {
  return matrix.map((row) => row.map((value) => cleanNumber(value * scalar)));
}

export function multiplyMatrices(a: Matrix, b: Matrix): Matrix | null {
  if (!a.length || !b.length || a[0].length !== b.length) return null;
  return a.map((row) =>
    Array.from({ length: b[0].length }, (_, columnIndex) =>
      cleanNumber(row.reduce((total, value, index) => total + value * b[index][columnIndex], 0)),
    ),
  );
}

export function trace(matrix: Matrix): number | null {
  if (!isSquare(matrix)) return null;
  return cleanNumber(matrix.reduce((sum, row, index) => sum + row[index], 0));
}

export function determinant(matrix: Matrix): number | null {
  if (!isSquare(matrix)) return null;
  const size = matrix.length;
  const copy = cloneMatrix(matrix);
  let sign = 1;
  let result = 1;

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(copy[row][column]) > Math.abs(copy[pivot][column])) pivot = row;
    }

    if (Math.abs(copy[pivot][column]) < LINEAR_EPSILON) return 0;

    if (pivot !== column) {
      [copy[pivot], copy[column]] = [copy[column], copy[pivot]];
      sign *= -1;
    }

    const pivotValue = copy[column][column];
    result *= pivotValue;

    for (let row = column + 1; row < size; row += 1) {
      const factor = copy[row][column] / pivotValue;
      for (let target = column; target < size; target += 1) {
        copy[row][target] = cleanNumber(copy[row][target] - factor * copy[column][target]);
      }
    }
  }

  return cleanNumber(result * sign);
}

export function ref(matrix: Matrix) {
  const output = cloneMatrix(matrix);
  const rows = output.length;
  const columns = output[0]?.length ?? 0;
  const pivotColumns: number[] = [];
  let pivotRow = 0;

  for (let column = 0; column < columns && pivotRow < rows; column += 1) {
    let bestRow = pivotRow;
    for (let row = pivotRow + 1; row < rows; row += 1) {
      if (Math.abs(output[row][column]) > Math.abs(output[bestRow][column])) bestRow = row;
    }

    if (Math.abs(output[bestRow][column]) < LINEAR_EPSILON) continue;

    [output[pivotRow], output[bestRow]] = [output[bestRow], output[pivotRow]];
    const pivotValue = output[pivotRow][column];

    for (let row = pivotRow + 1; row < rows; row += 1) {
      const factor = output[row][column] / pivotValue;
      for (let index = column; index < columns; index += 1) {
        output[row][index] = cleanNumber(output[row][index] - factor * output[pivotRow][index]);
      }
    }

    pivotColumns.push(column);
    pivotRow += 1;
  }

  return { matrix: output.map((row) => row.map(cleanNumber)), pivotColumns };
}

export function rref(matrix: Matrix) {
  const output = cloneMatrix(matrix);
  const rows = output.length;
  const columns = output[0]?.length ?? 0;
  const pivotColumns: number[] = [];
  let pivotRow = 0;

  for (let column = 0; column < columns && pivotRow < rows; column += 1) {
    let bestRow = pivotRow;
    for (let row = pivotRow + 1; row < rows; row += 1) {
      if (Math.abs(output[row][column]) > Math.abs(output[bestRow][column])) bestRow = row;
    }

    if (Math.abs(output[bestRow][column]) < LINEAR_EPSILON) continue;

    [output[pivotRow], output[bestRow]] = [output[bestRow], output[pivotRow]];
    const pivotValue = output[pivotRow][column];
    output[pivotRow] = output[pivotRow].map((value) => cleanNumber(value / pivotValue));

    for (let row = 0; row < rows; row += 1) {
      if (row === pivotRow) continue;
      const factor = output[row][column];
      if (Math.abs(factor) < LINEAR_EPSILON) continue;
      output[row] = output[row].map((value, index) => cleanNumber(value - factor * output[pivotRow][index]));
    }

    pivotColumns.push(column);
    pivotRow += 1;
  }

  return { matrix: output.map((row) => row.map(cleanNumber)), pivotColumns };
}

export function matrixRank(matrix: Matrix) {
  return rref(matrix).pivotColumns.length;
}

export function inverse(matrix: Matrix): Matrix | null {
  if (!isSquare(matrix)) return null;
  const size = matrix.length;
  const augmented = matrix.map((row, rowIndex) => [
    ...row,
    ...Array.from({ length: size }, (_, columnIndex) => (rowIndex === columnIndex ? 1 : 0)),
  ]);
  const reduced = rref(augmented);

  if (reduced.pivotColumns.length < size || reduced.pivotColumns.some((column, index) => column !== index)) {
    return null;
  }

  return reduced.matrix.map((row) => row.slice(size).map(cleanNumber));
}

export function minor(matrix: Matrix, removeRow: number, removeColumn: number) {
  return matrix
    .filter((_, rowIndex) => rowIndex !== removeRow)
    .map((row) => row.filter((_, columnIndex) => columnIndex !== removeColumn));
}

export function cofactorMatrix(matrix: Matrix): Matrix | null {
  if (!isSquare(matrix) || matrix.length > 5) return null;
  return matrix.map((row, rowIndex) =>
    row.map((_, columnIndex) => {
      const value = determinant(minor(matrix, rowIndex, columnIndex));
      return cleanNumber((rowIndex + columnIndex) % 2 === 0 ? value ?? 0 : -(value ?? 0));
    }),
  );
}

export function adjugate(matrix: Matrix): Matrix | null {
  const cofactors = cofactorMatrix(matrix);
  return cofactors ? transpose(cofactors) : null;
}

export function solveLinearSystem(a: Matrix, b: number[], method: LinearMethod = "auto"): LinearSystemResult {
  if (!isSquare(a) || b.length !== a.length) {
    return { status: "unsupported", message: "A square coefficient matrix and a matching vector b are required.", reduced: [], method: "" };
  }

  const size = a.length;
  const augmented = a.map((row, index) => [...row, b[index]]);
  const reduced = rref(augmented);
  const inconsistent = reduced.matrix.some((row) =>
    row.slice(0, size).every((value) => Math.abs(value) < LINEAR_EPSILON) && Math.abs(row[size]) >= LINEAR_EPSILON,
  );

  if (inconsistent) return { status: "none", reduced: reduced.matrix, method: methodLabel(method) };
  if (reduced.pivotColumns.filter((column) => column < size).length < size) {
    return { status: "infinite", reduced: reduced.matrix, method: methodLabel(method) };
  }

  if (method === "inverse") {
    const inv = inverse(a);
    if (!inv) return { status: "unsupported", message: "Matrix inverse method needs a non-singular coefficient matrix.", reduced: reduced.matrix, method: methodLabel(method) };
    const vector = multiplyMatrices(inv, b.map((value) => [value]));
    return { status: "unique", solution: vector?.map((row) => cleanNumber(row[0])) ?? [], reduced: reduced.matrix, method: "Matrix inverse" };
  }

  if (method === "cramer") {
    if (size > 4) return { status: "unsupported", message: "Cramer's rule is limited to 2–4 variables here to keep the calculation responsive.", reduced: reduced.matrix, method: "Cramer's rule" };
    const detA = determinant(a);
    if (detA === null || Math.abs(detA) < LINEAR_EPSILON) return { status: "unsupported", message: "Cramer's rule needs a non-zero determinant.", reduced: reduced.matrix, method: "Cramer's rule" };
    const solution = Array.from({ length: size }, (_, column) => {
      const replaced = a.map((row, rowIndex) => row.map((value, columnIndex) => (columnIndex === column ? b[rowIndex] : value)));
      return cleanNumber((determinant(replaced) ?? 0) / detA);
    });
    return { status: "unique", solution, reduced: reduced.matrix, method: "Cramer's rule" };
  }

  const solution = Array.from({ length: size }, (_, row) => cleanNumber(reduced.matrix[row][size]));
  return { status: "unique", solution, reduced: reduced.matrix, method: method === "gaussian" ? "Gaussian elimination" : method === "gauss-jordan" ? "Gauss-Jordan / RREF" : "Automatic row reduction" };
}

export function eigenvalues2(matrix: Matrix): { values: string[]; trace: number; determinant: number } | null {
  if (matrix.length !== 2 || matrix[0]?.length !== 2 || matrix[1]?.length !== 2) return null;
  const tr = trace(matrix) ?? 0;
  const det = determinant(matrix) ?? 0;
  const discriminant = tr ** 2 - 4 * det;

  if (Math.abs(discriminant) < LINEAR_EPSILON) {
    return { values: [formatComplex(tr / 2)], trace: tr, determinant: det };
  }
  if (discriminant > 0) {
    const root = Math.sqrt(discriminant);
    return { values: [formatComplex((tr + root) / 2), formatComplex((tr - root) / 2)], trace: tr, determinant: det };
  }
  const real = tr / 2;
  const imaginary = Math.sqrt(-discriminant) / 2;
  return { values: [`${formatComplex(real)} + ${formatComplex(imaginary)}i`, `${formatComplex(real)} − ${formatComplex(imaginary)}i`], trace: tr, determinant: det };
}

function formatComplex(value: number) {
  const rounded = Number(value.toPrecision(10));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function isSquare(matrix: Matrix) {
  return matrix.length > 0 && matrix.every((row) => row.length === matrix.length);
}

function sameSize(a: Matrix, b: Matrix) {
  return a.length === b.length && a.every((row, index) => row.length === b[index]?.length);
}

function methodLabel(method: LinearMethod) {
  if (method === "gaussian") return "Gaussian elimination";
  if (method === "gauss-jordan") return "Gauss-Jordan / RREF";
  if (method === "inverse") return "Matrix inverse";
  if (method === "cramer") return "Cramer's rule";
  return "Automatic row reduction";
}
