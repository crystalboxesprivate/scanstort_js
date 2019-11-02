export const resolutionMultiplier = window.devicePixelRatio
export const aspect = (a: number) => a * resolutionMultiplier

export class CanvasBase {
  canvas: HTMLCanvasElement
  res: { w: number, h: number } = { w: 0, h: 0 }

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
  }

  get width(): number {
    return this.res.w
  }

  get height(): number {
    return this.res.h
  }

  set width(value: number) {
    this.canvas.width = aspect(value)
    this.canvas.style.width = `${value}px`
    this.res.w = value
  }

  set height(value: number) {
    this.canvas.height = aspect(value)
    this.canvas.style.height = `${value}px`
    this.res.h = value
  }
}
