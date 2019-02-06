import { expect } from 'chai';
import { Vector } from '../src/vector';

const ERROR_THRESHOLD = 0.000000000000001;

describe('vector', () => {
  describe('instantiating and filling', () => {
    it('should create', () => {
      const vector = new Vector();
      expect(vector).to.exist;
    });

    it('should have the correct dimension', () => {
      const vector = new Vector(0, 0, 0);
      expect(vector.length).to.equal(3);
    });

    it('should be fillable with random numbers', () => {
      const vector = new Vector(2).random();
      expect(vector.distance).to.be.least(0).and.most(Math.sqrt(2));
    });

    it('should be fillable with zeros', () => {
      const vector = new Vector(2).zeros();
      expect(vector).to.eql([0, 0]);
    });

    it('should be fillable with ones', () => {
      const vector = new Vector(2).ones();
      expect(vector).to.eql([1, 1]);
    });
  });

  describe('add', () => {
    it('should add two vectors', () => {
      const vector1 = new Vector(0, 1);
      const vector2 = new Vector(1, 1);

      const addition = vector1.add(vector2);

      expect(addition).to.eql([1, 2]);
    });

    it('should add a vector and a scalar as number', () => {
      const vector = new Vector(0, 2);
      const scalar = 5;

      const addition = vector.add(scalar);

      expect(addition).to.eql([5, 7]);
    });

    it('should add a vector with length 1', () => {
      const vector = new Vector(0, 2);
      const scalarVector = new Vector(1).fill(5);

      const addition = vector.add(scalarVector);

      expect(addition).to.eql([5, 7]);
    });

    it('should throw an error if parameter of type string', () => {
      const vector = new Vector(0, 2);
      expect(() => { vector.add({ prop: 'test' } as any); })
          .to.throw(new RegExp(`Parameter must be of type Vector, Array<number> or number`));
    });

    it('should throw error when vectors of wrong shape', () => {
      const vector1 = new Vector(0, 0);
      const vector2 = new Vector(0, 1, 2);

      expect(() => vector1.add(vector2)).to.throw(
        new RegExp(`Can't add vectors having unequal dimensions or dimension not equal to 1`)
      );
    });
  });

  describe('dot', () => {
    it('should calculate the scalar product of two vectors', () => {
      const vector1 = new Vector(1, 1);
      const vector2 = new Vector(2, 3);

      const scalar = vector1.dot(vector2);

      expect(scalar).to.equal(5);
    });

    it('should calculate the scalar product of a vector and an array of numbers', () => {
      const vector1 = new Vector(1, 1);
      const vector2 = [2, 3];

      const scalar = vector1.dot(vector2);

      expect(scalar).to.equal(5);
    });

    it('should calculate the product of a vector and a scalar as number', () => {
      const vector = new Vector(1, 1);
      const scalar = 4;

      const product = vector.dot(scalar);

      expect(product).to.eql([4, 4]);
    });

    it('should calculate the product of a vector and a scalar wrapped as Vector', () => {
      const vector = new Vector(1, 1);
      const scalar = new Vector();
      scalar[0] = 2;

      const product = vector.dot(scalar);

      expect(product).to.eql([2, 2]);
    });

    it('should throw error if vectors have unequal dimensions', () => {
      const vector1 = new Vector(1, 2);
      const vector2 = new Vector(2, 3, 4);

      expect(() => vector1.dot(vector2)).to.throw(new RegExp(`Can't multiply vectors having unequal dimensions`));
    });

    it('should throw error if input is an object not of type Vector or Array', () => {
      const vector = new Vector(1, 2);

      expect(() => { vector.dot({prop: 'test'} as any); })
          .to.throw(new RegExp('Multiplication requires a vector, array or an integer number as input'));
    });
  });

  describe('cross', () => {
    it('should be 3 dimensional output', () => {
      const vector1 = new Vector(1, 1, 1);
      const vector2 = new Vector(1, 1, 2);

      const cross = vector1.cross(vector2);

      expect(cross.length).to.equal(3);
    });

    it('should return [7 -37 27] for [12 3 1] x [-1 2 3]', () => {
      const vector1 = new Vector(12, 3, 1);
      const vector2 = new Vector(-1, 2, 3);

      const cross = vector1.cross(vector2);

      expect(cross).to.eql([7, -37, 27]);
    });

    it('should throw an error if parameter dimension not equal to 3', () => {
      const vector1 = new Vector(2, 1, 3);
      const vector2 = new Vector(1, 1);

      expect(() => vector1.cross(vector2)).to.throw(new RegExp(`Can't build the vector-product of unequally sized vectors`));
    });

    it('should throw an error if dimensions equal but not 3', () => {
      const vector1 = new Vector(1, 1);
      const vector2 = new Vector(2, 1);

      expect(() => vector1.cross(vector2)).to.throw(new RegExp(`Cross product not available for vectors with dimension not equal to 3`));
    });
  });

  describe('rotation2D', () => {
    it('should invert a vector by rotating by PI', () => {
      const vector = new Vector(2, 3);

      vector.rotate2D(Math.PI);
      vector.invert();

      const error = [Math.abs(2 - vector[0]), Math.abs(3 - vector[1])];

      expect(error[0]).to.be.below(ERROR_THRESHOLD);
      expect(error[1]).to.be.below(ERROR_THRESHOLD);
    });

    it('should throw an error if vector dimension is not 2', () => {
      const vector = new Vector(2, 4, -1);

      expect(() => { vector.rotate2D(0); })
          .to.throw(new RegExp(`Rotation in two dimensions requires a two dimensional vector`));
    });
  });

  describe('normalize', () => {
    it('should normalize 1D vector to 1', () => {
      const vector = new Vector();
      vector[0] = 5;

      vector.normalize();

      expect(vector).to.eql([1]);
    });

    it('should normalize 2D vector', () => {
      const vector = new Vector(3, 4);
      expect(vector.distance).to.equal(Math.sqrt(9 + 16));

      vector.normalize();
      expect(vector.distance).to.equal(1);
    });

    it('should normalize 3D vector', () => {
      const vector = new Vector(2, 4, 5);
      expect(vector.distance).to.equal(Math.sqrt(4 + 16 + 25));

      vector.normalize();
      expect(vector.distance).to.equal(1);
    });

    it('should normalize 20D vector', () => {
      const vector = new Vector(20).fill(4);

      vector.normalize();
      expect(vector.distance).to.equal(1);
    });

    it('should normalize a 100-dimensional random vector', () => {
      const vector = new Vector(100).random();

      vector.normalize();
      const error = 1 - vector.distance;

      expect(error).to.be.lessThan(ERROR_THRESHOLD);
    });
  });

  describe('invert', () => {
    it('should invert a test vector', () => {
      const vector = new Vector(2, -6, 34);
      vector.invert();

      expect(vector).to.eql([-2, 6, -34]);
    });

    it('should be the same length as the original vector', () => {
      const vector = new Vector(2, 3, 5);
      const initialDistance = vector.distance;

      vector.invert();
      expect(vector.distance).to.equal(initialDistance);
    });

    it('should become the original vector when inverting twice', () => {
      const vector1 = new Vector(2, -3, 1);
      const vector2 = new Vector();
      vector2.from(vector1);

      vector1.invert().invert();

      expect(vector1).to.eql(vector2);
    });
  });

  describe('multiplyElementWise', () => {
    it('should multiply two 3D vectors element wise', () => {
      const vector = new Vector(3, 4, 5);

      const multiplication = vector.multiplyElementWise(vector);

      expect(multiplication).to.eql([9, 16, 25]);
    });

    it('should throw an error if vector dimensions are not equal', () => {
      const vector1 = new Vector(0, 1);
      const vector2 = new Vector(2, 3, 4);

      expect(() => { vector1.multiplyElementWise(vector2); })
          .to.throw(`Can't multiply unequal sized vectors element-wise`);
    });
  });


  describe('divideElementWise', () => {
    it('should divide two 3D vectors element wise', () => {
      const vector = new Vector(3, 4, 5);

      const multiplication = vector.divideElementWise(vector);

      expect(multiplication).to.eql([1, 1, 1]);
    });

    it('should throw an error if vector dimensions are not equal', () => {
      const vector1 = new Vector(0, 1);
      const vector2 = new Vector(2, 3, 4);

      expect(() => { vector1.divideElementWise(vector2); })
          .to.throw(`Can't divide unequal sized vectors element-wise`);
    });
  });


  describe('signedAngle', () => {
    it('should calculate PI/2 for [1, 0] and [0, 1]', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(0, 1);

      const angle = vector1.signedAngle(vector2);
      const error = angle - Math.PI / 2;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should calculate -PI/2 for [1, 0] and [0, -1]', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(0, -1);

      const angle = vector1.signedAngle(vector2);
      const error = angle + Math.PI / 2;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should throw error if vector dimension not equal to two', () => {
      const vector1 = new Vector(0, 1);
      const vector2 = new Vector(0, 1, 2);

      expect(() => { vector1.signedAngle(vector2); })
          .to.throw(new RegExp(`Vector dimensions must be 2`));
    });

    it('should work with 90 < angle < 180', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(-1, 1);

      const angle = vector1.signedAngle(vector2);
      const error = angle - Math.PI * 0.75;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should work with -90 < angle < -180', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(-1, -1);

      const angle = vector1.signedAngle(vector2);
      const error = angle + Math.PI * 0.75;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should output PI for inverted vectors', () => {
      const vector1 = new Vector(1, 4);
      const vector2 = new Vector(-1, -4);

      const angle = vector1.signedAngle(vector2);
      const error = angle - Math.PI;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should output 0 for identical vectors', () => {
      const vector1 = new Vector(1, 4);
      const vector2 = new Vector(1, 4);

      const angle = vector1.signedAngle(vector2);

      expect(angle).to.equal(0);
    });

    it('should work in all directions', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(0, 1);
      const vector3 = new Vector(-1, 0);
      const vector4 = new Vector(0, -1);

      expect(Math.PI / 2 - vector1.signedAngle(vector2)).to.be.below(ERROR_THRESHOLD);
      expect(Math.PI / 2 + vector1.signedAngle(vector4)).to.be.below(ERROR_THRESHOLD);

      expect(Math.PI / 2 - vector2.signedAngle(vector3)).to.be.below(ERROR_THRESHOLD);
      expect(Math.PI / 2 + vector2.signedAngle(vector1)).to.be.below(ERROR_THRESHOLD);

      expect(Math.PI / 2 - vector3.signedAngle(vector4)).to.be.below(ERROR_THRESHOLD);
      expect(Math.PI / 2 + vector3.signedAngle(vector2)).to.be.below(ERROR_THRESHOLD);

      expect(Math.PI / 2 - vector4.signedAngle(vector1)).to.be.below(ERROR_THRESHOLD);
      expect(Math.PI / 2 + vector4.signedAngle(vector3)).to.be.below(ERROR_THRESHOLD);
    });
  });

  describe('angle', () => {
    it('should calculate PI/2 for [1, 0] and [0, 1]', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(0, 1);

      const angle = vector1.angle(vector2);
      const error = angle - Math.PI / 2;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should calculate PI/2 for [1, 0] and [0, -1]', () => {
      const vector1 = new Vector(1, 0);
      const vector2 = new Vector(0, 1);

      const angle = vector1.angle(vector2);
      const error = angle - Math.PI / 2;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should throw an error if vector dimensions are not equal', () => {
      const vector1 = new Vector(0, 1);
      const vector2 = new Vector(2, 1, 0);

      expect(() => { vector1.angle(vector2); })
          .to.throw(new RegExp(`Can't multiply vectors having unequal dimensions`));
    });

    it('should output PI for inverted vectors', () => {
      const vector1 = new Vector(1, 3, 2, 0);
      const vector2 = new Vector(-1, -3, -2, 0);

      const angle = vector1.angle(vector2);
      const error = angle - Math.PI;

      expect(error).to.be.below(ERROR_THRESHOLD);
    });

    it('should calculate a 10-dimensional angle', () => {
      const vector1 = new Vector(0, 1, 2, 3, 4, 5, 7, 0, 2, 9, 1);
      const vector2 = new Vector(1, 1, 0, 6, 4, 2, 7, 1, 2, 9, 1);

      const angle = vector1.angle(vector2);

      expect(angle).to.exist;
    });
  });

  describe('subtract', () => {
    it('should subtract demo vectors', () => {
      const vector1 = new Vector(0, 2, 45);
      const vector2 = new Vector(12, 1, 40);

      const subtraction = vector1.subtract(vector2);

      expect(subtraction).to.eql([-12, 1, 5]);
    });

    it('should throw an error if vector dimensions are not equal', () => {
      const vector1 = new Vector(0, 1);
      const vector2 = new Vector(2, 3, 4);

      expect(() => { vector1.subtract(vector2); }).to.throw;
    });
  });
});
