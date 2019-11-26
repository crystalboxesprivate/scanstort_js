import { CanvasBase } from "./CanvasBase"

export class CanvasContext extends CanvasBase {
  get htmlId(): string { return "canvas2d-context" }
  private _ctx: CanvasRenderingContext2D
  get ctx(): CanvasRenderingContext2D {
    if (this._ctx == null) {
      if (this.canvas == null) {
        return null
      }
      this._ctx = this.canvas.getContext("2d")
    }
    return this._ctx
  }

  getPixels(startX: number, startY: number, width: number, height: number): Uint8ClampedArray {
    return this.ctx.getImageData(0, 0, width, height).data
  }
}
