import React = require("react")
import { IValueUpdatable } from "../interfaces/IValueUpdatable"
import {
  packState,
  unpackState
} from "../State"

interface TextInputProps { callbackObj: IValueUpdatable }

export class StateLoader extends React.Component<TextInputProps, {}> {
  obj: IValueUpdatable
  state: { textareaState: string }

  constructor(props: TextInputProps) {
    super(props)
    this.obj = props.callbackObj
    this.state = {textareaState: ""}
    this.saveState = this.saveState.bind(this)
    this.loadState = this.loadState.bind(this)
  }

  loadState(_: React.MouseEvent) {
    this.obj.setValue(this.pName, JSON.parse(unpackState(this.state.textareaState)))
  }

  get pName() { return "parameters" }

  saveState(_: React.MouseEvent) {
    let packed = packState(this.obj.getValue(this.pName))
    this.setState({ textareaState: packed })
  }

  render() {
    return (
      <div>
        <textarea name="my" value={this.state.textareaState} onChange={() => {}} />
        <button onClick={this.saveState}>
          Save state
      </button>
        <button onClick={this.loadState}>
          Load state
      </button>
      </div>
    )
  }
}