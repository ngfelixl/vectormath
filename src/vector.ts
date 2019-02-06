/**
 * ## Vector
 *
 * The Vector class extends the JavaScript Array class by
 * algebraic operations like translation (**add**) or rotation.
 * It can be of any dimension. Some functions are only available
 * to specific number of dimensions and will throw a controlled
 * error, e.g. cross-product requires three dimensions.
 *
 * ### Example
 *
 * Following snippets contain valid constructions of a Vector
 *
 * **Initializing an predefined Vector**
 *
 * ```typescript
 * const vec = new Vector(4, -1, 9);
 * ```
 *
 * **Initializing from an Array**
 *
 * ```typescript
 * const arr = [4, 5, 6];
 * const vec = new Vector(...arr);
 * // or
 * const vec = new Vector();
 * vec.from(arr);
 * ```
 *
 * **Copy a Vector**
 *
 * ```typescript
 * const vec = new Vector(2, 3, 4);
 * const vecCopy = new Vector(...vec);
 * ```
 */
export class Vector extends Array<number> {
  constructor(...vector: number[]) {
    super(...vector);

    // [1] Set the prototype explicitly, required for ES5.
    // Object.setPrototypeOf(this, Vector.prototype);

    // [1] or: Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    return this;
  }

  /**
   * Parse JavaScript array values into this vector
   * @param vector
   */
  from(vector: number[]) {
    for (let i = 0; i < vector.length; i++) {
      this[i] = vector[i];
    }
    return this;
  }

  /**
   * Fill the entire vector with zeros.
   */
  zeros() {
    for (let i = 0; i < this.length; i++) {
      this[i] = 0;
    }
    return this;
  }

  /**
   * Fill the entire vector with zeros.
   */
  ones() {
    for (let i = 0; i < this.length; i++) {
      this[i] = 1;
    }
    return this;
  }

  /**
   * Fill the entire vectors with randomly generated values
   * in [0, 1]. Use in combination with `.normalize()` to
   * get a normalized random vector.
   */
  random() {
    for (let i = 0; i < this.length; i++) {
      this[i] = Math.random();
    }
    return this;
  }

  /**
   * Add a vector or a scalar to this vector.
   * @param vector
   * @return addition
   */
  add(vector: Vector | number[] | number): Vector {
    if (vector instanceof Vector || vector instanceof Array) {
      if (this.length !== vector.length && vector.length !== 1) {
        throw new Error(`Can't add vectors having unequal dimensions or dimension not equal to 1`);
      }
      const result = new Vector();
      for (let i = 0; i < this.length; i++) {
        result[i] = this[i] + vector[vector.length === 1 ? 0 : i];
      }

      return result;
    } else if (typeof vector === 'number' && !Number.isNaN(vector)) {
      const result = new Vector();
      for (let i = 0; i < this.length; i++) {
        result[i] = this[i] + vector;
      }
      return result;
    } else {
      throw new Error(`Parameter must be of type Vector, Array<number> or number`);
    }
  }

  /**
   * Returns the euclidian distance of the n-dimensional vector
   */
  get distance() {
    let distance = 0;

    for (let i = 0; i < this.length; i++) {
      distance += this[i] * this[i];
    }

    return Math.sqrt(distance);
  }

  /**
   * ## Signed angle (2D)
   *
   * Calculate the signed angle in two dimensions
   * between this vector and the given vector
   * in n-dimensional euclidian space in respect to the
   * executing vector. It requires the vector dimensions
   * to be equal since it uses the dot-product.
   *
   * @returns angle [radians]
   *
   * Example
   *
   * In this two listing there is the demonstration of
   * the *sign*. The angle will be in the range of (-PI, PI].
   *
   * ```
   *    parameter
   *    ^
   *    |   angle = +PI / 2
   *    |
   *    +------> this ```
   *
   * Imagine you look into the direction of **this**. If
   * the parameter vector is to your left, the angle is positive,
   * if the parameter vector is to your right, the angle is negative.
   *
   * ```
   *    +------> this
   *    |
   *    |   angle = -PI / 2
   *    v
   *    parameter ```
   */
  signedAngle(vector: Vector): number {
    if (this.length !== 2 || this.length !== vector.length) {
      throw new Error(`Vector dimensions must be 2`);
    }

    let angle = Math.atan2(vector[1], vector[0]) - Math.atan2(this[1], this[0]);

    if (angle > Math.PI) {
      angle -= 2 * Math.PI;
    } else if (angle <= -Math.PI) {
      angle += 2 * Math.PI;
    }
    return angle;
  }

  /**
   * Calculate the unsigned angle in n-dimensions
   * between this vector and the given vector
   * in n-dimensional euclidian space in respect to the
   * executing vector. It requires the vector dimensions
   * to be equal since it uses the dot-product.
   * @returns angle [radians]
   */
  angle(vector: Vector): number {
    return Math.acos((this.scalarProduct(vector) as number) / (this.distance * vector.distance));
  }

  /**
   * Normalize the vector to a length 1 vector preserving the direction
   * using the euclidian distance. Vector can have any number of dimensions.
   */
  normalize() {
    const distance = this.distance;
    for (let i = 0; i < this.length; i++) {
      this[i] = this[i] / distance;
    }
    return this;
  }

  /**
   * Multiply this vector with another one. Result will be
   * returned and not stored. If the parameter is a vector
   * it will determine the scalar-product, if it is a scalar
   * it will perform a vector-scalar-multiplication.
   * @param vector
   */
  dot<T extends Vector | number[] | number>(vector: T): T extends Vector ? number : Vector;
  dot(vector: Vector | number[] | number): Vector | number {
    if (vector instanceof Vector || vector instanceof Array) {
      if (vector.length === 1) {
        return this.product(vector[0]);
      } else {
        return this.scalarProduct(vector);
      }
    } else if (typeof vector === 'number' && !Number.isNaN(vector)) {
      return this.product(vector);
    } else {
      throw new TypeError('Multiplication requires a vector, array or an integer number as input');
    }
  }

  /**
   * Calculates the cross product of two vectors. Cross product requires 3
   * dimensional vectors.
   * @param vector
   */
  cross(vector: Vector | number[]): Vector {
    if (this.length !== 3) {
      throw new Error(`Cross product not available for vectors with dimension not equal to 3`);
    }
    if (this.length !== vector.length) {
      throw new Error(`Can't build the vector-product of unequally sized vectors`);
    }

    const product = new Vector(3);

    product[0] = this[1] * vector[2] - this[2] * vector[1];
    product[1] = this[2] * vector[0] - this[0] * vector[2];
    product[2] = this[0] * vector[1] - this[1] * vector[0];

    return product;
  }

  /**
   * Calculate the element wise multiplication of two vectors.
   * This operation is also called Hadamard-product or Schur-product.
   * It requires the vector dimensions to be equal.
   * @param vector
   *
   */
  multiplyElementWise(vector: Vector): Vector {
    if (this.length !== vector.length) {
      throw new Error(`Can't multiply unequal sized vectors element-wise`);
    }

    const result = new Vector();
    for (let i = 0; i < this.length; i++) {
      result[i] = this[i] * vector[i];
    }

    return result;
  }

  /**
   * Calculate the element wise multiplication of two vectors.
   * This operation is also called Hadamard-product or Schur-product.
   * It requires the vector dimensions to be equal.
   * @param vector
   *
   */
  divideElementWise(vector: Vector): Vector {
    if (this.length !== vector.length) {
      throw new Error(`Can't divide unequal sized vectors element-wise`);
    }

    const result = new Vector();
    for (let i = 0; i < this.length; i++) {
      result[i] = this[i] / vector[i];
    }

    return result;
  }

  /**
   * ## Invert
   *
   * Chainable function for vector inversion.
   *
   * ### Example
   *
   * ```typescript
   * const vector = new Vector(-2, 4);
   * vector.invert();
   * console.log(vector); // [2, -4];
   * ```
   *
   * It is also chainable, so you can use it directly with
   * other operators like `rotate2D` or itself (which propably
   * does not make sense).
   *
   * Two times inversion returns the original vector
   *
   * ```typescript
   * const vector = new Vector(2, 4);
   * vector.invert().invert();
   * console.log(vector); // [2, 4]
   * ```
   *
   *
   */
  invert(): Vector {
    for (let i = 0; i < this.length; i++) {
      this[i] = -this[i];
    }
    return this;
  }

  /**
   * ## Rotation
   *
   * Rotate a two dimensional vector by an angle [radians]. This
   * operation is chainable.
   *
   * ### Example
   *
   * ```typescript
   * const vector = new Vector(1, 0);
   * vector.rotate2D(Math.PI);
   * console.log(vector); // [-1, 0];
   * ```
   *
   * ### Under the hood
   *
   * The vector gets rotated by a rotation matrix
   *
   * ```
   * R = | cos(angle)  -sin(angle) |
   *     | sin(angle)   cos(angle) |```
   *
   * The result is a simple matrix vector multiplication
   *
   * `rotatedVector = R * originalVector`
   */
  rotate2D(angle: number): Vector {
    if (this.length !== 2) {
      throw new Error(`Rotation in two dimensions requires a two dimensional vector`);
    }

    this[0] = Math.cos(angle) * this[0] - Math.sin(angle) * this[1];
    this[1] = Math.sin(angle) * this[0] + Math.cos(angle) * this[1];
    return this;
  }

  /**
   * Subtracts a vector from this vector. Returns the
   * subtraction.
   * @param vector
   */
  subtract(vector: Vector) {
    const vectorCopy = new Vector(...vector);
    return this.add(vectorCopy.invert());
  }

  private scalarProduct(vector: Vector | number[]): number {
    if (this.length !== vector.length && vector.length !== 1) {
      throw new Error(`Can't multiply vectors having unequal dimensions`);
    }

    let product = 0;
    for (let i = 0; i < this.length; i++) {
      product += this[i] * vector[i];
    }
    return product;
  }

  private product(scalar: number): Vector {
    const product = new Vector();

    for (let i = 0; i < this.length; i++) {
      product[i] = this[i] * scalar;
    }

    return product;
  }
}
