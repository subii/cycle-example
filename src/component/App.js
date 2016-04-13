import { Observable } from 'rx';
import { h1, div, a, table, thead, tbody, tr, td, th } from '@cycle/dom';
import Record from './record/Record';

function intent(DOM) {

    return {
        query$: DOM.select('a.query').events('click'),
        clear$: DOM.select('a.clear').events('click')
    };
}

function model(actions, DOM) {

    //Clear existing records of current Query
    const clearRecords$ = actions.clear$
        .map(id => function (oldList) {
            return oldList.filter(() => false);
        });

    //Cleanup records of the previous Query
    const cleanupRecords$ = actions.query$
            .map(id => function (oldList) {
                return oldList.filter(() => false);
            });

    const fetch$ = Observable.interval(1000).take(20)
        .map(i => function (oldList) {
            const record = Record(DOM, {
                count: `${i}`,
                text: `Increasing counter ${i}`
            });
            return oldList.concat([{DOM: record.DOM}]);
        });
    const addRecords$ = actions.query$.flatMapLatest( () => fetch$);

    const mod$ = Observable.merge(cleanupRecords$, addRecords$, clearRecords$);

    return Observable.just([])
          .merge(mod$)
          .scan((acc, mod) => mod(acc));

}

function view(state$) {

    const stateAggr$ = state$.map(list => list.map(t => t.DOM));

    return stateAggr$.map(record =>
        div('.wrapper', [
            a({ href: '#', className: 'query'}, 'Query'),
            a({ href: '#', className: 'clear'}, 'Clear'),
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
