export class CanvasOut {
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
  drawText(text:string) {
    let ctx = this.ctx
    let canvas = this.canvas
    ctx.fillStyle = "orange"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"

    ctx.font = "78px Impact"
    for (let x = 0; x < 10; x++) {
      ctx.fillText(text, 100, x * 80)
    }
  }
}
