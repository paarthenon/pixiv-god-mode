import * as pathUtils from '../utils/path'
import * as services from '../services'
import {BasePage, RegisteredAction, ExecuteOnLoad} from './base'

export class GalleryPage extends BasePage {
	protected darkenInList(artists: Model.Artist[]): void {
		this.jQuery('li.image-item').toArray().forEach(image => {
			unsafeWindow.console.log('analyzing image');
			let artistId = parseInt(this.jQuery(image).find('a.user').attr('data-user_id'));
			// Artist save format is [<id>] - <username>
			if (artists.some(artist => artist.id === artistId)) {
				this.jQuery(image).css('background-color', '#333334');
			}
		});
	}

	@ExecuteOnLoad
	public darkenImages(): void {
		services.getArtistList(this.darkenInList);
	}
}