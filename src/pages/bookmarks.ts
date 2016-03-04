import {RootPage} from './root'
import {RegisteredAction} from '../utils/actionDecorators'
import * as services from '../services'

export class BookmarkIllustrationPage extends RootPage {
	public get artistId():number {
		return parseInt((<any>unsafeWindow).pixiv.context.userId)
	}

	public getTagElements() {
		return [
			'ul.tags a'
		].map(x => this.jQuery(x)).concat(super.getTagElements());
	}

	protected darkenInList(artists:Model.Artist[]): void {
		this.jQuery('section#illust-recommend li.image-item').toArray().forEach(image => {
			let artistId = parseInt(this.jQuery(image).find('a.user').attr('data-user_id'));

			// Artist save format is [<id>] - <username>
			if (artistId === this.artistId || artists.some(artist => artist.id === artistId)) {
				unsafeWindow.console.log('deciding to darken');
				this.jQuery(image).addClass('pa-hidden-thumbnail');
			}
		});
	}

	@RegisteredAction({id: 'pa_darken_bookmark_suggestions', label: 'Darken Bookmarks', icon: 'paint-format'})
	public darkenBookmarks() {
		services.getArtistList((artists)=>this.darkenInList(artists));
	}

	@RegisteredAction({id: 'pa_load_all_bookmarks', label: 'Load All Bookmarks', icon: 'spinner2'})
	public loadAllBookmarks() {
		for (let i = 0; i < 15; i++) { 
			(<any>unsafeWindow).pixiv.illustRecommend.load();
		}
	}
}