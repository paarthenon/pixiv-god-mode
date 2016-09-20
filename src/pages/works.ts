import * as pathUtils from '../utils/path'
import * as jQUtils from '../utils/document'
import {PixivAssistantServer} from '../services'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import SettingKeys from '../settingKeys'
import {Model} from '../../common/proto'

import * as log4js from 'log4js'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {UserRelationButton} from '../components/userRelationButton'

import {injectPagingButtons} from '../injectors/pagingButtonInjector'
import {injectUserRelationshipButton} from '../injectors/openFolderInjector'
import {injectOpenInTabs} from '../injectors/openInTabs'
import {Container as Deps} from '../deps'

import ConfigKeys from '../ConfigKeys'

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
		].map(tag => this.jQuery(tag)).concat(super.getTagElements());
	}

	protected executeOnEachImage<T>(func:(image:JQuery) => T) {
		this.jQuery('li.image-item').toArray().forEach(image => func(this.jQuery(image)));
	}

	@ExecuteIfSetting(SettingKeys.pages.works.inject.openFolder)
	public injectOpenFolder(){
		injectUserRelationshipButton(this.jQuery, this.artist);
	}
	@ExecuteIfSetting(SettingKeys.pages.works.inject.openInTabs)
	public injectOpenTabs(){
		injectOpenInTabs(this.jQuery, 'Open In Tabs', this.openTabs.bind(this));
	}	
	@ExecuteIfSetting(SettingKeys.pages.works.inject.pagingButtons)
	public injectPagingButtons(){
		super.injectPagingButtons();
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

	@RegisteredAction({ id: 'pa_button_go_to_last_page', label: 'Go To Last Page', icon: 'fast-forward' })
	public goToLastPage() {
		window.location.href = this.lastPageUrl;
	}

	@RegisteredAction({ id: 'pa_button_open_in_tabs', label: 'Open in Tabs', icon: 'new-window' })
	public openTabs():void {
		Deps.getSetting(SettingKeys.pages.works.openTabsImagesOnly).then(imagesOnly => {
			if(imagesOnly) {
				/*
				For each image
					- if a manga or ugoira page, return the viewing url directly
					- if an illustration page, return the original image url
						- use the API to get illustration details to find file path
						- use string manipulation to get the original-size image path from the thumbnail
						- use string manipulation to attach the proper extension (thumbnails are always jpg)
				Once each url is loaded, open them all in new tabs.
					- Use a hacked navigate instead of chrome's tabs.create because pixiv needs referer information
					  to access direct images or it gives 403 Forbidden.
				*/
				Promise.all<string>(this.jQuery('li.image-item a.work').toArray().map(imgEntry => {
					if (imgEntry.classList.contains('multiple') || imgEntry.classList.contains('ugoku-illust')) {
						return Promise.resolve(imgEntry.href);
					} else {
						let url = this.jQuery(imgEntry).find('img').attr('src');
						let illustId = pathUtils.getImageIdFromSourceUrl(url);
						return Deps.execOnPixiv(
							(pixiv, props) => pixiv.api.illust.detail([props.illustId], {}),
							{
								illustId
							}
						).then((response:any) => {
							let extension = response.body[illustId].illust_ext;
							let extensionWithDot = (extension.charAt(0) === '.') ? extension : `.${extension}`;
							let newSrc = pathUtils.experimentalMaxSizeImageUrl(url).replace(/\.(\w+)$/, extensionWithDot);

							return newSrc;
						});
					}
					
				})).then(newUrls => newUrls.forEach(url => jQUtils.hackedNewTab(this.jQuery, url)));
			} else {
				this.jQuery('li.image-item a.work').toArray().forEach(image => Deps.openInTab(image.href));
			}
		});
	}

	@RegisteredAction({id: 'pa_button_open_folder', label: 'Open Folder', icon: 'folder-open'})
	public openFolder():void {
		PixivAssistantServer.openFolder(this.artist);
	}

	@RegisteredAction({ 
		id: 'pa_download_all_images_debug', 
		label: 'Download All (DEBUG)', 
		icon: 'new-tab', 
		if: () => Deps.config.get(ConfigKeys.debug_mode),
	})
	public debugDownloadAllImagesForArtist():void {
		Deps.execOnPixiv(
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
