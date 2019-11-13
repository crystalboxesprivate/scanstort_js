import * as React from "react"
import { IValueUpdatable } from "../interfaces/IValueUpdatable";
import { IStateLoadable } from "./IStateLoadable";

export interface ResolutionFormProps { canvas: IValueUpdatable }

export class ResolutionSettings extends React.Component<ResolutionFormProps, {}> implements IStateLoadable {
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

  get canvasWidthParamName() { return "width" }
  get canvasHeightParamName() { return "height" }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let val = Math.max(+event.target.value, 1)
    let width = this.state.width
    let height = this.state.height

    if (event.target.name == this.canvasWidthParamName) {
      if (val != this.state.width) {
        width = val
        this.canvas.setValue(this.canvasWidthParamName, width)
      }
    }

    if (event.target.name == this.canvasHeightParamName) {
      if (val != this.state.height) {
        height = val
        this.canvas.setValue(this.canvasHeightParamName, height)
      }
    }

    this.setState({ width: width, height: height })
  }

  refreshState() {
    this.setState({ width: this.canvas.getValue(this.canvasWidthParamName), 
      height: this.canvas.getValue(this.canvasHeightParamName) })
  }


  render() {
    return (
      <div style={{ padding: 10 }}>
        <span>Width: </span>
        <input type="text" value={this.state.width}
          name={this.canvasWidthParamName} onChange={this.handleChange} />
        <br />
        <span>Height: </span>
        <input type="text" value={this.state.height}
          name={this.canvasHeightParamName} onChange={this.handleChange} />
      </div>
    );
  }
}
