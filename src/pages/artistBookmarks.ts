import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'

export class ArtistBookmarksPage extends GalleryPage {

	protected artistFromJQImage(image: JQuery): Model.Artist {
		return {
			id: parseInt(image.find('a.user').attr('data-user_id')),
			name: image.find('a.user').attr('data-user_name')
		}
	}
	protected imageFromJQImage(image: JQuery): Model.Image {
		return {
			id: pathUtils.getImageId(image.find('a.work').attr('href'))
		}
	}

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		this.jQuery('li.image-item').toArray().forEach(image => func(this.jQuery(image)));
	}

	@ExecuteOnLoad
	public experimentalFade() {
		this.executeOnEachImage(image => {
			let artist = this.artistFromJQImage(image);
			let imageObj = this.imageFromJQImage(image);
			services.imageExistsInDatabase(artist, imageObj, exists => {
				if (exists) {
					image.addClass('pa-hidden-thumbnail');
				}
			})
		});
	}
}