import {BasePage} from './base'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'

import {DictionaryService} from '../utils/dict'

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

	protected translateTagsOnPage():void {
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => this.jQuery(x)).forEach(tagElement => {
			let textNode = tagElement.contents().filter(function() {
				return this.nodeType === Node.TEXT_NODE;
			});
			let translatedText = DictionaryService.getTranslation(textNode.text());
			if (translatedText) {
				tagElement.attr('data-pa-translation-backup', textNode.text());
				textNode.replaceWith(translatedText);
			}
		}));
	}
	protected revertTagTranslations():void {
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