import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {PagingButton} from '../components/pagingButton'
import {GenerateElement} from './utils'

function injectFirstButton($:JQueryStatic, url:string) {
	let componentProps =  {text: '<<', tooltip: 'First', rel: 'prev', href:url};
	let cssProps = {position: 'absolute', left: '-100%'};

	$('span.prev').css('position','relative');

	let component1 = GenerateElement(React.createElement(PagingButton, componentProps), $);
	$(component1).css(cssProps);
	$('span.prev').first().append(component1);

	let component2 = GenerateElement(React.createElement(PagingButton, componentProps), $);
	$(component2).css(cssProps);
	$('span.prev').last().append(component2);
}

function injectLastButton($:JQueryStatic, url:string) {
	let componentProps = {text: '>>', tooltip: 'Last', rel: 'next', href:url};
	let cssProps = {position: 'absolute', left: '100%'};

	$('span.next').css('position','relative');

	let component1 = GenerateElement(React.createElement(PagingButton, componentProps), $);
	$(component1).css(cssProps);
	$('span.next').first().append(component1);

	let component2 = GenerateElement(React.createElement(PagingButton, componentProps), $);
	$(component2).css(cssProps);
	$('span.next').last().append(component2);
}

export function injectPagingButtons($:JQueryStatic, firstPage:string, lastPage:string) {
	if($('span.prev').children().length > 0) {
		injectFirstButton($,firstPage);
	}
	if($('span.next').children().length > 0) {
		injectLastButton($, lastPage);
	}
}