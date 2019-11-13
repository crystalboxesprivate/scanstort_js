import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ResolutionSettings } from './components/ResolutionSettings'
import { ScannerController } from './Controller'
import { EffectParameters } from './components/EffectParameters';
import { TextInputParameters } from './components/TextInputParameters';
import { StateLoader } from './components/StateLoader';

let controller = new ScannerController()


ReactDOM.render(
  <div className="row">
    <div className="params column">
      <TextInputParameters callbackObj={controller} />
      <ResolutionSettings canvas={controller} />
      <EffectParameters obj={controller} />
      <StateLoader callbackObj={controller} />
    </div>
    <div className="column">
      <div className='canvases'>
        <canvas id='canvas2d' />
        <canvas id='canvasgl' />
      </div>
    </div>
  </div>,
  document.getElementById('render')
);

controller.initGraphics()
controller.drawLoop()
