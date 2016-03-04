import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import * as jQUtils from '../utils/jq'

export class ArtistBookmarksPage extends GalleryPage {
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
}