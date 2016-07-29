import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import {DictionaryService} from '../utils/dict'
import {Container as Deps} from '../deps'

import * as jQUtils from '../utils/jq'

export class SearchPage extends GalleryPage {

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		this.jQuery('li.image-item').toArray().forEach(image => func(this.jQuery(image)));
	}

	@ExecuteOnLoad
	public experimentalFade() {
		this.executeOnEachImage(image => {
			let artist = jQUtils.artistFromJQImage(image);
			let imageObj = jQUtils.imageFromJQImage(image);
			services.imageExistsInDatabase(artist, imageObj, exists => {
				if (exists) {
					image.addClass('pa-hidden-thumbnail');
				}
			})
		});
	}

	protected getTagElements() {
		return [
			'nav.breadcrumb > span > a > span',
			'a.self',
			'dl.column-related ul.tags li.tag a.text'
		].map(x => this.jQuery(x)).concat(super.getTagElements());
	}

	public changeTitle(): void {
		let titleMatch = document.title.match(/「(.*)」/);
		if(titleMatch && titleMatch[1]){
			let translatedText = DictionaryService.getTranslation(titleMatch[1]);
			if (translatedText) {
				let newTitle = document.title.replace(/「(.*)」/, `「${translatedText}」`);
				// If I set the title directly pixiv will eventually try to set the title
				// again, reverting my changes. This sets the field that pixiv's own functions
				// use. They'll do my work for me.
				// TODO: Allow for paramater passing. 
				Deps.execOnPixiv(pixiv => pixiv.title.original = newTitle);
			}
		}
	}

	public translateTagsOnPage(): void {
		this.changeTitle();
		super.translateTagsOnPage();
	}

	// TODO: This logic is wrong if we are already on the last page and there are fewer than the full set of elements. 
	// Make this action only visible if we are not already on the last page. 
	@RegisteredAction({ id: 'pa_button_go_to_last_page', label: 'Go To Last Page', icon: 'last' })
	public goToLastPage() {
		super.goToLastPage();
	} 
}
