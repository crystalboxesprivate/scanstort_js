import * as React from "react"
import { ICurve } from "../interfaces/ICurve"
import { Curve } from "../Curve"
import { IValueUpdatable } from "../interfaces/IValueUpdatable"

export interface CurveEditorProps { width: number; height: number; param: string; callbackObject: IValueUpdatable }

export class CurveEditor extends React.Component<CurveEditorProps, {}> {
  props: CurveEditorProps
  curve: ICurve
  state: {
    pointId: number
  }

  node: SVGSVGElement

  constructor(props: CurveEditorProps) {
    super(props)
    this.props = props
    this.curve = new Curve()

    this.state = {
      pointId: null,
    }
  }

  updateState(pointId: number) {
    this.setState({ pointId: pointId },
      () => this.props.callbackObject.setValue(this.props.param, this.curve))
  }

  handleMouseDown(ev: React.MouseEvent<SVGElement, MouseEvent>, isRight: boolean, pointId: number) {
    if (isRight) {
      this.curve.removePoint(pointId)
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

      this.curve.addPoint(x, y)

      this.updateState(this.curve.getLastPointIndex())
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
      this.curve.setPointValue(this.state.pointId, x, y)

      this.updateState(this.state.pointId)
    }
  }

  get path(): JSX.Element[] {
    let cx = (norm: number) => norm * +this.props.width
    let cy = (norm: number) => norm * +this.props.height

    const items: JSX.Element[] = []
    let pts = this.curve.getCurvePoints()

    for (let x = 0; x < pts.length - 1; x++) {
      items.push(<line key={"l" + x} x1={cx(pts[x].position)} y1={cy(pts[x].value)}
        x2={cx(pts[x + 1].position)} y2={cy(pts[x + 1].value)} stroke="#777" strokeWidth="1"></line>)
    }

    pts = this.curve.getCurvePointsUnsorted()
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
