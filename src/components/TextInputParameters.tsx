import React = require("react")
import { RangedSlider } from "./core/RangedSlider"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"

interface TextInputProps { callbackObj: IValueUpdatable }

const fonts = [
  'Arial',
  'Times New Roman',
  'Impact'
]

export class TextInputParameters extends React.Component<TextInputProps, {}> {
  state: { text: string, font: string, size: number, repeats: number }
  callbackObj: IValueUpdatable
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
    this.handleChange = this.handleChange.bind(this);
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

  render() {
    return (
      <div className="input-params">
        <textarea name="text-textarea" value={this.state.text} onChange={this.handleChange} />
        <label>
          Font:
        <select name="text-font" value={this.state.font}
            onChange={this.handleChange}>
            {this.getItems()}
          </select>
        </label>

        <RangedSlider min={1} max={200} default={78} step={1} title="Text Size"
          parameterName="text-size" callbackObject={this.callbackObj} />
        <RangedSlider min={0} max={20} default={10} step={1} title="Repeats"
          parameterName="text-repeats" callbackObject={this.callbackObj} />
      </div>
    )
  }
}
