export class CurvePoint {
  position: number
  value: number
}

export function isCurveInstance(value: any): boolean {
  if (typeof value !== 'object') {
    return false
  }
  return 'getCurvePoints' in value && 'getLastPointIndex' in value
}

export interface ICurve {
  getCurvePoints(): CurvePoint[]
  getCurvePointsUnsorted(): CurvePoint[]

  getLastPointIndex(): number

  addPoint(position: number, value: number): void
  removePoint(index: number): void
  setPointValue(index: number, position: number, value: number): void
}
