import * as jszip from 'jszip'
import * as log4js from 'log4js'

import * as pathUtils from '../utils/path'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import SettingKeys from '../settingKeys'
import {PixivAssistantServer} from '../services'
import {Container as Deps} from '../deps'
import {Model, Messages} from '../../common/proto'
import {UgokuInformation} from '../core/IUgoku'
import {injectUserRelationshipButton} from '../injectors/openFolderInjector'
import {injectDownloadIllustrationButton} from '../injectors/downloadIllustration'

import * as geomUtils from '../utils/geometry'
import {getBlob} from '../utils/ajax'
import {execSequentially} from '../utils/promise'
import {toCanvasInstance} from '../utils/document'

var whammy = require('whammy');

let logger = log4js.getLogger('Illustration Page');

enum IllustrationType {
	Picture,
	Manga,
	Animation,
}

export class IllustrationPage extends RootPage {
	public isBusy:boolean = false;

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
	public get ugokuInfo():Promise<UgokuInformation> {
		return Deps.execOnPixiv(pixiv => pixiv.context.ugokuIllustFullscreenData);
	}
	public get ugokuCanvas():HTMLCanvasElement {
		return this.jQuery('._ugoku-illust-player-container canvas')[0] as HTMLCanvasElement;
	}
	public get imageDimensions():Promise<geomUtils.Rectangle> {
		return Deps.execOnPixiv<number[]>(pixiv => pixiv.context.illustSize)
			.then(dims => ({width:dims[0], height:dims[1]}));
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
		].map(tag => this.jQuery(tag)).concat(super.getTagElements());
	}

	@ExecuteOnLoad
	public injectDownloadButton() {
		injectDownloadIllustrationButton(this.jQuery,
			() => PixivAssistantServer.imageExistsInDatabase(this.artist, {id: this.imageId}),
			() => this.downloadIllustration());
		
	}
	@ExecuteOnLoad
	public injectUnloadCallback() {
		let message = "Pixiv Assistant is currently processing. Please leave the page open";
		window.addEventListener("beforeunload", event => {
			if (this.isBusy) {
				event.returnValue = message;
				return message;
			}
		});
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

	@ExecuteOnLoad
	public injectTrigger() {
		let observer = new MutationObserver(this.fadeRecommendations.bind(this))
			.observe(this.jQuery('section#illust-recommend ul')[0], { childList: true });
	}
	@ExecuteOnLoad
	public fadeRecommendations() {
		function recommendationDetails(li:JQuery) : Messages.ArtistImageRequest {
			let img = li.find('a.work img._thumbnail');
			let imageId = pathUtils.getImageIdFromSourceUrl(img.attr('src'));
			let artistId = parseInt(img.attr('data-user-id'));
			return {
				artist: {
					id: artistId,
					name: '', //TODO: remove pending refactor of core protocol.
				},
				image: {
					id: imageId,
				}
			}
		}
		this.jQuery('section#illust-recommend li').toArray().map(x => this.jQuery(x)).forEach(liElem => {
			let msg = recommendationDetails(liElem);
			PixivAssistantServer.imageExistsInDatabase(msg.artist, msg.image).then(exists => {
				if (exists) {
					liElem.addClass('pa-hidden-thumbnail');
				}
			})
		});
	}

	@RegisteredAction({ 
		id: 'pa_download_animation_button', 
		label: 'Download Animation',
		icon: 'compressed',
	})
	public downloadAnimation() {
		function getBase64(blob:Blob) :Promise<string> {
			return new Promise((resolve, reject) => {
				var reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => resolve(reader.result);
			});
		}

		return this.makeWebM().then(video => 
			getBase64(video).then(b64 => 
				PixivAssistantServer.downloadAnimation({
					artist: this.artist,
					image: { id: this.imageId },
				}, b64)
			)
		).then(() => {this.isBusy = false});
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
				return this.downloadAnimation();
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

	@RegisteredAction({ id: 'pa_make_webm', label: 'WEBM', icon: 'folder-open' })
	public localWebM(): void {
		this.makeWebM().then(video => {
			let videoString = URL.createObjectURL(video);
			Deps.download(videoString, `${this.imageId}.webm`);
		}).then(() => this.isBusy = false)
	}

	protected makeWebM(): Promise<Blob> {
		let video = new whammy.Video(undefined, 1);

		this.isBusy = true;

		return this.ugokuInfo
			.then(info => getBlob(info.src))
			.then(data => jszip().loadAsync(data))
			.then(zip => {
				let fileData: {[id:string]:Promise<string>} = {}	
				zip.forEach((path, file) => {
					fileData[path] = file.async('base64');
				});

				return this.ugokuInfo.then(info => 
					execSequentially(info.frames, frame => 
						fileData[frame.file].then(rawData => 
							this.imageDimensions.then(dims => {
								let dataUrl = `data:${info.mime_type};base64,${rawData}`;
								return toCanvasInstance(dataUrl, dims)
									.then(canvas => video.add(canvas, frame.delay))
							})
						)
					)
				)
			}).then(() => video.compile())
	}

}