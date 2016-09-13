import * as log4js from 'log4js'

import {BasePage} from './base'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {DictionaryService} from '../services'
import {injectTagAugmentation} from '../injectors/tagAugment'

let logger = log4js.getLogger('Root Page');

export class RootPage extends BasePage {
	constructor(
		protected path: string,
		protected jQuery: JQueryStatic
	) {
		super(path, jQuery);

		this.translateTagsOnPage();
	}
	protected getTagElements():JQuery[] {
		return [];
	}

	public translateTagsOnPage():void {
		logger.trace('translating tags',this.getTagElements());
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => this.jQuery(x)).forEach(tagElement => {
			let textNode = tagElement.contents().filter(function() {
				return this.nodeType === Node.TEXT_NODE;
			});
			logger.trace('found text node',textNode.text());
			DictionaryService.getTranslation(textNode.text()).then(translatedText => {
				if (translatedText) {
					logger.trace('found translation', translatedText);
					tagElement.attr('data-pa-translation-backup', textNode.text());
					textNode.replaceWith(translatedText);
				}
			});
		}));
	}
	public revertTagTranslations():void {
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => this.jQuery(x)).forEach(tagElement => {
			let textNode = tagElement.contents().filter(function() {
				return this.nodeType === Node.TEXT_NODE;
			});
			let backedUpText = tagElement.attr('data-pa-translation-backup');
			if (backedUpText) {
				textNode.replaceWith(backedUpText);
				tagElement.attr('data-pa-translation-backup', '');
			}
		}));
	}
}