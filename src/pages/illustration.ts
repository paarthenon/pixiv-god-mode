import * as pathUtils from '../utils/path'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import SettingKeys from '../settingKeys'
import {PixivAssistantServer} from '../services'
import {Container as Deps} from '../deps'
import {Model} from '../../common/proto'
import {injectUserRelationshipButton} from '../injectors/openFolderInjector'
import {injectDownloadIllustrationButton} from '../injectors/downloadIllustration'

import * as geomUtils from '../utils/geometry'

enum IllustrationType {
	Picture,
	Manga,
	Animation,
}

export class IllustrationPage extends RootPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.jQuery('a.user-link').attr('href'));
	}
	public get artistName():string {
		return this.jQuery('a.user-link h1').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}
	public get thumbUrl():string {
		return this.jQuery('.boxbody center img').attr('src');
	}
	public get fullImageUrl():string {
		return this.jQuery('._illust_modal img').attr('data-src');
	}
	public get imageId():number {
		return pathUtils.getImageId(this.path);
	}

	public get illustrationType():IllustrationType {
		if (this.jQuery('.works_display a.multiple').length) {
			return IllustrationType.Manga;
		}
		if (this.jQuery('div.works_display > div._ugoku-illust-player-container').length) {
			return IllustrationType.Animation;
		}
		return IllustrationType.Picture;
	}

	protected getTagElements():JQuery[] {
		return [
			'.tags-container li.tag a.text',
			'div.user-tags li a',
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}

	@ExecuteOnLoad
	public injectDownloadButton() {
		injectDownloadIllustrationButton(this.jQuery,
			() => PixivAssistantServer.imageExistsInDatabase(this.artist, {id: this.imageId}),
			() => this.downloadIllustration());
		
	}
	@ExecuteIfSetting(SettingKeys.pages.illust.inject.openFolder)
	public injectOpenFolder() {
		injectUserRelationshipButton(this.jQuery, this.artist);
	}

	@ExecuteIfSetting(SettingKeys.pages.illust.autoOpen)
	public openImage(): void {
		this.jQuery("._layout-thumbnail.ui-modal-trigger").click()
	}

	@ExecuteIfSetting(SettingKeys.pages.illust.boxImage)
	public resizeOpenedImage() : void {
		let image = this.jQuery('img.original-image');

		let originalBounds = {
			width: parseInt(image.attr('width')),
			height: parseInt(image.attr('height'))
		}

		let windowBounds = {
			width: window.innerWidth,
			height: window.innerHeight
		}
		let newBounds = geomUtils.resizeBounds(originalBounds, windowBounds);

		image.width(newBounds.width);
		image.height(newBounds.height);
	}

	@RegisteredAction({ 
		id: 'pa_download_zip_button', 
		label: 'Download Animation as Zip',
		icon: 'compressed',
	})
	public downloadZip() {
		return new Promise<void>((resolve, reject) => {
			Deps.execOnPixiv(pixiv => pixiv.context.ugokuIllustFullscreenData.src)
			.then((src:string) => {
				if(src.length > 0){
					resolve(PixivAssistantServer.downloadZip(this.artist, src))
				} else {
					reject('Unable to find animation frames');
				}
			});
		});
	}

	@RegisteredAction({ id: 'pa_button_open_folder', label: 'Open Folder', icon: 'folder-open' })
	public openFolder(): void {
		PixivAssistantServer.openFolder(this.artist);
	}

	public downloadIllustration():Promise<void> {
		switch (this.illustrationType) {
			case IllustrationType.Picture:
				return this.downloadSinglePicture();
			case IllustrationType.Manga:
				return this.downloadManga();
			case IllustrationType.Animation:
				return this.downloadZip();
		}
	}

	@RegisteredAction({ id: 'pa_button_download', label: 'Download Image', icon: 'floppy-save' })
	public downloadSinglePicture() {
		return PixivAssistantServer.download(this.artist, this.fullImageUrl);
	}

	@RegisteredAction({ id: 'pa_button_download_manga', label: 'Download Manga', icon: 'floppy-save' })
	public downloadManga() {
		let url = this.jQuery('div.works_display div._layout-thumbnail img').attr('src');

		let metaPageString = this.jQuery('ul.meta li:contains("Multiple images")').text();
		let pages = pathUtils.numPagesFromMeta(metaPageString);

		let fullResUrl = pathUtils.experimentalMaxSizeImageUrl(url);
		let urls = pathUtils.explodeImagePathPages(fullResUrl, pages);

		console.log('Images',urls);

		return PixivAssistantServer.downloadMulti(this.artist, urls);
	}

}