import { Vector } from '../src/vector';
import { expect } from 'chai';

describe('vector', () => {
  it('should use map correctly', () => {
    const vec = new Vector(0, 1, 2);

    expect(vec.map(entry => entry * 2)).to.eql([0, 2, 4]);
  });

  it('should use reduce correctly', () => {
    const vec = new Vector(0, 1, 2);

    expect(vec.reduce((acc, cur) => acc+cur)).to.equal(3);
  });

  it('should be accessible via indexed structure', () => {
    const vec = new Vector(0, 1, 2);

    expect(vec[0]).to.equal(0);
    expect(vec[1]).to.equal(1);
    expect(vec[2]).to.equal(2);
  });

  it('should be sortable', () => {
    const vec = new Vector(2, 0, 1);

    expect(vec.sort()).to.eql([0, 1, 2]);
  });

  it('should remove an element with splice', () => {
    const vec = new Vector(2, 0, 1);

    vec.splice(1, 1);

    expect(vec).to.eql([2, 1]);
  });

  it('should add an element with push', () => {
    const vec = new Vector(2, 0, 1);

    vec.push(3);

    expect(vec).to.eql([2, 0, 1, 3]);
  });

  it('should concat two vectors', () => {
    const vec = new Vector(2, 0, 1);

    const res = vec.concat(vec);

    expect(res).to.eql([2, 0, 1, 2, 0, 1]);
  });

  it('should filter entries', () => {
    const vec = new Vector(2, 0, 1);

    const res = vec.filter(o => o > 0);

    expect(res).to.eql([2, 1]);
  });
});