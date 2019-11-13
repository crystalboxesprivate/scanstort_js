import * as React from "react"
import { IParameter } from "./IParameter"

export enum StringFieldRepresentation {
  TextField,
  TextArea
}

export interface StringFieldProps {
  default: string,
  title: string,
  type: StringFieldRepresentation
}

export class StringField extends React.Component implements IParameter {
  state: { value: string }
  actualValue: string

  props: StringFieldProps

  constructor(props: StringFieldProps) {
    super(props)
    this.props = props
  }


  static defaultProps = {
    default: "",
    title: "default",
    type: StringFieldRepresentation.TextArea
  }

  setDirty(): void {
    this.actualValue = this.state.value + "_"
  }

  isChanged(): boolean {
    if (this.actualValue != this.state.value) {
      this.actualValue = this.state.value
      return true
    }
    return false
  }

  get(_?: any): any {
    return this.actualValue
  }

  set(value: any): void {
    this.setState({ value: value as string })
  }
}
