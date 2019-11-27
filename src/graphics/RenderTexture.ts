import { Texture } from "./Texture";

export class RenderTexture extends Texture {
  gl: WebGLRenderingContext
  framebuffer: WebGLFramebuffer
  texture: WebGLTexture

  constructor(gl: WebGLRenderingContext, width: number, height: number, textureType: number) {
    super(gl, width, height, textureType, gl.LINEAR, gl.RGBA)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    this.framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  setData(_: Uint8Array | Uint8ClampedArray) {
    throw new Error("Setting data is not allowed for render textures")
  }
}
