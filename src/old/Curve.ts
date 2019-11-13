import { ICurve, CurvePoint } from "./interfaces/ICurve"


export class Curve implements ICurve {
  points: CurvePoint[]

  constructor() {
    this.points = [
      { position: 0, value: 0.5 },
      { position: 1, value: 0.5 }
    ]
  }

  getLastPointIndex(): number {
    return this.points.length - 1
  }

  getCurvePoints(): CurvePoint[] {
    let pts: CurvePoint[] = []
    for (let pt of this.points) {
      pts.push({ position: pt.position, value: pt.value })
    }
    pts.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
    return pts
  }

  getCurvePointsUnsorted(): CurvePoint[] {
    return this.points
  }

  addPoint(position: number, value: number): void {
    this.points.push({ position: position, value: value })
  }

  removePoint(index: number): void {
    if (index < this.points.length) {
      this.points.splice(index, 1)
    }
  }

  setPointValue(index: number, position: number, value: number): void {
    if (index < this.points.length) {
      this.points[index].position = position
      this.points[index].value = value
    }
  }
}
