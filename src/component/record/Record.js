import { Observable } from 'rx';
import { h1, table, thead, tbody, tr, td, th } from '@cycle/dom';

export default function Record (sources, record, header) {

    const vtree = []
    for (let elem in record) {
        vtree.push(header? th(record[elem]): td(record[elem]));
    }
    return {
        DOM: Observable.of(
            tr(vtree)
        )
    }
}
