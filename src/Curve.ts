import { ICurve, CurvePoint } from "./interfaces/ICurve"

const bufferSize = 256

function lerp(start: number, end: number, amount: number): number {
  return (1 - amount) * start + amount * end
}

export class Curve implements ICurve {
  points: CurvePoint[]
  buffer: Float32Array

  isDirty: boolean = true

  constructor() {
    this.buffer = new Float32Array(bufferSize)
    this.points = [
      { position: 0, value: 0.5 },
      { position: 1, value: 0.5 }
    ]
  }

  getLastPointIndex(): number {
    return this.points.length - 1
  }

  getCurvePointBuffer(): Float32Array {
    if (this.isDirty) {
      let pts = this.getCurvePoints()

      for (let x = 0; x < bufferSize; x++) {
        let u = x / bufferSize

        let indexLess = 0
        let indexMore = 0

        for (let y = 0; y < pts.length - 1; y++) {
          if (pts[y].position < u && pts[y + 1].position > u) {
            indexLess = y
            indexMore = y + 1
            break;
          }
        }

        this.buffer[x] = lerp(pts[indexLess].value, pts[indexMore].value,
          u - pts[indexLess].position)
      }
    }

    return this.buffer
  }

  getCurvePoints(): CurvePoint[] {
    let pts: CurvePoint[] = []
    for (let pt of this.points) {
      pts.push({position: pt.position, value: pt.value})
    }
    pts.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
    return pts
  }

  getCurvePointsUnsorted(): CurvePoint[] {
    return this.points
  }

  addPoint(position: number, value: number): void {
    this.points.push({ position: position, value: value })
    this.isDirty = true
  }

  removePoint(index: number): void {
    if (index < this.points.length) {
      this.points.splice(index, 1)
      this.isDirty = true
    }
  }

  setPointValue(index: number, position: number, value: number): void {
    if (index < this.points.length) {
      this.points[index].position = position
      this.points[index].value = value
      this.isDirty = true
    }
  }
}
