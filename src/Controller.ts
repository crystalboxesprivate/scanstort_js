import { WebGLQuad } from './canvases/gl/WebGLQuad'
import { Canvas2D } from './canvases/Canvas2D'
import { Parameters } from './Parameters'
import { IValueUpdatable } from './interfaces/IValueUpdatable'
import { ICurve, isCurveInstance } from './interfaces/ICurve'

export class ScannerController implements IValueUpdatable {
  params: Parameters

  canvasGl: WebGLQuad | null = null
  canvas2d: Canvas2D | null = null
  isDirty: boolean = true

  constructor(params: Parameters) {
    this.params = params
  }

  getWidth(): number {
    return this.params.width
  }

  getHeight(): number {
    return this.params.height
  }

  setDirty(): void {
    this.isDirty = true
  }

  updateResolution(): void {
    this.canvasGl.width = this.canvas2d.width = this.params.width
    this.canvasGl.height = this.canvas2d.height = this.params.height
    this.canvasGl.freeTexture()
    this.setDirty()
  }

  handleGlDrawing() {
    this.canvas2d.drawText(this.params.text, this.params.size, this.params.font, this.params.repeats)

    let canvasGl = this.canvasGl
    let canvas2d = this.canvas2d
    let width = this.params.width
    let height = this.params.height

    var pixel = canvas2d.getImageData(0, 0, width, height)
    canvasGl.loadPixels(pixel.data, pixel.width, pixel.height)
    canvasGl.draw()
    this.isDirty = false
  }

  initGraphics() {
    // set resolution
    this.canvasGl = new WebGLQuad('canvasgl', this.params)
    this.canvas2d = new Canvas2D('canvas2d')
    // set styles
    this.canvas2d.width = this.params.width
    this.canvas2d.height = this.params.height
    this.canvasGl.width = this.params.width
    this.canvasGl.height = this.params.height

    this.canvas2d.canvas.style.display = "none"
    this.canvasGl.canvas.style.display = "block"
    this.setDirty()
  }

  drawLoop() {
    let that = this
    function update(_: number) {
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
      let slot = uniforms.curveBuffer.setCurve(curve, name)
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
      switch (name) {
        case "text-textarea":
          un.text = value; break;
        case "text-font":
          un.font = value; break;
        case "text-size":
          un.size = value; break;
        case "text-repeats":
          un.repeats = value; break;

        case "width":
          { un.width = value; this.updateResolution(); break; }
        case "height":
          { un.height = value; this.updateResolution(); break; }
        case "g_amount":
          un.g_amount = value; break;
        case "g_amountX":
          un.g_amountX = value; break;
        case "g_amountY":
          un.g_amountY = value; break;

        case "sineHorizontal-weight":
          un.sh_weight = value; break;
        case "sineHorizontal-amp":
          un.sh_amp = value; break;
        case "sineHorizontal-frequency":
          un.sh_freq = value; break;

        case "sineVertical-weight":
          un.sv_weight = value; break;
        case "sineVertical-amp":
          un.sv_amp = value; break;
        case "sineVertical-frequency":
          un.sv_freq = value; break;

        case "dirHorizontal-weight":
          un.dh_weight = value; break;
        case "dirVertical-weight":
          un.dv_weight = value; break;

        case "noise-weight":
          un.n_weight = value; break;
        case "noise-compl":
          un.n_complexity = value; break;
        case "noise-freq":
          un.n_freq = value; break;
        case "noise-ampx":
          un.n_ampx = value; break;
        case "noise-ampy":
          un.n_ampy = value; break;
        case "noise-offset":
          un.n_offset = value; break;

        default: break;
      }
    }
    this.setDirty()
  }

  getValue(name: string): any {
    let un = this.params
    switch (name) {
      case "text-textarea":
        return un.text
      case "text-font":
        return un.font
      case "text-size":
        return un.size
      case "text-repeats":
        return un.repeats

      case "width":
        return un.width
      case "height":
        return un.height
      case "g_amount":
        return un.g_amount
      case "g_amountX":
        return un.g_amountX
      case "g_amountY":
        return un.g_amountY

      case "sineHorizontal-curve-weight":
        return un.sh_weightCurve
      case "sineHorizontal-frequency-curve":
        return un.sh_frequencyCurve
      case "sineVertical-curve-weight":
        return un.sv_weightCurve
      case "sineVertical-frequency-curve":
        return un.sv_frequencyCurve
      case "dirHorizontal-curve-weight":
        return un.dh_weightCurve
      case "dirVertical-curve-weight":
        return un.dv_weightCurve
      case "noise-curve-weight":
        return un.n_weightCurve

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
      case "noise-offset":
        return un.n_offset

      default: break;
    }
  }

}
