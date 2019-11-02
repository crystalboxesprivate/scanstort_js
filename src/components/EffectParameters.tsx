import { RangedSlider } from "./core/RangedSlider"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"
import * as React from "react"
import { CurveEditor } from "./core/CurveEditor"

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
        curve={this.obj.getValue(curveWeightParam)}
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
    let freqCurveParamName = `${this.name}-frequency-curve`
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
      <CurveEditor key={freqCurveParamName}
        curve={this.obj.getValue(freqCurveParamName)}
        width={ceWidth} height={ceHeight}
        param={freqCurveParamName}
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
    let offset = `${this.name}-offset`
    let elems = super.getElem()
    elems.push(
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
        callbackObject={this.obj} />,
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
        key={offset}
        title="Offset"
        min={-3.0} max={3.0}
        default={this.obj.getValue(offset)}
        step={0.04}
        parameterName={offset}
        callbackObject={this.obj} />
    )
    return elems
  }
}

interface EffectParametersProps {
  obj: IValueUpdatable
}

export class EffectParameters extends React.Component<EffectParametersProps, {}> {
  sineHorizontal: SineDistort
  sineVertical: SineDistort
  dirHorizontal: DirectionalDistort
  dirVertical: DirectionalDistort
  noise: NoiseDistort

  obj: IValueUpdatable

  constructor(props: EffectParametersProps) {
    super(props)
    this.obj = props.obj
  }

  render() {
    return (
      <div className="distort-parameters">
        <RangedSlider
          title="Global amount"
          min={0} max={1.0}
          default={this.obj.getValue('g_amount')}
          step={0.004}
          parameterName={'g_amount'}
          callbackObject={this.obj} />
        <RangedSlider
          title="Amount X"
          min={0.8} max={1.0}
          default={this.obj.getValue('g_amountX')}
          step={0.001}
          parameterName={'g_amountX'}
          callbackObject={this.obj} />
        <RangedSlider
          title="Amount Y"
          min={0.8} max={1.0}
          default={this.obj.getValue('g_amountY')}
          step={0.001}
          parameterName={'g_amountY'}
          callbackObject={this.obj} />

        <SineDistort ref={node => (this.sineVertical = node)}
          name="sineVertical" title="Sine Vertical" obj={this.obj} />
        <SineDistort ref={node => (this.sineHorizontal = node)}
          name="sineHorizontal" title="Sine Horizontal" obj={this.obj} />
        <DirectionalDistort ref={node => (this.dirVertical = node)}
          name="dirVertical" title="Direction Vertical" obj={this.obj} />
        <DirectionalDistort ref={node => (this.dirHorizontal = node)}
          name="dirHorizontal" title="Direction Horizontal" obj={this.obj} />
        <NoiseDistort ref={node => (this.noise = node)}
          name="noise" title="Noise" obj={this.obj} />
      </div>
    )
  }
}
