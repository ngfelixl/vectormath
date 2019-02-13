import { Node } from "../models/node";
import { doublyConnectedEdgeList } from "./doubly-connected-edge-list";
import { Vector } from "../vector";

export class Polygon {
  id?: string;
  edgeList: Node[];

  constructor(points: Vector[]) {
    this.edgeList = doublyConnectedEdgeList(points) || [];
  }

  near(polygon: Polygon) {
    return !(this.xRange[0] > polygon.xRange[1]
      || this.xRange[1] < polygon.xRange[0]
      || this.yRange[0] > polygon.yRange[1]
      || this.yRange[1] < polygon.yRange[0]);
  }

  get xRange() {
    return this.edgeList.reduce((acc, cur) => {
        return [
          acc[0] < cur.start[0] ? acc[0] : cur.start[0],
          acc[1] > cur.start[0] ? acc[1] : cur.start[0]
        ];
      },
      this.edgeList[0].start as number[]
    );
  }

  get yRange() {
    return this.edgeList.reduce((acc, cur) => {
        return [
          acc[0] < cur.start[1] ? acc[0] : cur.start[1],
          acc[1] > cur.start[1] ? acc[1] : cur.start[1]
        ];
      },
      this.edgeList[0].start as number[]
    );
  }
}
