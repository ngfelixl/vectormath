import { Vector } from '../core/vector';

export interface Node {
  edge: Vector;

  start: Vector;
  end: Vector;

  faceLeft: string;
  faceRight: string;

  previous: number;
  next: number;
}
