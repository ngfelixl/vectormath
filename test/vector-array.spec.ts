import { Vector } from '../src/vector';

describe('vector', () => {
  it('should use map correctly', () => {
    const vec = new Vector(0, 1, 2);

    expect(vec.map(entry => entry * 2)).toEqual([0, 2, 4]);
  });

  it('should use reduce correctly', () => {
    const vec = new Vector(0, 1, 2);

    expect(vec.reduce((acc, cur) => acc+cur)).toBe(3);
  });

  it('should be accessible via indexed structure', () => {
    const vec = new Vector(0, 1, 2);

    expect(vec[0]).toBe(0);
    expect(vec[1]).toBe(1);
    expect(vec[2]).toBe(2);
  });

  it('should be sortable', () => {
    const vec = new Vector(2, 0, 1);

    expect(vec.sort()).toEqual([0, 1, 2]);
  });

  it('should remove an element with splice', () => {
    const vec = new Vector(2, 0, 1);

    vec.splice(1, 1);

    expect(vec).toEqual([2, 1]);
  });

  it('should add an element with push', () => {
    const vec = new Vector(2, 0, 1);

    vec.push(3);

    expect(vec).toEqual([2, 0, 1, 3]);
  });

  it('should concat two vectors', () => {
    const vec = new Vector(2, 0, 1);

    const res = vec.concat(vec);

    expect(res).toEqual([2, 0, 1, 2, 0, 1]);
  });

  it('should filter entries', () => {
    const vec = new Vector(2, 0, 1);

    const res = vec.filter(o => o > 0);

    expect(res).toEqual([2, 1]);
  });
});