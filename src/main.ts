import { WebGLQuad } from "./webgl-quad";
import { CanvasOut } from "./canvas-out"

function merge(a: Uint8Array, b: Uint8Array): Uint8Array {
  var merged = new Uint8Array(a.length + b.length)
  merged.set(a)
  merged.set(b, a.length)
  return merged
}

let canvasGl = new WebGLQuad(<HTMLCanvasElement>document.getElementById('canvasgl'))
let canvas2d = new CanvasOut(<HTMLCanvasElement>document.getElementById('canvas2d'))

canvas2d.drawText("Help")

canvas2d.canvas.style.display = "block"
canvasGl.canvas.style.display = "block"
var pixel = canvas2d.ctx.getImageData(0, 0, canvas2d.canvas.width, canvas2d.canvas.height)
canvasGl.loadPixels(pixel.data, pixel.width, pixel.height)

let image = canvasGl.scan(0)
for (let x = 1; x < canvasGl.canvas.height; x++) {
  image = merge(image, canvasGl.scan(x))
}
canvasGl.loadPixels(image, canvas2d.canvas.width, canvas2d.canvas.height)
canvasGl.draw()
