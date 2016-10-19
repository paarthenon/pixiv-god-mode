import * as $ from 'jquery'
import * as React from 'react'

import {PagingButton} from 'src/components/pagingButton'
import {GenerateElement} from 'src/injectors/utils'

function injectFirstButton(url:string) {
	let componentProps =  {className: 'glyphicon-step-backward', tooltip: 'First', rel: 'prev', href:url};
	let cssProps = {position: 'absolute', left: '-100%'};

	$('span.prev').css('position','relative');

	let component1 = GenerateElement(React.createElement(PagingButton, componentProps));
	$(component1).css(cssProps);
	$('span.prev').first().append(component1);

	let component2 = GenerateElement(React.createElement(PagingButton, componentProps));
	$(component2).css(cssProps);
	$('span.prev').last().append(component2);
}

function injectLastButton(url:string) {
	let componentProps = {className: 'glyphicon-step-forward', tooltip: 'Last', rel: 'next', href:url};
	let cssProps = {position: 'absolute', left: '100%'};

	$('span.next').css('position','relative');

	let component1 = GenerateElement(React.createElement(PagingButton, componentProps));
	$(component1).css(cssProps);
	$('span.next').first().append(component1);

	let component2 = GenerateElement(React.createElement(PagingButton, componentProps));
	$(component2).css(cssProps);
	$('span.next').last().append(component2);
}

export function injectPagingButtons(firstPage:string, lastPage:string) {
	if($('span.prev').children().length > 0) {
		injectFirstButton(firstPage);
	}
	if($('span.next').children().length > 0) {
		injectLastButton(lastPage);
	}
}