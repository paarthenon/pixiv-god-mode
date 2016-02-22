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
		console.log('translating tags');
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => $(x))
			.forEach(tagElement => {
			// TODO: Handle elements that have children
			let translatedText = DictionaryService.getTranslation(tagElement.text());
			if (translatedText) {
				tagElement.attr('data-pa-translation-backup', tagElement.text());
				tagElement.text(translatedText);
			}
		}));
	}
}