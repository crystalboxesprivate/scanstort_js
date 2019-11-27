import * as React from "react"
import { IParameter } from "./IParameter"
import { RangedSlider } from "./RangedSlider"

export enum NumberFieldRepresentation {
  TextField,
  RangedSlider
}

export interface NumberFieldProps {
  min: number,
  max: number,
  default: number,
  step: number,
  title: string,
  parameterName: string,
  type: NumberFieldRepresentation
}

export class NumberField extends React.Component implements IParameter {
  state: { value: number }
  actualValue: number

  props: NumberFieldProps

  static defaultProps: NumberFieldProps = {
    min: 0,
    max: 10,
    default: 5,
    step: 1,
    title: "default",
    parameterName: "",
    type: NumberFieldRepresentation.RangedSlider
  }

  constructor(props: NumberFieldProps) {
    super(props)
    this.props = props
    this.state = { value: props.default }
    this.handleChange = this.handleChange.bind(this)
  }

  setDirty(): void {
    this.actualValue = this.state.value - 1
  }

  isChanged(): boolean {
    if (this.actualValue != this.state.value) {
      this.actualValue = this.state.value
      return true
    }
    return false
  }

  get(_?: any): any {
    return this.state.value
  }

  set(value: any): void {
    this.setState({ value: value as number })
  }

  handleChange(n: number) {
    this.set(n)
  }

  render() {
    if (this.props.type == NumberFieldRepresentation.TextField) {
      throw new Error("Not implemented")
    } else {
      return (
        <RangedSlider
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          step={this.props.step}
          title={this.props.title}
          onChange={this.handleChange}
        />
      )
    }
  }
}
