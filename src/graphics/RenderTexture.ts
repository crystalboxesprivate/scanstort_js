import { Texture } from "./Texture";

export class RenderTexture extends Texture {
  setData(_: Uint8Array | Uint8ClampedArray) {
    throw new Error("Setting data is not allowed for render textures")
  }
}