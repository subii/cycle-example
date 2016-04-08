import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import App from '../src/component/App.js';

const main = App;
const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
