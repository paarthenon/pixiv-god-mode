import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Turn a react component into an HTMLElement that we can mess with using JQuery
 */
export function GenerateElement(componentDef: React.ReactElement<any>) {
    let elem = $('<div></div>')[0];
    ReactDOM.render(componentDef, elem);
    return $(elem)
        .children()
        .first()[0];
}
