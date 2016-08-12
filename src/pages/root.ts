import {BasePage} from './base'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'

import {DictionaryService} from '../services'

import {injectTagAugmentation} from '../injectors/tagAugment'

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
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => this.jQuery(x)).forEach(tagElement => {
			let textNode = tagElement.contents().filter(function() {
				return this.nodeType === Node.TEXT_NODE;
			});
			DictionaryService.getTranslation(textNode.text()).then(translatedText => {
				if (translatedText) {
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