import { Observable } from 'rx';
import { h1, table, thead, tbody, tr, td, th } from '@cycle/dom';

export default function Record (sources, record) {

    return {
        DOM: Observable.of(
            tr([
                    td(record.count),
                    td(record.text)
            ])
        )
    }
}
