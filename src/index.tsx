import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanvasScan } from './components/CanvasScan'
import { ResolutionSettings } from './components/ResolutionSettings'
import { ScannerController } from './ScannerController'
import { RangedSlider } from './components/RangedSlider'
import { CurveEditor } from './components/CurveEditor';

let initialWidth = 640
let initialHeight = 480
let controller = new ScannerController(initialWidth,
  initialHeight)

ReactDOM.render(
  <div>
    <ResolutionSettings canvas={controller} />
    <RangedSlider min={0} max={10} default={4} step={0.05}  />
    <CurveEditor width="400" height = "80" />
    <CanvasScan width={"" + initialWidth} height={"" + initialHeight} />
  </div>,
  document.getElementById('render')
);

controller.init()
