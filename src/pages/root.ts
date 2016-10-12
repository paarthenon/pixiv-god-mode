import * as $ from 'jquery'
import {BasePage} from 'src/pages/base'
import {DictionaryService} from 'src/services'
import {Container} from 'src/deps'
import SettingKeys from 'src/settingKeys'

export class RootPage extends BasePage {
	constructor(
		protected path: string,
	) {
		super(path);

		Container.getSetting(SettingKeys.global.translateTags).then(translate => {
			if (translate) this.translateTagsOnPage();
		})
	}
	protected getTagElements():JQuery[] {
		return [];
	}

	public translateTagsOnPage():void {
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => $(x)).forEach(tagElement => {
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
		this.getTagElements().forEach(jQTagElement => jQTagElement.toArray().map(x => $(x)).forEach(tagElement => {
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