import { Matrix, Vector } from '../src/index';

const ERROR_THRESHOLD = 0.000000000000001;
const test3x2 = [
  [2, 4], [1, -1], [2.5, 1]
]

describe('matrix', () => {
  describe('instantiation and filling', () => {
    it('should create', () => {
      const matrix = new Matrix(2, 4);
      expect(matrix).toBeTruthy;
    });

    it('should be correctly shaped', () => {
      const matrix = new Matrix(2, 3);
      expect(matrix.shape).toEqual([2, 3]);
    });

    it('should be fillable with zeros', () => {
      const matrix = new Matrix(2, 3).zeros();

      expect(matrix).toEqual([
        [0, 0, 0],
        [0, 0, 0]
      ]);
    });

    it('should be fillable with zeros', () => {
      const matrix = new Matrix(2, 3).ones();

      expect(matrix).toEqual([
        [1, 1, 1],
        [1, 1, 1]
      ]);
    });

    it('should return a [0,0] shape if it has no rows', () => {
      const matrix = new Matrix();

      expect(matrix.shape).toEqual([0, 0]);
    });

    it('should be randomly fillable', () => {
      const matrix = new Matrix(2, 2).random();

      expect(matrix[0][0]).toBeGreaterThanOrEqual(0)
      expect(matrix[0][0]).toBeLessThanOrEqual(1);
      expect(matrix[0][1]).toBeGreaterThanOrEqual(0);
      expect(matrix[0][1]).toBeLessThanOrEqual(1);
      expect(matrix[1][0]).toBeGreaterThanOrEqual(0);
      expect(matrix[1][0]).toBeLessThanOrEqual(1);
      expect(matrix[1][1]).toBeGreaterThanOrEqual(0);
      expect(matrix[1][1]).toBeLessThanOrEqual(1);
    });

    it('should throw an error if one of the rows was transformed manually', () => {
      const matrix = new Matrix(2, 2);

      matrix[0][2] = 1;

      expect(() => { matrix.shape; })
          .toThrow(new RegExp(`Your matrix is broken, it contains rows with different dimensions: 3 and 2`));
    });

    it('should do nothing when from parameter is an empty array', () => {
      const matrix = new Matrix().from([]);

      expect(matrix.shape).toEqual([0, 0]);
    });
  });

  describe('transpose', () => {
    it('should transpose without values', () => {
      const matrix = new Matrix(2, 5);

      matrix.transpose();

      expect(matrix.shape).toEqual([5, 2]);
    });

    it('should transpose with values', () => {
      const matrix = new Matrix(1, 3);
      matrix.from([[1, 2, 3]]);

      matrix.transpose();
      expect(matrix).toEqual([[1], [2], [3]]);
      expect(matrix.shape).toEqual([3, 1]);
    });
  });

  describe('identity', () => {
    it('should create a 3D identity matrix from scratch', () => {
      const matrix = new Matrix().identity(3);

      expect(matrix)
    });

    it('should throw an error if parameter is not positive integer', () => {
      const matrix = new Matrix();

      expect(() => { matrix.identity(0.5); })
          .toThrow(new RegExp('Size must be a positive integer value'));
    });

    it('should create a 3D identity matrix from existing', () => {
      const matrix = new Matrix(3, 3).zeros();
      matrix.identity();

      expect(matrix).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    });

    it('should throw an error if matrix not NxN-shaped', () => {
      const matrix = new Matrix().from(test3x2);

      expect(() => { matrix.identity(); })
          .toThrow(new RegExp('Matrix has to be NxN shaped'));
    });
  });

  describe('determinant', () => {
    it('should calculate the 2d-determinant', () => {
      const matrix = new Matrix(2, 2).from([[1, 2], [2, -4]]);

      const determinant = matrix.determinant;

      expect(determinant).toBe(1 * -4 - 2 * 2);
    });

    it('should calculate the 3d-determinant', () => {
      const matrix = new Matrix(2, 2).from([
        [1, 2, -1],
        [2, -4, 0],
        [1, 8, -2]
      ]);

      const determinant = matrix.determinant;

      expect(determinant).toBe(8 + 0 -16 - 4 + 8 - 0);
    });

    it('should calculate the 4d-determinant', () => {
      const matrix = new Matrix().from([
        [3, 7, 3, 0],
        [0, 2, -1, 1],
        [5, 4, 3, 2],
        [6, 6, 4, -1]
      ]);

      const determinant = matrix.determinant;

      expect(determinant).toBe(105);
    });

    it('should throw an error if matrix is not NxN shaped', () => {
      const matrix = new Matrix(2, 3);

      expect(() => { matrix.determinant; }).toThrow(new RegExp(`Determinants require matrices having shape NxN`));
    });
  });

  describe('trace', () => {
    it('should compute the 2D trace', () => {
      const matrix = new Matrix().from([
        [2, 4],
        [1, -9]
      ]);

      expect(matrix.trace).toBe(-7);
    });

    it('should throw an error if matrix is not NxN shaped', () => {
      const matrix = new Matrix(2, 3);

      expect(() => { matrix.trace }).toThrow(new RegExp('Trace requires a NxN matrix'));
    });
  });

  describe('extract', () => {
    it('should extract a [2, 2] matrix out of a [4, 3] matrix', () => {
      const matrix = new Matrix().from([
        [3, 4, 1, 5],
        [0, 1, 2, 9],
        [-1, 0, 2, -4]
      ]);

      const extraction = matrix.extract([1, 2], [2, 3]);

      expect(extraction).toEqual([[2, 9], [2, -4]]);
    });

    it('should throw an error when indices out of bounds', () => {
      const matrix = new Matrix(2, 2);

      expect(() => { matrix.extract([1, 2], [2, 3]) })
          .toThrow(new RegExp(`Range out of bounds. Matrix shape is 2,2. Ranges are 1,2 and 2,3`));
    });
  });

  describe('dot', () => {
    it('should throw error if parameter is not Vector, Matrix or scalar', () => {
      const matrix = new Matrix(2, 2).zeros();

      expect(() => { matrix.dot('string' as any); })
          .toThrow(new RegExp(`Multiplication requires a Vector, a Matrix or a number as parameter`))
    });

    describe('scalar', () => {
      it('should be multiplicate scalar values', () => {
        const matrix = new Matrix(2, 3).from(test3x2);

        const result = matrix.dot(2);

        expect(result instanceof Matrix).toBeTruthy;
        expect(result).toEqual([
          [4, 8], [2, -2], [5, 2]
        ]);
      });

      it('should multiplicate float scalar values', () => {
        const matrix = new Matrix(2, 3).from(test3x2);

        const result = matrix.dot(0.5);

        expect(result).toEqual([
          [1, 2], [0.5, -0.5], [1.25, 0.5]
        ]);
      });
    });

    describe('vector', () => {
      it('should be multiplicate vectors', () => {
        const matrix = new Matrix(3, 2).from(test3x2);
        const vector = new Vector(-1, 2);
        const result = matrix.dot(vector);

        expect(result instanceof Vector).toBeTruthy;
        expect(result).toEqual([6, -3, -0.5]);
      });

      it('should throw an error if vector has wrong dimensions', () => {
        const matrix = new Matrix(3, 2).from(test3x2);
        const vector = new Vector(4).zeros();

        expect(() => { matrix.dot(vector); })
            .toThrow(new RegExp(`Matrix-vector multiplication requires the dimensions to be`));
      });

      it('should multiplicate an empty matrix and an empty vector', () => {
        const matrix = new Matrix(3, 2);
        const vector = new Vector(2);

        const result = matrix.dot(vector);

        expect(result.length).toBe(3);
      });
    });

    describe('matrix', () => {
      it('should multiplicate matrices', () => {
        const matrix0 = new Matrix();
        matrix0.from([
          [1, 2, 3],
          [-1, -1, 0]
        ]);

        const matrix1 = new Matrix();
        matrix1.from([
          [1, 1],
          [1, 0],
          [0, -1]
        ]);

        const result = matrix0.dot(matrix1);

        expect(result).toEqual([[3, -2], [-2, -1]]);
      });

      it('should throw an error if matrix dimensions are invalid', () => {
        const matrix0 = new Matrix(2, 3);
        const matrix1 = new Matrix(4, 5);

        expect(() => { matrix0.dot(matrix1); })
            .toThrow(new RegExp('Matrix shapes invalid.'));
      });

      it('should multiplicate empty matrices', () => {
        const matrix0 = new Matrix(2, 3);
        const matrix1 = new Matrix(3, 5);

        const matrix = matrix0.dot(matrix1);

        expect(matrix.shape).toEqual([2, 5]);
      });
    });
  });

  describe('solve', () => {
    it('should solve the 3d identity linear system of equations', () => {
      const matrix = new Matrix().identity(3);
      const vector = new Vector(1, 2, 3);
      const solution = matrix.solve(vector);

      expect(solution).toEqual([1, 2, 3]);
    });

    it('should solve the test 2d linear system of equations', () => {
      const matrix = new Matrix().from([
        [2, 4],
        [-1, 3]
      ]);
      const vector = new Vector(0.5, -1);

      const solution = matrix.solve(vector);
      expect(solution).toBeTruthy;

      if (solution) {
        const error = [Math.abs(solution[0] - 0.55), Math.abs(solution[1] + 0.15)];
        expect(error[0]).toBeLessThan(ERROR_THRESHOLD);
        expect(error[1]).toBeLessThan(ERROR_THRESHOLD);
      }
    });

    it('should throw an error if vector has invalid dimenions', () => {
      const matrix = new Matrix(2, 2);
      const vector = new Vector(3);

      expect(() => { matrix.solve(vector); })
          .toThrow(new RegExp(`Vector has to be of size 2 but is 3`));
    });

    it('should return NULL if system is not solvable', () => {
      const matrix = new Matrix(2, 2).zeros();
      const vector = new Vector(2).random();

      const solution = matrix.solve(vector);

      expect(solution).toBeNull;
    });

    it('should return NULL if it is not computable (e.g. null-vector)', () => {
      const matrix = new Matrix().from([[1, 2], [3, 4]]);
      const vector = new Vector(2).zeros();

      const solution = matrix.solve(vector);

      expect(solution).toBeNull;
    });
  });

  describe('diagonalize', () => {
    it('should do nothing on diagonal matrices', () => {
      const data = [
        [1, 23, 1],
        [0, 1, 3],
        [0, 0, 3]
      ];
      const matrix = new Matrix().from(data);
      matrix.diagonalize();

      expect(matrix).toEqual(data);
    });

    it('should diagonalize a 3x2 matrix', () => {
      const matrix = new Matrix().from(test3x2);
      matrix.diagonalize();
      expect(matrix[1][0]).toBe(0);
      expect(matrix[2][0]).toBe(0);
      expect(matrix[2][1]).toBe(0);
    });
  });
});