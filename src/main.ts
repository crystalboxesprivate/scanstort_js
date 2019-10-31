import { WebGLQuad } from "./webgl-quad";
import { CanvasOut } from "./canvas-out"

let canvasGl = new WebGLQuad(<HTMLCanvasElement>document.getElementById('canvasgl'))
let canvas2d = new CanvasOut(<HTMLCanvasElement>document.getElementById('canvas2d'))

canvasGl.draw()
canvas2d.drawText("Help")

canvas2d.canvas.style.display = "none"
canvasGl.canvas.style.display = "block"
