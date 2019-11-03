import { ShaderProgram } from "./ShaderProgram"
import { UniformParameters } from "./UniformParameters"
import { Parameters } from "../../Parameters"
import { CanvasBase, aspect } from "../CanvasBase"

class Framebuffer {
  fb: WebGLFramebuffer
  framebufferTex: WebGLTexture
  gl: WebGLRenderingContext

  canvas:CanvasBase
  resolutionMultiplier: number

  constructor(gl: WebGLRenderingContext, resolutionMultiplier: number, canvas: CanvasBase) {
    this.gl = gl
    this.canvas = canvas
    this.resolutionMultiplier = resolutionMultiplier
    this.fb = gl.createFramebuffer()
    this.reallocate()
  }

  reallocate() {
    let gl = this.gl
    let canvas = this.canvas
    if (this.framebufferTex != null) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebufferTex)
      this.gl.deleteTexture(this.framebufferTex)
      this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    }
    this.framebufferTex = gl.createTexture()
    let targetTexture = this.framebufferTex
    gl.bindTexture(gl.TEXTURE_2D, targetTexture)
    {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        canvas.width * this.resolutionMultiplier, canvas.height * this.resolutionMultiplier, 0,
                    gl.RGBA, gl.UNSIGNED_BYTE, null)
    
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
    
    const attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}

export class WebGLQuad extends CanvasBase {
  gl: WebGLRenderingContext | null = null

  vertexBuffer: WebGLBuffer | null = null
  bufferSize: number = 6

  tex: WebGLTexture | null = null
  shader: ShaderProgram
  uniforms: UniformParameters

  framebuffer: Framebuffer

  constructor(canvasId: string, params: Parameters) {
    super(canvasId)
    this.gl = <WebGLRenderingContext>this.canvas.getContext('webgl')
    if (!this.gl) {
      throw ('WebGL is not supported on your browser')
    }

    this.shader = new ShaderProgram(this.gl,
      (<HTMLElement>document.getElementById('vert')).innerText,
      (<HTMLElement>document.getElementById('frag')).innerText)

    this.uniforms = new UniformParameters()
    this.uniforms.params = params
    this.uniforms.init(this.gl)

    this.framebuffer = new Framebuffer(this.gl, 1, this)

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
    gl.viewport(0, 0, aspect(this.width), aspect(this.height))
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

    this.framebuffer.reallocate()
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
