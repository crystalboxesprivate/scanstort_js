import { WebGLQuad } from "./webgl-quad";
import { CanvasOut } from "./canvas-out"

let canvasGl = new WebGLQuad(<HTMLCanvasElement>document.getElementById('canvasgl'))
let canvas2d = new CanvasOut(<HTMLCanvasElement>document.getElementById('canvas2d'))

canvas2d.drawText("Help")

canvas2d.canvas.style.display = "none"
canvasGl.canvas.style.display = "block"
var pixel = canvas2d.ctx.getImageData(0, 0, canvas2d.canvas.width, canvas2d.canvas.height)
// argb8
canvasGl.uploadImage(pixel.data, pixel.width, pixel.height)
canvasGl.draw()
