import React = require("react")
import { RangedSlider } from "./core/RangedSlider"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"
import { IStateLoadable } from "./IStateLoadable"

interface TextInputProps { callbackObj: IValueUpdatable }

const fonts = [
  'Arial',
  'Times New Roman',
  'Impact'
]

export class TextInputParameters extends React.Component<TextInputProps, {}> implements IStateLoadable {
  state: { text: string, font: string, size: number, repeats: number }
  callbackObj: IValueUpdatable

  textSizeSlider: RangedSlider
  textRepeatsSlider: RangedSlider

  constructor(props: TextInputProps) {
    super(props)
    let obj = props.callbackObj
    this.state = {
      text: obj.getValue("text-textarea"),
      font: obj.getValue("text-font"),
      size: obj.getValue("text-size"),
      repeats: obj.getValue("text-repeats")
    }
    this.callbackObj = props.callbackObj
    this.handleChange = this.handleChange.bind(this)
  }


  handleChange(event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) {
    let target = event.target
    let state = this.state
    if (target.tagName == 'TEXTAREA') {
      state.text = target.value
    } else {
      state.font = target.value
    }
    this.setState(state, () =>
      this.callbackObj.setValue(target.name, target.value));
  }

  getItems(): JSX.Element[] {
    let items = []
    for (let font of fonts) {
      items.push(<option key={font} value={font}>{font}</option>)
    }
    return items
  }


  refreshState() {
    this.textSizeSlider.setState({ value: this.callbackObj.getValue(this.textSizeParamName) })
    this.textRepeatsSlider.setState({ value: this.callbackObj.getValue(this.textRepeatsParamName) })
    let state = this.state
    state.text = this.callbackObj.getValue(this.textAreaParamName)
    state.font = this.callbackObj.getValue(this.textFontParamName)
    this.setState(state)
  }

  get textRepeatsParamName() { return "text-repeats" }
  get textSizeParamName() { return "text-size" }
  get textAreaParamName() { return "text-textarea" }
  get textFontParamName() { return "text-font" }

  render() {
    return (
      <div className="input-params">
        <textarea name={this.textAreaParamName} value={this.state.text} onChange={this.handleChange} />
        <label>
          Font:
        <select name={this.textFontParamName} value={this.state.font}
            onChange={this.handleChange}>
            {this.getItems()}
          </select>
        </label>

        <RangedSlider ref={node => (this.textSizeSlider = node)}
          min={1} max={200} default={78} step={1} title="Text Size"
          parameterName={this.textSizeParamName} callbackObject={this.callbackObj} />
        <RangedSlider ref={node => (this.textRepeatsSlider = node)}
          min={0} max={20} default={10} step={1} title="Repeats"
          parameterName={this.textRepeatsParamName} callbackObject={this.callbackObj} />
      </div>
    )
  }
}
