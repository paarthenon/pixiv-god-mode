import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import * as jQUtils from 'src/utils/document';
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators';
import {GalleryPage} from 'src/pages/gallery';
import SettingKeys from 'src/settingKeys';
import {Model} from 'pixiv-assistant-common';
import {injectOpenInTabs} from 'src/injectors/openInTabs';
import {Container as Deps} from 'src/deps';

import * as pixivBridge from 'src/utils/pixivBridge';

import applog from 'src/log';
import {awaitElement} from 'src/utils/document';
const log = applog.subCategory('Works Page');

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

    protected getTagSelectors() {
        return ['.gtm-gm-profile-work-list-tag-list-click div'].concat(super.getTagSelectors());
    }

    @ExecuteIfSetting(SettingKeys.pages.works.inject.openInTabs)
    public injectOpenTabs() {
        injectOpenInTabs('Actions', [
            {
                text: 'Open in tabs',
                onClick: () => this.openTabs(),
            }
        ]);
    }

    @ExecuteIfSetting(SettingKeys.global.inject.pagingButtons)
    public async injectPagingButtons() {
        super.injectPagingButtons();
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

    public async openTabs() {
        const imagesOnly = await Deps.getSetting(SettingKeys.pages.works.openTabsImagesOnly);

        const $imgAnchors = await awaitElement('#root li > div > a');
        const urls = $imgAnchors.toArray().map((a: HTMLAnchorElement) => a.href);

        urls.forEach(url => jQUtils.hackedNewTab($, url));
    }
}
