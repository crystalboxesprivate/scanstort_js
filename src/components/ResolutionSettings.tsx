import * as React from "react"
import { ICanvas } from '../interfaces/ICanvas'

export interface ResolutionFormProps { canvas: ICanvas }

export class ResolutionSettings extends React.Component<ResolutionFormProps, {}>  {
  state: { width: number, height: number, canvas: ICanvas }
  constructor(props: ResolutionFormProps) {
    super(props);
    this.state = {
      width: props.canvas.getWidth(),
      height: props.canvas.getHeight(),
      canvas: props.canvas
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let val = Math.max(+event.target.value, 1)
    let width = this.state.width
    let height = this.state.height

    if (event.target.name == "canvas-width") {
      if (val != this.state.width) {
        width = val
      }
    }
    if (event.target.name == "canvas-height") {
      if (val != this.state.height) {
        height = val
      }
    }

    this.state.canvas.onResolutionChanged(width, height)
    this.setState({ width: width, height: height, canvas: this.state.canvas })
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <span>Width: </span>
        <input type="text" value={this.state.width} name="canvas-width" onChange={this.handleChange} />

        <span>Height: </span>
        <input type="text" value={this.state.height} name="canvas-height" onChange={this.handleChange} />
      </div>
    );
  }
}
