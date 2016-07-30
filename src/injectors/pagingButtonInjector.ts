import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {PageButton} from '../components/pageButton'
import {GenerateElement} from './utils'

function injectFirstButton($:JQueryStatic, func:Function) {
	let componentProps =  {text: '<<', tooltip: 'First', rel: 'prev', clickAction: func};
	let cssProps = {position: 'absolute', left: '-100%'};

	$('span.prev').css('position','relative');

	let component1 = GenerateElement(React.createElement(PageButton, componentProps), $);
	$(component1).css(cssProps);
	$('span.prev').first().append(component1);

	let component2 = GenerateElement(React.createElement(PageButton, componentProps), $);
	$(component2).css(cssProps);
	$('span.prev').last().append(component2);
}

function injectLastButton($:JQueryStatic, func:Function) {
	let componentProps = {text: '>>', tooltip: 'Last', rel: 'next', clickAction: func};
	let cssProps = {position: 'absolute', left: '100%'};

	$('span.next').css('position','relative');

	let component1 = GenerateElement(React.createElement(PageButton, componentProps), $);
	$(component1).css(cssProps);
	$('span.next').first().append(component1);

	let component2 = GenerateElement(React.createElement(PageButton, componentProps), $);
	$(component2).css(cssProps);
	$('span.next').last().append(component2);
}

export function injectPagingButtons($:JQueryStatic, firstPageFunc:Function, lastPageFunc:Function) {
	if($('span.prev').children().length > 0) {
		injectFirstButton($,firstPageFunc);
	}
	if($('span.next').children().length > 0) {
		injectLastButton($, lastPageFunc);
	}
}