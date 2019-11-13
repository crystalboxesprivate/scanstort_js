import * as React from "react"
import { Curve } from "./Curve"
import { NumberField } from "./NumberField"
import { StringField } from "./StringField"
import { Shader } from "./graphics/Shader"
import { CanvasContext } from "./graphics/CanvasContext"
import { Texture } from "./graphics/Texture"
import { GraphicsContext } from "./graphics/GraphicsContext"

export class DistortParameters extends React.Component {
  weight: NumberField
  weightCurve: Curve
}

export class SineDistort extends DistortParameters {
  Amplitude: NumberField
  Frequency: NumberField
  FrequencyCurve: Curve
}

export class NoiseDistort extends DistortParameters {
  ampX: NumberField
  ampY: NumberField
  complexity: NumberField
  frequency: NumberField
  offset: NumberField
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

export class Scanstort extends React.Component {
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
  renderTexture: Texture;

  // create structured buffers of curves
  curves: Texture;
  curveArray: Uint8Array

  needsBlit: boolean

  width: 640
  height: 480

  updateUniforms() {
    let _material = this.material
    _material.setFloat("_scale", this.scale.get());
    _material.setFloat("sh_weight", this.sineHorizontal.weight.get());
    _material.setFloat("sh_amp", this.sineHorizontal.Amplitude.get());
    _material.setFloat("sh_freq", this.sineHorizontal.Frequency.get());

    _material.setFloat("sv_weight", this.sineVertical.weight.get());
    _material.setFloat("sv_amp", this.sineVertical.Amplitude.get());
    _material.setFloat("sv_freq", this.sineVertical.Frequency.get());

    _material.setFloat("dh_weight", this.dirHorizontal.weight.get());
    _material.setFloat("dv_weight", this.dirVertical.weight.get());

    _material.setFloat("n_weight", this.noise.weight.get());
    _material.setFloat("n_complexity", this.noise.complexity.get());
    _material.setFloat("n_freq", this.noise.frequency.get());
    _material.setVector("n_amp", [this.noise.ampX.get(), this.noise.ampY.get(), 0, 0]);
    _material.setFloat("n_offset", this.noise.offset.get());

    _material.setVector("_resolution", [this.width, this.height, 0, 0]);
    _material.setVector("g_amount", [this.amountX.get(), this.amountY.get(), this.globalAmount.get(), 0]);

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
      this.sineHorizontal.FrequencyCurve.isChanged() ||
      this.sineVertical.FrequencyCurve.isChanged() ||
      this.dirHorizontal.weightCurve.isChanged() ||
      this.dirVertical.weightCurve.isChanged() ||
      this.noise.weightCurve.isChanged()) {
      this.setCurveData();
    }
  }

  setCurveData() {
    if (this.curves == null)
      return;

    for (var x = 0; x < CurveBufferLenght; x++) {
      const l = CurveBufferLenght;
      let u = x / CurveBufferLenght;
      this.curveArray[sh_weightCurveSlot * l + x] = this.sineHorizontal.weightCurve.evaluate(u);
      this.curveArray[sv_weightCurveSlot * l + x] = this.sineVertical.weightCurve.evaluate(u);
      this.curveArray[sh_freqCurveSlot * l + x] = this.sineHorizontal.FrequencyCurve.evaluate(u);
      this.curveArray[sv_freqCurveSlot * l + x] = this.sineVertical.FrequencyCurve.evaluate(u);
      this.curveArray[dh_weightCurveSlot * l + x] = this.dirHorizontal.weightCurve.evaluate(u);
      this.curveArray[dv_weightCurveSlot * l + x] = this.dirVertical.weightCurve.evaluate(u);
      this.curveArray[n_weightCurveSlot * l + x] = this.noise.weightCurve.evaluate(u);
    }
    this.curves.setData(this.curveArray);
  }


  onRenderImage() {
    this.graphicsContext.present(this.renderTexture, this.materialPresent);
  }

  update() {
    this.recache();

    if (this.needsBlit) {
      this.updateUniforms();
      this.graphicsContext.blit(this.targetTexture, this.renderTexture, this.material);
      this.needsBlit = false;
    }

    this.onRenderImage()
  }

  onValidate() {
    if (
      this.scale.isChanged() ||
      this.sineHorizontal.weight.isChanged() ||
      this.sineHorizontal.Amplitude.isChanged() ||
      this.sineHorizontal.Frequency.isChanged() ||

      this.sineVertical.weight.isChanged() ||
      this.sineVertical.Amplitude.isChanged() ||
      this.sineVertical.Frequency.isChanged() ||

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
      this.needsBlit = true;
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
    this.curves = this.graphicsContext.newTexture(CurveBufferLenght, CurveBufferCount);
    this.targetTexture = this.graphicsContext.newTexture(this.width, this.height);
    this.renderTexture = this.graphicsContext.newTexture(this.width, this.height);
    // allocate new cairo surface to render
  }

  aspect(pixel: number): number {
    return this.scale.get() * pixel;
  }

  updateCairo() {
    throw new Error("Not implemented");
    // Cairo.SetSourceRGBA(cairo.Ctx, 1, 1, 1, 1);
    // Cairo.Paint(cairo.Ctx);

    // Cairo.SetSourceRGB(cairo.Ctx, 0, 0, 0);
    // Cairo.SetFontSize(cairo.Ctx, Aspect(textSize));

    // for (int x = 0; x < repeats; x++)
    // {
    //   Cairo.MoveTo(cairo.Ctx, Aspect(100.0f), x * Aspect(80.0f));
    //   Cairo.ShowText(cairo.Ctx, text);
    // }

    // targetTexture.SetPixelData(cairo.BufferArray, 0, 0);
    // targetTexture.Apply();
  }

  getRenderOut(): JSX.Element {
    return (
      <div>
        <CanvasContext ref={n => this.cairo = n} width={this.width} height={this.height} />
        <GraphicsContext ref={n => this.graphicsContext = n} width={this.width} height={this.height} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <NumberField ref={n => this.scale = n} />
        <StringField ref={n => this.text = n} />
        <NumberField ref={n => this.textSize = n} />
        <NumberField ref={n => this.repeats = n} />

        <NumberField ref={n => this.globalAmount = n} />
        <NumberField ref={n => this.amountX = n} />
        <NumberField ref={n => this.amountY = n} />

        <SineDistort ref={n => this.sineVertical = n} />
        <SineDistort ref={n => this.sineHorizontal = n} />
        <DistortParameters ref={n => this.dirVertical = n} />
        <DistortParameters ref={n => this.dirHorizontal = n} />
        <NoiseDistort ref={n => this.noise = n} />
      </div>
    );
  }
}
