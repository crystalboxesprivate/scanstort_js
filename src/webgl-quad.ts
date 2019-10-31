export class WebGLQuad {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext | null = null
  program: WebGLProgram | null = null

  vertexBuffer: WebGLBuffer | null = null
  vertexPositionAttribute: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl')
    if (!this.gl) {
      console.log('WebGL is not supported on your browser')
    }

    if (this.gl) {
      this.initShaders()
      this.initVertexBuffer([
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
      ])
      this.draw()
    }
  }

  initVertexBuffer(v: number[]) {
    let gl = <WebGLRenderingContext>this.gl
    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW)
  }

  draw() {
    let gl = <WebGLRenderingContext>this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const bufferSize = 6
    gl.uniform2f(gl.getUniformLocation(<WebGLProgram>this.program, 'resolution'),
      gl.canvas.width, gl.canvas.height)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, bufferSize)
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

  initShaders() {
    let gl = <WebGLRenderingContext>this.gl
    let vert = <WebGLShader>this.compileShader(
      (<HTMLElement>document.getElementById('drawImage-vertex-shader')).innerText, gl.VERTEX_SHADER)
    let frag = <WebGLShader>this.compileShader(
      (<HTMLElement>document.getElementById('drawImage-fragment-shader')).innerText, gl.FRAGMENT_SHADER)

    this.program = <WebGLProgram>gl.createProgram();
    gl.attachShader(this.program, vert)
    gl.attachShader(this.program, frag)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.log('Shader program is not linked: ' + gl.getProgramInfoLog(this.program))
      return
    }
    gl.useProgram(this.program)

    this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'pos')
    gl.enableVertexAttribArray(this.vertexPositionAttribute)
  }
}
