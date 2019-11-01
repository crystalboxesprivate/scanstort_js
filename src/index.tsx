import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanvasScan } from './components/CanvasScan'
import { ResolutionForm } from './components/ResolutionForm'
import { ScannerController } from './ScannerController'

let initialWidth = 640
let initialHeight = 480
let controller = new ScannerController(initialWidth,
  initialHeight)

ReactDOM.render(
  <div>
    <ResolutionForm canvas={controller} />
    <CanvasScan width={"" + initialWidth} height={"" + initialHeight} />
  </div>,
  document.getElementById('render')
);

controller.init()
