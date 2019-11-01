import { ICanvas } from './interfaces/ICanvas'

import { WebGLQuad } from "./canvases/WebGLQuad";
import { Canvas2D } from "./canvases/Canvas2D"
import { IValueUpdatable } from './interfaces/IValueUpdatable';

export class ScannerController implements ICanvas, IValueUpdatable {
  canvasGl: WebGLQuad | null = null
  canvas2d: Canvas2D | null = null
  res: { width: number, height: number }
  isDirty: boolean = true
  constructor(width: number, height: number) {
    this.res = { width: width, height: height }
  }

  getWidth(): number {
    return this.res.width
  }

  getHeight(): number {
    return this.res.height
  }

  setDirty(): void {
    this.isDirty = true
  }

  onResolutionChanged(width: number, height: number): void {
    if (width != this.res.width || height != this.res.height) {
      this.canvasGl.canvas.width = this.canvas2d.canvas.width = this.res.width = width
      this.canvasGl.canvas.height = this.canvas2d.canvas.height = this.res.height = height
      this.canvasGl.freeTexture()
      this.handleCanvas2dDrawing()
    }
    this.handleGlDrawing()
  }

  setValue(name: string, value: any): void {

  }

  handleCanvas2dDrawing() {
    this.canvas2d.drawText("download")
  }

  handleGlDrawing() {
    let canvasGl = this.canvasGl
    let canvas2d = this.canvas2d
    let width = this.res.width
    let height = this.res.height

    var pixel = canvas2d.ctx.getImageData(0, 0, width, height)
    canvasGl.loadPixels(pixel.data, width, height)
    canvasGl.draw()
    this.isDirty = false
  }

  init() {
    this.canvasGl = new WebGLQuad(document.getElementById('canvasgl') as HTMLCanvasElement)
    this.canvas2d = new Canvas2D(document.getElementById('canvas2d') as HTMLCanvasElement)
    this.canvas2d.canvas.style.display = "none"
    this.canvasGl.canvas.style.display = "block"
    this.handleCanvas2dDrawing()
    this.handleGlDrawing()
  }

  drawLoop() {
    let start = 0
    function update(timestamp: number) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      if (this.isDirty) {
        this.handleGlDrawing()
      }
      if (progress < 2000) {
        window.requestAnimationFrame(update);
      }
    }

    window.requestAnimationFrame(update)
  }
}
