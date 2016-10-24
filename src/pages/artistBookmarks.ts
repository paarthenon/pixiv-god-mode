import * as $ from 'jquery'
import * as pathUtils from 'src/utils/path'
import {PixivAssistantServer} from 'src/services'
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators'
import {GalleryPage} from 'src/pages/gallery'
import * as jQUtils from 'src/utils/document'
import {Model} from 'common/proto'
import {Container as Deps} from 'src/deps'
import SettingKeys from 'src/settingKeys'

import {injectUserRelationshipButton} from 'src/injectors/openFolderInjector'

import {prefix} from 'src/utils/log'
let console = prefix("Artist's Bookmarks Page");

export class ArtistBookmarksPage extends GalleryPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.path);
	}
	public get artistName():string {
		return $('h1.user').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}

	protected executeOnEachImage<T>(func: (image: JQuery) => T) {
		$('li.image-item').toArray().forEach(image => func($(image)));
	}
	
	protected getTagElements() {
		return [
			'span.tag-badge',
			'div.bookmark-tags li a'
		].map(tag => $(tag)).concat(super.getTagElements());
	}

	@ExecuteIfSetting(SettingKeys.global.inject.openToArtistButton)
	injectOpenFolder() {
		injectUserRelationshipButton(this.artist);
	}
	@ExecuteIfSetting(SettingKeys.global.inject.pagingButtons)
	public injectPagingButtons(){
		super.injectPagingButtons();
	}
	
	@ExecuteOnLoad
	public experimentalFade() {
		this.executeOnEachImage(image => {
			Deps.getSetting(SettingKeys.global.fadeDownloadedImages).then(fade => {
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

			Deps.getSetting(SettingKeys.global.fadeImagesByBookmarkedArtists).then(fade => {
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

	@ExecuteIfSetting(SettingKeys.global.directToManga)
	public replaceMangaThumbnailLinksToFull(){
		console.log('Replacing manga links to link to the viewer');
		super.replaceMangaThumbnailLinksToFull();
	}
}