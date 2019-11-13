import * as React from "react"
import { Texture } from "./Texture";
import { Shader } from "./Shader";

export class GraphicsContext extends React.Component {
  state: {
    width: number,
    height: number
  }

  static defaultProps = {
    width: 640,
    height: 480,
  }

  constructor(props: { width: number, height: number }) {
    super(props)
    this.state.width = props.width
    this.state.height = props.height
    throw new Error("Not implemented.")
  }
  present(renderTexture: Texture, _materialPresent: Shader) {
    throw new Error("Method not implemented.");
  }
  blit(source: Texture, target: Texture, _material: Shader) {
    throw new Error("Method not implemented.");
  }
  newTexture(width: number, height: number): Texture {
    throw new Error("Method not implemented.");
  }

  render() {
    return (
      <canvas id="graphics-context" width={this.state.width} height={this.state.height} />
    )
  }
}
