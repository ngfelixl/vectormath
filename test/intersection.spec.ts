import { intersection, Vector } from '../src/index';

describe('intersection', () => {
  it('should return [0.5, 0.5] as intersection point for [0,0]->[1,1], [0,1]->[1,0]', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0), new Vector(1, 1)];
    const segment1: [Vector, Vector] = [new Vector(0, 1), new Vector(1, 0)];

    const point = intersection(segment0, segment1);

    expect(point).toEqual([0.5, 0.5]);
  });

  it('should return [0, 0] as intersection point for [-1,-1]->[1,1], [-1,1]->[1,-1]', () => {
    const segment0: [Vector, Vector] = [new Vector(-1, -1), new Vector(1, 1)];
    const segment1: [Vector, Vector] = [new Vector(-1, 1), new Vector(1, -1)];

    const point = intersection(segment0, segment1);

    expect(point).toEqual([0, 0]);
  });

  it('should return [0.5, 0] as intersection point for [0,0]->[1,0], [1,1]->[0,-1]', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0), new Vector(1, 0)];
    const segment1: [Vector, Vector] = [new Vector(1, 1), new Vector(0, -1)];

    const point = intersection(segment0, segment1);

    expect(point).toEqual([0.5, 0]);
  });

  it('should return [0.5, 0] as intersection point for [1,1]->[0,-1] and [0,0]->[1,0]', () => {
    // [ Vector [ 1, 1 ], Vector [ 0, -1 ] ] [ Vector [ 0, 0 ], Vector [ 1, 0 ] ]
    const segment1: [Vector, Vector] = [new Vector(0, 0), new Vector(1, 0)];
    const segment0: [Vector, Vector] = [new Vector(1, 1), new Vector(0, -1)];

    const point = intersection(segment0, segment1);

    expect(point).toEqual([0.5, 0]);
  })

  it('should return null for non-intersecting segments', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0), new Vector(0, 1)];
    const segment1: [Vector, Vector] = [new Vector(1, 0), new Vector(1, 1)];

    const point = intersection(segment0, segment1);

    expect(point).toBeNull;
  });

  it('should return null if intersecting not between these points', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0), new Vector(0, 1)];
    const segment1: [Vector, Vector] = [new Vector(-1, 2), new Vector(1, 2)];

    const point = intersection(segment0, segment1);

    expect(point).toBeNull;
  });

  it('should return null if starting point is the intersection', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0), new Vector(1, 0)];
    const segment1: [Vector, Vector] = [new Vector(0, 0), new Vector(1, 1)];

    const point = intersection(segment0, segment1);

    expect(point).toBeNull;
  });

  it('should return null if end point is the intersection', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0), new Vector(1, 0)];
    const segment1: [Vector, Vector] = [new Vector(1, 1), new Vector(1, 0)];

    const point = intersection(segment0, segment1);

    expect(point).toBeNull;
  });

  it('should return return an Error for 3D inputs', () => {
    const segment0: [Vector, Vector] = [new Vector(0, 0, 0), new Vector(1, 1, 1)];
    const segment1: [Vector, Vector] = [new Vector(0, 0.5, 0.5), new Vector(1, 0.5, 0.5)];

    expect(() => { intersection(segment0, segment1); })
        .toThrow(new RegExp(`To compute the 2 dimensional intersection`));
  });

  it('should return an error if input is empty', () => {
    expect(() => { intersection(undefined as any, null as any); })
        .toThrow(new RegExp(`Intersection requires Vectors as input`));
  });

  it('should return an error if input is empty', () => {
    expect(() => { intersection(new Array<Vector>() as any, new Array<Vector>() as any); })
        .toThrow(new RegExp(`To compute the 2 dimensional intersection, 2 dimensional vectors are required`));
  });

  it('should return an error if input is string', () => {
    expect(() => { intersection('fjdskjsd' as any, null as any); })
        .toThrow(new RegExp(`Intersection requires Vectors as input`));
  });
});