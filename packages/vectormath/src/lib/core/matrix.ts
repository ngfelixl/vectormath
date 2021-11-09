import { Vector } from './vector';

/**
 * ## Matrix
 *
 * The matrix class extends the JavaScript Array class containing Vectors.
 *
 * ### Example
 *
 * You can instantiate an empty matrix without any arguments.
 *
 * ```typescript
 * const matrix = new Matrix()
 * ```
 *
 * or with shape arguments. E.g. passing in 2 and 3 generates a
 * 2x3 matrix.
 *
 * ```typescript
 * const matrix = new Matrix(2, 3);
 * ```
 */
export class Matrix extends Array<Vector> {
  constructor(x?: number, y?: number) {
    super();

    if (x && y) {
      for (let i = 0; i < x; i++) {
        this[i] = new Vector(y);
      }
    }

    Object.setPrototypeOf(this, new.target.prototype);

    return this;
  }

  /**
   * Returns the shape of the matrix. Also validates each
   * row for equal lengths.
   */
  get shape(): [number, number] {
    if (this.length > 0) {
      this.validate();
      return [this.length, this[0].length];
    } else {
      return [0, 0];
    }
  }

  /**
   * Reshape and insert the matrix by a given matrix.
   *
   * @param matrix
   */
  from(matrix: Vector[] | Matrix | number[][]) {
    this.splice(0, this.length);

    for (const row of matrix) {
      const vec = new Vector(row.length).from(row);
      this.push(vec);
    }

    this.validate();
    return this;
  }

  /**
   * Creates a identity matrix. Shapes it NxN and fills it with
   * ones on the diagonal and zeros else.
   */
  identity(size?: number) {
    if (size) {
      if (!(size >= 0 && Number.isInteger(size))) {
        throw new Error('Size must be a positive integer value');
      }

      this.splice(0, this.length);

      for (let i = 0; i < size; i++) {
        const vector = new Vector(size).fill(0);
        vector[i] = 1;
        this.push(vector);
      }
    } else {
      if (!this.NxN) {
        throw new Error('Matrix has to be NxN shaped');
      }

      this.map((row, index) => {
        row.fill(0);
        row[index] = 1;
        return row;
      });
    }
    return this;
  }

  /**
   * Fill the entire matrix with zeros
   */
  zeros() {
    for (const row of this) {
      row.zeros();
    }
    return this;
  }

  /**
   * Fill the entire matrix with zeros
   */
  ones() {
    for (const row of this) {
      row.ones();
    }
    return this;
  }

  /**
   * Fill the entire matrix with random numbers.
   */
  random() {
    for (const row of this) {
      row.random();
    }
    return this;
  }

  /**
   * Multiplicates the matrix with a given input. If the input is
   * a matrix, it will perform a matrix-matrix multiplication. If
   * it is a vector, it determines the matrix-vector product, and
   * if it is a scalar value, each element will be multiplied by
   * it.
   *
   * @param multiplicator
   */
  dot<T = Vector | Matrix | number>(
    multiplicator: T
  ): T extends Vector ? Vector : Matrix;
  dot<T = Vector | Matrix | number>(multiplicator: T): Vector | Matrix {
    if (multiplicator instanceof Vector) {
      return this.vectorMultiplication(multiplicator);
    } else if (multiplicator instanceof Matrix) {
      return this.matrixMultiplication(multiplicator);
    } else if (
      typeof multiplicator === 'number' &&
      !Number.isNaN(multiplicator)
    ) {
      return this.scalarMultiplication(multiplicator);
    } else {
      throw new TypeError(
        `Multiplication requires a Vector, a Matrix or a number as parameter`
      );
    }
  }

  /**
   * Swap dimensions
   */
  transpose() {
    const shape = [...this.shape];
    const matrix = new Matrix(shape[1], shape[0]);

    for (let i = 0; i < shape[0]; i++) {
      for (let j = 0; j < shape[1]; j++) {
        matrix[j][i] = this[i][j];
      }
    }

    this.from(matrix);
    return this;
  }

  /**
   * Solves the system of linear equations using Cramer's rule. Throws an
   * error if there is no solution.
   *
   * @param vector
   */
  solve(vector: Vector): Vector | null {
    if (!(vector instanceof Vector) || vector.length !== this.shape[1]) {
      throw new Error(
        `Vector has to be of size ${this.shape[1]} but is ${vector.length}`
      );
    }
    const det = this.determinant;
    if (det !== 0) {
      let determinants = new Vector(vector.length);

      for (let i = 0; i < vector.length; i++) {
        const temp = new Matrix().from(this);
        temp.transpose();
        temp[i].from(vector);
        temp.transpose();
        const determinant = temp.determinant;
        if (determinant) {
          determinants[i] = determinant;
        } else {
          return null;
        }
      }

      determinants = determinants.dot(1 / det);

      return determinants;
    } else {
      return null;
    }
  }

  /**
   * Diagonlize the matrix to the upper triangular using
   * Gauss elimination.
   *
   * @param matrix
   */
  diagonalize() {
    for (let i = 0; i < this.length; i++) {
      for (let j = i + 1; j < this.length; j++) {
        const factor = this[j][i] / this[i][i];
        const row = this[i].dot(factor);
        this[j] = this[j].add(row.invert());
      }
    }
    return this;
  }

  /**
   * Computes the trace of the matrix. Matrix has to be
   * of shape NxN
   */
  get trace() {
    if (!this.NxN) {
      throw new Error('Trace requires a NxN matrix');
    }

    let trace = 0;
    for (let i = 0; i < this.length; i++) {
      trace += this[i][i];
    }
    return trace;
  }

  /**
   * Determines the n-dimensional determinant of an NxN-shaped
   * matrix.
   */
  get determinant(): number {
    if (!this.NxN) {
      throw new Error(`Determinants require matrices having shape NxN`);
    }
    return this._determinant(this);
  }

  /**
   * Returns a part of the matrix
   */
  extract(rangeX: [number, number], rangeY: [number, number]): Matrix {
    if (!this.validRange(rangeX, rangeY)) {
      const shape = JSON.stringify(this.shape);
      const rx = JSON.stringify(rangeX);
      const ry = JSON.stringify(rangeY);

      throw new Error(`Invalid range: ${rx} ${ry} for shape ${shape}`);
    } else {
      const elements = [rangeX[1] - rangeX[0] + 1, rangeY[1] - rangeY[0] + 1];
      const matrix = new Matrix(elements[0], elements[1]);

      for (let i = 0; i < elements[0]; i++) {
        for (let j = 0; j < elements[1]; j++) {
          matrix[i][j] = this[i + rangeX[0]][j + rangeY[0]];
        }
      }
      return matrix;
    }
  }

  /**
   * Recursively determines the determinant of an NxN matrix
   *
   * @param matrix
   */
  private _determinant(matrix: Matrix): number {
    if (matrix.length > 2) {
      let determinant = 0;
      for (let i = 0; i < matrix.shape[1]; i++) {
        determinant +=
          (((i + 1) % 2) * 2 - 1) *
          matrix[0][i] *
          this._determinant(this.removeEntries(matrix, 0, i));
      }
      return determinant;
    } else {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
  }

  /**
   * Returns the matrix with row x and column y removed
   */
  private removeEntries(matrix: Matrix, x: number, y: number): Matrix {
    const result = new Matrix().from(matrix);

    result.splice(x, 1);

    for (const row of result) {
      row.splice(y, 1);
    }
    return result;
  }

  private get NxN() {
    return this.length === this.shape[1];
  }

  /**
   * Checks if the range values are in the shape of the matrix
   *
   * @param rangeX
   * @param rangeY
   */
  private validRange(
    rangeX: [number, number],
    rangeY: [number, number]
  ): boolean {
    const shape = this.shape;
    let validX = false;
    let validY = false;
    if (
      rangeX[0] >= 0 &&
      rangeX[0] < shape[0] &&
      rangeX[1] >= rangeX[0] &&
      rangeX[1] < shape[0]
    ) {
      validX = true;
    }
    if (
      rangeY[0] >= 0 &&
      rangeY[0] < shape[1] &&
      rangeY[1] >= rangeY[0] &&
      rangeY[1] < shape[1]
    ) {
      validY = true;
    }
    return validX && validY;
  }

  private vectorMultiplication<T extends Vector>(vector: T): Vector {
    if (vector.length !== this.shape[1]) {
      throw new Error(
        `Matrix-vector multiplication requires the dimensions to be (MxN) and N`
      );
    }

    const result = new Vector();

    for (const row of this) {
      result.push(row.dot(vector) as number);
    }

    return result;
  }

  private scalarMultiplication(scalar: number): Matrix {
    const matrix = new Matrix(this.shape[0], this.shape[1]);
    for (let i = 0; i < this.length; i++) {
      matrix[i] = this[i].dot(scalar);
    }
    return matrix;
  }

  private matrixMultiplication(matrix: Matrix): Matrix {
    if (this.shape[1] !== matrix.shape[0]) {
      throw new Error(
        `Matrix shapes invalid. Matrices have to be [NxM] and [MxP] shaped`
      );
    }
    const result = new Matrix(this.shape[0], matrix.shape[1]);

    matrix.transpose();

    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        result[i][j] = this[i].dot(matrix[j]);
      }
    }
    return result;
  }

  /**
   * Validates if all rows are of equal dimensions
   */
  private validate() {
    if (this.length > 0) {
      const yShape = this[0].length;
      for (const row of this) {
        if (yShape !== row.length) {
          throw new Error(
            `Your matrix is broken, it contains rows with different dimensions: ${yShape} and ${row.length}`
          );
        }
      }
    }
  }
}
