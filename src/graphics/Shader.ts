export class Shader {
  constructor(gl: WebGLRenderingContext, vertSource: string, fragSource:string) {
    this.gl = gl

    let vert = <WebGLShader>this.compileShader(
      vertSource, gl.VERTEX_SHADER)
    let frag = <WebGLShader>this.compileShader(
      fragSource, gl.FRAGMENT_SHADER)

    this.program = <WebGLProgram>gl.createProgram();
    gl.attachShader(this.program, vert)
    gl.attachShader(this.program, frag)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.log('Shader program is not linked: ' + gl.getProgramInfoLog(this.program))
      return
    }
    gl.useProgram(this.program)
    gl.useProgram(null)
  }

  
  compileShader(src: string, type: number) {
    let gl = <WebGLRenderingContext>this.gl
    let typestring = 'vertex'
    if (type == gl.FRAGMENT_SHADER) {
      typestring = 'fragment'
    }

    let shader = <WebGLShader>gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('Compile error (' + typestring + '): ' + gl.getShaderInfoLog(shader))
      return null
    }
    return shader
  }


  gl: WebGLRenderingContext
  program: WebGLProgram
  isBound: boolean = false

  bind() {
    if (!this.isBound) {
      this.gl.useProgram(this.program)
      this.isBound = true;
    }
  }

  unbind() {
    this.isBound = false;
    this.gl.useProgram(null)
  }

  setTexture(name: string, texture: import("./Texture").Texture) {
    this.bind()
    throw new Error("Method not implemented.");
  }
  setInt(name: string, value: number) {
    this.bind()
    throw new Error("Method not implemented.");
  }
  setVector(name: string, value: number[]) {
    this.bind()
    throw new Error("Method not implemented.");
  }
  setFloat(name: string, value: number) {
    this.bind()
    throw new Error("Method not implemented.");
  }
}