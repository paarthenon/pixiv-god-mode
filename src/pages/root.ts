import {BasePage} from './base'
import {RegisteredAction} from '../utils/actionDecorators'

import {DictionaryService} from '../utils/dict'

export class RootPage extends BasePage {
	protected translateTags(tagElements:JQuery[]):void {
		tagElements.forEach(tagElement => {
			// TODO: Handle elements that have children
			let translatedText = DictionaryService.getTranslation(tagElement.text());
			if(translatedText){
				tagElement.attr('data-pa-translation-backup', tagElement.text());
				tagElement.text(translatedText);
			}
		});
	}
}