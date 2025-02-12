import * as React from "react"

export interface CanvasBaseProps { width: number; height: number }

export class CanvasBase extends React.Component {
  state: {
    width: number,
    height: number
  }
  static defaultProps = {
    width: 640,
    height: 480,
  }

  get htmlId(): string { return "canvas-element" }
  private _canvas: HTMLCanvasElement

  get canvas(): HTMLCanvasElement {
    if (this._canvas == null) {
      let canv = document.getElementById(this.htmlId)
      if (canv == null) {
        return null
      }
      this._canvas = canv as HTMLCanvasElement
      this._canvas.width = this.state.width
      this._canvas.height = this.state.height
    }
    return this._canvas
  }

  constructor(props: { width: number, height: number }) {
    super(props)
    this.state = {width: props.width, height: props.height}
  }

  get displayCss() {
    return { display: 'none' }
  }

  render() {
    return (
      <canvas id={this.htmlId} width={this.state.width} height={this.state.height} style={this.displayCss} />
    )
  }
}
