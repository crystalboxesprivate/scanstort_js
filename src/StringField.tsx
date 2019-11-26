import * as React from "react"
import { IParameter } from "./IParameter"

export enum StringFieldRepresentation {
  TextField,
  TextArea,
  Select
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
    type: StringFieldRepresentation.TextArea,
    selection: ["A", "B"]
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

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ value: event.target.value });
  }

  get(_?: any): any {
    return this.state.value
  }

  set(value: any): void {
    this.setState({ value: value as string })
  }

  render() {
    if (this.props.type == StringFieldRepresentation.TextArea) {
      return (<textarea name="text-textarea" value={this.state.value} onChange={this.handleChange} />);
    }
    else {
      throw new Error("Not implemented");
    }
  }
}
