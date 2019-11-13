import * as React from "react"


export class CanvasContext extends React.Component {
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

  render() {
    return (
      <canvas id="canvas-context" width={this.state.width} height={this.state.height} style={{ display: 'none' }} />
    )
  }
}
