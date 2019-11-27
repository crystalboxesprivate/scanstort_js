export class Texture {
  gl: WebGLRenderingContext
  width: number
  height: number

  textureType: number
  componentType: number

  texture: WebGLTexture

  constructor(gl: WebGLRenderingContext, width: number, height: number, textureType: number, filterType: number, componentType: number) {
    this.gl = gl
    this.width = width
    this.height = height
    this.textureType = textureType
    this.componentType = componentType

    this.texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, this.componentType,
      this.width, this.height, 0, this.componentType, this.textureType, null)
  
    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterType)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  setData(data: Uint8Array | Uint8ClampedArray) {
    let gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, this.componentType, this.width, this.height, 0, this.componentType, this.textureType, (function () {
      return data.constructor == Uint8ClampedArray ? new Uint8Array(data.buffer) : data
    })())
      // need to bind the texture first
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
