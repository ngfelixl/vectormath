import { Vector, convexHull } from "../src/index";
import { expect } from 'chai';

describe('convexHull', () => {
  let data: Vector[];

  beforeEach(() => {
    data = [
      new Vector(-1, -1),
      new Vector(0, 1),
      new Vector(1, -1)
    ];
  });

  it('should not remove an element on example triangle', () => {
    data = convexHull(data);

    expect(data.length).to.equal(3);
  });

  it('should not remove any elements on 100 random triangles', () => {
    for (let i = 0; i < 100; i++) {
      data = [
        new Vector(Math.random(), Math.random()),
        new Vector(Math.random(), Math.random()),
        new Vector(Math.random(), Math.random())
      ];
      data = convexHull(data);
      expect(data.length).to.equal(3);
    }
  });

  it('should do nothing when element count < 3', () => {
    const data1: Vector[] = [];
    const data2 = [new Vector(1, 2)];
    const data3 = [new Vector(2, -1), new Vector(1, 4)];
    expect(convexHull(data1)).to.eql(data1);
    expect(convexHull(data2)).to.eql(data2);
    expect(convexHull(data3)).to.eql(data3);
  });

  it('should remove inner point', () => {
    const testData: Vector[] = [...data, new Vector(0.01, 0)];
    const hull = convexHull(testData);

    expect(hull.length).to.equal(3);
    expect(data).to.contain(hull[0])
        .and.to.contain(hull[1])
        .and.to.contain(hull[2]);
  });

  it('should not remove outer points', () => {
    const testData: Vector[] = [...data, new Vector(1, 1)];
    const hull = convexHull(testData);

    expect(hull.length).to.equal(4);
  });

  it('should not remove a point out of 100 points on circle surface', () => {
    data = [];
    for (let i = 0; i < 100; i++) {
      data.push(new Vector(
        Math.cos((i / 101) * 2 * Math.PI),
        Math.sin((i / 101) * 2 * Math.PI)
      ));
    }
    const hull = convexHull(data);
    
    expect(hull.length).to.equal(100);
  });
  
  it('should not remove a point out of 100 points on circle surface', () => {
    data = [];
    for (let i = 0; i < 100; i++) {
      data.push(new Vector(
        Math.cos((i / 101) * 2 * Math.PI),
        Math.sin((i / 101) * 2 * Math.PI)
      ));

      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 0.5;
      data.push(new Vector(
        distance * Math.cos(angle),
        distance * Math.sin(angle)
      ));
    }
    const hull = convexHull(data);
    expect(hull.length).to.equal(100);
  });

  it('should remove 100 elements out of a bounding rect', () => {
    data.push(new Vector(-1, 2), new Vector(1, 2));
    for (let i = 0; i < 100; i++) {
      data.push(new Vector(
        Math.random() * 0.99, Math.random() * 1.99
      ));
    }
    const hull = convexHull(data);
    expect(hull.length).to.equal(4);
  });
});
