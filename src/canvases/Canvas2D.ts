import { CanvasBase, aspect } from "./CanvasBase"

export class Canvas2D extends CanvasBase {
  ctx: CanvasRenderingContext2D
  
  constructor(canvasId: string) {
    super(canvasId)
    let ctx = this.canvas.getContext("2d")
    if (!ctx) {
      throw ("Canvas is not supported")
    } else {
      this.ctx = ctx
    }
  }

  getImageData(x: number, y: number, width: number, height: number): ImageData {
    return this.ctx.getImageData(aspect(0), aspect(0), aspect(width), aspect(height))
  }

  drawText(text: string, size: number, font: string, repeats: number) {
    let ctx = this.ctx
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, aspect(this.width), aspect(this.height))
    ctx.fillStyle = "black"

    ctx.font = `${aspect(size)}px ${font}`
    for (let x = 0; x < repeats; x++) {
      ctx.fillText(text, aspect(100), aspect(x * 80))
    }
  }
}
