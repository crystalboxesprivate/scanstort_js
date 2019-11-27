import * as React from "react"
import { IParameter } from "./IParameter"

export class CurvePoint {
  position: number
  value: number
}

export interface CurveEditorProps { width: number; height: number }

export class Curve extends React.Component<CurveEditorProps, {}> implements IParameter {


  static defaultProps = {
    width: 100,
    height: 64
  }

  evaluate(u: number): number {
    let lerp = function (v0: number, v1: number, t: number) {
      return v0 * (1 - t) + v1 * t
    };
    let pts = this.points
    for (let x = 0; x < pts.length - 1; x++) {
      let point = pts[x]
      let point2 = pts[x + 1]
      if (u > point.position && u < point2.position ) {
        let off = u - point.position
        let dist = point2.position - point.position
        return lerp(point.value, point2.value, off / dist)
      }
    }
  }

  points: CurvePoint[]
  private isDirty: boolean = true

  get(option?: any): any {
    if (option == null) {
      option = 0.5
    }
    return this.evaluate(option)
  }

  set(_: any): void {
  }

  setDirty(): void {
    this.isDirty = true;
  }

  isChanged(): boolean {
    if (this.isDirty) {
      this.isDirty = false;
      return true;
    }
    return false;
  }

  constructor(props: CurveEditorProps) {
    super(props)
    this.points = [
      { position: 0, value: 0.5 },
      { position: 1, value: 0.5 }
    ]

    this.props = props

    this.state = {
      pointId: null,
    }
  }

  getLastPointIndex(): number {
    return this.points.length - 1
  }

  getCurvePoints(): CurvePoint[] {
    let pts: CurvePoint[] = []
    for (let pt of this.points) {
      pts.push({ position: pt.position, value: pt.value })
    }
    pts.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
    return pts
  }

  getCurvePointsUnsorted(): CurvePoint[] {
    return this.points
  }

  addPoint(position: number, value: number): void {
    this.points.push({ position: position, value: value })
  }

  removePoint(index: number): void {
    if (index < this.points.length) {
      this.points.splice(index, 1)
    }
  }

  setPointValue(index: number, position: number, value: number): void {
    if (index < this.points.length) {
      this.points[index].position = position
      this.points[index].value = value
    }
  }

  props: CurveEditorProps
  state: {
    pointId: number
  }

  node: SVGSVGElement

  updateState(pointId: number) {
    this.setState({ pointId: pointId }, () => { this.setDirty() })
  }

  handleMouseDown(ev: React.MouseEvent<SVGElement, MouseEvent>, isRight: boolean, pointId: number) {
    if (isRight && pointId !== null) {
      this.removePoint(pointId)
      this.updateState(null)
      ev.preventDefault()
      return
    }
    this.updateState(pointId)
  }


  handleSvgMouseDown(ev: React.MouseEvent<SVGElement, MouseEvent>) {
    if (ev.altKey) {

      const svgRect = this.node.getBoundingClientRect();
      const svgX = ev.clientX - svgRect.left;
      const svgY = ev.clientY - svgRect.top;

      let x = svgX / +this.props.width
      let y = svgY / +this.props.height

      this.addPoint(x, y)

      this.updateState(this.getLastPointIndex())
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
      this.setPointValue(this.state.pointId, x, y)

      this.updateState(this.state.pointId)
    }
  }

  get path(): JSX.Element[] {
    const cx = (norm: number) => norm * +this.props.width
    const cy = (norm: number) => norm * +this.props.height

    const items: JSX.Element[] = []
    let pts = this.getCurvePoints()
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

    pts = this.getCurvePointsUnsorted()
    const curvePointToRect = (a: CurvePoint, s: number) => {
      return {
        x: cx(a.position) - s / 2,
        y: cy(a.value) - s / 2,
        s: s
      }
    }
    const size = 10
    const col = "rgb(12, 12, 12)"
    const bgColor = "rgba(255, 255, 255, 0)"

    for (let x = 0; x < pts.length; x++) {
      let rL = curvePointToRect(pts[x], size)
      let rS = curvePointToRect(pts[x], size / 2.5)
      items.push(<rect key={`pl${x}`} name={`p${x}`}
        x={rL.x} y={rL.y} width={rL.s} height={rL.s}
        fill={bgColor}
        onMouseDown={() => this.handleMouseDown(null, false, x)}
        onContextMenu={(ev) => this.handleMouseDown(ev, true, x)}
      />, <rect key={`p${x}`} name={`p2${x}`}
        x={rS.x} y={rS.y} width={rS.s} height={rS.s}
        fill={col}
        onMouseDown={() => this.handleMouseDown(null, false, x)}
        onContextMenu={(ev) => this.handleMouseDown(ev, true, x)}
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

