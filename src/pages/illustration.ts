import * as $ from 'jquery'
import * as jszip from 'jszip'

import * as pathUtils from 'src/utils/path'
import {tap} from 'src/utils/promise'
import {RootPage} from 'src/pages/root'
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators'
import {default as SettingKeys, AddToBookmarksButtonType} from 'src/settingKeys'
import {PixivAssistantServer} from 'src/services'
import {Container as Deps} from 'src/deps'
import {Model, Messages} from 'common/proto'
import {UgokuInformation} from 'src/core/IUgoku'
import {injectUserRelationshipButton} from 'src/injectors/openFolderInjector'
import {injectBookmarksClone} from 'src/injectors/addToBookmarksClone'
import {injectIllustrationToolbar} from 'src/injectors/illustrationToolbar'

import * as geomUtils from 'src/utils/geometry'
import {getBlob} from 'src/utils/ajax'
import {execSequentially} from 'src/utils/promise'
import {toCanvasInstance} from 'src/utils/document'
import * as pixivBridge from 'src/utils/pixivBridge'

import * as whammy from 'whammy'

export enum IllustrationType {
	Picture,
	Manga,
	Animation,
}

/**
 * Viewing a specific work. This is the 'medium' view. Images, manga, and ugoira animations
 * are all rendered in some capacity in this page.
 */
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

	@ExecuteIfSetting(SettingKeys.pages.illust.inject.toolbar)
	public injectToolbar() {
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
			return undefined;
		});
	}

	@ExecuteOnLoad
	public injectBookmarkButtonClone() {
		Deps.getSetting(SettingKeys.pages.illust.addBookmarkButtonType).then(type => {
			let enumType = parseInt(type as any); //Horrible and hacky, need to generalize getSetting.TODO.
			switch (enumType) {
				case AddToBookmarksButtonType.MODAL:
					injectBookmarksClone(() => {
						Deps.execOnPixiv(pixiv => {
							pixiv.bookmarkModal.open();
						});
					});
					break;
				case AddToBookmarksButtonType.ONE_CLICK:
					injectBookmarksClone(() => {
						$('div.bookmark-add-modal div.submit-container input[type="submit"]').click()
					}, 'Instant Add Bookmark');
					break;
			}
		})
	}

	@ExecuteIfSetting(SettingKeys.global.inject.openToArtistButton)
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
		new MutationObserver(this.fadeRecommendations.bind(this))
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

	public downloadAnimation(updateText:(text:string) => void) {
		function getBase64(blob:Blob) :Promise<string> {
			return new Promise((resolve, reject) => {
				var reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => resolve(reader.result);
				reader.onerror = err => reject(err);
			});
		}

		return this.makeWebM(updateText)
			.then(tap(() => updateText('Preparing video for transport')))
			.then(video => 
				getBase64(video).then(b64 => {
					updateText('Server is downloading the video');
					return PixivAssistantServer.downloadAnimation({
						artist: this.artist,
						image: { id: this.imageId, animation: true },
					}, b64).then(tap(() => updateText('Download Completed')))
				})
			).then(() => {this.isBusy = false});
	}

	public downloadIllustrationLocal(updateText:(text:string) => void):Promise<void> {
		updateText('Downloading');
		switch (this.illustrationType) {
			case IllustrationType.Picture:
				return this.downloadSinglePictureLocal().then(() => updateText('Downloaded'))
			case IllustrationType.Manga:
				return this.zipManga(updateText);
			case IllustrationType.Animation:
				return this.localWebM(updateText);
		}
	}
	public downloadIllustration(updateText:(text:string) => void):Promise<void> {
		updateText('Downloading');
		switch (this.illustrationType) {
			case IllustrationType.Picture:
				return this.downloadSinglePicture().then(() => updateText('Downloaded'))
			case IllustrationType.Manga:
				return this.downloadManga().then(() => updateText('Downloaded'))
			case IllustrationType.Animation:
				return this.downloadAnimation(updateText);
		}
	}

	public downloadSinglePictureLocal() {
		return Deps.download(this.fullImageUrl, this.fullImageUrl.split('/').pop());
	}
	public downloadSinglePicture() {
		return PixivAssistantServer.download(this.artist, this.fullImageUrl);
	}

	protected generateMangaPageUrls() :Promise<string[]> {
		return pixivBridge.illustDetail(this.imageId).then((response: any) => { 
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


	public zipManga(updateText:(text:string) => void) {
		updateText('Collecting image locations');
		return this.generateMangaPageUrls().then(urls => {
			let zip = new jszip();
			urls.forEach((url, i) => {
				updateText('Registering file ' + i)
				let fileName = url.split('/').pop();
				zip.file(fileName, getBlob(url));
			})
			updateText('Generating zip file');
			zip.generateAsync({type:'blob'}).then(zipFile => {
				let zipString = URL.createObjectURL(zipFile);
				updateText('Zip ready to download');
				Deps.download(zipString, this.imageId + '.zip').then(() => updateText('Zip Downloaded'))
			})
		})
	}

	public localWebM(updateText:(text:string) => void):Promise<void> {
		return this.makeWebM(updateText).then(video => {
			let videoString = URL.createObjectURL(video);
			return Deps.download(videoString, `${this.imageId}.webm`);
		}).then(() => {
			updateText('Downloading video');
			this.isBusy = false
		})
	}

	protected makeWebM(updateText:(text:string) => void): Promise<Blob> {
		let video = new whammy.Video(undefined, 0.9);

		this.isBusy = true;

		return this.ugokuInfo
			.then(tap(() => updateText('Downloading ugoira data')))
			.then(info => getBlob(info.src))
			.then(tap(() => updateText('Reading ugoira data')))
			.then<jszip>(data => jszip().loadAsync(data))
			.then(zip => {
				let fileData: {[id:string]:Promise<string>} = {}	
				zip.forEach((path, file) => {
					fileData[path] = file.async('base64');
				});

				let currentFrame = 1;
				return this.ugokuInfo.then(info => 
					execSequentially(info.frames, frame => {
						updateText(`Processing frame ${currentFrame++} of ${info.frames.length}`);
						return fileData[frame.file].then(rawData => 
							this.imageDimensions.then(dims => {
								let dataUrl = `data:${info.mime_type};base64,${rawData}`;
								return toCanvasInstance(dataUrl, dims)
									.then(canvas => video.add(canvas, frame.delay))
							})
						)
					})
				)
			}).then(tap(() => updateText('Encoding video')))
			.then(() => video.compile())
			.then(tap(() => updateText('Video ready to download')));
	}

}