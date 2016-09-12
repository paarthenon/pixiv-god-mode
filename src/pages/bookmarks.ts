import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import {PixivAssistantServer} from '../services'
import * as pathUtils from '../utils/path'
import * as jQUtils from '../utils/document'
import {Container as Deps} from '../deps'
import {injectViewAllButton, ViewAllButtonElementId} from '../injectors/bookmarkDetailViewAll'

import SettingKeys from '../settingKeys'

export class BookmarkIllustrationPage extends RootPage {

	public getTagElements() {
		return [
			'ul.tags a'
		].map(this.jQuery).concat(super.getTagElements());
	}

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		this.jQuery('section#illust-recommend li.image-item:not([data-pa-processed="true"])').toArray().forEach(image => func(this.jQuery(image)));
	}

	@ExecuteIfSetting(SettingKeys.pages.bookmarkIllustration.inject.viewAll)
	public injectItems(){
		injectViewAllButton(this.jQuery, "View All", this.loadAllBookmarks);
	}

	@ExecuteOnLoad
	public injectTrigger() {
		document.addEventListener('pixivBookmarkIllustrationRecommenationLoaded', (event) => {
			this.experimentalFade();
			Deps.execOnPixiv(pixiv => pixiv.illustRecommend.completed).then(completed => {
				console.log('completed status',completed);
				if (completed) {
					$(`#${ViewAllButtonElementId}`).hide();
				}
			})
		});

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

	public experimentalFade() {
		this.executeOnEachImage(image => {
			let artist = jQUtils.artistFromJQImage(image);
			let imageObj = jQUtils.imageFromJQImage(image);

			Deps.getSetting(SettingKeys.pages.bookmarkIllustration.fadeDownloaded).then(settingValue => {
				if(settingValue) {
					PixivAssistantServer.imageExistsInDatabase(artist, imageObj).then(exists => {
						if (exists) {
							image.addClass('pa-hidden-thumbnail');
						}
					});
				}
			});

			Deps.getSetting(SettingKeys.pages.bookmarkIllustration.fadeBookmarked).then(settingValue => {
				if(settingValue) {
					let url = jQUtils.artistUrlFromJQImage(image);
					Deps.isPageBookmarked(url).then(bookmarked => {
						if (bookmarked) {
							image.addClass('pa-hidden-thumbnail');
						}
					})
				}
			});
			
			image.attr('data-pa-processed', 'true');
		});
	}

	@ExecuteIfSetting(SettingKeys.pages.bookmarkIllustration.skipToDetail)
	public moveOnToDetail(){
		if (/bookmark_add/.test(window.location.href)) window.location.reload();
	}

	@RegisteredAction({id: 'pa_load_all_bookmarks', label: 'Load All Bookmarks', icon: 'th'})
	public loadAllBookmarks() {
		for (let i = 0; i < 15; i++) { 
			Deps.execOnPixiv(pixiv => {
				pixiv.illustRecommend.load();
			});
		}
	}
}