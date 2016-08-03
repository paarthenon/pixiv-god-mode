import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import * as services from '../services'
import * as pathUtils from '../utils/path'
import * as jQUtils from '../utils/jq'
import {Container as Deps} from '../deps'
import {injectViewAllButton} from '../injectors/bookmarkDetailViewAll'

export class BookmarkIllustrationPage extends RootPage {

	public getTagElements() {
		return [
			'ul.tags a'
		].map(x => this.jQuery(x)).concat(super.getTagElements());
	}

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		this.jQuery('section#illust-recommend li.image-item:not([data-pa-processed="true"])').toArray().forEach(image => func(this.jQuery(image)));
	}

	@ExecuteOnLoad
	public injectItems(){
		injectViewAllButton(this.jQuery, "View All", this.loadAllBookmarks);
	}

	@ExecuteOnLoad
	public injectTrigger() {
		document.addEventListener('pixivBookmarkIllustrationRecommenationLoaded', (event) => this.experimentalFade());

		Deps.execOnPixiv(pixiv => {
			function issueNotification(){
				var evt = new CustomEvent('pixivBookmarkIllustrationRecommenationLoaded', {});
				document.dispatchEvent(evt);
			}
			function paWrapFunction(func:Function, context:any) {
				return function() {
					issueNotification();
					func.call(context);
				}
			}

			pixiv.scrollView.process = paWrapFunction(pixiv.scrollView.process, pixiv.scrollView);
		});
	}

	@RegisteredAction({ id: 'pa_fade_bookmark_suggestions', label: 'Fade Downloaded Bookmarks', icon: 'paint-format' })
	public experimentalFade() {
		this.executeOnEachImage(image => {
			let artist = jQUtils.artistFromJQImage(image);
			let imageObj = jQUtils.imageFromJQImage(image);
			services.imageExistsInDatabase(artist, imageObj, exists => {
				if (exists) {
					image.addClass('pa-hidden-thumbnail');
				}
			})
			image.attr('data-pa-processed', 'true');
		});
	}

	@RegisteredAction({id: 'pa_load_all_bookmarks', label: 'Load All Bookmarks', icon: 'spinner2'})
	public loadAllBookmarks() {
		for (let i = 0; i < 15; i++) { 
			Deps.execOnPixiv(pixiv => {
				pixiv.illustRecommend.load();
			});
		}
	}
}