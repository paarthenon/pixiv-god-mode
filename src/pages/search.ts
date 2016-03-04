import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import {DictionaryService} from '../utils/dict'

import {log} from '../utils/log'

export class SearchPage extends GalleryPage {
	protected darkenInList(artists: Model.Artist[]): void {
		this.jQuery('li.image-item').toArray().forEach(image => {
			unsafeWindow.console.log('analyzing image');
			let artistId = parseInt(this.jQuery(image).find('a.user').attr('data-user_id'));
			// Artist save format is [<id>] - <username>
			if (artists.some(artist => artist.id === artistId)) {
				this.jQuery(image).addClass('pa-hidden-thumbnail');
			}
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
				log(`SearchPage.changeTitle | replacing title from [${document.title}] to [${newTitle}]`);
				// If I set the title directly pixiv will eventually try to set the title
				// again, reverting my changes. This sets the field that pixiv's own functions
				// use. They'll do my work for me.
				(<any>unsafeWindow).pixiv.title.original = newTitle;
			}
		}
	}

	public translateTagsOnPage(): void {
		this.changeTitle();
		super.translateTagsOnPage();
	}

	@ExecuteOnLoad
	public darkenImages(): void {
		services.getArtistList((artists) => this.darkenInList(artists));
	}

	// TODO: This logic is wrong if we are already on the last page and there are fewer than the full set of elements. 
	// Make this action only visible if we are not already on the last page. 
	@RegisteredAction({ id: 'pa_button_go_to_last_page', label: 'Go To Last Page', icon: 'last' })
	public goToLastPage() {
		super.goToLastPage();
	} 
}
