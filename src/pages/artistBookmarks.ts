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

/**
 * A listing of images that a specific artist has bookmarked.
 */
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

	public get allImages():JQuery[] {
		return $('li.image-item').toArray().map(x => $(x));
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
	
	@ExecuteIfSetting(SettingKeys.global.fadeDownloadedImages)
	public fadeDownloaded() {
		let imageMap = this.allImages.reduce((acc: { [id:string] : JQuery }, cur:JQuery) => {
			let imageId = jQUtils.imageFromJQImage(cur).id;
			acc[imageId.toString()] = cur;
			return acc;
		}, <{ [id: string]: JQuery }> {});

		let request = Object.keys(imageMap)
						.map(id => ({ 
							artist: jQUtils.artistFromJQImage(imageMap[id]), 
							image: { id: parseInt(id) } 
						}));

		PixivAssistantServer.bulkImageExists(request)
			.then(matchedImages => matchedImages
				.map(match => match.image.id.toString())
				.forEach(matchId => imageMap[matchId].addClass('pa-hidden-thumbnail')));
	}
	@ExecuteOnLoad
	public experimentalFade() {
		this.executeOnEachImage(image => {
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