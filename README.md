# Vector

![build](https://travis-ci.org/ngfelixl/vectormath.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ngfelixl/vectormath/badge.svg?branch=master)](https://coveralls.io/github/ngfelixl/vectormath?branch=master)
![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)
[![npmversion](https://img.shields.io/npm/v/@geometric/vector.svg)](https://www.npmjs.com/package/@geometric/vector)
![license](https://img.shields.io/npm/l/@geometric/vector.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Extends the JavaScript array with n-dimensional Vector and Matrix math capabilities. Well tested,
controlled error flow, focus on usability. It even is capable of solving systems of linear equations.
This is an early stage, so it might be faced some API changes in the future.

## Table of contents

1. [Installation](#1-installation)
2. [The Vector class](#2-the-vector-class)
    1. [Instantiation and filling with values](#21-instatiation-and-filling-with-values)
    2. [Data and Dimensions](#22-data-and-dimensions)
    3. [Distance](#23-distance)
    4. [Invert the vector](#24-invert-the-vector)
    5. [Normalization](#25-normalization)
    6. [(Signed) angle](#26-signed-angle)
    7. [Addition (and subtraction)](#27-addition-and-subtraction)
    8. [Multiplication](#28-multiplication)
    9. [Rotation](#29-rotation)
3. [The Matrix](#3-the-matrix)
    1. [Instantiation and filling](#31-instantiation-and-filling)
    2. [Multiplication](#32-multiplication)
    3. [Determinant](#33-determinant)
    4. [Trace](#34-trace)
    5. [Submatrix extraction](#35-submatrix-extraction)
    6. [Transpose](#36-transpose)
    7. [Solve system of linear equations](#37-system-of-linear-equations)
    8. [Diagonal matrices](#38-diagonal-matrices)
4. [Convex Hull](#4-convex-hull)
5. [Doubly-connected edge list](#5-doubly-connected-edge-list)
6. [Testing](#6-testing)
7. [Roadmap](#7-roadmap)
8. [Contributing](#8-contributing)
9. [Get in touch](#9-get-in-touch)

## 1 Installation

```
npm install @geometric/vector
```

## 2 The Vector class

The Vector class extends the JavaScript Array class by
algebraic operations like translation (**add**) or rotation.
It can be of any dimension. Some functions are only available
to specific number of dimensions and will throw a controlled
error, e.g. cross-product requires three dimensions. It extends
the standard JavaScript `Array` class, so it is aware of all
default array features like `fill` or `map`.

### 2.1 Instatiation and filling with values

There are several ways to instatiate and fill vectors. One is
to pass in the values as parameters. Import the vector class
first.

```typescript
import { Vector } from '@geometric/vector';
```

The vector has got the dimension of the number of passed
in values.

```typescript
const vec = new Vector(4, -1, 9);
```

If there is allready an existing **Array** and you want it to
be a vector or an existing **Vector** and you want to copy it

```typescript
const existing = [4, 5, 6];
// const existing = new Vector(2, 3, 4);
const vec = new Vector(...existing);
```

If you hand in only one parameter, the vector will be of that
length, e.g. `new Vector(10)` will be a 10-dimensional empty
vector. To fill it with values you can use the following items.

```typescript
const vector = new Vector(20)
vector.zeros();
vector.random();
vector.fill(4);
```

It is also possible to chain these like

```typescript
const vector = new Vector(20).random().normalize();
```

### 2.2 Data and Dimensions

Since this is an extension of the JavaScript **Array** there
is the everyone knowing `length` function. This returns
the number of elements and the number of elements is the array
dimension. You can access each entry similarly with `vector[0]`
style. Also it is possible to print the vector like

```typescript
const vector = new Vector(1, 3, 4);
console.log(vector.length);     // 3
console.log(vector);            // [1, 3, 4]
```

### 2.3 Distance

Compute the length of the vector by

```typescript
const vec = new Vector(4).random();
vec.distance;
```

### 2.4 Invert the vector

Compute the inversion of the (here 3-dimensional) vector by.

```typescript
const vec = new Vector(3).random();
vec.invert();
```

### 2.5 Normalization

To normalize the vector (make it length 1 in euclidian space)
you can simply use the `normalize` function.

```typescript
const vec = new Vector(4).random();
vec.normalize();
```

### 2.6 (Signed) angle

There are two member functions for determining
the angle between two vectors. The `angle` function
returns the angle between two n-dimensional vectors
in the range [0, PI].

```typescript
const first = new Vector(20).random();
const second = new Vector(20).random();
const angle = first.angle(second);
```

Especially in 2D robotics, games and other movement tasks
it often is required to also get the direction. Imagine the
vectors (1, 0) and the angles between (0, 1) and (0, -1).
The above method would return PI / 2 (90 degrees) in both
cases.

To calculate the signed angle in two dimensions
between this vector and the given vector
in 2-dimensional space in respect to the
executing vector the `signedAngle` function is provided.
The angle will be in the range of (-PI, PI].

```typescript
const angle = origin.signedAngle(target);
```

Imagine you look into the direction of **this**. If
the parameter vector is to your left, the angle is positive,
if the parameter vector is to your right, the angle is negative.

### 2.7 Addition (and Subtraction)

To add a vector or a scalar to a vector you can use the build-in
`add` function. It automatically detects if it is a scalar
or a vector.

```typescript
const left  = new Vector(2, 4, 0);
const right = new Vector(-3, 1, 2);
const vec1 = new Vector(1).fill(10);

const vectorSum = left.add(right);     // []
const scalarSum = left.add(5);         //
const vec1Sum   = left.add(scalarVec); // 
```

Vector-vector addition requires the vectors to have the same
dimensions. A vector-scalar addition multiplicates each entry
with that scalar.

### 2.8 Multiplication

There are several methods for different multiplication types. The
first one is known as the `dot`-product. For two equally dimensioned
vectors it returns the scalar-product. For vector-scalar multiplication
it returns the scaled vector.

```typescript
const vector1 = new Vector(1, -2, 3);
const vector2 = new Vector(2, 4, -1);

const scalar = vector1.dot(vector2);  // -11
const vector = vector1.dot(2);        // [2, -4, 6]
```

The next type of multiplication is the `cross` product. This type of
multiplication is only available for 3-dimensional vectors (or in theory 7D).

```typescript
const vector1 = new Vector(1, 0, 0);
const vector2 = new Vector(0, 1, 0);

const vector = vector1.cross(vector2);  // [0, 0, 1]
```

The last multiplication is the element-wise multiplication / division. For this purpose
the `multiplyElementWise` or `divideElementWise` is provided. It requires two
equally dimensioned vectors and returns a vector with the same dimension.

### 2.9 Rotation

Rotation is currently only available in 2-dimensions. It rotates a vector
by an angle [radians]. This operation is chainable.

```typescript
const vector = new Vector(1, 0);
vector.rotate2D(Math.PI);     // [-1, 0];
```

It uses the 2D rotation matrix.

```
| cos(angle)  -sin(angle) |
| sin(angle)   cos(angle) |
```

## 3 The Matrix

### 3.1 Instantiation and filling

The matrix class extends the JavaScript Array class containing Vectors
as elements. It provides several helper classes and build in integrity
checks. You can instantiate an empty matrix without any arguments.

```typescript
const matrix = new Matrix()
```

or with shape arguments. E.g. passing in 2 and 3 generates a
2x3 matrix.

```typescript
const matrix = new Matrix(2, 3);
```

To create the identity matrix there are two ways. Providing the parameter
resizes the given matrix. Providing no parameter requires an NxN shaped
matrix.

```typescript
const matrix = new Matrix().identity(3);
const matrix = new Matrix(3, 3).identity();
```

There are also the methods `zeros()` and `random()` which fill the entire
matrix with either 0s or randomly created numbers between 0 and 1. To get the matrix
shape you can use

```typescript
const matrix1 = new Matrix(3, 4);
const matrix2 = new Matrix().identity(2);
const matrix3 = new Matrix().from([[0, 1], [1, 0], [-1, 0]]);

console.log(matrix1.shape);  // [3, 4]
console.log(matrix2.shape);  // [2, 2]
console.log(matrix3.shape);  // [3, 2]
```

### 3.2 Multiplication

There are three types of matrix multiplications. Matrix-matrix, matrix-vector
or matrix-scalar multiplication. For this purpose the `dot` method is provided.
It automatically detects the parameter type and returns either a vector (if
it is a matrix-vector multiplication) or a matrix. Imagine the following setup

```typescript
const matrix = new Matrix().from([
  [2, 1, -1],
  [1, 0.5, 2]
]);
const zeros  = new Matrix(3, 4).zeros()
const vector = new Vector(1, 2, 3);
const scalar = 4;
```

Can be used as follows

```typescript
const matvec = matrix.dot(vector); // Vector [1, 8]
const matnum = matrix.dot(scalar); // Matrix [[8, 4, -4], [4, 2, 8]]
const matmat = matrix.dot(zeros);  // Matrix 2x4 filled with zeroes
```

### 3.3 Determinant

Computes the determinant of the n-dimensional, equally shaped matrix.

```typescript
const matrix = new Matrix().identity(3);
const determinant = matrix.determinant;  // 3
```

### 3.4 Trace

Computes the trace (the sum over all diagonal entries)
of the n-dimensional, equally shaped matrix.

```typescript
const matrix = new Matrix().from([[2, 3], [-1, -4]]);
const trace = matrix.trace;  // -2
```

### 3.5 Submatrix extraction

Extracts a part of a larger matrix. Requires lower and
upper x-range indices and lower and upper y-range indices.

```typescript
const matrix = new Matrix().from([
  [3, 4, 1, 5],
  [0, 1, 2, 9],
  [-1, 0, 2, -4]
]);

const extraction = matrix.extract([1, 2], [2, 3]);
// [[2, 9], [2, -4]]
```

### 3.6 Transpose

To transpose the matrix you can use the `transpose` method. It
swaps both dimensions.

```
const matrix = new Matrix().from([[1, 2], [3, 4], [5, 6]]);
matrix.transpose();
console.log(matrix); // [[1, 3, 5], [2, 4, 6]]
```

### 3.7 System of linear equations

The matrix class is also able to solve systems of linear equations.

```
Ax = b
```

where *A* is the matrix, *b* is the result (vector) and *x* is the vector we
want to compute.

```typescript
const matrix = new Matrix().identity(3);
const vector = new Vector(-1, 2, -3);
const result = matrix.solve(vector);  // [-1, 2, -3]
```

This also works with non-trivial cases. It returns `null` if no solution was found.

### 3.8 Diagonal matrices

The matrix diagonalization is based on **Gauss**-elimination. Use it as follows

```
const matrix = new Matrix().from([2, 3, 4], [1, 2, 3], [5, 6, 7]);
matrix.diagonalize();
console.log(matrix);  // [[x, y, z], [0, a, b], [0, 0, c]]
```

## 4 Convex Hull

The script also contains a helper function to detect the 2-dimensional
convex hull out of a bunch of points (vectors). Import it

```typescript
import { convexHull } from '@geometric/vector';
```

The convex-hull sorts the points by *x*-coordinate, or *y*-coordinate if
equal, ascending. Afterwards it calculates the upper hull and then the lower
hull. In the end both hulls will be merged. This is an example for 20 randomly
created 2-dimensional vectors.

```typescript
// Create an array of 20 2-dimensional vectors
const vectors: Vector[] = [];
for (let i = 0; i < 20; i++) {
    vectors.push(new Vector(2).random());
}

// Determine the complex hull
const hull = convexHull(vectors);
```

The algorithms computation time is *O(n* log*n)* due to sorting.

## 5 Doubly-connected edge list

For geometric tasks it often is required to compute the doubly-connected edge list
containing all edges with its faces on the left and the right and the previous and
the next edge.

```typescript
import { doublyConnectedEdgeList } from '@geometric/vector';
```

It requires all vectors to be 2-dimensional (having 2 entries).

```typescript
const vectors = [
  new Vector(1, 0),
  new Vector(1, 1),
  new Vector(0, 1)
];

const edgeList = doublyConnectedEdgeList(vectors);
```

It will produce an array of `Nodes`. The order determines the polygon. The above
setup will produce the following edge list.

```json
[
  { edge: [ 0, 1 ],
    start: [ 1, 0 ], end: [ 1, 1 ],
    faceLeft: 'f1', faceRight: 'f2',
    previous: 2, next: 1 },
  { edge: [ -1, 0 ],
    start: [ 1, 1 ], end: [ 0, 1 ],
    faceLeft: 'f1', faceRight: 'f2',
    previous: 0, next: 2 },
  { edge: [ 1, -1 ],
    start: [ 0, 1 ], end: [ 1, 0 ],
    faceLeft: 'f1', faceRight: 'f2',
    previous: 1, next: 0 }
]
```

**Attention**: It currently does not implement intersections and have more than two faces.

## 6 Testing

Code quality is one of the most important things in computer
science. Just the vector class has got [more than 50 tests](./test/vector.spec.ts).
They might be also useful for understanding this library.
This minimizes code quality issues, bugs and improves the controlled
error-flow significantly. Pull requests should include tests
for usual and edge cases as well.

## 7 Roadmap

- Implement eigenvectors and eigenvalues
- Implement doubly-connected edge list
- Implement Voronoi diagrams
- Implement Delaunay triangulation
- Implement polygon intersections

## 8 Contributing

Pull requests, issue reports and feature requests are very welcome.

## 9 Get in touch

[![twitter](https://img.shields.io/badge/twitter-%40ngfelixl-blue.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ngfelixl)
[![github](https://img.shields.io/badge/github-%40ngfelixl-blue.svg?logo=github)](https://github.com/ngfelixl)

Hi, I am Felix,
Angular and NgRX contributor

![avatar](https://avatars2.githubusercontent.com/u/24190530?s=200&v=4)

If you like this library, think about giving it a star or follow me on twitter or github.