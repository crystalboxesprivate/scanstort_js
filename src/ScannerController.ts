import { ICanvas } from './interfaces/ICanvas'

import { WebGLQuad } from "./canvases/WebGLQuad";
import { Canvas2D } from "./canvases/Canvas2D"
import { IValueUpdatable } from './interfaces/IValueUpdatable';
import { ICurve, isCurveInstance } from './interfaces/ICurve';


export class Parameters {
  sh_weight: number = 0
  sh_amp: number = 0.004
  sh_freq: number = 0.05

  sh_weightCurveSlot: number = 0
  sh_freqCurveSlot: number = 0

  sv_weight: number = 1
  sv_amp: number = 0.032
  sv_freq: number = .12

  sv_weightCurveSlot: number = 0
  sv_freqCurveSlot: number = 0

  dh_weight: number = 0
  dh_weightCurveSlot: number = 0

  dv_weight: number = 0
  dv_weightCurveSlot: number = 0

  n_weight: number = 1
  n_weightCurveSlot: number = 0
  n_complexity: number = 0.5
  n_freq: number = 1.0
  n_ampx: number = .03
  n_ampy: number = .1
}

export class ScannerController implements ICanvas, IValueUpdatable {
  params: Parameters

  canvasGl: WebGLQuad | null = null
  canvas2d: Canvas2D | null = null
  res: { width: number, height: number }
  isDirty: boolean = true
  constructor(width: number, height: number) {
    this.res = { width: width, height: height }
    this.params = new Parameters()
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
    this.canvasGl = new WebGLQuad(document.getElementById('canvasgl') as HTMLCanvasElement, this.params)
    this.canvas2d = new Canvas2D(document.getElementById('canvas2d') as HTMLCanvasElement)
    this.canvas2d.canvas.style.display = "none"
    this.canvasGl.canvas.style.display = "block"
    this.handleCanvas2dDrawing()
    this.handleGlDrawing()
  }

  drawLoop() {
    let that = this
    function update(timestamp: number) {
      if (that.isDirty) {
        that.handleGlDrawing()
      }
      window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update)
  }

  setValue(name: string, value: any): void {
    let uniforms = this.canvasGl.uniforms
    let un = this.params
    if (isCurveInstance(value)) {
      let curve = <ICurve>value;
      let slot = uniforms.curveBuffer.setCurve(curve.getCurvePointBuffer(), name)
      switch (name) {
        case "sineHorizontal-curve-weight":
          un.sh_weightCurveSlot = slot; break;
        case "sineHorizontal-frequency-curve":
          un.sh_freqCurveSlot = slot; break;
        case "sineVertical-curve-weight":
          un.sv_weightCurveSlot = slot; break;
        case "sineVertical-frequency-curve":
          un.sv_freqCurveSlot = slot; break;
        case "dirHorizontal-curve-weight":
          un.dh_weightCurveSlot = slot; break;
        case "dirVertical-curve-weight":
          un.dv_weightCurveSlot = slot; break;
        case "noise-curve-weight":
          un.n_weightCurveSlot = slot; break;
        default: break;
      }
    } else {
      let val = <number>value
      switch (name) {
        case "sineHorizontal-weight":
          un.sh_weight = val; break;
        case "sineHorizontal-amp":
          un.sh_amp = val; break;
        case "sineHorizontal-frequency":
          un.sh_freq = val; break;

        case "sineVertical-weight":
          un.sv_weight = val; break;
        case "sineVertical-amp":
          un.sv_amp = val; break;
        case "sineVertical-frequency":
          un.sv_freq = val; break;

        case "dirHorizontal-weight":
          un.dh_weight = val; break;
        case "dirVertical-weight":
          un.dv_weight = val; break;

        case "noise-weight":
          un.n_weight = val; break;
        case "noise-compl":
          un.n_complexity = val; break;
        case "noise-freq":
          un.n_freq = val; break;
        case "noise-ampx":
          un.n_ampx = val; break;
        case "noise-ampy":
          un.n_ampy = val; break;

        default: break;
      }
    }
    this.setDirty()
  }

  getValue(name: string): any {
    let un = this.params
    switch (name) {
      case "sineHorizontal-weight":
        return un.sh_weight
      case "sineHorizontal-amp":
        return un.sh_amp
      case "sineHorizontal-frequency":
        return un.sh_freq

      case "sineVertical-weight":
        return un.sv_weight
      case "sineVertical-amp":
        return un.sv_amp
      case "sineVertical-frequency":
        return un.sv_freq

      case "dirHorizontal-weight":
        return un.dh_weight
      case "dirVertical-weight":
        return un.dv_weight

      case "noise-weight":
        return un.n_weight
      case "noise-compl":
        return un.n_complexity
      case "noise-freq":
        return un.n_freq
      case "noise-ampx":
        return un.n_ampx
      case "noise-ampy":
        return un.n_ampy

      default: break;
    }
  }

}
