import {RootPage} from './root'
import {RegisteredAction} from '../utils/actionDecorators'
import * as services from '../services'

export class BookmarkIllustrationPage extends RootPage {
	public get artistId():number {
		return parseInt((<any>unsafeWindow).pixiv.context.userId)
	}

	protected darkenInList(artists:Model.Artist[]): void {
		this.jQuery('section#illust-recommend li.image-item').toArray().forEach(image => {
			let artistId = parseInt(this.jQuery(image).find('a.user').attr('data-user_id'));

			// Artist save format is [<id>] - <username>
			if (artistId === this.artistId || artists.some(artist => artist.id === artistId)) {
				unsafeWindow.console.log('deciding to darken');
				this.jQuery(image).css('background-color', '#333334');
			}
		});
	}

	@RegisteredAction({id: 'pa_darken_bookmark_suggestions', label: 'Darken Bookmarks'})
	public darkenBookmarks() {
		services.getArtistList((artists)=>this.darkenInList(artists));
	}

	@RegisteredAction({id: 'pa_load_all_bookmarks', label: 'Load All Bookmarks',})
	public loadAllBookmarks() {
		for (let i = 0; i < 15; i++) { 
			(<any>unsafeWindow).pixiv.illustRecommend.load();
		}
	}
}