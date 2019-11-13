import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Scanstort } from './Scanstort';

let scanstort = new Scanstort(640, 480)
ReactDOM.render(
  <div className="row">
    <div className="params column">
      {scanstort.getParameters()}
    </div>
    <div className="column">
      {scanstort.getRenderOut()}
    </div>
  </div>,
  document.getElementById('render')
);
scanstort.run()
