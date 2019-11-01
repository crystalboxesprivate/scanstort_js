import * as React from "react"
import {ICanvas} from '../ICanvas'

export interface ResolutionFormProps { canvas: ICanvas }

export class ResolutionForm extends React.Component<ResolutionFormProps, {}>  {
  state: {width: number, height: number, canvas: ICanvas}
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
    if (event.target.name == "canvas-width") {
      if (+event.target.value != this.state.width) {
        this.state.width = +event.target.value
      }
    }
    if (event.target.name == "canvas-height") {
      if (+event.target.value != this.state.height) {
        this.state.height = +event.target.value
      }
    }
    this.state.canvas.onResolutionChanged(this.state.width, this.state.height)
  }

  render() {
    return (
      <div style={{padding: 10}}>
        <span>Width: </span>
        <input type="text" value={this.state.width} name="canvas-width" onChange={this.handleChange} />

        <span>Height: </span>
        <input type="text" value={this.state.height} name="canvas-height" onChange={this.handleChange} />
      </div>
    );
  }
}
