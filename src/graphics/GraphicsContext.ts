import { Texture } from "./Texture";
import { Shader } from "./Shader";
import { CanvasBase } from "./CanvasBase"

export class GraphicsContext extends CanvasBase {
  newRenderTexture(width: number, height: number): import("./RenderTexture").RenderTexture {
    throw new Error("Method not implemented.");
  }
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

  newShader(vertSourceId: string, fragSourceId: string): Shader {
    if (!this.gl) {
      throw new Error("context wasn't initialized")
    }
    return new Shader(this.gl,
      (document.getElementById(vertSourceId) as HTMLElement).innerText,
      (document.getElementById(fragSourceId) as HTMLElement).innerText
    )
  }

  present(renderTexture: Texture, shader: Shader) {
    throw new Error("Method not implemented.");
    shader.unbind()
  }
  blit(source: Texture, target: Texture, shader: Shader) {
    throw new Error("Method not implemented.");
    shader.unbind()
  }
  newTexture(width: number, height: number): Texture {
    throw new Error("Method not implemented.");
  }

}
