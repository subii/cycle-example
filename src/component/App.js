import { Observable } from 'rx';
import { h1, div, a, table, thead, tbody, tr, td, th } from '@cycle/dom';
import Record from './record/Record';

function intent(DOM) {

    return {
        click$: DOM.select('a').events('click')
    };
}

function model(actions, DOM) {

    const addRecord$ = actions.click$.flatMapLatest( () => Observable.interval(1000).take(20)
        .map(i => function (oldList) {
            const record = Record(DOM, {
                count: `${i}`,
                text: `Increasing counter ${i}`
            });
            return oldList.concat([{DOM: record.DOM}]);
        }));

    return Observable.just([])
          .merge(addRecord$)
          .scan((acc, mod) => mod(acc));

}

function view(state$) {

    const stateAggr$ = state$.map(list => list.map(t => t.DOM));

    return stateAggr$.map(record =>
        div('.wrapper', [
            a({ href: '#', id: 'link'}, 'Query'),
            table('.tableclass', [
              thead(tr([
                  th('COUNT'),
                  th('TEXT')
              ])),
              tbody('.tbodyclass', record)
            ])
        ])
    );

}

export default function App(drivers) {

    const actions$ = intent(drivers.DOM);
    const state$ = model(actions$, drivers.DOM);
    const view$ = view(state$);

    return {
        DOM : view$
    };
}
