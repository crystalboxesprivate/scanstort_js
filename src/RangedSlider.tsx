import * as React from "react"
type ValueCallback = (n: number) => any;

export interface RangedSliderProps {
  min: number, max: number,  value: number,
  step: number, title: string, onChange?: ValueCallback;
}

export interface RangedSliderState {
  value:number
}

export class RangedSlider extends React.Component<RangedSliderProps, {}> {
  props: RangedSliderProps
  state: RangedSliderState

  changeEvent?: ValueCallback
  
  constructor(props: RangedSliderProps) {
    super(props)
    this.props = props
    this.state = { value: +props.value }

    this.handleChange = this.handleChange.bind(this)
    this.getInitialState = this.getInitialState.bind(this)
    this.changeEvent = props.onChange
  }

  static defaultProps = {
    min: 0,
    max: 10,
    step: 1,
    title: "default",
    value: 5,
  }

  getInitialState(): { value: number } {
    return { value: +this.props.value }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value })

    if (this.changeEvent != null) {
      this.changeEvent(this.state.value)
    }
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
