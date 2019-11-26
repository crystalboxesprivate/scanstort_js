export class Texture {
  gl: WebGLRenderingContext
  width: number
  height: number

  textureType: number

  constructor(gl: WebGLRenderingContext, width: number, height: number, textureType: number) {
    this.gl = gl
    this.width = width
    this.height = height
    this.textureType = textureType
    throw new Error("Method not implemented.");
  }

  setData(data: Uint8Array | Uint8ClampedArray) {
    let gl = this.gl
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, this.textureType, (function () {
      return data.constructor == Uint8ClampedArray ? new Uint8Array(data.buffer) : data
    })())
      // need to bind the texture first
    throw new Error("Method not implemented.");
  }
}
