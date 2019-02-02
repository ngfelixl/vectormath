# Vectormath

![build](https://img.shields.io/travis/ngfelixl/vectormath.svg)
![coverage](https://img.shields.io/coveralls/:vcsType/ngfelixl/vectormath.svg)
![license](https://img.shields.io/npm/l/vectormath.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Extends the JavaScript array with n-dimensional Vector math capabilities. Well tested,
controlled error flow, focus on usability.

## Table of contents

1. [Installation](#1-installation)
2. [The Vector class](#2-the-vector-class)
    1. [Instantiation and filling with values](#2.1-instatiation-and-filling-with-values)
    2. [Dimensions](#2.2-dimensions)
    3. [Distance](#2.3-distance)
    4. [Invert the vector](#2.4-invert-the-vector)
    5. [Normalization](#2.5-normalization)
    6. [(Signed) angle](#2.6-signed-angle)
    7. [Addition](#2.7-addition)
    8. [Multiplication](#2.8-multiplication)
    9. [Rotation](#2.9-rotation)
3. [Testing](#3-testing)
4. [Roadmap](#4-roadmap)
5. [Contributing](#5-contributing)

## 1 Installation

```
npm install vectormath
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
to pass in the values as parameters. The vector wil be of the
dimension of the passed in values.

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

### 2.2 Dimensions

Since this is an extension of the JavaScript **Array** there
is the everyone knowing `length` function. This returns
the number of elements and the number of elements is the array
dimension.

### 2.3 Distance

Compute the length of the vector by

```typescript
const vec = new Vector(4).random();
vec.distance;
```

### 2.4 Invert the vector

Compute the length of the vector by

```typescript
const vec = new Vector(4).random();
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
const angle = vector1.angle(vector2);
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
const angle = vector1.signedAngle(vector2);
```

Imagine you look into the direction of **this**. If
the parameter vector is to your left, the angle is positive,
if the parameter vector is to your right, the angle is negative.

## 3 Testing

Code quality is one of the most important things in computer
science. Just the vector class has got [more than 50 tests](./test/vector.spec.ts).
This minimizes code quality issues, bugs and improves the controlled
error-flow significantly.

Anyway. If there are any bugs or missleading calculations, feel
free to contribute. You are very welcome.

## 4 Roadmap

- Implement matrices
- Implement doubly-connected edge list
- Implement Voronoi diagrams
- Implement Delaunay triangulation
- Implement polygon intersections

## 5 Contributing

Contributions and new ideas are very welcome.

## 5 Get in touch
