import { Vector } from '../core/vector';
import { Matrix } from '../core/matrix';

const epsilon = 0.000000000001;

/**
 * Computes the intersection of two line-segments. Hand in the
 * starting and the end point of the two lines you want to compute
 * the intersection of.
 *
 * @param segment0
 * @param segment1
 */
export function intersection(
  segment0: [Vector, Vector],
  segment1: [Vector, Vector]
): Vector | null {
  if (!isArrayOfVectors(segment0) || !isArrayOfVectors(segment1)) {
    throw new TypeError(`Intersection requires Vectors as input`);
  }

  if (!isTwoDimensional([...segment0, ...segment1])) {
    throw new Error(
      `To compute the 2 dimensional intersection, 2 dimensional vectors are required`
    );
  }

  const edge0 = segment0[1].subtract(segment0[0]);
  const edge1 = segment1[1].subtract(segment1[0]);

  const det1 = new Matrix().from([segment0[1], segment0[0]]).determinant;
  const det2 = new Matrix().from([segment1[1], segment1[0]]).determinant;
  const divisor = new Matrix().from([edge0, edge1]).determinant;

  if (divisor) {
    let point = new Vector(
      (det1 * edge1[0] - det2 * edge0[0]) / divisor,
      (det1 * edge1[1] - det2 * edge0[1]) / divisor
    );
    point = fixNegativeZero(point);

    if (intersectionOnSegement(point, segment0)) {
      return point;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function fixNegativeZero(vector: Vector): Vector {
  return new Vector().from(vector.map((o) => (Object.is(o, -0) ? 0 : o)));
}

function intersectionOnSegement(point: Vector, segment: [Vector, Vector]) {
  const ca = point.subtract(segment[0]);
  const ba = segment[1].subtract(segment[0]);

  const crossProduct = new Matrix().from([ba, ca]).determinant;
  const product = ca.dot(ba);
  const squaredLength = Math.pow(ba.distance, 2);

  if (
    Math.abs(crossProduct) > epsilon ||
    product < 0 ||
    product > squaredLength ||
    (point[0] === segment[0][0] && point[1] === segment[0][1]) ||
    (point[0] === segment[1][0] && point[1] === segment[1][1])
  ) {
    return false;
  }

  return true;
}

/**
 * Checks if parameter exists and if its an array. Checks if all
 * entries have the length 2.
 *
 * @param array
 */
function isTwoDimensional(array: Vector[]) {
  if (array.length > 0) {
    return array.reduce((acc, curr) => acc && curr.length === 2, true);
  } else {
    return false;
  }
}

/**
 * Checks if parameter exists and if its an array. Checks if all
 * entries are instances of Vector
 *
 * @param array
 */
function isArrayOfVectors(array: Vector[]) {
  if (array && array instanceof Array) {
    return array.reduce((acc, curr) => acc && curr instanceof Vector, true);
  } else {
    return false;
  }
}
