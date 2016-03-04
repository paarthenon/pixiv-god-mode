import {RootPage} from './root'
import {RegisteredAction} from '../utils/actionDecorators'
import * as services from '../services'
import * as pathUtils from '../utils/path'

export class BookmarkIllustrationPage extends RootPage {
	public get artistId():number {
		return parseInt((<any>unsafeWindow).pixiv.context.userId)
	}

	public getTagElements() {
		return [
			'ul.tags a'
		].map(x => this.jQuery(x)).concat(super.getTagElements());
	}

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
		this.jQuery('section#illust-recommend li.image-item').toArray().forEach(image => func(this.jQuery(image)));
	}

	@RegisteredAction({ id: 'pa_fade_bookmark_suggestions', label: 'Fade Downloaded Bookmarks', icon: 'paint-format' })
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

	@RegisteredAction({id: 'pa_load_all_bookmarks', label: 'Load All Bookmarks', icon: 'spinner2'})
	public loadAllBookmarks() {
		for (let i = 0; i < 15; i++) { 
			(<any>unsafeWindow).pixiv.illustRecommend.load();
		}
	}
}