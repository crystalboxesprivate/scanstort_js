import { RangedSlider } from "./RangedSlider"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"
import * as React from "react"
import { CurveEditor } from "./CurveEditor"
import { Curve } from "../Curve"

const ceWidth = 300
const ceHeight = 25

abstract class DistortParameterGroup {
  name: string
  obj: IValueUpdatable

  constructor(name: string, obj: IValueUpdatable) {
    this.name = name
    this.obj = obj
  }
  getElem(): JSX.Element[] {
    return [
      <RangedSlider key={this.name + "-weight"}
        title="Weight"
        min={0} max={1} default={0} step={0.04}
        parameterName={this.name + "-weight"}
        callbackObject={this.obj} />,
      <CurveEditor key={this.name + "-curve-weight"}
        curve={new Curve()}
        width={ceWidth} height={ceHeight}
        param={this.name + "-curve-weight"}
        callbackObject={this.obj} />
    ]
  }
}

class SineDistort extends DistortParameterGroup {
  getElem(): JSX.Element[] {
    let elems = super.getElem()
    elems.push(
      <RangedSlider
        key={this.name + "-amp"}
        title="Amplitude"
        min={0} max={1} default={1} step={0.04}
        parameterName={this.name + "-amp"}
        callbackObject={this.obj} />,
      <RangedSlider
        key={this.name + "-frequency"}
        title="Frequency"
        min={0} max={.6} default={0.05} step={0.004}
        parameterName={this.name + "-frequency"}
        callbackObject={this.obj} />,
      <CurveEditor key={this.name + "-frequency-curve"}
        curve={new Curve()}
        width={ceWidth} height={ceHeight}
        param={this.name + "-frequency-curve"}
        callbackObject={this.obj} />
    )
    return elems
  }
}

class DirectionalDistort extends DistortParameterGroup {
}

class NoiseDistort extends DistortParameterGroup {
}
export interface ScanDistortParametersProps {
  obj: IValueUpdatable
}
export class ScanDistortParameters extends React.Component<ScanDistortParametersProps, {}> {
  sineHorizontal: SineDistort
  sineVertical: SineDistort
  dirHorizontal: DirectionalDistort
  dirVertical: DirectionalDistort
  noise: NoiseDistort

  obj: IValueUpdatable

  constructor(props: ScanDistortParametersProps) {
    super(props)
    this.obj = props.obj

    this.sineHorizontal = new SineDistort("sineHorizontal", this.obj)
    this.sineVertical = new SineDistort("sineVertical", this.obj)
    this.dirHorizontal = new DirectionalDistort("dirHorizontal", this.obj)
    this.dirVertical = new DirectionalDistort("dirVertical", this.obj)
    this.noise = new NoiseDistort("noise", this.obj)
  }

  render() {
    return (
      <div className="distort-parameters">
        <div>
          <h3>Sine Horizontal</h3>
          {this.sineHorizontal.getElem()}
        </div>
        <div>
          <h3>Sine Vertical</h3>
          {this.sineVertical.getElem()}
        </div>
        <div>
          <h3>Direction Horizontal</h3>
          {this.dirHorizontal.getElem()}
        </div>
        <div>
          <h3>Direction Vertical</h3>
          {this.dirVertical.getElem()}
        </div>
        <div>
          <h3>Noise</h3>
          {this.noise.getElem()}
        </div>
      </div>
    )
  }
}
