import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import AppContext from './context';

ReactDOM.render((
  <BrowserRouter>
    <AppContext>
      <App />
    </AppContext>
  </BrowserRouter>
), document.getElementById('root'));

serviceWorker.unregister();
