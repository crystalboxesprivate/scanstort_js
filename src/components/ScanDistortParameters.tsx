import { RangedSlider } from "./RangedSlider"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"
import * as React from "react"
import { CurveEditor } from "./CurveEditor"
import { Curve } from "../Curve"

const ceWidth = 300
const ceHeight = 25

interface GroupProps {
  name: string,
  title: string,
  obj: IValueUpdatable
}

abstract class DistortParameterGroup extends React.Component<GroupProps, {}> {
  name: string
  title: string
  obj: IValueUpdatable

  constructor(props: GroupProps) {
    super(props)
    this.name = props.name
    this.title = props.title
    this.obj = props.obj
  }
  getWeightMin() { return 0 }
  getWeightMax() { return 1 }
  getElem(): JSX.Element[] {
    let weightParamName = `${this.name}-weight`
    let curveWeightParam = `${this.name}-curve-weight`
    return [
      <RangedSlider key={weightParamName}
        title="Weight"
        min={this.getWeightMin()} max={this.getWeightMax()}
        default={this.obj.getValue(weightParamName)}
        step={0.004}
        parameterName={weightParamName}
        callbackObject={this.obj} />,
      <CurveEditor key={curveWeightParam}
        curve={new Curve()}
        width={ceWidth} height={ceHeight}
        param={curveWeightParam}
        callbackObject={this.obj} />
    ]
  }

  render() {
    return (
      <div className="parameter-group">
        <h3 className="title">{this.title}</h3>
        {this.getElem()}
      </div>
    )
  }
}

class SineDistort extends DistortParameterGroup {
  getElem(): JSX.Element[] {
    let ampParamName = `${this.name}-amp`
    let freqParamName = `${this.name}-frequency`
    let elems = super.getElem()
    elems.push(
      <RangedSlider
        key={ampParamName}
        title="Amplitude"
        min={0} max={.1}
        default={this.obj.getValue(ampParamName)}
        step={0.004}
        parameterName={ampParamName}
        callbackObject={this.obj} />,
      <RangedSlider
        key={freqParamName}
        title="Frequency"
        min={0} max={.4}
        default={this.obj.getValue(freqParamName)}
        step={0.004}
        parameterName={freqParamName}
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
  getWeightMin() { return -1 }
}

class NoiseDistort extends DistortParameterGroup {
  getElem(): JSX.Element[] {
    let complexityName = `${this.name}-compl`
    let freqParamName = `${this.name}-freq`
    let ampNameX = `${this.name}-ampx`
    let ampNameY = `${this.name}-ampy`
    let elems = super.getElem()
    elems.push(
      <RangedSlider
        key={complexityName}
        title="Complexity"
        min={0} max={1}
        default={this.obj.getValue(complexityName)}
        step={0.004}
        parameterName={complexityName}
        callbackObject={this.obj} />,
      <RangedSlider
        key={freqParamName}
        title="Frequency"
        min={0} max={.4}
        default={this.obj.getValue(freqParamName)}
        step={0.004}
        parameterName={freqParamName}
        callbackObject={this.obj} />,
      <RangedSlider
        key={ampNameX}
        title="Amp X"
        min={0} max={.4}
        default={this.obj.getValue(ampNameX)}
        step={0.004}
        parameterName={ampNameX}
        callbackObject={this.obj} />,
      <RangedSlider
        key={ampNameY}
        title="Amp Y"
        min={0} max={2.0}
        default={this.obj.getValue(ampNameY)}
        step={0.004}
        parameterName={ampNameY}
        callbackObject={this.obj} />
    )
    return elems
  }
}

interface ScanDistortParametersProps {
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
  }

  render() {
    return (
      <div className="distort-parameters">
        <SineDistort ref={node => (this.sineHorizontal = node)} name="sineHorizontal" title="Sine Horizontal" obj={this.obj} />
        <SineDistort ref={node => (this.sineVertical = node)} name="sineVertical" title="Sine Vertical" obj={this.obj} />
        <DirectionalDistort ref={node => (this.dirHorizontal = node)} name="dirHorizontal" title="Direction Horizontal" obj={this.obj} />
        <DirectionalDistort ref={node => (this.dirVertical = node)} name="dirVertical" title="Direction Vertical" obj={this.obj} />
        <NoiseDistort ref={node => (this.noise = node)} name="noise" title="Noise" obj={this.obj} />
      </div>
    )
  }
}
