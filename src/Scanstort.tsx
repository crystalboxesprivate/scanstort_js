import * as React from "react"
import { Curve } from "./Curve"
import { NumberField } from "./NumberField"
import { StringField } from "./StringField"
import { Shader } from "./graphics/Shader"
import { CanvasContext } from "./graphics/CanvasContext"
import { Texture } from "./graphics/Texture"
import { GraphicsContext } from "./graphics/GraphicsContext"
import { RenderTexture } from "./graphics/RenderTexture"


interface DistortParametersProps {
  title: string,
  defaultWeight: number
}

export class DistortParameters extends React.Component {
  weight: NumberField
  weightCurve: Curve
  

  props: DistortParametersProps

  static defaultProps: DistortParametersProps = {
    title: "Distort Parameters",
    defaultWeight: 1.0
  }

  constructor(props: DistortParametersProps) {
    super(props)
    this.props = props
  }

  getWeightMin() {return 0.0}
  getWeightMax() {return 1.0}

  elem(): JSX.Element[] {
    return [
      <NumberField key="weight" ref={n => this.weight = n} title="Weight" step={0.001} min={this.getWeightMin()} max={this.getWeightMax()} default={this.props.defaultWeight} />,
      <Curve key="weightCurve" ref={n => this.weightCurve = n} />
    ]
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {this.elem()}
      </div>
    )
  }
}

export class DirectionalDistort extends DistortParameters {
  getWeightMin() {return -1.0}
}

export class SineDistort extends DistortParameters {
  amplitude: NumberField
  frequency: NumberField
  frequencyCurve: Curve

  elem(): JSX.Element[] {
    let e = super.elem()
    e.push(<NumberField key="amplitude" ref={n => this.amplitude = n} title="Amplitude" min={0.0} max={.1} default={.036} step={0.0001} />)
    e.push(<NumberField key="frequency" ref={n => this.frequency = n} title="Frequency" min={0.0} max={.1} default={.036} step={0.0001} />)
    e.push(<Curve key="frequencyCurve" ref={n => this.frequencyCurve = n} />)
    return e
  }
}

export class NoiseDistort extends DistortParameters {
  ampX: NumberField
  ampY: NumberField
  complexity: NumberField
  frequency: NumberField
  offset: NumberField

  elem(): JSX.Element[] {
    let e = super.elem()
    e.push(<NumberField key="ampX" title="Amplitude X" min={0.0} max={.4} default={.036} step={0.001} ref={n => this.ampX = n} />)
    e.push(<NumberField key="ampY" title="Amplitude Y" min={0.0} max={2.0} default={.1} step={0.0001} ref={n => this.ampY = n} />)
    e.push(<NumberField key="complexity" title="Complexity" min={0.0} max={1.0} default={.5} step={0.001} ref={n => this.complexity = n} />)
    e.push(<NumberField key="frequency" title="Frequency" min={0.0} max={.4} default={1.036} step={0.001} ref={n => this.frequency = n} />)
    e.push(<NumberField key="offset" title="Offset" min={-3.0} max={3.0} default={.0} step={0.001} ref={n => this.offset = n} />)
    return e
  }
}

const CurveBufferCount = 8;
const CurveBufferLenght = 128;

const sh_weightCurveSlot = 0;
const sv_weightCurveSlot = 1;
const sh_freqCurveSlot = 2;
const sv_freqCurveSlot = 3;
const dh_weightCurveSlot = 4;
const dv_weightCurveSlot = 5;
const n_weightCurveSlot = 6;

export class Scanstort {
  material: Shader
  materialPresent: Shader
  scale: NumberField
  text: StringField
  textSize: NumberField
  repeats: NumberField

  globalAmount: NumberField
  amountX: NumberField
  amountY: NumberField

  sineVertical: SineDistort
  sineHorizontal: SineDistort
  dirVertical: DistortParameters
  dirHorizontal: DistortParameters
  noise: NoiseDistort

  cairo: CanvasContext;
  graphicsContext: GraphicsContext

  needsRefresh: boolean = false;
  targetTexture: Texture;
  renderTexture: RenderTexture;

  // create structured buffers of curves
  curves: Texture;
  curveArray: Uint8Array

  needsBlit: boolean

  width: number = 640
  height: number = 480

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  run() {
    this.start()
    let that = this
    let loop = () => {
      that.update()
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  updateUniforms() {
    let _material = this.material
    _material.setFloat("_scale", this.scale.get());
    _material.setFloat("sh_weight", this.sineHorizontal.weight.get());
    _material.setFloat("sh_amp", this.sineHorizontal.amplitude.get());
    _material.setFloat("sh_freq", this.sineHorizontal.frequency.get());

    _material.setFloat("sv_weight", this.sineVertical.weight.get());
    _material.setFloat("sv_amp", this.sineVertical.amplitude.get());
    _material.setFloat("sv_freq", this.sineVertical.frequency.get());

    _material.setFloat("dh_weight", this.dirHorizontal.weight.get());
    _material.setFloat("dv_weight", this.dirVertical.weight.get());

    _material.setFloat("n_weight", this.noise.weight.get());
    _material.setFloat("n_complexity", this.noise.complexity.get());
    _material.setFloat("n_freq", this.noise.frequency.get());
    _material.setVector("n_amp", [this.noise.ampX.get(), this.noise.ampY.get()]);
    _material.setFloat("n_offset", this.noise.offset.get());

    _material.setVector("_resolution", [this.width, this.height]);
    _material.setVector("g_amount", [this.amountX.get(), this.amountY.get(), this.globalAmount.get()]);

    _material.setInt("sh_weightCurveSlot", sh_weightCurveSlot);
    _material.setInt("sh_freqCurveSlot", sh_freqCurveSlot);

    _material.setInt("sv_weightCurveSlot", sv_weightCurveSlot);
    _material.setInt("sv_freqCurveSlot", sv_freqCurveSlot);

    _material.setInt("dh_weightCurveSlot", dh_weightCurveSlot);
    _material.setInt("dv_weightCurveSlot", dv_weightCurveSlot);

    _material.setInt("n_weightCurveSlot", n_weightCurveSlot);

    _material.setTexture("curves", this.curves);

    if (this.sineHorizontal.weightCurve.isChanged() ||
      this.sineVertical.weightCurve.isChanged() ||
      this.sineHorizontal.frequencyCurve.isChanged() ||
      this.sineVertical.frequencyCurve.isChanged() ||
      this.dirHorizontal.weightCurve.isChanged() ||
      this.dirVertical.weightCurve.isChanged() ||
      this.noise.weightCurve.isChanged()) {
      this.setCurveData();
    }
  }

  setCurveData() {
    if (this.curves == null)
      return;

    if (!this.curveArray) {
      this.curveArray = new Uint8Array(CurveBufferLenght * CurveBufferCount)
      this.curveArray.fill(127)
    }

    let toByte = function(f:number):number {
      let byteVal = Math.floor(f * 255)
      return byteVal > 255
        ? 255
        : byteVal < 0
          ? 0
          : byteVal
    }

    for (var x = 0; x < CurveBufferLenght; x++) {
      const l = CurveBufferLenght
      let u = x / CurveBufferLenght
      this.curveArray[sh_weightCurveSlot * l + x] = toByte(this.sineHorizontal.weightCurve.evaluate(u))
      this.curveArray[sv_weightCurveSlot * l + x] = toByte(this.sineVertical.weightCurve.evaluate(u))
      this.curveArray[sh_freqCurveSlot * l + x] = toByte(this.sineHorizontal.frequencyCurve.evaluate(u))
      this.curveArray[sv_freqCurveSlot * l + x] = toByte(this.sineVertical.frequencyCurve.evaluate(u))
      this.curveArray[dh_weightCurveSlot * l + x] = toByte(this.dirHorizontal.weightCurve.evaluate(u))
      this.curveArray[dv_weightCurveSlot * l + x] = toByte(this.dirVertical.weightCurve.evaluate(u))
      this.curveArray[n_weightCurveSlot * l + x] = toByte(this.noise.weightCurve.evaluate(u))
    }
    this.curves.setData(this.curveArray);
  }


  onRenderImage() {
    this.graphicsContext.present(this.renderTexture, this.materialPresent)
    this.materialPresent.unbind()
  }

  update() {
    this.recache();

    if (this.needsBlit) {
      this.updateUniforms()
      this.graphicsContext.blit(this.targetTexture, this.renderTexture, this.material)
      this.material.unbind()
      this.needsBlit = false
    }

    this.onRenderImage()
  }

  onValidate() {
    if (this.needsRefresh ||
      this.scale.isChanged() ||
      this.sineHorizontal.weight.isChanged() ||
      this.sineHorizontal.amplitude.isChanged() ||
      this.sineHorizontal.frequency.isChanged() ||

      this.sineVertical.weight.isChanged() ||
      this.sineVertical.amplitude.isChanged() ||
      this.sineVertical.frequency.isChanged() ||

      this.dirHorizontal.weight.isChanged() ||
      this.dirVertical.weight.isChanged() ||

      this.noise.weight.isChanged() ||
      this.noise.complexity.isChanged() ||
      this.noise.frequency.isChanged() ||
      this.noise.ampX.isChanged() ||
      this.noise.ampY.isChanged() ||
      this.noise.offset.isChanged() ||

      this.amountX.isChanged() ||
      this.amountY.isChanged() ||
      this.globalAmount.isChanged()) {
      this.needsBlit = true
    }
  }


  recache() {
    this.checkTextInput();
    this.onValidate();
    this.needsRefresh = false;
  }


  checkTextInput() {
    if (this.text.isChanged() || this.textSize.isChanged() || this.repeats.isChanged() || this.needsRefresh || this.scale.isChanged()) {
      this.needsRefresh = true;
      this.updateCairo();
    }
  }

  start() {
    this.curves = this.graphicsContext.newTexture(CurveBufferLenght, CurveBufferCount, true);
    this.targetTexture = this.graphicsContext.newTexture(this.width, this.height);
    this.renderTexture = this.graphicsContext.newRenderTexture(this.width, this.height);
  
    this.material = this.graphicsContext.newShader("vert", "frag")
    this.materialPresent = this.graphicsContext.newShader("vert", "fragPresent")
  }

  aspect(pixel: number): number {
    return this.scale.get() * pixel;
  }

  updateCairo() {
    let ctx = this.cairo.ctx
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, this.aspect(this.width), this.aspect(this.height))
    ctx.fillStyle = "black"

    ctx.font = `${this.aspect(this.textSize.get())}px Arial`
    for (let x = 0; x < this.repeats.get(); x++) {
      ctx.fillText(this.text.get(), this.aspect(100), this.aspect(x * 80))
    }
    this.targetTexture.setData(this.cairo.getPixels(0, 0, this.width, this.height))
  }

  getRenderOut(): JSX.Element {
    return (
      <div>
        <CanvasContext ref={n => this.cairo = n} width={this.width} height={this.height} />
        <GraphicsContext ref={n => this.graphicsContext = n} width={this.width} height={this.height} />
      </div>
    );
  }

  getParameters(): JSX.Element {
    return (
      <div>
        <NumberField ref={n => this.scale = n} min={0.01} max={9.0} step={0.001} title="Scale" default={0.5} />
        <StringField ref={n => this.text = n} default="distort" title="Text" />
        <NumberField ref={n => this.textSize = n} min={1} max={200} step={1} default={78} title={"Font Size"} />
        <NumberField ref={n => this.repeats = n} min={0} max={20} step={1} default={10} title="Repeats" />

        <NumberField ref={n => this.globalAmount = n} min={0} max={1} step={0.001} title="Global Amount" default={1} />
        <NumberField ref={n => this.amountX = n} min={0} max={1} step={0.001} title="Amount X" default={1} />
        <NumberField ref={n => this.amountY = n} min={0} max={1} step={0.001} title="Amount X" default={.999} />

        <SineDistort ref={n => this.sineVertical = n} title="Sine Vertical" />
        <SineDistort ref={n => this.sineHorizontal = n} title="Sine Horizontal" />
        <DirectionalDistort ref={n => this.dirVertical = n} title="Directional Vertical" />
        <DirectionalDistort ref={n => this.dirHorizontal = n} title="Directional Horizontal" />
        <NoiseDistort ref={n => this.noise = n} title="Noise Distort" />
      </div>
    );
  }
}
