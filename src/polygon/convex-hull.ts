import { Vector } from '../vector';

/**
 * Generates the convex hull in two dimensions of an array of points.
 * It calculates the upper and lower bounding and merges them to
 * the convex hull.
 * @param data Elements to get the convex hull of
 */
export function convexHull(data: Vector[]) {
  if (data.length < 3) {
    return data;
  }

  // sort from left to right, equal top to bottom
  data.sort((a: Vector, b: Vector) => {
    const order = a[0] - b[0];
    return order === 0 ? a[1] - b[1] : order;
  });

  const upper = [data[0], data[1]];
  for (let i = 2; i < data.length; i++) {
    upper.push(data[i]);
    reduce(upper);
  }

  const lower = [data[data.length - 1], data[data.length - 2]];
  for (let i = data.length - 3; i >= 0; i--) {
    lower.push(data[i]);
    reduce(lower);
  }
  lower.splice(0, 1);
  lower.splice(-1, 1);

  return [...upper, ...lower];
}

/**
 * Checks the bounding points to only make right turns
 * otherwise delete the element on which not a right turn
 * is found.
 * @param bounding
 */
function reduce(bounding: Vector[]) {
  let turnLeft = true;
  while (turnLeft && bounding.length > 2) {
    const c = bounding.length - 1;
    const vec1 = bounding[c - 1].subtract(bounding[c]);
    const vec2 = bounding[c - 1].subtract(bounding[c - 2]);
    const angle = vec1.signedAngle(vec2);
    turnLeft = angle <= 0;

    if (turnLeft) {
      bounding.splice(c - 1, 1);
    }
  }
}
