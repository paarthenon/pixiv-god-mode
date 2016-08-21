import * as pathUtils from '../utils/path'
import {PixivAssistantServer} from '../services'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import * as jQUtils from '../utils/jq'
import {Model} from '../../common/proto'
import {Container as Deps} from '../deps'
import SettingKeys from '../settingKeys'

import {injectUserRelationshipButton} from '../injectors/openFolderInjector'
import {injectPagingButtons} from '../injectors/pagingButtonInjector'

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

	@ExecuteIfSetting(SettingKeys.pages.artistBookmarks.inject.openFolder)
	injectOpenFolder() {
		injectUserRelationshipButton(this.jQuery, this.artist);
	}
	@ExecuteIfSetting(SettingKeys.pages.artistBookmarks.inject.pagingButtons)
	public injectPagingButtons(){
		injectPagingButtons(this.jQuery, this.goToFirstPage.bind(this), this.goToLastPage.bind(this));
	}
	
	@ExecuteOnLoad
	public experimentalFade() {
		this.executeOnEachImage(image => {
			Deps.getSetting(SettingKeys.pages.artistBookmarks.fadeDownloaded).then(fade => {
				if(fade) {
					let artist = jQUtils.artistFromJQImage(image);
					let imageObj = jQUtils.imageFromJQImage(image);
					PixivAssistantServer.imageExistsInDatabase(artist, imageObj).then(exists => {
						if (exists) {
							image.addClass('pa-hidden-thumbnail');
						}
					})
				}
			});

			Deps.getSetting(SettingKeys.pages.artistBookmarks.fadeBookmarked).then(fade => {
				if (fade) {
					let url = jQUtils.artistUrlFromJQImage(image);
					Deps.isPageBookmarked(url).then(bookmarked => {
						if (bookmarked) {
							image.addClass('pa-hidden-thumbnail');
						}
					})
				}
			})
			
		});
	}

	@ExecuteIfSetting(SettingKeys.pages.artistBookmarks.directToManga)
	public replaceMangaThumbnailLinksToFull(){
		super.replaceMangaThumbnailLinksToFull();
	}
}