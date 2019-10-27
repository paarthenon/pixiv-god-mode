import * as React from 'react';
import * as $ from 'jquery';

import {IllustrationToolbarContainer, IllustrationToolbarContainerProps} from 'src/components/illustrationToolbar'
import {GenerateElement} from 'src/injectors/utils'

import log from 'src/log';
import {awaitUntil} from 'src/utils/document';

export async function injectIllustrationToolbar(props:IllustrationToolbarContainerProps) {
	log.info('Injecting toolbar');
	let component = GenerateElement(React.createElement(IllustrationToolbarContainer, props));

	let $target = await awaitUntil(() => {
		const selector = '#root main > section > div';
		if ($(selector).length === 3) {
			return $(selector).first();
		} else {
			return false;
		}
	});

	log.info('toolbar generated', component, 'adding to', $target, 'of', $target.length);
	$(component).insertAfter($target);
}
