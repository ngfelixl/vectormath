import { Node } from '../models/node';
import { Vector } from '../vector';
import { intersection } from './intersection';

/**
 * Computes the doubly-connected edge list for a set of points.
 * The order of the points determines the edges that are connected.
 * This currently only works only for non-intersecting geometries
 * and will not detect any intersections.
 * @param vectors
 */
export function doublyConnectedEdgeList(vectors: Vector[]): Node[] | null {
  for (const vector of vectors) {
    if (vector.length !== 2) {
      throw new Error('Vectors must be 2-dimensional');
    }
  }

  const list: Node[] = [];

  for (let i = 0; i < vectors.length; i++) {
    const n = vectors.length;

    const edge = vectors[(i + 1) % vectors.length].subtract(vectors[i]);

    const next = {
      edge,
      start: vectors[i],
      end: vectors[(i + 1) % vectors.length],
      faceLeft: 'f1',
      faceRight: 'f2',
      previous: (((i - 1) % n) + n) % n,
      next: (i + 1) % vectors.length,
    };

    if (intersectsPolygon(next, list)) {
      return null;
    }

    list.push(next);
  }

  return list;
}

/**
 * Checks if the new edge intersects one of the previously inserted
 * edges.
 * @param edge
 * @param nodes
 */
function intersectsPolygon(edge: Node, nodes: Node[]): boolean {
  if (nodes.length > 0) {
    const intersects = nodes.reduce((acc, cur) => {
      return acc || !!intersection([edge.start, edge.end], [cur.start, cur.end]);
    }, false);

    return intersects;
  }
  return false;
}
