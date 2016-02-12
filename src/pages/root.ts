import {BasePage} from './base'
import {RegisteredAction} from '../utils/actionDecorators'

export class RootPage extends BasePage {
	@RegisteredAction({id: 'pa_button_translate_tags', label: 'Translate all tags'})
	public translateTags():void {

	}
}