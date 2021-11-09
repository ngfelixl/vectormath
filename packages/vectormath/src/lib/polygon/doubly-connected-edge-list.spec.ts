import { Vector } from '../core/vector';
import { doublyConnectedEdgeList } from './doubly-connected-edge-list';

describe('doubly-connected-edge-list', () => {
  it('should compute the double connected edge list for 3 vectors', () => {
    const vectors: Vector[] = [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(0, 1),
    ];

    const edgeList = doublyConnectedEdgeList(vectors);

    expect(edgeList).toEqual([
      {
        edge: [0, 1],
        start: [1, 0],
        end: [1, 1],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 2,
        next: 1,
      },
      {
        edge: [-1, 0],
        start: [1, 1],
        end: [0, 1],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 0,
        next: 2,
      },
      {
        edge: [1, -1],
        start: [0, 1],
        end: [1, 0],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 1,
        next: 0,
      },
    ]);
  });

  it('should compute the double connected edge list for 4 vectors', () => {
    const vectors: Vector[] = [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(0, 1),
      new Vector(0, 0),
    ];

    const edgeList = doublyConnectedEdgeList(vectors);

    expect(edgeList).toEqual([
      {
        edge: [0, 1],
        start: [1, 0],
        end: [1, 1],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 3,
        next: 1,
      },
      {
        edge: [-1, 0],
        start: [1, 1],
        end: [0, 1],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 0,
        next: 2,
      },
      {
        edge: [0, -1],
        start: [0, 1],
        end: [0, 0],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 1,
        next: 3,
      },
      {
        edge: [1, 0],
        start: [0, 0],
        end: [1, 0],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 2,
        next: 0,
      },
    ]);
  });

  it('should compute negative edges correctly', () => {
    const vectors: Vector[] = [
      new Vector(-2, -1),
      new Vector(-1, -1),
      new Vector(-1, -2),
    ];

    const edgeList = doublyConnectedEdgeList(vectors);

    expect(edgeList).toEqual([
      {
        edge: [1, 0],
        start: [-2, -1],
        end: [-1, -1],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 2,
        next: 1,
      },
      {
        edge: [0, -1],
        start: [-1, -1],
        end: [-1, -2],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 0,
        next: 2,
      },
      {
        edge: [-1, 1],
        start: [-1, -2],
        end: [-2, -1],
        faceLeft: 'f1',
        faceRight: 'f2',
        previous: 1,
        next: 0,
      },
    ]);
  });

  it('should throw an error if one of the vectors is not 2d', () => {
    const vectors = [new Vector(2, 3, 4), new Vector(2, 1)];

    expect(() => {
      doublyConnectedEdgeList(vectors);
    }).toThrow(new RegExp('Vectors must be 2-dimensional'));
  });

  it('should return null if there is an intersection', () => {
    const vectors = [
      new Vector(0, 0),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(0, -1),
    ];

    const list = doublyConnectedEdgeList(vectors);

    expect(list).toBeFalsy;
  });
});
