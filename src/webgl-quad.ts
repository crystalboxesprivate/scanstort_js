class ShaderProgram {
  gl: WebGLRenderingContext
  program: WebGLProgram
  constructor (gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
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
}

export class WebGLQuad {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext | null = null

  vertexBuffer: WebGLBuffer | null = null

  tex: WebGLTexture | null = null
  framebufferTex: WebGLTexture | null = null

  shaderFramebuffer: ShaderProgram
  shaderMain: ShaderProgram

  fb: WebGLFramebuffer | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl')
    if (!this.gl) {
      throw('WebGL is not supported on your browser')
    }

    this.shaderFramebuffer = new ShaderProgram(this.gl, 
      (<HTMLElement>document.getElementById('drawImage-vertex-shader')).innerText, 
      (<HTMLElement>document.getElementById('drawImage-fragment-shader')).innerText)

    this.shaderMain = new ShaderProgram(this.gl, 
      (<HTMLElement>document.getElementById('drawImage-vertex-shader')).innerText, 
      (<HTMLElement>document.getElementById('drawImage-fragfbo-shader')).innerText)

      this.initFramebuffer()
      this.initVertexBuffer([
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
      ])
  }

  initFramebuffer() {
    let gl = <WebGLRenderingContext>this.gl
    this.framebufferTex = gl.createTexture()
    let targetTexture = this.framebufferTex
    gl.bindTexture(gl.TEXTURE_2D, targetTexture)
    {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        this.canvas.width, this.canvas.height, 0,
                    gl.RGBA, gl.UNSIGNED_BYTE, null)
    
      // set the filtering so we don't need mips
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    this.fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
    
    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, 0)
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

    // render to our targetTexture by binding the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)

    let program = <WebGLProgram>this.shaderFramebuffer.program
    gl.useProgram(program)
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0)

    gl.uniform2f(gl.getUniformLocation(program, 'resolution'),
      gl.canvas.width, gl.canvas.height)

    let attr = 0
    let that = this
    let drawThis = function() {
      attr = gl.getAttribLocation(program, 'pos')
      gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer)
      gl.enableVertexAttribArray(attr)
      gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, bufferSize)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
    drawThis()

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    program = <WebGLProgram>this.shaderMain.program
    gl.useProgram(program)
    gl.bindTexture(gl.TEXTURE_2D, this.framebufferTex)
    gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0)
    drawThis()

    gl.drawArrays(gl.TRIANGLES, 0, bufferSize)

    gl.useProgram(null)
  }



  uploadImage(data: Uint8ClampedArray, width: number, height: number) {
    let gl = <WebGLRenderingContext>this.gl
    if (!this.tex) {
      this.tex = gl.createTexture()
    } 
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    var array = new Uint8Array(data.buffer)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, array)
  }
}

// draw to framebuffer
// draw to render view
// y rows
// each framebuffer iteration read back
// get pixel row
