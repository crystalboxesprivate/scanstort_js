import * as React from "react"
import { IValueUpdatable } from "./old/interfaces/IValueUpdatable"

export interface RangedSliderProps {
  min: number, max: number, default: number,
  step: number, title: String
}

export interface RangedSliderState {
  value:number
}

export class RangedSlider extends React.Component<RangedSliderProps, {}> {
  props: RangedSliderProps
  state: RangedSliderState
  
  constructor(props: RangedSliderProps) {
    super(props)
    this.props = props
    this.state = { value: +props.default }

    this.handleChange = this.handleChange.bind(this)
    this.getInitialState = this.getInitialState.bind(this)
  }

  static defaultProps = {
    min: 0,
    max: 10,
    default: 5,
    step: 1,
    title: "default",
  }

  getInitialState(): { value: number } {
    return { value: +this.props.default }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value })
  }

  render() {
    return (
      <div className="ranged-slider">
        <span>{this.props.title}</span>
        <input
          type="range"
          min={this.props.min} max={this.props.max}
          value={this.state.value}
          onChange={this.handleChange}
          step={this.props.step} />
        <span className="value-text">{this.state.value}</span>
      </div>
    )
  }
}
