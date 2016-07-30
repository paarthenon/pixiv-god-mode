import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {PageButton} from '../components/pageButton'

function injectFirstButton($:JQueryStatic, func:Function) {
	let props =  {text: '<<', tooltip: 'First', rel: 'prev', clickAction: func};

	let elem = $('<span></span>')[0];
	ReactDOM.render(React.createElement(PageButton, props), elem);
	$('.pager-container').first().prepend(elem);

	let elem2 = $('<span></span>')[0];
	ReactDOM.render(React.createElement(PageButton, props), elem2);
	$('.pager-container').last().prepend(elem2);
}

function injectLastButton($:JQueryStatic, func:Function) {
	let props = {text: '>>', tooltip: 'Last', rel: 'next', clickAction: func};

	let elem = $('<span></span>')[0];
	ReactDOM.render(React.createElement(PageButton, props ), elem);
	$('.pager-container').first().append(elem);

	let elem2 = $('<span></span>')[0];
	ReactDOM.render(React.createElement(PageButton, props ), elem2);
	$('.pager-container').last().append(elem2);
}

export function injectPagingButtons($:JQueryStatic, firstPageFunc:Function, lastPageFunc:Function) {
	if($('span.prev').children().length > 0) {
		injectFirstButton($,firstPageFunc);
	}
	if($('span.next').children().length > 0) {
		injectLastButton($, lastPageFunc);
	}
}