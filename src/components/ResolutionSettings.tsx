import * as React from "react"
import { IValueUpdatable } from "../interfaces/IValueUpdatable";

export interface ResolutionFormProps { canvas: IValueUpdatable }

export class ResolutionSettings extends React.Component<ResolutionFormProps, {}>  {
  state: { width: number, height: number }
  canvas: IValueUpdatable

  constructor(props: ResolutionFormProps) {
    super(props);
    this.state = {
      width: props.canvas.getValue('width'),
      height: props.canvas.getValue('height')
    }

    this.canvas = props.canvas
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let val = Math.max(+event.target.value, 1)
    let width = this.state.width
    let height = this.state.height

    if (event.target.name == "canvas-width") {
      if (val != this.state.width) {
        width = val
        this.canvas.setValue("width", width)
      }
    }

    if (event.target.name == "canvas-height") {
      if (val != this.state.height) {
        height = val
        this.canvas.setValue("height", height)
      }
    }

    this.setState({ width: width, height: height })
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <span>Width: </span>
        <input type="text" value={this.state.width} name="canvas-width" onChange={this.handleChange} />
        <br />
        <span>Height: </span>
        <input type="text" value={this.state.height} name="canvas-height" onChange={this.handleChange} />
      </div>
    );
  }
}
