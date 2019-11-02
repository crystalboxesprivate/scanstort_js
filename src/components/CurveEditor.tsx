import * as React from "react"
import { ICurve } from "../interfaces/ICurve"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"

export interface CurveEditorProps { width: number; height: number; param: string; curve: ICurve; callbackObject: IValueUpdatable }

export class CurveEditor extends React.Component<CurveEditorProps, {}> {
  props: CurveEditorProps
  state: {
    pointId: number
  }

  node: SVGSVGElement

  constructor(props: CurveEditorProps) {
    super(props)
    this.props = props

    this.state = {
      pointId: null,
    }
  }

  updateState(pointId: number) {
    this.setState({ pointId: pointId },
      () => this.props.callbackObject.setValue(this.props.param, this.props.curve))
  }

  handleMouseDown(ev: React.MouseEvent<SVGElement, MouseEvent>, isRight: boolean, pointId: number) {
    if (isRight) {
      this.props.curve.removePoint(pointId)
      this.updateState(null)
      ev.preventDefault()
      return
    }
    this.updateState(pointId)
  }


  handleSvgMouseDown(ev: React.MouseEvent<SVGElement, MouseEvent>) {
    if (ev.ctrlKey) {

      const svgRect = this.node.getBoundingClientRect();
      const svgX = ev.clientX - svgRect.left;
      const svgY = ev.clientY - svgRect.top;

      let x = svgX / +this.props.width
      let y = svgY / +this.props.height

      this.props.curve.addPoint(x, y)

      this.updateState(this.props.curve.getLastPointIndex())
    }
  }

  handleMouseUp() {
    if (this.state.pointId !== null) {
      this.updateState(null)
    }
  }

  handleMouseMove(event: { clientX: number, clientY: number }) {
    if (this.state.pointId !== null) {

      const svgRect = this.node.getBoundingClientRect();
      const svgX = event.clientX - svgRect.left;
      const svgY = event.clientY - svgRect.top;

      let x = svgX / +this.props.width
      let y = svgY / +this.props.height
      this.props.curve.setPointValue(this.state.pointId, x, y)

      this.updateState(this.state.pointId)
    }
  }

  get path(): JSX.Element[] {
    let cx = (norm: number) => norm * +this.props.width
    let cy = (norm: number) => norm * +this.props.height

    const items: JSX.Element[] = []
    let pts = this.props.curve.getCurvePoints()
    if (pts.length == 0) {
      return
    }

    const lineColor = "#777"
    const lineWidth = 1

    const getLine = (index: number, x1: number, y1: number, x2: number, y2: number, width?: number, color?: string) => <line
      key={"l" + index}
      x1={x1} y1={y1}
      x2={x2} y2={y2}
      stroke={color == null ? lineColor : color}
      strokeWidth={width == null ? lineWidth : width} />

    const tolerance = 0.0001
    if (pts[0].position > tolerance) {
      items.push(getLine(-1, cx(0.0), cy(pts[0].value),
        cx(pts[0].position), cy(pts[0].value)))
    }

    for (let x = 0; x < pts.length - 1; x++) {
      items.push(
        getLine(
          x, cx(pts[x].position), cy(pts[x].value),
          cx(pts[x + 1].position), cy(pts[x + 1].value
          )
        ))
    }

    let lastIndex = pts.length - 1
    if (pts[lastIndex].position < 1 - tolerance) {
      items.push(getLine(-2, cx(1.0), cy(pts[lastIndex].value),
        cx(pts[lastIndex].position), cy(pts[lastIndex].value)))
    }

    pts = this.props.curve.getCurvePointsUnsorted()
    const size = 8
    for (let x = 0; x < pts.length; x++) {
      items.push(<rect key={x} name={"p" + x}
        x={cx(pts[x].position) - size / 2}
        y={cy(pts[x].value) - size / 2}
        width={size}
        height={size}
        fill="rgb(12, 12, 12)"
        onMouseDown={() => this.handleMouseDown(null, false, x)}
        onContextMenu={(ev) => this.handleMouseDown(ev, true, x)}
        style={{ cursor: '-webkit-grab' }}
      />)
    }
    return items
  }

  render() {
    return (
      <svg ref={node => (this.node = node)}
        className="curve-editor" width={this.props.width}
        height={this.props.height}
        onMouseMove={ev => this.handleMouseMove(ev)}
        onMouseUp={() => this.handleMouseUp()}
        onMouseLeave={() => this.handleMouseUp()}
        onMouseDown={ev => this.handleSvgMouseDown(ev)}
        viewBox={"0 0 " + this.props.width + " " + this.props.height}
        style={{ maxHeight: this.props.height }}
      >
        {this.path}
      </svg>
    );
  }
}
