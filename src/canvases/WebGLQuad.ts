import { object } from "prop-types"
import {BufferSize as CurveBufferSize} from "../Curve"
class ShaderProgram {
  gl: WebGLRenderingContext
  program: WebGLProgram

  constructor(gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
    this.gl = gl

    let vert = <WebGLShader>this.compileShader(
      vertSource, gl.VERTEX_SHADER)
    let frag = <WebGLShader>this.compileShader(
      fragSource, gl.FRAGMENT_SHADER)

    this.program = <WebGLProgram>gl.createProgram();
    gl.attachShader(this.program, vert)
    gl.attachShader(this.program, frag)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.log('Shader program is not linked: ' + gl.getProgramInfoLog(this.program))
      return
    }
    gl.useProgram(this.program)
    gl.useProgram(null)
  }

  compileShader(src: string, type: number) {
    let gl = <WebGLRenderingContext>this.gl
    let typestring = 'vertex'
    if (type == gl.FRAGMENT_SHADER) {
      typestring = 'fragment'
    }

    let shader = <WebGLShader>gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('Compile error (' + typestring + '): ' + gl.getShaderInfoLog(shader))
      return null
    }
    return shader
  }
}

class CurveBufferTexture {
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

    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
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

  setCurve(value: Float32Array, name: string): number {
    let slot = this.getSlot(name)
    if (CurveBufferTexture.resolution !== value.length) {
      // TODO resample to the texture resolution
      throw ("Curve resolution mismatch")
    }
    if (slot >= CurveBufferTexture.slots) {
      throw ("Invalid slot number (" + slot + " of " + CurveBufferTexture.slots + ")")
    }
    for (let x = 0; x < value.length; x++) {
      const offset = slot * CurveBufferTexture.resolution
      let byteVal = Math.floor(value[x] * 255)
      this.buffer[offset + x] =
        byteVal > 255
          ? 255
          : byteVal < 0
            ? 0
            : byteVal
    }
    console.log("set curve")
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

class UniformParameters {
  gl: WebGLRenderingContext
  curveBuffer: CurveBufferTexture
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.curveBuffer = new CurveBufferTexture(this.gl)
  }

  sh_weight: number = 0
  sh_amp: number = 0
  sh_freq: number = 0
  sh_weightCurveSlot: number = 0
  sh_freqCurveSlot: number = 0

  sv_weight: number = 0
  sv_amp: number = 0
  sv_freq: number = 0
  sv_weightCurveSlot: number = 0
  sv_freqCurveSlot: number = 0

  dh_weight: number = 0
  dh_weightCurveSlot: number = 0

  dv_weight: number = 0
  dv_weightCurveSlot: number = 0

  n_weight: number = 0
  n_weightCurveSlot: number = 0

  setParams(program: WebGLProgram) {
    let gl = this.gl
    const uniform1f = (name: string, val: number) =>
      gl.uniform1f(gl.getUniformLocation(program, name), val)

    uniform1f("sh_weight", this.sh_weight)
    uniform1f("sh_amp", this.sh_amp)
    uniform1f("sh_freq", this.sh_freq)
    uniform1f("sh_weightCurveSlot", this.sh_weightCurveSlot)
    uniform1f("sh_freqCurveSlot", this.sh_freqCurveSlot)

    uniform1f("sv_weight", this.sv_weight)
    uniform1f("sv_amp", this.sv_amp)
    uniform1f("sv_freq", this.sv_freq)

    uniform1f("sv_weightCurveSlot", this.sv_weightCurveSlot)
    uniform1f("sv_freqCurveSlot", this.sv_freqCurveSlot)

    uniform1f("dh_weight", this.dh_weight)
    uniform1f("dh_weightCurveSlot", this.dh_weightCurveSlot)

    uniform1f("dv_weight", this.dv_weight)
    uniform1f("dv_weightCurveSlot", this.dv_weightCurveSlot)

    uniform1f("n_weight", this.n_weight)
    uniform1f("n_weightCurveSlot", this.n_weightCurveSlot)

    gl.uniform2f(gl.getUniformLocation(program, "curveRes"), 
      CurveBufferTexture.resolution, CurveBufferTexture.slots)
    
  }
}

export class WebGLQuad {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext | null = null

  vertexBuffer: WebGLBuffer | null = null
  bufferSize: number = 6

  tex: WebGLTexture | null = null
  shader: ShaderProgram

  uniforms: UniformParameters

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl')
    if (!this.gl) {
      throw ('WebGL is not supported on your browser')
    }

    this.shader = new ShaderProgram(this.gl,
      (<HTMLElement>document.getElementById('vert')).innerText,
      (<HTMLElement>document.getElementById('frag')).innerText)

    this.uniforms = new UniformParameters(this.gl)


    this.initVertexBuffer([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ])
  }


  initVertexBuffer(v: number[]) {
    let gl = <WebGLRenderingContext>this.gl
    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW)
  }

  drawQuad(program: WebGLProgram) {
    // program must be used
    let attr = 0
    let gl = <WebGLRenderingContext>this.gl
    attr = gl.getAttribLocation(program, 'pos')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.enableVertexAttribArray(attr)
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferSize)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  draw() {
    let gl = <WebGLRenderingContext>this.gl
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    let program = <WebGLProgram>this.shader.program
    gl.useProgram(program)

    gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0)
    gl.uniform1i(gl.getUniformLocation(program, 'curves'), 1)

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex)

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.uniforms.curveBuffer.texture)

    this.uniforms.setParams(program)

    gl.uniform2f(gl.getUniformLocation(program, 'resolution'), this.canvas.width, this.canvas.height)
    this.drawQuad(program)
    gl.useProgram(null)
  }

  freeTexture() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex)
    this.gl.deleteTexture(this.tex)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.tex = null
  }

  loadPixels(data: Uint8ClampedArray | Uint8Array, width: number, height: number) {
    let gl = <WebGLRenderingContext>this.gl
    if (!this.tex) {
      console.log('Allocating texture... ' + width + " : " + height)
      this.tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, this.tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    } else {
      gl.bindTexture(gl.TEXTURE_2D, this.tex)
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, (function () {
      return data.constructor == Uint8ClampedArray ? new Uint8Array(data.buffer) : data
    })())
  }
}
