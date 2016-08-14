import * as pathUtils from '../utils/path'
import {PixivAssistantServer} from '../services'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import SettingKeys from '../settingKeys'
import {Model} from '../../common/proto'

import {Container as DepsContainer} from '../deps'

import * as log4js from 'log4js'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {PageButton} from '../components/pageButton'
import {UserRelationButton} from '../components/userRelationButton'

import {injectPagingButtons} from '../injectors/pagingButtonInjector'
import {injectUserRelationshipButton} from '../injectors/openFolderInjector'
import {injectNavbarRightButton} from '../injectors/navbarRightButtonInjector'

let logger = log4js.getLogger();

export class WorksPage extends GalleryPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.path);
	}
	public get artistName():string {
		return this.jQuery('h1.user').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}
	public get allImages():JQuery[] {
		return this.jQuery('li.image-item').toArray().map(x => this.jQuery(x));
	}

	protected getTagElements() {
		return [
			'span.tag-badge',
			'div.user-tags li a'
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}

	protected executeOnEachImage<T>(func:(image:JQuery) => T) {
		this.jQuery('li.image-item').toArray().forEach(image => func(this.jQuery(image)));
	}

	@ExecuteOnLoad
	public injectPageElements() {
		injectPagingButtons(this.jQuery, this.goToFirstPage.bind(this), this.goToLastPage.bind(this));
		injectUserRelationshipButton(this.jQuery, this.artist);
		injectNavbarRightButton(this.jQuery, 'Open In Tabs', this.openTabs.bind(this));
	}


	@ExecuteIfSetting(SettingKeys.pages.works.autoDarken)
	public experimentalFade() {
		let imageMap = this.allImages.reduce((acc: { [id:string] : JQuery }, cur:JQuery) => {
			let imageId = pathUtils.getImageId(cur.find('a.work').attr('href'));
			acc[imageId.toString()] = cur;
			return acc;
		}, <{ [id: string]: JQuery }> {});

		let request = Object.keys(imageMap)
						.map(id => ({ artist: this.artist, image: { id: parseInt(id) } }));

		PixivAssistantServer.bulkImageExists(request)
			.then(matchedImages => matchedImages
				.map(image => { logger.debug(JSON.stringify(image)); return image; })
				.map(match => match.image.id.toString())
				.forEach(matchId => imageMap[matchId].addClass('pa-hidden-thumbnail')));
	}

	// TODO: This logic is wrong if we are already on the last page and there are fewer than the full set of elements.
	// Make this action only visible if we are not already on the last page.
	@RegisteredAction({ id: 'pa_button_go_to_last_page', label: 'Go To Last Page', icon: 'last' })
	public goToLastPage() {
		super.goToLastPage();
	}

	@RegisteredAction({ id: 'pa_button_open_in_tabs', label: 'Open in Tabs', icon: 'new-tab' })
	public openTabs():void {
		this.jQuery('li.image-item a.work').toArray().forEach(image => {
			let path = this.jQuery(image).attr('href');
			if (this.jQuery(image).attr('class').indexOf('multiple') >= 0) {
				path = path.replace('medium', 'manga');
			}
			DepsContainer.openInTab(window.location.origin + path);
		});
	}

	@RegisteredAction({id: 'pa_button_open_folder', label: 'Open Folder', icon: 'folder-open'})
	public openFolder():void {
		PixivAssistantServer.openFolder(this.artist);
	}

	@RegisteredAction({ id: 'pa_download_all_images_debug', label: 'Download All (DEBUG)', icon: 'new-tab' })
	public debugDownloadAllImagesForArtist():void {
		DepsContainer.execOnPixiv(
			(pixiv, props) => {
				return pixiv.api.userProfile({
					user_ids: props.artistId,
					illust_num: 1000000
				}, {})
			},{
				artistId: this.artistId
			}
		).then((result: any) => {
			let combined_urls = result.body[0].illusts.map((illust: any) => {
				let url = illust.url[Object.keys(illust.url)[0]];
				let pages = illust.illust_page_count;

				let fullResUrl = pathUtils.experimentalMaxSizeImageUrl(url);
				let urls = pathUtils.explodeImagePathPages(fullResUrl, pages);

				return urls;
			}).reduce((previous: string[], current: string[]) => previous.concat(current));

			PixivAssistantServer.downloadMulti(this.artist, combined_urls);
		});
	}

	@ExecuteIfSetting(SettingKeys.pages.works.directToManga)
	public replaceMangaThumbnailLinksToFull(){
		super.replaceMangaThumbnailLinksToFull();
	}

}
