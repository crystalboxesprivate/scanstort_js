import { Texture } from "./Texture";
import { Shader } from "./Shader";
import { CanvasBase } from "./CanvasBase"
import { RenderTexture } from "./RenderTexture";

export class GraphicsContext extends CanvasBase {
  get htmlId(): string { return "canvas-webgl" }

  private _gl: WebGLRenderingContext
  get gl(): WebGLRenderingContext {
    if (this._gl == null) {
      if (this.canvas == null) {
        return null
      }
      this._gl = this.canvas.getContext('webgl')
    }
    return this._gl
  }

  get displayCss() {
    return { display: 'block' }
  }

  newShader(vertSourceId: string, fragSourceId: string): Shader {
    if (!this.gl) {
      throw new Error("context wasn't initialized")
    }
    return new Shader(this.gl,
      (document.getElementById(vertSourceId) as HTMLElement).innerText,
      (document.getElementById(fragSourceId) as HTMLElement).innerText
    )
  }


  vertexBuffer: WebGLBuffer | null = null
  initVertexBuffer() {
    if (this.vertexBuffer == null) {
      let gl = this.gl
      this.vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
      ]), gl.STATIC_DRAW)
    }
  }

  doDrawing( program: WebGLProgram) {
    const bufferSize = 6
    let that = this
    let gl = this.gl
    gl.useProgram(program)
    let attr = gl.getAttribLocation(program, 'pos')
    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enableVertexAttribArray(attr)
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, bufferSize)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.useProgram(null)
  }
  
  present(renderTexture: Texture, shader: Shader) {
    this.initVertexBuffer()
    let gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    shader.setTexture("texture", renderTexture, 0);
    this.doDrawing(shader.program)
  }

  blit(source: Texture, target: RenderTexture, shader: Shader) {
    this.initVertexBuffer()
    let gl = this.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer)
    shader.setTexture("texture", source, 0)
    this.doDrawing(shader.program)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  newTexture(width: number, height: number, asDataTexture?: boolean): Texture {
    let gl = this.gl
    let texture = null
    if (asDataTexture === true) {
      texture = new Texture(gl, width, height, gl.UNSIGNED_BYTE, gl.NEAREST, gl.LUMINANCE)
    } else {
      texture = new Texture(gl, width, height, gl.UNSIGNED_BYTE, gl.LINEAR, gl.RGBA)
    }
    return texture
  }

  newRenderTexture(width: number, height: number): import("./RenderTexture").RenderTexture {
    return new RenderTexture(this.gl, width, height, this.gl.UNSIGNED_BYTE)
  }
}
