import { Parameters } from "../../Parameters"
import { CurveBufferTexture } from "./CurveBuffer"

export class UniformParameters {
  params: Parameters
  gl: WebGLRenderingContext
  curveBuffer: CurveBufferTexture

  init(gl: WebGLRenderingContext) {
    this.gl = gl
    this.curveBuffer = new CurveBufferTexture(this.gl)
  }

  setParams(program: WebGLProgram) {
    let gl = this.gl
    const params = this.params
    const uniform1f = (name: string, val: number) =>
      gl.uniform1f(gl.getUniformLocation(program, name), val)

      gl.uniform3f(gl.getUniformLocation(program, "g_amount"),
        params.g_amountX, params.g_amountY, params.g_amount)
    
    uniform1f("sh_weight", params.sh_weight)
    uniform1f("sh_amp", params.sh_amp)
    uniform1f("sh_freq", params.sh_freq)
    uniform1f("sh_weightCurveSlot", params.sh_weightCurveSlot)
    uniform1f("sh_freqCurveSlot", params.sh_freqCurveSlot)

    uniform1f("sv_weight", params.sv_weight)
    uniform1f("sv_amp", params.sv_amp)
    uniform1f("sv_freq", params.sv_freq)

    uniform1f("sv_weightCurveSlot", params.sv_weightCurveSlot)
    uniform1f("sv_freqCurveSlot", params.sv_freqCurveSlot)

    uniform1f("dh_weight", params.dh_weight)
    uniform1f("dh_weightCurveSlot", params.dh_weightCurveSlot)

    uniform1f("dv_weight", params.dv_weight)
    uniform1f("dv_weightCurveSlot", params.dv_weightCurveSlot)

    uniform1f("n_weight", params.n_weight)
    uniform1f("n_weightCurveSlot", params.n_weightCurveSlot)
    uniform1f("n_complexity", params.n_complexity)
    uniform1f("n_freq", params.n_freq)
    gl.uniform2f(gl.getUniformLocation(program, "n_amp"),
      params.n_ampx, params.n_ampy)
    uniform1f("n_offset", params.n_offset)

    gl.uniform2f(gl.getUniformLocation(program, "curveRes"),
      CurveBufferTexture.resolution, CurveBufferTexture.slots)

  }
}
