export class Canvas2D {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    let ctx = canvas.getContext("2d")
    if (!ctx) {
      throw("Canvas is not supported")
    } else {
      this.ctx = ctx
    }
  }
  drawText(text:string, size: number, font: string, repeats: number) {
    let ctx = this.ctx
    let canvas = this.canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"

    ctx.font = `${size}px ${font}`
    for (let x = 0; x < repeats; x++) {
      ctx.fillText(text, 100, x * 80)
    }
  }
}
