import * as React from "react"
import { IParameter } from "./IParameter"

export enum NumberFieldRepresentation {
  TextField,
  RangedSlider
}

export interface NumberFieldProps {
  default?: number, min?: number, max?: number, type?: NumberFieldRepresentation
}

export class NumberField extends React.Component implements IParameter {
  state: { value: number }
  actualValue: number

  props: {default: number, min: number, max: number, type: NumberFieldRepresentation}

  
  static defaultProps = {
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
    this.props = {
      default: props.default == null ? 0.0 : props.default,
      min: props.min == null ? 0.0 : props.min,
      max: props.max == null ? 1.0 : props.max,
      type: props.type == null ? NumberFieldRepresentation.RangedSlider : props.type
    }
  }

  setDirty() : void {
    this.actualValue = this.state.value - 1
  }

  isChanged() : boolean {
    if (this.actualValue != this.state.value) {
      this.actualValue = this.state.value
      return true
    }
    return false
  }

  get(_?:any): any {
    return this.actualValue
  }
  
  set(value: any): void  {
    this.setState({value: value as number})
  }
}
