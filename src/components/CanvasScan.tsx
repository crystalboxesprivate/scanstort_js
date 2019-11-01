import * as React from "react"

export interface CanvasScanProps { width: string; height: string; }

export class CanvasScan extends React.Component<CanvasScanProps, {}> {
  render() {
    return (
      <div className='canvases'>
        <canvas id='canvas2d' width={this.props.width} height={this.props.height}></canvas>
        <canvas id='canvasgl' width={this.props.width} height={this.props.height}></canvas>
      </div>
    );
  }
}
