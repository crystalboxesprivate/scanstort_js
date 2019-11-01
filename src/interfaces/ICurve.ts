export class CurvePoint {
  position: number
  value: number
}

export interface ICurve {
  getCurvePointBuffer(): Float32Array
  getCurvePoints(): CurvePoint[]
  getCurvePointsUnsorted(): CurvePoint[]

  getLastPointIndex(): number
  
  addPoint(position: number, value: number): void
  removePoint(index: number): void
  setPointValue(index: number, position: number, value: number): void
}
