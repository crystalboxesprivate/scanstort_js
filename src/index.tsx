import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanvasScan } from './components/CanvasScan'
import { ResolutionSettings } from './components/ResolutionSettings'
import { ScannerController } from './ScannerController'
import { ScanDistortParameters } from './components/ScanDistortParameters';

let initialWidth = 640
let initialHeight = 480
let controller = new ScannerController(initialWidth,
  initialHeight)

ReactDOM.render(
  <div className="row">
    <div className="params column">
      <ResolutionSettings canvas={controller} />
      <ScanDistortParameters obj={controller} />
    </div>
    <div className="column">
      <CanvasScan width={"" + initialWidth} height={"" + initialHeight} />
    </div>
  </div>,
  document.getElementById('render')
);

controller.init()
controller.drawLoop()
