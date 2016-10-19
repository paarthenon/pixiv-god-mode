import * as $ from 'jquery'
import * as jszip from 'jszip'

import * as pathUtils from 'src/utils/path'
import {RootPage} from 'src/pages/root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators'
import SettingKeys from 'src/settingKeys'
import {PixivAssistantServer} from 'src/services'
import {Container as Deps} from 'src/deps'
import {Model, Messages} from 'common/proto'
import {UgokuInformation} from 'src/core/IUgoku'
import {injectUserRelationshipButton} from 'src/injectors/openFolderInjector'
import {injectImageOpenFolderButton} from 'src/injectors/imageOpenFolderButton'
import {injectBookmarksClone} from 'src/injectors/addToBookmarksClone'
import {injectIllustrationToolbar} from 'src/injectors/illustrationToolbar'

import * as geomUtils from 'src/utils/geometry'
import {getBlob} from 'src/utils/ajax'
import {execSequentially} from 'src/utils/promise'
import {toCanvasInstance} from 'src/utils/document'

var whammy = require('whammy');

enum IllustrationType {
	Picture,
	Manga,
	Animation,
}

export class IllustrationPage extends RootPage {
	public isBusy:boolean = false;

	public get artistId():number {
		return pathUtils.getArtistId($('a.user-link').attr('href'));
	}
	public get artistName():string {
		return $('a.user-link h1').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}
	public get thumbUrl():string {
		return $('.boxbody center img').attr('src');
	}
	public get fullImageUrl():string {
		return $('._illust_modal img').attr('data-src');
	}
	public get imageId():number {
		return pathUtils.getImageId(this.path);
	}
	public get ugokuInfo():Promise<UgokuInformation> {
		return Deps.execOnPixiv(pixiv => pixiv.context.ugokuIllustFullscreenData);
	}
	public get ugokuCanvas():HTMLCanvasElement {
		return $('._ugoku-illust-player-container canvas')[0] as HTMLCanvasElement;
	}
	public get imageDimensions():Promise<geomUtils.Rectangle> {
		return Deps.execOnPixiv<number[]>(pixiv => pixiv.context.illustSize)
			.then(dims => ({width:dims[0], height:dims[1]}));
	}

	public get illustrationType():IllustrationType {
		if ($('.works_display a.multiple').length) {
			return IllustrationType.Manga;
		}
		if ($('div.works_display > div._ugoku-illust-player-container').length) {
			return IllustrationType.Animation;
		}
		return IllustrationType.Picture;
	}

	protected getTagElements():JQuery[] {
		return [
			'.tags-container li.tag a.text',
			'div.user-tags li a',
		].map(tag => $(tag)).concat(super.getTagElements());
	}

	@ExecuteOnLoad
	public injectDownloadButton() {
		injectIllustrationToolbar({
			existsFunc: () => PixivAssistantServer.imageExistsInDatabase(this.artist, {id: this.imageId}),
			downloadInBrowser: this.downloadIllustrationLocal.bind(this),
			downloadUsingServer: this.downloadIllustration.bind(this),
			openToImage: () => PixivAssistantServer.openImageFolder({id: this.imageId}),
		});
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

	//TODO: Use a setting for this.
	@ExecuteOnLoad
	public injectBookmarkButtonClone() {
		injectBookmarksClone(() => {
			Deps.execOnPixiv(pixiv => {
				pixiv.bookmarkModal.open();
			});
		})
	}

	@ExecuteIfSetting(SettingKeys.pages.illust.inject.openFolder)
	public injectOpenFolder() {
		injectUserRelationshipButton(this.artist);
	}

	@ExecuteIfSetting(SettingKeys.pages.illust.autoOpen)
	public openImage(): void {
		$("._layout-thumbnail.ui-modal-trigger").click()
	}

	@ExecuteIfSetting(SettingKeys.pages.illust.boxImage)
	public resizeOpenedImage() : void {
		let image = $('img.original-image');

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
			.observe($('section#illust-recommend ul')[0], { childList: true });
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
		$('section#illust-recommend li').toArray().map(x => $(x)).forEach(liElem => {
			let msg = recommendationDetails(liElem);
			PixivAssistantServer.imageExistsInDatabase(msg.artist, msg.image).then(exists => {
				if (exists) {
					liElem.addClass('pa-hidden-thumbnail');
				}
			})
		});
	}

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
					image: { id: this.imageId, animation: true },
				}, b64)
			)
		).then(() => {this.isBusy = false});
	}

	@RegisteredAction({ id: 'pa_button_open_folder', label: 'Open Folder', icon: 'folder-open' })
	public openFolder(): void {
		PixivAssistantServer.openFolder(this.artist);
	}

	public downloadIllustrationLocal():Promise<void> {
		switch (this.illustrationType) {
			case IllustrationType.Picture:
				return this.downloadSinglePictureLocal();
			case IllustrationType.Manga:
				return this.zipManga();
			case IllustrationType.Animation:
				return this.localWebM();
		}
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

	public downloadSinglePictureLocal() {
		return Deps.download(this.fullImageUrl, this.fullImageUrl.split('/').pop());
	}
	public downloadSinglePicture() {
		return PixivAssistantServer.download(this.artist, this.fullImageUrl);
	}

	protected generateMangaPageUrls() {
		return Deps.execOnPixiv(
			(pixiv, props) => pixiv.api.illust.detail([props.illustId], {}),
			{
				illustId: this.imageId
			}
		).then((response: any) => { 
			let extension = response.body[this.imageId].illust_ext;
			let pageCount = response.body[this.imageId].illust_page_count;

			let url = $('div.works_display div._layout-thumbnail img').attr('src');
			let fullResUrl = pathUtils.experimentalMaxSizeImageUrl(url, extension);

			let fullUrls = pathUtils.explodeImagePathPages(fullResUrl, pageCount);

			return Promise.resolve(fullUrls);
		});
	}
	public downloadManga() {
		return this.generateMangaPageUrls().then(urls => 
			PixivAssistantServer.downloadMulti(this.artist, urls)
		)
	}


	public zipManga() {
		return this.generateMangaPageUrls().then(urls => {
			let zip = new jszip();
			urls.forEach(url => {
				let fileName = url.split('/').pop();
				zip.file(fileName, getBlob(url));
			})
			zip.generateAsync({type:'blob'}).then(zipFile => {
				let zipString = URL.createObjectURL(zipFile);
				Deps.download(zipString, this.imageId + '.zip');
			})
		})
	}

	public localWebM():Promise<void> {
		return this.makeWebM().then(video => {
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