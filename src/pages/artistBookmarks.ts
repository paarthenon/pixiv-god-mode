import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'

export class ArtistBookmarksPage extends GalleryPage {
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

	@ExecuteOnLoad
	public darkenImages(): void {
		services.getArtistList((artists) => this.darkenInList(artists));
	}
}