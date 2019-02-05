import { Node } from "../models/node";
import { Vector } from "../vector";

/**
 * Computes the doubly-connected edge list for a set of points.
 * The order of the points determines the edges that are connected.
 * This currently only works only for non-intersecting geometries
 * and will not detect any intersections.
 * @param vectors
 */
export function doublyConnectedEdgeList(vectors: Vector[]): Node[] {
  for (const vector of vectors) {
    if (vector.length !== 2) {
      throw new Error('Vectors must be 2-dimensional');
    }
  }

  const list: Node[] = [];

  for (let i = 0; i < vectors.length; i++) {
    const n = vectors.length;

    list[i] = {
      edge: vectors[(i + 1)%vectors.length].subtract(vectors[i]),
      start: vectors[i],
      end: vectors[(i + 1)%vectors.length],
      faceLeft: 'f1',
      faceRight: 'f2',
      previous: (((i - 1)%n)+n)%n,
      next: (i + 1)%vectors.length
    }
  }

  return list;
}
