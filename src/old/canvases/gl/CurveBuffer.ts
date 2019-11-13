import { ICurve } from "../../interfaces/ICurve"

const CurveBufferSize = 512
let buffer = new Float32Array(CurveBufferSize)

function lerp(start: number, end: number, amount: number): number {
  return (1 - amount) * start + amount * end
}

function fillCurvePointBuffer(curve: ICurve) {
  let pts = curve.getCurvePoints()

  for (let x = 0; x < CurveBufferSize; x++) {
    let u = x / CurveBufferSize

    let indexLess = 0
    let indexMore = 0

    for (let y = 0; y < pts.length - 1; y++) {
      if (pts[y].position < u && pts[y + 1].position > u) {
        indexLess = y
        indexMore = y + 1
        break;
      }
    }

    // Objects are drawn in the upsidedown orientation. Mirror them
    buffer[x] = 1.0 - lerp(pts[indexLess].value, pts[indexMore].value,
      u - pts[indexLess].position)
  }
}

export class CurveBufferTexture {
  static readonly resolution = CurveBufferSize
  static readonly slots = 8

  gl: WebGLRenderingContext
  slots: string[]

  private isDirty: boolean

  buffer: Uint8Array
  private tex: WebGLTexture

  get texture(): WebGLTexture {
    if (this.isDirty) {
      this.uploadToGPU()
    }
    return this.tex
  }

  constructor(gl: WebGLRenderingContext) {
    this.slots = []

    this.gl = gl
    this.buffer = new Uint8Array(
      CurveBufferTexture.resolution * CurveBufferTexture.slots)
    this.buffer.fill(127)

    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.uploadToGPU()
  }

  getSlot(name: string) {
    let slot = this.slots.indexOf(name)
    if (slot == -1) {
      this.slots.push(name)
      slot = this.slots.length - 1
    }
    return slot
  }

  setCurve(value: ICurve, name: string): number {
    fillCurvePointBuffer(value)
    let slot = this.getSlot(name)
    if (CurveBufferTexture.resolution !== buffer.length) {
      // TODO resample to the texture resolution
      throw ("Curve resolution mismatch")
    }
    if (slot >= CurveBufferTexture.slots) {
      throw ("Invalid slot number (" + slot + " of " + CurveBufferTexture.slots + ")")
    }
    for (let x = 0; x < buffer.length; x++) {
      const offset = slot * CurveBufferTexture.resolution
      let byteVal = Math.floor(buffer[x] * 255)
      this.buffer[offset + x] =
        byteVal > 255
          ? 255
          : byteVal < 0
            ? 0
            : byteVal
    }
    this.isDirty = true
    return slot
  }

  uploadToGPU() {
    let gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, CurveBufferTexture.resolution,
      CurveBufferTexture.slots, 0,
      gl.LUMINANCE, gl.UNSIGNED_BYTE, this.buffer);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.isDirty = false
  }
}
