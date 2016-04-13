import { Observable } from 'rx';
import { h1, div, button, table, thead, tbody, tr, td, th } from '@cycle/dom';
import Record from './record/Record';

function intent(DOM) {

    return {
        query$: DOM.select('button.query').events('click'),
        clear$: DOM.select('button.clear').events('click')
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
    const source = Observable.interval(1000).take(20);
    const header$ = source.first()
        .map(i => function (oldList) {
            const record = Record(DOM, {
                count: `COUNT ${i}`,
                text: `TEXT ${i}`
            }, true);
            return oldList.concat([{DOM: record.DOM}]);
        });

    const rows$ = source.skip(1)
        .map(i => function (oldList) {
            const record = Record(DOM, {
                count: `${i}`,
                text: `Increasing counter ${i}`
            });
            return oldList.concat([{DOM: record.DOM}]);
        });

    const addRecords$ = actions.query$.flatMapLatest( () => Observable.merge(header$, rows$));

    const mod$ = Observable.merge(cleanupRecords$, addRecords$, clearRecords$);

    return Observable.just([])
          .merge(mod$)
          .scan((acc, mod) => mod(acc));

}

function view(state$) {

    const stateAggr$ = state$.map(list => list.map(t => t.DOM));

    return stateAggr$.map(record =>
        div('.wrapper', [
            button('.query', 'Query'),
            button('.clear', 'Clear'),
            table('.tableclass', [
              record
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
