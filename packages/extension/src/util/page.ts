import ReactDOM from 'react-dom';
import $ from 'cash-dom';
/**
 * Turn a react component into an HTMLElement that we can mess with using JQuery
 */
export function GenerateElement<P = any>(componentDef: React.ReactElement<P>) {
    let elem = $('<div></div>')[0]!;
    ReactDOM.render<P>(componentDef, elem);
    return $(elem)
        .children()
        .first()[0];
}
