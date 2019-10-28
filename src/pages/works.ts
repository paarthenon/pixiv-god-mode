import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import * as jQUtils from 'src/utils/document';
import {PixivAssistantServer} from 'src/services';
import {ExecuteOnLoad} from 'src/utils/actionDecorators';
import {GalleryPage} from 'src/pages/gallery';
import SettingKeys from 'src/settingKeys';
import {Model} from 'pixiv-assistant-common';

import {injectUserRelationshipButton} from 'src/injectors/openFolderInjector';
import {injectOpenInTabs} from 'src/injectors/openInTabs';
import {injectCountBadge} from 'src/injectors/countBadge';
import {Container as Deps} from 'src/deps';

import * as pixivBridge from 'src/utils/pixivBridge';

import log from 'src/log';
let console = log.subCategory('Works Page');

/**
 * The listing of an artist's works.
 */
export class WorksPage extends GalleryPage {

    @ExecuteOnLoad
    public debug() {
        log.info('Entered Works page');
        log.info('Artist seen as', this.artist);
    }
    public get artistId(): number {
        return pathUtils.getArtistId(this.path);
    }
    public get artistName(): string {
        return $('#root h1').first().text();
    }
    public get artist(): Model.Artist {
        return {id: this.artistId, name: this.artistName};
    }
    public get allImages(): JQuery[] {
        return $('li.image-item')
            .toArray()
            .map(x => $(x));
    }

    protected getTagElements() {
        return ['a.gtm-gm-profile-work-list-tag-list-click div']
            .map(tag => $(tag))
            .concat(super.getTagElements());
    }
    protected getTagSelectors() {
        log.info('returning relevant selectors');
        return ['.gtm-gm-profile-work-list-tag-list-click div'].concat(super.getTagSelectors());
    }

    protected executeOnEachImage<T>(func: (image: JQuery) => T) {
        $('li.image-item')
            .toArray()
            .forEach(image => func($(image)));
    }

    // @ExecuteIfSetting(SettingKeys.global.inject.openToArtistButton)
    public injectOpenFolder() {
        injectUserRelationshipButton(this.artist);
    }
    // @ExecuteIfSetting(SettingKeys.pages.works.inject.openInTabs)
    public injectOpenTabs() {
        injectOpenInTabs('Open in Tabs', this.openTabs.bind(this));
        injectOpenInTabs('Open all in Tabs', this.openAllInTabs.bind(this));
    }
    // @ExecuteOnLoad
    public injectTotalWorks() {
        pixivBridge.userProfile(this.artistId).then(result => {
            let imageCount = result.body[0].illusts.reduce(
                (acc: number, cur: any) => acc + parseInt(cur.illust_page_count),
                0,
            );
            injectCountBadge(`${imageCount} total images`);
        });
    }
    // @ExecuteIfSetting(SettingKeys.global.inject.pagingButtons)
    public injectPagingButtons() {
        super.injectPagingButtons();
    }

    // @ExecuteIfSetting(SettingKeys.global.fadeDownloadedImages)
    public experimentalFade() {
        let imageMap = this.allImages.reduce(
            (acc: {[id: string]: JQuery}, cur: JQuery) => {
                let imageId = pathUtils.getImageId(cur.find('a.work').attr('href'));
                acc[imageId.toString()] = cur;
                return acc;
            },
            <{[id: string]: JQuery}>{},
        );

        let request = Object.keys(imageMap).map(id => ({
            artist: this.artist,
            image: {id: parseInt(id)},
        }));

        if (request.length > 0) {
            PixivAssistantServer.bulkImageExists(request).then(matchedImages =>
                matchedImages
                    .map(match => match.image.id.toString())
                    .forEach(matchId =>
                        imageMap[matchId].addClass('pa-hidden-thumbnail'),
                    ),
            );
        } else {
            console.debug('No images found, avoiding server call');
        }
    }

    public openAllInTabs(): void {
        pixivBridge.userProfile(this.artistId).then(result => {
            result.body[0].illusts.forEach((illust: any) => {
                let link = pathUtils.generateImageLink(illust.illust_id);
                if (parseInt(illust.illust_page_count) > 1) {
                    link = link.replace('medium', 'manga');
                }
                Deps.openInTab(link);
            });
        });
        return;
    }
    public openTabs(): void {
        console.trace('Opening images in tabs');

        Deps.getSetting(SettingKeys.pages.works.openTabsImagesOnly).then(imagesOnly => {
            if (imagesOnly) {
                console.info('opening images only.');
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
                Promise.all<string>(
                    $('li.image-item a.work')
                        .toArray()
                        .map((imgEntry: HTMLAnchorElement) => {
                            if (
                                imgEntry.classList.contains('multiple') ||
                                imgEntry.classList.contains('ugoku-illust')
                            ) {
                                return Promise.resolve(imgEntry.href);
                            } else {
                                let url = $(imgEntry)
                                    .find('img')
                                    .attr('src');
                                let illustId = pathUtils.getImageIdFromSourceUrl(url);
                                return pixivBridge
                                    .illustDetail(illustId)
                                    .then((response: any) => {
                                        let extension =
                                            response.body[illustId].illust_ext;
                                        let extensionWithDot =
                                            extension.charAt(0) === '.'
                                                ? extension
                                                : `.${extension}`;
                                        let newSrc = pathUtils
                                            .experimentalMaxSizeImageUrl(url)
                                            .replace(/\.(\w+)$/, extensionWithDot);

                                        return newSrc;
                                    });
                            }
                        }),
                ).then(newUrls => newUrls.forEach(url => jQUtils.hackedNewTab($, url)));
            } else {
                $('li.image-item a.work')
                    .toArray()
                    .forEach((image: HTMLAnchorElement) => Deps.openInTab(image.href));
            }
        });
    }

    // @ExecuteIfSetting(SettingKeys.global.directToManga)
    public replaceMangaThumbnailLinksToFull() {
        super.replaceMangaThumbnailLinksToFull();
    }
}
