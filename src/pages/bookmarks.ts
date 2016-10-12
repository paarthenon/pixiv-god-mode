import * as $ from 'jquery'
import {RootPage} from 'src/pages/root'
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators'
import {PixivAssistantServer} from 'src/services'
import * as pathUtils from 'src/utils/path'
import * as jQUtils from 'src/utils/document'
import {Container as Deps} from 'src/deps'
import {injectViewAllButton, ViewAllButtonElementId} from 'src/injectors/bookmarkDetailViewAll'

import SettingKeys from 'src/settingKeys'

export class BookmarkIllustrationPage extends RootPage {

	public getTagElements() {
		return [
			'ul.tags a'
		].map(tag => $(tag)).concat(super.getTagElements());
	}

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		$('section#illust-recommend li.image-item:not([data-pa-processed="true"])').toArray().forEach(image => func($(image)));
	}

	@ExecuteIfSetting(SettingKeys.pages.bookmarkIllustration.inject.viewAll)
	public injectItems(){
		injectViewAllButton("View All", this.loadAllBookmarks);
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
		// Do not trigger if this is a bookmark_detail page.
		if (/bookmark_add/.test(window.location.href)) {
			let detailLink = $('.bookmark-count')[0];
			if (detailLink) detailLink.click();
		}
	}

	public loadAllBookmarks() {
		for (let i = 0; i < 15; i++) { 
			Deps.execOnPixiv(pixiv => {
				pixiv.illustRecommend.load();
			});
		}
	}
}