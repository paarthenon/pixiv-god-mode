import {BasePage} from './base'
import {RegisteredAction} from '../utils/actionDecorators'

import * as Dict from '../utils/dict'

export class RootPage extends BasePage {
	protected translateTags(tagElements:JQuery[]):void {
		tagElements.forEach(tagElement => {
			// TODO: Handle elements that have children
			let translatedText = Dict.getTranslation(tagElement.text());
			if(translatedText){
				tagElement.text(translatedText);
			}
		});
	}
}