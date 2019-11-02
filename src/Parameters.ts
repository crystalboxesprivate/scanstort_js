import { Curve } from "./Curve"

export class Parameters {
  width: number = 640
  height: number = 480
  
  // Input text
  text: string = "distort"
  font: string = "Impact"
  size: number = 78
  repeats: number = 10

  g_amount:number = 1.0
  g_amountX:number = 1.0
  g_amountY:number = 0.999

  // curves
  sh_weightCurve = new Curve()
  sh_frequencyCurve = new Curve()
  sv_weightCurve = new Curve()
  sv_frequencyCurve = new Curve()
  dh_weightCurve = new Curve()
  dv_weightCurve = new Curve()
  n_weightCurve = new Curve()

  // Shader related parameters
  sh_weight: number = 0
  sh_amp: number = 0.004
  sh_freq: number = 0.05

  sh_weightCurveSlot: number = 0
  sh_freqCurveSlot: number = 0

  sv_weight: number = 1
  sv_amp: number = 0.036
  sv_freq: number = .036

  sv_weightCurveSlot: number = 0
  sv_freqCurveSlot: number = 0

  dh_weight: number = 0
  dh_weightCurveSlot: number = 0

  dv_weight: number = .552
  dv_weightCurveSlot: number = 0

  n_weight: number = 1
  n_weightCurveSlot: number = 0
  n_complexity: number = 0.5
  n_freq: number = 1.0
  n_ampx: number = .03
  n_ampy: number = .1
  n_offset: number = 0.0
}
