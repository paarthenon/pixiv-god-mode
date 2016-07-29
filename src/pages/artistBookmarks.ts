import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import * as jQUtils from '../utils/jq'
import {Model} from '../../common/proto'

import {injectUserRelationshipButton} from '../injectors/openFolderInjector'

export class ArtistBookmarksPage extends GalleryPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.path);
	}
	public get artistName():string {
		return this.jQuery('h1.user').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		this.jQuery('li.image-item').toArray().forEach(image => func(this.jQuery(image)));
	}
	
	protected getTagElements() {
		return [
			'span.tag-badge',
			'div.bookmark-tags li a'
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}

	@ExecuteOnLoad
	inject() {
		injectUserRelationshipButton(this.jQuery, this.artist);
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