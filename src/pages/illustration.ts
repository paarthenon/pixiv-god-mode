import * as $ from 'jquery';
import * as jszip from 'jszip';

import * as pathUtils from 'src/utils/path';
import {tap} from 'src/utils/promise';
import {RootPage} from 'src/pages/root';
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators';
import {default as SettingKeys} from 'src/settingKeys';
import {PixivAssistantServer} from 'src/services';
import {Container as Deps} from 'src/deps';
import {Model} from 'pixiv-assistant-common';
import {injectIllustrationToolbar} from 'src/injectors/illustrationToolbar';

import * as geomUtils from 'src/utils/geometry';
import {getBlob} from 'src/utils/ajax';
import {execSequentially} from 'src/utils/promise';
import {toCanvasInstance, awaitElement} from 'src/utils/document';
import * as pixivBridge from 'src/utils/pixivBridge';

import * as whammy from 'whammy';

import baselog from 'src/log';
import {Sigil} from 'daslog';
import {saveAs} from 'file-saver';

const log = baselog.subCategory('Illust Page');
const hlog = log.append(Sigil.Label('[=|=]'));

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
    public isBusy: boolean = false;

    @ExecuteOnLoad
    public async debug() {
        const artist = await this.artist;
        const thumbUrl = await this.thumbUrl;
        const fullUrl = await this.fullImageUrl;
        const userId = await Deps.execOnPixiv(pixiv => pixiv.userData.id);
        const illustType = await this.illustrationType;

        hlog.debug('Artist info');
        log.debug('Artist Id', artist.id);
        log.debug('Artist Name:', artist.name);
        hlog.debug('Picture info');
        log.debug('Thumbnail:', thumbUrl);
        log.debug('Full Url', fullUrl);
        log.debug('Illust Id', this.imageId);
        log.debug('Illust Type', illustType);
        log.debug('User ID:', userId);
    }

    public get artistId() {
        return awaitElement<HTMLAnchorElement>('#root aside section:nth-child(1) a')
            .then($elem => $elem.attr('href'))
            .then(pathUtils.getArtistId);
    }
    public get artistName() {
        return awaitElement('#root aside section:nth-child(1) a').then($elem =>
            $elem.text(),
        );
    }
    public get artist(): Promise<Model.Artist> {
        return Promise.all([this.artistId, this.artistName]).then(([id, name]) => ({
            id,
            name,
        }));
    }
    private get $image() {
        return awaitElement('#root main figure img');
    }
    public get thumbUrl() {
        return this.$image.then(elem => elem.attr('src'));
    }
    public get fullImageUrl(): Promise<string> {
        return Deps.execOnPixiv(
            (p, props) => p.preload.illust[props.imageId].urls.original,
            {
                imageId: this.imageId,
            },
        );
    }
    public get imageId() {
        return pathUtils.getImageId(this.path);
    }
    public get ugokuInfo() {
        return pixivBridge.ugoiraDetails(this.imageId);
    }
    public get ugokuCanvas(): HTMLCanvasElement {
        return $('#root main canvas')[0] as HTMLCanvasElement;
    }
    public get imageDimensions(): Promise<geomUtils.Rectangle> {
        return pixivBridge.illustDetail(this.imageId)
            .then(x => x.body);
    }

    public get illustrationType(): Promise<IllustrationType> {
        log.debug('Illustration type requested');
        return new Promise(resolve => {
            awaitElement('#root main section figure a')
                .then($elem => {
                    if ($elem.length > 1) {
                        resolve(IllustrationType.Manga);
                    } else {
                        resolve(IllustrationType.Picture);
                    }
                });
            awaitElement('#root main canvas')
                .then(() => resolve(IllustrationType.Animation));
        });
    }

    protected getTagElements(): JQuery[] {
        return ['.tags-container li.tag a.text', 'div.user-tags li a']
            .map(tag => $(tag))
            .concat(super.getTagElements());
    }

    protected getTagSelectors() {
        return [
            '.gtm-new-work-tag-event-click'
        ];
    }

    @ExecuteOnLoad
    public log() {
        log.info('Illustration page recognized');
    }

    @ExecuteIfSetting(SettingKeys.pages.illust.inject.toolbar)
    public injectToolbar() {
        injectIllustrationToolbar({
            existsFunc: async () =>
                PixivAssistantServer.imageExistsInDatabase(await this.artist, {
                    id: this.imageId,
                }),
            downloadInBrowser: this.downloadIllustrationLocal.bind(this),
            downloadUsingServer: this.downloadIllustration.bind(this),
            openToImage: () => PixivAssistantServer.openImageFolder({id: this.imageId}),
        });
    }

    @ExecuteOnLoad
    public injectUnloadCallback() {
        let message =
            'Pixiv Assistant is currently processing. Please leave the page open';
        window.addEventListener('beforeunload', event => {
            if (this.isBusy) {
                event.returnValue = message;
                return message;
            }
            return undefined;
        });
    }

    // TODO ELECTRON: Re-enable once server comes back.
    // @ExecuteIfSetting(SettingKeys.global.inject.openToArtistButton)
    // public async injectOpenFolder() {
    // 	injectUserRelationshipButton(await this.artist);
    // }

    @ExecuteIfSetting(SettingKeys.pages.illust.autoOpen)
    public async openImage() {
        log.info('Image will open as soon as it is loaded');
        const $img = await awaitElement('main img');
        log.info('Image loaded. Opening');
        $img.click();
        log.info('Image should be open');
    }

    // TODO: Evaluate if obsolete. Seems like it.
    @ExecuteIfSetting(SettingKeys.pages.illust.boxImage)
    public async resizeOpenedImage() {
        let image = await awaitElement('div[role=presentation] > div > div > div > img');

        let originalBounds = {
            width: parseInt(image.attr('width')),
            height: parseInt(image.attr('height')),
        };

        let windowBounds = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        let newBounds = geomUtils.resizeBounds(originalBounds, windowBounds);

        image.width(newBounds.width);
        image.height(newBounds.height);
    }

    // TODO ELECTRON: Fading needs library server
    // @ExecuteOnLoad
    // public injectTrigger() {
    // 	new MutationObserver(this.fadeRecommendations.bind(this))
    // 		.observe($('section#illust-recommend ul')[0], { childList: true });
    // }
    // @ExecuteOnLoad
    // public fadeRecommendations() {
    // 	function recommendationDetails(li:JQuery) : Messages.ArtistImageRequest {
    // 		let img = li.find('a.work img._thumbnail');
    // 		let imageId = pathUtils.getImageIdFromSourceUrl(img.attr('src'));
    // 		let artistId = parseInt(img.attr('data-user-id'));
    // 		return {
    // 			artist: {
    // 				id: artistId,
    // 				name: '', //TODO: remove pending refactor of core protocol.
    // 			},
    // 			image: {
    // 				id: imageId,
    // 			}
    // 		}
    // 	}
    // 	$('section#illust-recommend li').toArray().map(x => $(x)).forEach(liElem => {
    // 		let msg = recommendationDetails(liElem);
    // 		PixivAssistantServer.imageExistsInDatabase(msg.artist, msg.image).then(exists => {
    // 			if (exists) {
    // 				liElem.addClass('pa-hidden-thumbnail');
    // 			}
    // 		})
    // 	});
    // }

    public downloadAnimation(updateText: (text: string) => void) {
        function getBase64(blob: Blob): Promise<string> {
            return new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.readAsDataURL(blob); // Forces the result to be of type 'string'
                // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = err => reject(err);
            });
        }

        return this.makeWebM(updateText)
            .then(tap(() => updateText('Preparing video for transport')))
            .then(video =>
                getBase64(video).then(b64 => {
                    updateText('Server is downloading the video');
                    return this.artist
                        .then(artist => {
                            return PixivAssistantServer.downloadAnimation(
                                {
                                    artist,
                                    image: {id: this.imageId, animation: true},
                                },
                                b64,
                            );
                        })
                        .then(tap(() => updateText('Download Completed')));
                }),
            )
            .then(() => {
                this.isBusy = false;
            });
    }

    public async downloadIllustrationLocal(updateText: (text: string) => void): Promise<void> {
        updateText('Downloading');
        switch (await this.illustrationType) {
            case IllustrationType.Picture:
                log.info('Discovered Picture');
                return this.downloadSinglePictureLocal().then(() =>
                    updateText('Downloaded'),
                );
            case IllustrationType.Manga:
                log.info('Discovered Manga');
                return this.zipManga(updateText);
            case IllustrationType.Animation:
                log.info('Discovered Animation');
                return this.localWebM(updateText);
        }
    }
    public async downloadIllustration(updateText: (text: string) => void): Promise<void> {
        updateText('Downloading');
        switch (await this.illustrationType) {
            case IllustrationType.Picture:
                return this.downloadSinglePicture().then(() => updateText('Downloaded'));
            case IllustrationType.Manga:
                return this.downloadManga().then(() => updateText('Downloaded'));
            case IllustrationType.Animation:
                return this.downloadAnimation(updateText);
        }
    }

    public async downloadSinglePictureLocal() {
        const url = await this.fullImageUrl;
        saveAs(url, url.split('/').pop());
    }
    public async downloadSinglePicture() {
        return PixivAssistantServer.download(await this.artist, await this.fullImageUrl);
    }

    protected async generateMangaPageUrls() {
        const $imageAnchors = await awaitElement('#root main section figure a') as JQuery<HTMLAnchorElement>;
        return $imageAnchors.toArray().map(anchor => anchor.href);
    }

    public downloadManga() {
        return this.generateMangaPageUrls().then(async urls =>
            PixivAssistantServer.downloadMulti(await this.artist, urls),
        );
    }

    public async zipManga(updateText: (text: string) => void) {
        updateText('Collecting image locations');
        const urls = await this.generateMangaPageUrls();

        let zip = new jszip();
        urls.forEach((url, i) => {
            updateText('Registering file ' + i);
            let fileName = url.split('/').pop();
            zip.file(fileName, getBlob(url));
        });
        updateText('Generating zip file');
        zip.generateAsync({type: 'blob'}).then(zipFile => {
            let zipString = URL.createObjectURL(zipFile);
            updateText('Zip ready to download');
            Deps.download(zipString, this.imageId + '.zip').then(() =>
                updateText('Zip Downloaded'),
            );
        });
    }

    public localWebM(updateText: (text: string) => void): Promise<void> {
        return this.makeWebM(updateText)
            .then(video => {
                let videoString = URL.createObjectURL(video);
                return Deps.download(videoString, `${this.imageId}.webm`);
            })
            .then(() => {
                updateText('Downloading video');
                this.isBusy = false;
            });
    }

    protected async makeWebM(updateText: (text: string) => void): Promise<Blob> {
        let video = new whammy.Video(undefined, 0.9);

        this.isBusy = true;

        const msg = await this.ugokuInfo;
        const info = msg.body;
        log.info('Msg', msg, typeof msg, 'info', info, typeof info);
        updateText('Downloading ugoira data');
        const rawZipData = await getBlob(info.originalSrc);
        const zipData = await jszip().loadAsync(rawZipData);

        log.info('Preparing to load file data');
        let fileData: {[id: string]: Promise<string>} = {};
        zipData.forEach((path, file) => {
            fileData[path] = file.async('base64');
        });

        let currentFrame = 1;
        await execSequentially(info.frames, async frame => {
            updateText(`Processing frame ${currentFrame++} of ${info.frames.length}`);
            const rawFrame = await fileData[frame.file];
            const dims = await this.imageDimensions;
            let dataUrl = `data:${info.mime_type};base64,${rawFrame}`;
            return toCanvasInstance(dataUrl, dims).then(canvas => video.add(canvas, frame.delay));
        });

        updateText('Encoding video');
        updateText('Video ready to download');
        return video.compile();
    }
}
