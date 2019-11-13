import { RangedSlider } from "./core/RangedSlider"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"
import * as React from "react"
import { CurveEditor } from "./core/CurveEditor"
import { IStateLoadable } from "./IStateLoadable"

const ceWidth = 300
const ceHeight = 25

interface GroupProps {
  name: string,
  title: string,
  obj: IValueUpdatable
}

abstract class DistortParameterGroup extends React.Component<GroupProps, {}> implements IStateLoadable {
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
  get weightParamName() { return `${this.name}-weight`; }
  get curveWeightParam() { return `${this.name}-curve-weight`; }


  refreshState() {
    this.weightSlider.setState({ value: this.obj.getValue(this.weightParamName) })
    this.weightCurve.updateState(null)
  }

  weightSlider: RangedSlider
  weightCurve: CurveEditor

  getElem(): JSX.Element[] {
    return [
      <RangedSlider ref={node => (this.weightSlider = node)}
        key={this.weightParamName}
        title="Weight"
        min={this.getWeightMin()} max={this.getWeightMax()}
        default={this.obj.getValue(this.weightParamName)}
        step={0.004}
        parameterName={this.weightParamName}
        callbackObject={this.obj} />,
      <CurveEditor ref={node => (this.weightCurve = node)}
        key={this.curveWeightParam}
        curve={this.obj.getValue(this.curveWeightParam)}
        width={ceWidth} height={ceHeight}
        param={this.curveWeightParam}
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
  get ampParamName() { return `${this.name}-amp` }
  get freqParamName() { return `${this.name}-frequency` }
  get freqCurveParamName() { return `${this.name}-frequency-curve` }

  amp: RangedSlider
  freq: RangedSlider
  freqCurve: CurveEditor

  refreshState() {
    super.refreshState()
    this.amp.setState({ value: this.obj.getValue(this.ampParamName) })
    this.freq.setState({ value: this.obj.getValue(this.freqCurveParamName) })
    this.freqCurve.updateState(null)
  }

  getElem(): JSX.Element[] {
    let elems = super.getElem()
    elems.push(
      <RangedSlider ref={node => (this.amp = node)}
        key={this.ampParamName}
        title="Amplitude"
        min={0} max={.1}
        default={this.obj.getValue(this.ampParamName)}
        step={0.004}
        parameterName={this.ampParamName}
        callbackObject={this.obj} />,
      <RangedSlider ref={node => (this.freq = node)}
        key={this.freqParamName}
        title="Frequency"
        min={0} max={.4}
        default={this.obj.getValue(this.freqParamName)}
        step={0.004}
        parameterName={this.freqParamName}
        callbackObject={this.obj} />,
      <CurveEditor ref={node => (this.freqCurve = node)}
        key={this.freqCurveParamName}
        curve={this.obj.getValue(this.freqCurveParamName)}
        width={ceWidth} height={ceHeight}
        param={this.freqCurveParamName}
        callbackObject={this.obj} />
    )
    return elems
  }
}

class DirectionalDistort extends DistortParameterGroup {
  getWeightMin() { return -1 }
}

class NoiseDistort extends DistortParameterGroup {
  get complexityName() { return `${this.name}-compl` }
  get freqParamName() { return `${this.name}-freq` }
  get ampNameX() { return `${this.name}-ampx` }
  get ampNameY() { return `${this.name}-ampy` }
  get offset() { return `${this.name}-offset` }

  refreshState() {
    super.refreshState()
    this.ampX.setState({value: this.obj.getValue(this.ampNameX)})
    this.ampY.setState({value: this.obj.getValue(this.ampNameY)})
    this.complexity.setState({value: this.obj.getValue(this.complexityName)})
    this.frequency.setState({value: this.obj.getValue(this.freqParamName)})
    this.offsetSlider.setState({value: this.obj.getValue(this.offset)})
  }

  ampX: RangedSlider
  ampY: RangedSlider
  complexity: RangedSlider
  frequency: RangedSlider
  offsetSlider: RangedSlider

  getElem(): JSX.Element[] {
    let elems = super.getElem()
    elems.push(
      <RangedSlider ref={node => (this.ampX = node)}
        key={this.ampNameX}
        title="Amp X"
        min={0} max={.4}
        default={this.obj.getValue(this.ampNameX)}
        step={0.004}
        parameterName={this.ampNameX}
        callbackObject={this.obj} />,
      <RangedSlider ref={node => (this.ampY = node)}
        key={this.ampNameY}
        title="Amp Y"
        min={0} max={2.0}
        default={this.obj.getValue(this.ampNameY)}
        step={0.004}
        parameterName={this.ampNameY}
        callbackObject={this.obj} />,
      <RangedSlider ref={node => (this.complexity = node)}
        key={this.complexityName}
        title="Complexity"
        min={0} max={1}
        default={this.obj.getValue(this.complexityName)}
        step={0.004}
        parameterName={this.complexityName}
        callbackObject={this.obj} />,
      <RangedSlider ref={node => (this.frequency = node)}
        key={this.freqParamName}
        title="Frequency"
        min={0} max={.4}
        default={this.obj.getValue(this.freqParamName)}
        step={0.004}
        parameterName={this.freqParamName}
        callbackObject={this.obj} />,
      <RangedSlider ref={node => (this.offsetSlider = node)}
        key={this.offset}
        title="Offset"
        min={-3.0} max={3.0}
        default={this.obj.getValue(this.offset)}
        step={0.04}
        parameterName={this.offset}
        callbackObject={this.obj} />
    )
    return elems
  }
}

interface EffectParametersProps {
  obj: IValueUpdatable
}

export class EffectParameters extends React.Component<EffectParametersProps, {}>
  implements IStateLoadable {

  globalAmount: RangedSlider
  amountX: RangedSlider
  amountY: RangedSlider

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

  refreshState() {
    this.globalAmount.setState({ value: this.obj.getValue('g_amount') })
    this.amountX.setState({ value: this.obj.getValue('g_amountX') })
    this.amountY.setState({ value: this.obj.getValue('g_amountY') })

    this.sineHorizontal.refreshState()
    this.sineVertical.refreshState()
    this.dirHorizontal.refreshState()
    this.dirVertical.refreshState()
    this.noise.refreshState()
  }

  render() {
    return (
      <div className="distort-parameters">
        <RangedSlider ref={node => (this.globalAmount = node)}
          title="Global amount"
          min={0} max={1.0}
          default={this.obj.getValue('g_amount')}
          step={0.004}
          parameterName={'g_amount'}
          callbackObject={this.obj} />
        <RangedSlider ref={node => (this.amountX = node)}
          title="Amount X"
          min={0.8} max={1.0}
          default={this.obj.getValue('g_amountX')}
          step={0.001}
          parameterName={'g_amountX'}
          callbackObject={this.obj} />
        <RangedSlider ref={node => (this.amountY = node)}
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
