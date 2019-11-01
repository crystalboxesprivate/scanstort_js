import {ICanvas} from './ICanvas'

import { WebGLQuad } from "./WebGLQuad";
import { CanvasOut } from "./CanvasOut"

function merge(a: Uint8Array, b: Uint8Array): Uint8Array {
  var merged = new Uint8Array(a.length + b.length)
  merged.set(a)
  merged.set(b, a.length)
  return merged
}

export class ScannerController implements ICanvas {
  canvasGl: WebGLQuad | null = null
  canvas2d: CanvasOut | null = null
  res: {width: number, height:number} 
  constructor(width: number, height: number) {
    this.res = {width: width, height: height}
  }

  getWidth() : number {
    return this.res.width
  }

  getHeight() : number {
    return this.res.height
  }

  onResolutionChanged(width: number, height: number): void {
    if (width != this.res.width || height != this.res.height) {
      this.canvasGl.canvas.width = this.canvas2d.canvas.width = this.res.width = width
      this.canvasGl.canvas.width = this.res.height = height
      // todo reallocate framebuffers
      
    }
    this.run()
  }

  run() {
    let canvasGl = this.canvasGl
    let canvas2d = this.canvas2d
    let width= this.res.width
    let height= this.res.height

    var pixel = canvas2d.ctx.getImageData(0, 0, width, height)
    canvasGl.loadPixels(pixel.data, width, height)

    let image = canvasGl.scan(0)
    for (let x = 1; x < this.getHeight(); x++) {
      image = merge(image, canvasGl.scan(x))
    }
    canvasGl.loadPixels(image, width, height)
    canvasGl.draw()
  }

  init() {
    this.canvasGl = new WebGLQuad(document.getElementById('canvasgl') as HTMLCanvasElement)
    this.canvas2d = new CanvasOut(document.getElementById('canvas2d') as HTMLCanvasElement)

    this.canvas2d.drawText("download")

    this.canvas2d.canvas.style.display = "none"
    this.canvasGl.canvas.style.display = "block"
    this.run()
  }
}